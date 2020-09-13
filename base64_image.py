import argparse
import base64
from io import BytesIO

import matplotlib.pyplot as plt
from PIL import Image


def image_to_base64(image):
    with open(image, "rb") as image:
        base64_bytes = base64.b64encode(image.read())
        base64_string = base64_bytes.decode("utf-8")
        print(base64_string)


def base64_to_image(string):
    image_bytes = base64.b64decode(string)
    image = Image.open(BytesIO(image_bytes))
    # image.save()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group()
    group.add_argument("-i", action="store", dest="image")
    group.add_argument("-b", action="store", dest="string")

    args = parser.parse_args()
    if args.image:
        image_to_base64(args.image)
    elif args.string:
        pass
