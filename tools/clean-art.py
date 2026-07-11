#!/usr/bin/env python3
"""Cleans generated creature art: strips the faint background haze the
model sometimes paints (low-alpha wash across the whole canvas) while
keeping genuine soft edges like flames. Idempotent — safe to rerun.

Usage: python3 tools/clean-art.py [file ...]   (default: all creature PNGs)
"""
import sys
from pathlib import Path
from PIL import Image

HAZE_CUTOFF = 60     # alpha below this is background haze -> fully transparent
FEATHER_TOP = 110    # alpha between cutoff and this gets remapped smoothly

def clean(path: Path) -> None:
    img = Image.open(path).convert('RGBA')
    a = img.getchannel('A')
    lut = []
    for v in range(256):
        if v < HAZE_CUTOFF:
            lut.append(0)
        elif v < FEATHER_TOP:
            # remap [cutoff, feather_top) to [0, feather_top) for a soft edge
            lut.append(int((v - HAZE_CUTOFF) / (FEATHER_TOP - HAZE_CUTOFF) * FEATHER_TOP))
        else:
            lut.append(v)
    img.putalpha(a.point(lut))
    img.save(path)
    print(f'cleaned {path.name}')

targets = [Path(p) for p in sys.argv[1:]] or sorted(
    (Path(__file__).resolve().parent.parent / 'assets' / 'creatures').glob('*.png'))
for t in targets:
    clean(t)
print(f'{len(targets)} file(s) processed')
