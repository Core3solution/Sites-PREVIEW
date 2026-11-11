"""Converte imagens recebidas em WebP responsivo para o site.

Uso: python3 -I scripts/importar-fotos.py <pasta-do-cliente> [nome ...]
Origem: clientes/<pasta>/anexos/imagens/<nome>.(png|jpg|jpeg|webp)  (também aceita anexos/imagens-ia/)
Saída:  public/clientes/<pasta>/fotos/<nome>.webp (largura original) e <nome>-768.webp, sem ampliar além do original.
Os nomes dos arquivos devem ser os ids usados em src/clients/<pasta>/photos.ts.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent


def convert(path: Path, out: Path):
    im = Image.open(path).convert('RGB')
    out.mkdir(parents=True, exist_ok=True)
    im.save(out / f'{path.stem}.webp', 'WEBP', quality=86, method=6)
    if im.width > 768:
        small = im.resize((768, round(im.height * 768 / im.width)), Image.LANCZOS)
        small.save(out / f'{path.stem}-768.webp', 'WEBP', quality=84, method=6)
    aviso = '  ⚠ abaixo de 1200 px: vai parecer suave em telas grandes' if im.width < 1200 else ''
    print(f'{path.stem}: {im.width}x{im.height} → width: {im.width}, height: {im.height}{aviso}')


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    slug, names = sys.argv[1], sys.argv[2:]
    out = ROOT / 'public/clientes' / slug / 'fotos'
    found = False
    for folder in ('imagens', 'imagens-ia'):
        src = ROOT / 'clientes' / slug / 'anexos' / folder
        for p in sorted(src.glob('*')):
            if p.suffix.lower() in ('.png', '.jpg', '.jpeg', '.webp') and (not names or p.stem in names):
                convert(p, out)
                found = True
    if not found:
        print(f'Nenhuma imagem encontrada em clientes/{slug}/anexos/imagens/.')


if __name__ == '__main__':
    main()
