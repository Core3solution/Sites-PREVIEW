"""Recorta o mosaico de imagens geradas por IA (anexos/07_imagens_ia_chatgpt_mosaico.png) em arquivos individuais.

Uso: python3 -I scripts/importar-mosaico-ia.py
Saída: public/fotos/<nome>.webp no tamanho nativo de cada quadro (sem ampliação artificial).
Quando os arquivos originais em alta resolução chegarem, substitua os .webp e atualize width/height em photos.ts.
"""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'anexos/07_imagens_ia_chatgpt_mosaico.png'
OUT = ROOT / 'public/fotos'

# Limites medidos pelas linhas brancas separadoras (x0, y0, x1, y1), com 2 px de margem interna.
cols_r1 = [(0, 527), (529, 768), (772, 1153), (1155, 1536)]
cols = [(0, 378), (380, 767), (769, 1153), (1155, 1536)]
rows = {1: (0, 293), 2: (295, 578), 3: (580, 789), 4: (791, 1024)}
names = [
    ['hero', 'hero-mobile (não usado)', 'servico-ppf', 'servico-envelopamento'],
    ['servico-vitrificacao', 'servico-insulfilm', 'servico-polimento', 'servico-lavagem'],
    ['cta', 'ambiente', 'inspiracao-farol', 'inspiracao-frontal'],
    ['inspiracao-gotas', 'inspiracao-acetinado', 'inspiracao-espelho', 'inspiracao-noturna'],
]

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    im = Image.open(SRC).convert('RGB')
    report = {}
    for r, row in enumerate(names, start=1):
        y0, y1 = rows[r]
        for c, name in enumerate(row):
            x0, x1 = (cols_r1 if r == 1 else cols)[c]
            box = (x0 + 2 if x0 else 0, y0 + 2 if y0 else 0, x1 - 2 if x1 < 1536 else x1, y1 - 2 if y1 < 1024 else y1)
            if name.endswith('(não usado)'):
                continue
            if (ROOT / 'anexos/imagens-ia' / f'{name}.png').exists():
                continue  # já existe versão em alta resolução (scripts/importar-fotos.py)
            tile = im.crop(box)
            tile.save(OUT / f'{name}.webp', 'WEBP', quality=92, method=6)
            report[name] = {'width': tile.width, 'height': tile.height}
    print(json.dumps(report, indent=1))

if __name__ == '__main__':
    main()
