# 白东昊 · 作品集完整工程

这是当前作品集的独立副本，包含网站、素材、页面生成源稿和本地预览工具。文件夹可以整体移动，不依赖原工作区。

## 文件位置

- `dist/`：完整网站，可单独交给静态网站托管平台。
- `dist/index.html`：首页；其余五个 HTML 文件为项目详情。
- `dist/portfolio.css`：网站公共样式。
- `dist/portfolio.js`：网站交互与嵌入缩放。
- `dist/assets/`：视频、图片、字体和简历。Co-Thinker 的完整演示、首页预览、封面与三张截图是 `co-thinker-*.mp4` 和 `co-thinker-*.webp`。
- `dist/prototype/`、`gap/`、`thinking-prototype/`、`thinking-showcase/`：交互原型与展示副本，均位于 dist 内。`co-thinker-preview/`、`co-thinker-showcase/` 是旧版界面的样张，页面已不再链接，保留备查。
- `editorial/build.py`：六个网站页面的生成源稿，负责文案、结构和项目顺序。
- `editorial/gap-viewer.html`：GAP 详情的双标签嵌入模板。
- `editorial/IMPLEMENTATION.md`：编辑历史，仅作参考；历史目录位置指向原工作区，不影响本工程运行。
- `server.mjs`：本地预览工具。

## 本地打开

安装 Node.js 后，在本文件所在文件夹运行：

```sh
node server.mjs
```

浏览器访问 http://127.0.0.1:8809 。关闭预览时在终端按 Ctrl+C。
请使用本地服务打开；直接双击 HTML 可能限制原型通信和媒体行为。

## 修改与生成

修改文案、页面结构、项目顺序：编辑 `editorial/build.py`，然后安装 Python 3 并运行：

```sh
python3 editorial/build.py
```

这会重新生成 dist 下的六个主页面。仅修改生成后的 HTML 会在下一次生成时被覆盖。
公共 CSS、JS 与各原型源文件可直接修改，不会被该脚本覆盖。

## 交付范围

包含当前网站使用的原型源码与成品视频；不含各独立产品的后端、模型服务或视频剪辑工程。原型中的预设交互及概念影片标注保留。GitHub、文章、邮件等外部入口需要网络。

版本：2026-09-23。Co-Thinker 的短片与截图按新版界面重新录制，仍是真实模型连线，从对话、地基一直演示到一键生成 Prompt 并复制。短片配了原创合成的音乐，没有使用外部采样或录音。项目顺序：CanvasFlow、Astra、GAP Analysis、Co-Thinker、Thinking、AfterSpark。
