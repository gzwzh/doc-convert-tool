import os
import zipfile
import hashlib
import argparse

def generate_update_package(source_dir, output_zip):
    """
    Generates an update package (ZIP) from the source directory.
    """
    if not os.path.exists(source_dir):
        print(f"Error: Source directory '{source_dir}' does not exist.")
        return

    print(f"Packing files from: {source_dir}")
    print(f"Output: {output_zip}")

    try:
        with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
            for root, dirs, files in os.walk(source_dir):
                for file in files:
                    file_path = os.path.join(root, file)
                    # Calculate arcname (relative path inside zip)
                    arcname = os.path.relpath(file_path, source_dir)
                    
                    # Exclude updater.exe if present (as per docs)
                    if file.lower() == 'updater.exe':
                        print(f"Skipping {file} (updater should not update itself normally)")
                        continue
                        
                    # Exclude the output zip itself if it's in the source dir
                    if os.path.abspath(file_path) == os.path.abspath(output_zip):
                        continue

                    print(f"Adding: {arcname}")
                    zipf.write(file_path, arcname)
        
        print("ZIP package created successfully.")
        
        # Calculate SHA256
        sha256_hash = hashlib.sha256()
        with open(output_zip, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        
        file_hash = sha256_hash.hexdigest()
        print(f"\nSHA256 Hash: {file_hash}")
        print(f"File size: {os.path.getsize(output_zip)} bytes")
        
    except Exception as e:
        print(f"Error creating package: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Update Package Generator')
    parser.add_argument('source', help='Source directory containing the new version files')
    parser.add_argument('output', help='Output path for the ZIP file (e.g., update_v1.0.zip)')
    
    args = parser.parse_args()
    
    generate_update_package(args.source, args.output)
