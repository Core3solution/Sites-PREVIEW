"""Recorta um mosaico de imagens (ex.: grade exportada pelo ChatGPT) em arquivos individuais.

Uso: python3 -I scripts/importar-mosaico.py <pasta-do-cliente> <arquivo-do-mosaico> nome1 nome2 ...
  - Detecta automaticamente as linhas separadoras claras (grade de qualquer formato).
  - Nomes na ordem de leitura (esquerda → direita, de cima para baixo); use "-" para pular um quadro.
  - Quadros que já existirem em alta em clientes/<pasta>/anexos/imagens/ são pulados.
  - Saída em public/clientes/<pasta>/fotos/<nome>.webp no tamanho NATIVO (sem ampliação artificial).
Prefira sempre os arquivos originais em alta; o mosaico é solução provisória.
"""
import sys
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent


def runs(values, limit):
    """Agrupa índices consecutivos cujo valor > limit em intervalos (separadores)."""
    out, start = [], None
    for i, v in enumerate(values + [0]):
        if v > limit and start is None:
            start = i
        elif v <= limit and start is not None:
            out.append((start, i - 1))
            start = None
    return out


def segments(seps, total):
    cuts, prev = [], 0
    for a, b in seps:
        if a - prev > 20:
            cuts.append((prev, a))
        prev = b + 1
    if total - prev > 20:
        cuts.append((prev, total))
    return cuts


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        sys.exit(1)
    slug, mosaic, names = sys.argv[1], Path(sys.argv[2]), sys.argv[3:]
    im = Image.open(mosaic).convert('RGB')
    gray = im.convert('L')
    W, H = im.size
    px = gray.load()
    row_mean = [sum(px[x, y] for x in range(0, W, 2)) / (W / 2) for y in range(H)]
    tiles = []
    for (y0, y1) in segments(runs(row_mean, 200), H):
        col_mean = [sum(px[x, y] for y in range(y0, y1, 2)) / ((y1 - y0) / 2) for x in range(W)]
        for (x0, x1) in segments(runs(col_mean, 200), W):
            tiles.append((x0, y0, x1, y1))
    print(f'{len(tiles)} quadros detectados; {len(names)} nomes informados.')
    out = ROOT / 'public/clientes' / slug / 'fotos'
    out.mkdir(parents=True, exist_ok=True)
    hd = ROOT / 'clientes' / slug / 'anexos'
    for (x0, y0, x1, y1), name in zip(tiles, names):
        if name == '-':
            continue
        if any((hd / f / f'{name}{ext}').exists() for f in ('imagens', 'imagens-ia') for ext in ('.png', '.jpg', '.jpeg', '.webp')):
            print(f'{name}: pulado (existe original em alta)')
            continue
        tile = im.crop((x0 + 2, y0 + 2, x1 - 2, y1 - 2))
        tile.save(out / f'{name}.webp', 'WEBP', quality=92, method=6)
        print(f'{name}: {tile.width}x{tile.height} → width: {tile.width}, height: {tile.height}  ⚠ baixa resolução')


if __name__ == '__main__':
    main()
