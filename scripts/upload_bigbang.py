#!/usr/bin/env python3
"""Upload Big Bang series images to the database."""

import os
import base64
import mysql.connector
from datetime import datetime

# Database connection from environment
DATABASE_URL = os.environ.get('DATABASE_URL', '')

# Parse the DATABASE_URL
# Format: mysql://user:pass@host:port/database
def parse_db_url(url):
    # Remove mysql:// prefix
    url = url.replace('mysql://', '')
    # Split user:pass@host:port/database
    auth_host, database = url.rsplit('/', 1)
    auth, host_port = auth_host.rsplit('@', 1)
    user, password = auth.split(':', 1)
    host, port = host_port.split(':', 1)
    return {
        'user': user,
        'password': password,
        'host': host,
        'port': int(port),
        'database': database
    }

# Big Bang series data
BIGBANG_WORKS = [
    {
        'filename': 'BB1.jpg',
        'title': 'Big Bang: Breath Aureole',
        'dateCreated': '2025-04',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Gray, Subtle cyan undertones',
        'emotionalRegister': 'gentle',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'Feathering, halos, and negative space—saved territory where ink approached but did not consume. Documented throughout series, especially in works emphasizing respiratory quality.',
        'neonReading': 'The most delicate of the series. Graduated density aureoles and feathering create a sense of breath held and released. The cyan undertone (rare in this monochrome field) suggests alchemical shift—a trace of color as spirit breaking through matter. The Breath register at its most visible.',
        'sortOrder': 1
    },
    {
        'filename': 'BB2.jpg',
        'title': 'Big Bang: Diagonal Thrust',
        'dateCreated': '2025-04',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Gray',
        'emotionalRegister': 'brutal',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'The biomechanics are whole-body: shoulder-torso-leg coordination, velocity that requires the full structure, not just wrist. The body becomes the primary instrument.',
        'neonReading': 'High-velocity traversal. Energy enters one edge and exits another, edge-bleed implying form continuation beyond paper limits. This is Field logic incarnate—the work is an excerpt from a larger force-field, not a self-contained world. Diagonal thrust makes gravity visible as compositional co-author.',
        'sortOrder': 2
    },
    {
        'filename': 'BB3.jpg',
        'title': 'Big Bang: Vertical Descent',
        'dateCreated': '2025-04',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm (vertical orientation)',
        'colorPalette': 'Black, Gray',
        'emotionalRegister': 'brutal',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'At 100cm x 200cm, these works demand full-body engagement. The paper laid flat on floor or table means the artist moves not as a stationary painter but as a dancer or ritual performer.',
        'neonReading': "Vertical format activates gravity in a different register. Diagonal thrust becomes descent—ink falling, pooling, accumulating at the base. The body's choreography shifts when the paper is vertical; the marks trace falling motion rather than lateral sweep. This may be the series' test of orientation's effect on viscosity.",
        'sortOrder': 3
    },
    {
        'filename': 'BB4.jpg',
        'title': 'Big Bang: Smoke Field',
        'dateCreated': '2025-05',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Gray, Atmospheric smoke',
        'emotionalRegister': 'meditative',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'The Breath—feathering, halos, and negative space representing saved territory where ink approached but did not consume. Essential to preventing the image from collapsing into pure darkness.',
        'neonReading': "Atmospheric-dispersed typology. Cloud-masses and breath-space dominate. The Breath register is fully activated here—graduated density aureoles read as the work's respiratory system. This is the series at its most quiet, holding tension between presence and dissolution.",
        'sortOrder': 4
    },
    {
        'filename': 'BB5.jpg',
        'title': 'Big Bang: Diagonal Thrust II',
        'dateCreated': '2025-04',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Gray',
        'emotionalRegister': 'brutal',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'The series abandons the centralized, mandala-like compositions characterizing Phases 1–3, adopting instead Field logic where energy traverses the picture plane rather than organizing around focal point.',
        'neonReading': 'Second expression of high-velocity diagonal thrust. Where BB2 emphasized lateral sweep, this work shows ink pooling and accumulation at contact zones. The Bone and Flesh registers collaborate—dense blacks provide structure while mid-tone washes create turbulence. Edge-to-edge movement without center.',
        'sortOrder': 5
    },
    {
        'filename': 'BB6.jpg',
        'title': 'Big Bang: Geological Core',
        'dateCreated': '2025-04',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Gray, Turbulent mid-tones',
        'emotionalRegister': 'brutal',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'The ink demonstrates distinctive viscosity regime. Register 2: The Flesh—mid-tone washes and granulation, produced through geological or biological micro-textures, result of ink sediment settling into paper fiber topography.',
        'neonReading': "Dense-geological at center with atmospheric halo. The Flesh register dominates—mid-tone washes producing geological micro-textures, result of ink sediment settling into paper fiber topography. This work embodies compression where viscosity creates internal complexity and depth through gravity's collaboration.",
        'sortOrder': 6
    },
    {
        'filename': 'BB7.jpg',
        'title': 'Big Bang: Breath & Bone',
        'dateCreated': '2025-04',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Gray',
        'emotionalRegister': 'meditative',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'Register 1: The Bone—highest density blacks, sits on paper fiber rather than soaking through, creates foreground depth with almost three-dimensional presence, functions as structural skeleton.',
        'neonReading': "Hybrid-transitional showing the duality of the viscosity system. The Bone provides structural skeleton (dense blacks at center), while the Breath creates halos and feathering at edges. This work demonstrates that container is no longer drawn but enacted through ink's inherent behavior encountering paper's inherent resistance.",
        'sortOrder': 7
    },
    {
        'filename': 'BB8.jpg',
        'title': 'Big Bang: Geological Core II',
        'dateCreated': '2025-05',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Gray, Dense turbulent center',
        'emotionalRegister': 'brutal',
        'seriesName': 'Big Bang',
        'journalExcerpt': "The ink pools, settles, responds to earth's pull. Paper becomes a basin catching what falls. This is not possible with vertical easel work.",
        'neonReading': 'Maximum compression at center with explosive periphery. Where BB6 showed geological formation, this work shows geological pressure—strata compressed into near-singularity. The Flesh register creates turbulence, density, and internal heat. Ink as tectonic force.',
        'sortOrder': 8
    },
    {
        'filename': 'BB9.jpg',
        'title': 'Big Bang: Cloud Mass',
        'dateCreated': '2025-05',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Gray, Atmospheric wash',
        'emotionalRegister': 'meditative',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'These works function as temples dedicated to the act of creation rather than documents of it. Temple is not photograph of worship but site where worship occurred and can occur again.',
        'neonReading': 'Atmospheric-dispersed, cousin to Smoke Field. Cloud-masses dominate, suggesting weather systems or cosmic nebulae. The work hovers between representation (it looks like clouds) and abstraction (it is ink behavior). This is the Field logic at its most elemental—pure atmosphere, pure breath, minimal structure.',
        'sortOrder': 9
    },
    {
        'filename': 'BB10.jpg',
        'title': 'Big Bang: Shadow Self',
        'dateCreated': '2025-05',
        'technique': 'Sumi ink on Anhui rice paper',
        'dimensions': '100x200cm',
        'colorPalette': 'Black, Warm ochre undertones',
        'emotionalRegister': 'mysterious',
        'seriesName': 'Big Bang',
        'journalExcerpt': 'Most bounded, creature-like form in series. If Shadow were to have shape, it might look like this—entity floating against void, both part of self and separate from it.',
        'neonReading': "The outlier. Bounded-figural rather than field-based. This work reads as organism against void—a confrontation with the Shadow Self in Jungian terms. The warm ochre undertones (absent from the cooler atmospheric grays of other works) mark this as the series' reckoning with darkness not as absence but as presence. The only work that feels like a figure rather than a force.",
        'sortOrder': 10
    }
]

