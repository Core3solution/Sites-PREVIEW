"""Converte imagens recebidas (anexos/imagens-ia/<nome>.png) em WebP responsivo para public/fotos/.

Uso: python3 -I scripts/importar-fotos.py [nome ...]   (sem argumentos: converte todas)
Gera <nome>.webp (largura original) e <nome>-768.webp, sem ampliar além do tamanho original.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'anexos/imagens-ia'
OUT = ROOT / 'public/fotos'

def convert(path: Path):
    im = Image.open(path).convert('RGB')
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f'{path.stem}.webp', 'WEBP', quality=86, method=6)
    if im.width > 768:
        small = im.resize((768, round(im.height * 768 / im.width)), Image.LANCZOS)
        small.save(OUT / f'{path.stem}-768.webp', 'WEBP', quality=84, method=6)
    print(f'{path.stem}: {im.width}x{im.height}')

names = sys.argv[1:]
for p in sorted(SRC.glob('*.png')):
    if not names or p.stem in names:
        convert(p)
