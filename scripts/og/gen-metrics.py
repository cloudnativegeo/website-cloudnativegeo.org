#!/usr/bin/env python3
"""
gen-metrics.py — emit data/og_metrics.json for the build-time OG card renderer.

The OG card partial (layouts/partials/opengraph.html) needs to measure text to
reproduce the approved card's headline auto-fit (greedy word-wrap + binary-search
font sizing) entirely inside Hugo templates — Hugo has no font-metrics primitive,
so we precompute one here from the actual TTFs and commit the result.

Output shape (all advances normalized to em, i.e. advanceWidth / unitsPerEm):

{
  "quattro": {                 # iA Writer Quattro Bold — proportional; headline
    "unitsPerEm": 1000,
    "default": 0.52,           # fallback advance for chars not in the table
    "space": 0.30,
    "ch": 0.58,                # advance of "0" — defines the CSS "ch" unit
    "adv": { "A": 0.66, ... }  # per-character advances, em units
  },
  "mono": {                    # Berkeley Mono — monospaced; URL + footer-right
    "unitsPerEm": 1000,
    "adv": 0.60                # single advance (every glyph is the same width)
  }
}

Run once after a font change; commit the JSON. Not part of the Hugo build.

    python3 scripts/og/gen-metrics.py
"""
import json
import os
import sys

from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
FONTS = os.path.join(REPO, "assets", "fonts")
OUT = os.path.join(REPO, "data", "og_metrics.json")

# The character set we expect in CNG headlines/footers. Anything outside this
# falls back to "default"; widen if titles start using exotic glyphs.
CHARSET = (
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    "abcdefghijklmnopqrstuvwxyz"
    "0123456789"
    " .,:;!?'\"()[]{}/\\&%#@*+=<>|~^$"
    "-–—"          # hyphen, en dash, em dash
    "‘’“”"  # curly quotes
    "éèáàóüñç"  # common accented (é è á à ó ü ñ ç)
)


def char_advances(path, charset):
    font = TTFont(path)
    upm = font["head"].unitsPerEm
    cmap = font.getBestCmap()
    hmtx = font["hmtx"]
    adv = {}
    for ch in charset:
        cp = ord(ch)
        if cp not in cmap:
            continue
        gname = cmap[cp]
        advance = hmtx[gname][0]
        adv[ch] = round(advance / upm, 4)
    return upm, adv


def main():
    quattro_path = os.path.join(FONTS, "iAWriterQuattroS-Bold.ttf")
    mono_path = os.path.join(FONTS, "BerkeleyMono-Bold.ttf")
    for p in (quattro_path, mono_path):
        if not os.path.exists(p):
            sys.exit(f"missing font: {p}")

    q_upm, q_adv = char_advances(quattro_path, CHARSET)
    # default = advance of lowercase "x" (a representative mid-width glyph)
    q_default = q_adv.get("x", round(sum(q_adv.values()) / len(q_adv), 4))

    # Berkeley Mono is monospaced: every glyph shares one advance. Read "0".
    m_font = TTFont(mono_path)
    m_upm = m_font["head"].unitsPerEm
    m_cmap = m_font.getBestCmap()
    m_hmtx = m_font["hmtx"]
    m_adv = round(m_hmtx[m_cmap[ord("0")]][0] / m_upm, 4)

    data = {
        "quattro": {
            "unitsPerEm": q_upm,
            "default": q_default,
            "space": q_adv.get(" ", q_default),
            "ch": q_adv.get("0", q_default),
            "adv": q_adv,
        },
        "mono": {"unitsPerEm": m_upm, "adv": m_adv},
    }

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"wrote {OUT}")
    print(f"  quattro: {len(q_adv)} glyphs, upm={q_upm}, ch={data['quattro']['ch']}, default={q_default}")
    print(f"  mono: advance={m_adv} (em), upm={m_upm}")


if __name__ == "__main__":
    main()