def main():
    print("=== BIG BANG SERIES UPLOAD ===\n")
    print("Processing 10 works from the Big Bang series...\n")
    
    # Parse database URL
    db_config = parse_db_url(DATABASE_URL)
    
    # Connect to database
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    
    # Get NE phase ID
    cursor.execute("SELECT id FROM phases WHERE code = 'NE' LIMIT 1")
    result = cursor.fetchone()
    if result:
        phase_id = result[0]
        print(f"Found NE phase with ID: {phase_id}\n")
    else:
        print("ERROR: NE phase not found!")
        return
    
    manifest = []
    upload_dir = '/home/ubuntu/upload'
    
    for i, work in enumerate(BIGBANG_WORKS):
        filename = work['filename']
        filepath = os.path.join(upload_dir, filename)
        
        print(f"[{i+1}/10] Processing: {filename}")
        print(f"  Title: {work['title']}")
        
        if not os.path.exists(filepath):
            print(f"  WARNING: File not found at {filepath}")
            continue
        
        # Get file size
        file_size = os.path.getsize(filepath)
        print(f"  File size: {file_size / 1024:.2f} KB")
        
        # Read and encode image
        with open(filepath, 'rb') as f:
            image_data = f.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        data_url = f"data:image/jpeg;base64,{base64_image}"
        
        # Insert into database
        try:
            insert_sql = """
            INSERT INTO works (
                title, phaseId, dateCreated, technique, dimensions,
                colorPalette, emotionalRegister, imageUrl, thumbnailUrl,
                journalExcerpt, neonReading, seriesName, isPublished, sortOrder
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                work['title'],
                phase_id,
                work['dateCreated'],
                work['technique'],
                work['dimensions'],
                work['colorPalette'],
                work['emotionalRegister'],
                data_url,
                data_url,  # Same for thumbnail
                work['journalExcerpt'],
                work['neonReading'],
                work['seriesName'],
                True,
                work['sortOrder']
            )
            
            cursor.execute(insert_sql, values)
            conn.commit()
            
            db_id = cursor.lastrowid
            now = datetime.now().isoformat()
            
            print(f"  Database ID: {db_id}")
            print(f"  Created at: {now}")
            
            manifest.append({
                'ingestionOrder': i + 1,
                'filename': filename,
                'title': work['title'],
                'databaseId': db_id,
                'createdAt': now,
                'fileSize': f"{file_size / 1024:.2f} KB",
                'emotionalRegister': work['emotionalRegister'],
                'sortOrder': work['sortOrder']
            })
            
            print(f"  ✓ Successfully added to database\n")
            
        except Exception as e:
            print(f"  ERROR: {e}\n")
            conn.rollback()
    
    cursor.close()
    conn.close()
    
    # Output manifest
    print("\n=== INGESTION MANIFEST ===\n")
    print("Order | Filename   | Title                        | DB ID | Emotional Register")
    print("------|------------|------------------------------|-------|-------------------")
    
    for item in manifest:
        print(f"{item['ingestionOrder']:5} | {item['filename']:10} | {item['title'][:28]:28} | {item['databaseId']:5} | {item['emotionalRegister']}")
    
    # Save manifest to JSON
    import json
    manifest_path = '/home/ubuntu/neon-crucible/bigbang_manifest.json'
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    print(f"\nManifest saved to: {manifest_path}")
    
    print("\nDone!")

if __name__ == '__main__':
    main()
