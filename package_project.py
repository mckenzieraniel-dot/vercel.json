import os
import zipfile

def zip_project(output_filename, source_dir):
    exclude_dirs = {'node_modules', 'dist', '.git', '.tanstack'}
    exclude_extensions = {'.png', '.mp3'}
    exclude_files = {'.env.local', '.env.development.local', 'tenshon_project.tar.gz', 'tenshon_project.zip'}

    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # Exclude directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if any(file.endswith(ext) for ext in exclude_extensions):
                    continue
                if file in exclude_files:
                    continue
                
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, source_dir)
                zipf.write(file_path, arcname)

if __name__ == "__main__":
    zip_project('tenshon_project.zip', '.')
    print("Project zipped successfully as tenshon_project.zip")
