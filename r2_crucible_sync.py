import os
import sys
import boto3
import logging
from botocore.exceptions import ClientError
from colorama import init, Fore, Style

# Initialize terminal colors
init(autoreset=True)

# ─── Configuration ───────────────────────────────────────────────────────────
R2_ENDPOINT = "https://ee59ee5cb7da30e22c2451223113cff8.r2.cloudflarestorage.com"
ACCESS_KEY = "b1df39ace94decb6645edb6e4557535a"
SECRET_KEY = "a738185b2690f8ef04528555ddbad366e6ce6f9c55fd95031cfa758e8c351820"
BUCKET_NAME = "neonwebsite"
PREFIX = "Crucible/"

# ─── Diagnostics Logging Setup ───────────────────────────────────────────────
logger = logging.getLogger("R2_SYNC_DIAGNOSTICS")
logger.setLevel(logging.DEBUG)

ch = logging.StreamHandler(sys.stdout)
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - [%(levelname)s] - %(message)s', datefmt='%H:%M:%S')
ch.setFormatter(formatter)
logger.addHandler(ch)

def print_diagnostic_header():
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN} CRUCIBLE CLOUDFLARE R2 SYNC PROTOCOL INITIALIZED")
    print(f"{Fore.CYAN}{'='*60}\n")

def get_s3_client():
    logger.info("Initializing boto3 client for Cloudflare R2...")
    try:
        client = boto3.client(
            's3',
            endpoint_url=R2_ENDPOINT,
            aws_access_key_id=ACCESS_KEY,
            aws_secret_access_key=SECRET_KEY,
            region_name='auto' # Required for R2
        )
        logger.debug(f"Client established with endpoint: {R2_ENDPOINT}")
        return client
    except Exception as e:
        logger.error(f"{Fore.RED}FATAL ERROR: Failed to initialize boto3 client. Exception: {str(e)}")
        sys.exit(1)

def verify_connection(client):
    logger.info(f"Verifying access to bucket: '{BUCKET_NAME}'...")
    try:
        response = client.head_bucket(Bucket=BUCKET_NAME)
        logger.info(f"{Fore.GREEN}SUCCESS: HTTP 200 OK. Read/Write access verified for bucket '{BUCKET_NAME}'.")
        return True
    except ClientError as e:
        logger.error(f"{Fore.RED}CONNECTION FAILED: Bucket access denied or bucket does not exist.")
        logger.debug(f"Raw ClientError: {e}")
        return False

def list_crucible_contents(client):
    logger.info(f"Querying objects under prefix: '{PREFIX}'...")
    try:
        response = client.list_objects_v2(Bucket=BUCKET_NAME, Prefix=PREFIX)
        if 'Contents' in response:
            count = len(response['Contents'])
            logger.info(f"Found {Fore.YELLOW}{count}{Style.RESET_ALL} objects in remote bucket.")
            for obj in response['Contents'][:5]: # Print first 5 for diagnostics
                logger.debug(f" -> Found: {obj['Key']} ({obj['Size']} bytes)")
            if count > 5:
                logger.debug(f" -> ... and {count - 5} more.")
        else:
            logger.info("Bucket prefix is currently empty.")
    except Exception as e:
        logger.error(f"{Fore.RED}FAILED to list objects. Exception: {str(e)}")

def upload_file(client, file_path, object_name=None):
    if object_name is None:
        object_name = PREFIX + os.path.basename(file_path)
    
    logger.info(f"Preparing upload queue for: {file_path}")
    if not os.path.exists(file_path):
        logger.error(f"{Fore.RED}FILE NOT FOUND: {file_path}. Aborting upload.")
        return False

    content_type = "image/webp" if file_path.endswith(".webp") else "image/jpeg"
    logger.debug(f"Inferred ContentType: {content_type}")

    try:
        logger.info(f"Executing PUT operation to target: {object_name}...")
        client.upload_file(
            file_path, 
            BUCKET_NAME, 
            object_name,
            ExtraArgs={'ContentType': content_type}
        )
        logger.info(f"{Fore.GREEN}UPLOAD COMPLETE: {object_name} successfully written to R2.")
        return True
    except Exception as e:
        logger.error(f"{Fore.RED}UPLOAD FAILED: Exception: {str(e)}")
        return False

if __name__ == "__main__":
    print_diagnostic_header()
    s3 = get_s3_client()
    
    if verify_connection(s3):
        list_crucible_contents(s3)
        
    logger.info("Sync Protocol Terminated.")
