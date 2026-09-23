# 网站的生成与维护

这份说明给改网站的人看。仓库首页的 README 是给看作品集的人写的，文案照着网站首页；首页的文案、作品顺序或画面变了，README 要一起改。

## 文件

- `dist/`：完整网站，可以整个交给静态网站托管。`index.html` 是首页，另外五个 HTML 是作品详情页。
- `dist/portfolio.css`、`dist/portfolio.js`：公共样式和交互。
- `dist/assets/`：视频、图片、字体和简历。`fonts/` 是网页用的字体子集和它们的许可证。首页和详情页都放完整影片；两段 `*-preview.mp4` 短预览页面已不再引用，留作备查。
- `dist/prototype/`、`gap/`、`thinking-prototype/`、`thinking-showcase/`：交互原型和展示副本。`co-thinker-preview/`、`co-thinker-showcase/` 是旧版界面的样张，页面已不再链接，留作备查。
- `editorial/build.py`：六个页面的生成源稿，文案、结构和作品顺序都在这里。
- `editorial/cover.py`：生成首屏的纸面图和颗粒图（需要 numpy 和 Pillow）。弧线的参数和 `build.py` 里的 `cover_arc()` 一致，改一边要同时改另一边。
- `editorial/fonts.py`：从源字体里挑出网站用到的字，重做 `dist/assets/fonts/` 里的字体子集。
- `editorial/readme-images.mjs`：重截仓库首页 README 里首屏和两个原型的配图，存进 `.github/images/`。
- `editorial/readme-videos.sh`：给 README 压三段影片，第一帧换成网站用的封面，每段压到 10MB 以内。README 里的视频是 GitHub 附件，存在 issue #1 的评论里。
- `editorial/gap-viewer.html`：GAP 详情页的双标签嵌入模板。
- `editorial/IMPLEMENTATION.md`：早期的编辑记录，仅作参考；里面的目录指向原工作区，不影响运行。
- `server.mjs`：本地预览。

## 预览

直接用浏览器打开 `dist/index.html` 就能看。想和放到网上时一样，从本地服务打开：装好 Node.js，在仓库文件夹里运行

```sh
node server.mjs
```

再访问 http://127.0.0.1:8809 。在终端按 Ctrl+C 结束。

## 修改

- 文案、页面结构、作品顺序：改 `editorial/build.py`，再运行 `python3 editorial/build.py`，重新生成六个页面。直接改生成出来的 HTML，下次生成时会被覆盖；公共 CSS、JS 和各原型的文件可以直接改，不会被覆盖。
- 出现了新字：运行 `python3 editorial/fonts.py` 重做字体子集（需要 fontTools 和源字体，文件开头写了去哪里取）。不重做也不会坏，新字会回落到系统宋体。
- 换了影片：按新片子画面边缘的颜色改 `build.py` 里的 `STAGE`。影片所在的底板取自画面自己的底色，片子的边才看不出来。
- 改了首屏或原型：运行 `node editorial/readme-images.mjs`，重截 README 的配图。
- 换了影片或封面：运行 `bash editorial/readme-videos.sh` 压出新版，拖进 issue #1 的评论框发出评论，再把 GitHub 给的新链接换进 README。旧的那条评论等 README 推上去以后再删，删早了 README 里的视频会先放不出来。

## 交付范围

包含网站用到的原型源码和成品视频；不含各独立产品的后端、模型服务和视频剪辑工程。原型里的预设交互和概念影片的标注都保留着。除了 GitHub、文章、邮件这些外部链接，网站不需要联网。

## 版本

2026-09-23。版式改为冷白纸面、衬线标题：首屏是一张纸，光从下面漫上来，「作品集」沿光的上沿排，名字用小字放在它上面。中文用思源宋体，西文用 Newsreader。所有作品的画面同宽，放在取自画面底色的底板上，片名、画面和页边落在同一栏里。

Co-Thinker 的短片和截图按新版界面重新录制，连着真实模型，从对话、地基一直演示到一键生成 Prompt 并复制，片尾新建对话、回到首屏，共 1 分 19 秒。短片配的是原创合成的音乐，没有用外部采样或录音。作品顺序：CanvasFlow、Astra、GAP Analysis、Co-Thinker、Thinking、AfterSpark。
