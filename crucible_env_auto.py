import os
import sys
import subprocess
import logging
from colorama import init, Fore, Style

init(autoreset=True)

# ─── Diagnostics Logging Setup ───────────────────────────────────────────────
logger = logging.getLogger("ENV_AUTOMATION")
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler(sys.stdout)
ch.setFormatter(logging.Formatter('%(asctime)s - [%(levelname)s] - %(message)s', datefmt='%H:%M:%S'))
logger.addHandler(ch)

def print_diagnostic_header():
    print(f"\n{Fore.CYAN}{'='*60}")
    print(f"{Fore.CYAN} NEON-CRUCIBLE: AUTOMATED ENV & DB SYNC PROTOCOL")
    print(f"{Fore.CYAN}{'='*60}\n")

def update_env_file(db_url):
    env_path = os.path.join(os.getcwd(), ".env")
    logger.info(f"Targeting environment configuration at: {env_path}")
    
    lines = []
    db_url_found = False
    
    if os.path.exists(env_path):
        logger.debug("Existing .env file detected. Reading contents...")
        with open(env_path, "r") as f:
            lines = f.readlines()
            
    with open(env_path, "w") as f:
        for line in lines:
            if line.startswith("DATABASE_URL="):
                f.write(f'DATABASE_URL="{db_url}"\n')
                db_url_found = True
                logger.debug("Overwriting existing DATABASE_URL entry.")
            else:
                f.write(line)
                
        if not db_url_found:
            f.write(f'\nDATABASE_URL="{db_url}"\n')
            logger.debug("Appending new DATABASE_URL entry.")
            
    logger.info(f"{Fore.GREEN}SUCCESS: .env file structurally updated.")

def run_db_push():
    logger.info("Initializing Drizzle DB Push sequence...")
    try:
        process = subprocess.Popen(
            ["pnpm", "run", "db:push"],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            bufsize=1
        )
        
        logger.info(f"{Fore.YELLOW}--- BEGIN SUBPROCESS OUTPUT ---")
        for line in process.stdout:
            print(f"{Fore.LIGHTBLACK_EX}{line.strip()}")
            
        process.wait()
        logger.info(f"{Fore.YELLOW}--- END SUBPROCESS OUTPUT ---")
        
        if process.returncode == 0:
            logger.info(f"{Fore.GREEN}SUCCESS: Database schema successfully synchronized with Railway!")
        else:
            logger.error(f"{Fore.RED}FAILURE: Drizzle push exited with code {process.returncode}.")
            
    except Exception as e:
        logger.error(f"{Fore.RED}FATAL ERROR during subprocess execution: {str(e)}")

if __name__ == "__main__":
    print_diagnostic_header()
    
    print(f"\n{Fore.YELLOW}Paste your raw Railway MySQL URL below")
    print(f"{Fore.LIGHTBLACK_EX}(e.g., mysql://root:password@host:port/railway)")
    db_string = input(f"{Fore.CYAN}> {Style.RESET_ALL}").strip()
    
    # Strip quotes just in case they were accidentally included in the paste
    db_string = db_string.strip('"').strip("'")
    
    if not db_string.startswith("mysql://"):
        logger.error(f"{Fore.RED}INVALID FORMAT: URL must start with 'mysql://'. Aborting.")
        sys.exit(1)
        
    update_env_file(db_string)
    run_db_push()
    logger.info("Automation Protocol Terminated.")
