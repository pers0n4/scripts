from pathlib import Path

try:
    import chardet
except ImportError as e:
    import subprocess
    subprocess.check_call(["pip", "install", e.name])
    import chardet

if __name__ == "__main__":
    p = Path()

    for f in p.iterdir():
        filename = str(f)

        try:
            filename_bytes = filename.encode("iso-8859-1")
        except UnicodeEncodeError:
            continue

        if chardet.detect(filename_bytes)["encoding"] == "ascii":
            continue

        try:
            fixed_name = filename_bytes.decode("cp949")
        except UnicodeDecodeError:
            continue

        if filename != fixed_name:
            f.rename(fixed_name)
            print(filename)
            print(fixed_name)
            print()
