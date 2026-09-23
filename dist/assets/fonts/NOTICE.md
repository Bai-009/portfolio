# 字体

- `serif-sc.woff`：思源宋体 Source Han Serif CN Regular 的子集，只含网站用到的字。原字体保留了字体名 "Source"，改动后的版本不能沿用，所以改名为 Portfolio Serif SC。许可见 `OFL-SourceHanSerif.txt`。
- `serif.woff`、`serif-italic.woff`：Newsreader 可变字体（字重 200–800，光学尺寸 6–72）的西文子集，改名为 Portfolio Serif。许可见 `OFL-Newsreader.txt`。

子集由 `editorial/fonts.py` 生成。页面对字体的引用是渐进增强：没有收进子集的字回落到系统宋体，排版结构不依赖它。
