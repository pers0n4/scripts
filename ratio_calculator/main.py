#!/usr/bin/env python3
import argparse
from functools import reduce
from math import gcd

# def gcd(x, y):
#     while y:
#         x, y = y, x % y
#     return x

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("numbers", nargs="+", type=int)
    parser.add_argument("-x", default=1, type=int)

    args = parser.parse_args()
    factor = reduce(gcd, args.numbers)

    values = list(map(lambda number: number // factor * args.x, args.numbers))

    print(values)
