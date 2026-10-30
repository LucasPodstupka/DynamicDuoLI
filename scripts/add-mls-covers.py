"""Convert buyer-side MLS covers (<MLS#>.jpg) into public/listings/<mls>/00(.webp|-sm.webp)
and point data/listings.json at them. Usage: python3 scripts/add-mls-covers.py ~/Downloads/mls_covers"""
import json, os, sys, glob
from PIL import Image, ImageOps
src = sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/Downloads/mls_covers')
d = json.load(open('data/listings.json')); by = {l['mls']: l for l in d['listings']}
for f in glob.glob(f'{src}/*.jpg'):
    m = os.path.basename(f)[:-4]; l = by.get(m)
    if not l or len(l['photos']) > 1: continue
    out = f'public/listings/{m}'; os.makedirs(out, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
    for w, q, s in ((1400, 72, ''), (480, 68, '-sm')):
        t = im.copy(); t.thumbnail((w, w * 2)); t.save(f'{out}/00{s}.webp', 'WEBP', quality=q, method=4)
    l['photos'] = [f'/listings/{m}/00']; print('cover', m)
json.dump(d, open('data/listings.json', 'w'), indent=2)
