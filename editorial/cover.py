"""首屏的纸和光：一张冷白的纸，下半截被光照着，光的上沿是一道很缓的弧。
页面上的标题沿同一道弧排，弧的算法在 build.py 的 cover_arc() 里，两边的参数要一致（R = 宽 × 1.55，弧顶在高 × TOP）。

需要 numpy 和 Pillow：
    python3 editorial/cover.py                                   # 横屏 2880×1800，弧顶 0.54
    python3 editorial/cover.py 1290 2560 cover-paper-portrait 0.47   # 竖屏
颗粒图 cover-grain.png 每次一并重写。"""
import sys
import numpy as np
from PIL import Image

W, H = int(sys.argv[1]) if len(sys.argv) > 1 else 2880, int(sys.argv[2]) if len(sys.argv) > 2 else 1800
ASSETS = __import__('pathlib').Path(__file__).resolve().parents[1] / 'dist' / 'assets'
OUT = str(ASSETS / (sys.argv[3] if len(sys.argv) > 3 else 'cover-paper'))
rng = np.random.default_rng(7)

# 弧：圆心在画面正下方很远处，弧顶在画面高度的 TOP 处
TOP = float(sys.argv[4]) if len(sys.argv) > 4 else 0.54
R = W * 1.55
cx, cy = W / 2, H * TOP + R

y, x = np.mgrid[0:H, 0:W].astype(np.float32)
dist = np.hypot(x - cx, y - cy)
d = R - dist                      # >0 在光里（弧下方），<0 在影子里
edge = np.abs(x - cx) / (W / 2)   # 0 中间，1 两边

def smooth(a, b, t):
    t = np.clip((t - a) / (b - a), 0, 1)
    return t * t * (3 - 2 * t)

# 半影：中间窄、两边宽，离遮挡物越远越虚
pen = H * (0.04 + 0.07 * edge ** 2)
lit = smooth(-pen * 0.5, pen * 0.5, d)

# 纸的底色：影子里偏冷的灰，光里近白；光的上沿有一道很淡的亮边，往下慢慢弱
shadow = 0.9 + 0.036 * smooth(-H * 0.55, 0, d) - 0.014 * edge ** 2
light = 0.984 + 0.01 * np.exp(-np.clip(d, 0, None) / (H * 0.035)) + 0.004 * np.clip(d / (H * 0.5), 0, 1)
g = shadow * (1 - lit) + light * lit

# 纸纹：几层尺度的噪声，影子里（斜光）比光里清楚
def fbm(scales, weights):
    acc = np.zeros((H, W), np.float32)
    for s, w in zip(scales, weights):
        h, w_ = max(2, H // s), max(2, W // s)
        n = rng.standard_normal((h, w_)).astype(np.float32)
        img = Image.fromarray(n).resize((W, H), Image.BICUBIC)
        acc += w * np.asarray(img, np.float32)
    return acc / np.sqrt(sum(w * w for w in weights))

fiber = fbm([1, 2, 4], [0.45, 0.5, 0.3])
cloud = fbm([90, 260], [0.6, 0.4])
g += fiber * (0.0045 * (1 - lit) + 0.0025 * lit) + cloud * (0.0045 * (1 - lit))

# 冷一点：蓝通道略高
# 日光下的影子偏蓝，光里接近中性的白：冷暖只在这一点点色温差里
r_ = 0.978 * (1 - lit) + 0.994 * lit
g_ = 0.987 * (1 - lit) + 0.997 * lit
rgb = np.stack([g * r_, g * g_, g * 1.0], -1)
rgb = np.clip(rgb * 255, 0, 255).astype(np.uint8)
Image.fromarray(rgb).save(f'{OUT}.webp', quality=90, method=6)

# 颗粒：中灰上的细噪点，页面上用 overlay 叠在纸和字上面
grain = np.clip(128 + rng.standard_normal((192, 192)) * 24, 0, 255).astype(np.uint8)
Image.fromarray(grain).save(ASSETS / 'cover-grain.png', optimize=True)

print(W, H, 'R', R, 'top', H * TOP, 'sagitta', R - np.sqrt(R * R - (W / 2) ** 2))
