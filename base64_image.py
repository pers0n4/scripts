import argparse
import base64
import mimetypes
import re
import urllib.request
from io import BytesIO


def image_to_base64(image, datauri=False):
    with open(image, "rb") as f:
        base64_bytes = base64.b64encode(f.read())
        base64_string = base64_bytes.decode("utf-8")
        if datauri:
            mime, _ = mimetypes.guess_type(image)
            print(f"data:{mime};base64,{base64_string}")
        else:
            print(base64_string)


def base64_to_image(datauri, filename):
    prefix, _ = datauri.split(",")
    mime = re.search(r"[^:]\w+\/(\w+)(?=;)", prefix)
    ext = mime.group(1)
    response = urllib.request.urlopen(datauri)
    with open(f"{filename}.{ext}", "wb") as f:
        f.write(response.file.read())


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument("-i", action="store", dest="image")
    group.add_argument("-d", action="store", dest="data", nargs=2, metavar=("DATAURI", "FILENAME"))

    args = parser.parse_args()
    if args.image:
        image_to_base64(args.image, True)
    elif args.data:
        base64_to_image(*args.data)
