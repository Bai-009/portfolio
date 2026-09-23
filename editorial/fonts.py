"""把网站用到的字从开源字体里挑出来，做成网页字体，放进 dist/assets/fonts/。

中文用思源宋体 Source Han Serif CN，西文用 Newsreader，两者都是 SIL OFL 1.1。
思源宋体保留了字体名 "Source"，改动过的版本不能沿用，所以子集改名为 Portfolio Serif SC；
Newsreader 的子集一并改名为 Portfolio Serif。许可证原文在 dist/assets/fonts/ 里。

改了文案、出现了新字，先运行 build.py，再运行本脚本：

    python3 editorial/build.py
    python3 editorial/fonts.py

需要 fontTools（pip install fonttools）。源字体用环境变量指定：
    SOURCE_HAN_SERIF    SourceHanSerifCN-Regular.ttf（github.com/adobe-fonts/source-han-serif）
    NEWSREADER          Newsreader-opsz-wght.ttf（github.com/productiontype/Newsreader）
    NEWSREADER_ITALIC   Newsreader-Italic-opsz-wght.ttf
没重新生成也不会坏：新出现的字回落到系统宋体。
"""
import html
import os
import re
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
OUT = DIST / 'assets' / 'fonts'

SOURCES = {
    'serif-sc': os.environ.get('SOURCE_HAN_SERIF', ''),
    'serif': os.environ.get('NEWSREADER', ''),
    'serif-italic': os.environ.get('NEWSREADER_ITALIC', ''),
}
NAMES = {'serif-sc': 'Portfolio Serif SC', 'serif': 'Portfolio Serif', 'serif-italic': 'Portfolio Serif'}

# 页面之外还会出现的字：标点、数字，以及脚本里会切换的按钮文字
EXTRA = '０１２３４５６７８９〇一二三四五六七八九十百年月日第章节页·—–「」『』《》〈〉（）【】、，。：；？！…“”‘’　'
LATIN = ''.join(chr(i) for i in range(0x20, 0x7F)) + '’‘“”–—…·×→←↑↓↗§†•°±€£¥©®™áàâäãåçéèêëíìîïñóòôöõøúùûüœæß'


def site_text():
    chars = set(EXTRA)
    for page in list(DIST.glob('*.html')) + [DIST / 'portfolio.js']:
        text = page.read_text()
        text = re.sub(r'<script.*?</script>|<style.*?</style>', ' ', text, flags=re.S)
        chars |= set(html.unescape(re.sub(r'<[^>]+>', ' ', text)))
    return ''.join(sorted(chars))


def rename(font, family):
    style = 'Italic' if 'italic' in font['name'].getDebugName(2).lower() else 'Regular'
    for record in font['name'].names:
        if record.nameID in (1, 16):
            record.string = family
        elif record.nameID == 4:
            record.string = family if style == 'Regular' else f'{family} {style}'
        elif record.nameID == 6:
            record.string = family.replace(' ', '') + '-' + style
        elif record.nameID == 3:
            record.string = f'{family.replace(" ", "")}-{style};subset'


def build(key, text):
    source = SOURCES[key]
    if not source or not Path(source).exists():
        raise SystemExit(f'找不到 {key} 的源字体，请设置对应的环境变量（见文件开头）。')
    options = subset.Options()
    options.flavor = 'woff'
    options.layout_features = ['*']
    options.name_IDs = ['*']
    options.name_languages = ['*']
    options.hinting = False
    options.notdef_outline = True
    font = subset.load_font(source, options)
    subsetter = subset.Subsetter(options)
    subsetter.populate(text=text)
    subsetter.subset(font)
    rename(font, NAMES[key])
    target = OUT / f'{key}.woff'
    subset.save_font(font, target, options)
    print(f'{target.relative_to(ROOT)}  {target.stat().st_size // 1024} KB')


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    text = site_text()
    print(f'页面用到 {len(text)} 个字符')
    build('serif-sc', text)
    build('serif', LATIN)
    build('serif-italic', LATIN)
