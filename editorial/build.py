from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]/'dist'
gap=(Path(__file__).parent/'gap-viewer.html').read_text()

# 首页顺序。最后一项是详情页，Astra 没有详情页。
WORKS=[
    ('canvasflow','CanvasFlow','AI 画布工作流','canvasflow.html'),
    ('astra','Astra','概念宣传片',None),
    ('gap-analysis','GAP Analysis','企业 AI 解决方案','gap-analysis.html'),
    ('co-thinker','Co-Thinker','人机共同思考','co-thinker.html'),
    ('thinking','Thinking','智能体运行过程呈现','thinking.html'),
    ('afterspark','AfterSpark','AI 社交引荐','afterspark.html'),
]
CASES=[w for w in WORKS if w[3]]
# 台色取自影片画面边缘的底色，影片的边就化进台里。换片子时重新取色。
STAGE={'canvasflow':'#edeff1','astra':'#07080a','co-thinker':'#e9e8e6'}
counter=[0]

import math
def cover_arc(w,h,top,inset=38,span=0.46):
    r=w*1.55; cx,cy=w/2,h*top+r; rr=r-inset; th=math.asin(w*span/rr)
    return f'M {cx-rr*math.sin(th):.1f} {cy-rr*math.cos(th):.1f} A {rr:.1f} {rr:.1f} 0 0 1 {cx+rr*math.sin(th):.1f} {cy-rr*math.cos(th):.1f}', rr*2*th
def cover_scene(kind,w,h,top,title_size,name_y,index):
    # 字距在末字后面也留了一份，居中时整行会往左偏半个字距；名字和标题都补回来
    arc,length=cover_arc(w,h,top); name_size=34 if kind=='wide' else 48
    offset=50+title_size*0.34/2/length*100
    return (f'<svg class="cover-scene is-{kind}" viewBox="0 0 {w} {h}" preserveAspectRatio="xMidYMid slice">'
        f'<image href="assets/cover-paper{"" if kind=="wide" else "-portrait"}.webp" width="{w}" height="{h}"/>'
        f'<path id="arc-{kind}" d="{arc}" fill="none"/>'
        f'<text class="cover-name" x="{w/2+name_size*0.6/2:.0f}" y="{name_y}" text-anchor="middle">白东昊</text>'
        f'<text class="cover-title" font-size="{title_size}" aria-hidden="true"><textPath href="#arc-{kind}" startOffset="{offset:.2f}%" text-anchor="middle">作品集</textPath></text>'
        f'{index}</svg>')
def link(url,text,extra='',note=''):
    return f'<a class="text-link" href="{url}" {extra}>{text}{f"<small>{note}</small>" if note else ""}</a>'
def more(url,text,extra='data-case-link'):
    return f'<a class="text-link more" href="{url}" {extra}>{text}<span aria-hidden="true">→</span></a>'
def head(title,desc,home=False):
    counter[0]=0
    nav=('<a href="#work">作品</a><a href="#about">经历与文章</a>' if home else '<a href="index.html#work" data-return>作品</a>')+'<a href="assets/resume.pdf" target="_blank" rel="noopener">简历</a>'
    sig='' if home else '<a class="signature" href="index.html">白东昊</a>'
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} — 白东昊</title><meta name="description" content="{desc}"><meta name="theme-color" content="#fbfcfd"><link rel="icon" href="favicon.svg" type="image/svg+xml"><link rel="preload" href="assets/fonts/serif-sc.woff" as="font" type="font/woff" crossorigin><link rel="preload" href="assets/fonts/serif.woff" as="font" type="font/woff" crossorigin><link rel="stylesheet" href="portfolio.css"><script>document.documentElement.classList.add('js')</script><script src="portfolio.js" defer></script></head><body class="{'home' if home else 'case'}"><a class="skip" href="#main">跳到正文</a><header class="site-header">{sig}<nav aria-label="主导航">{nav}</nav></header><main id="main">'''
def foot():
    return '''</main><footer class="site-footer"><p class="footer-name">白东昊<span>AI 产品经理 · 2027 届硕士</span></p><nav aria-label="联系方式"><a class="text-link" href="mailto:15234067089@163.com">邮件联系</a><a class="text-link" href="https://github.com/Bai-009" target="_blank" rel="noopener">GitHub</a><a class="text-link" href="assets/resume.pdf" target="_blank" rel="noopener">简历</a></nav></footer><dialog class="image-dialog" aria-label="作品画面放大预览"><button type="button" data-close-image>关闭</button><img alt=""><p></p></dialog></body></html>'''
def case_header(name,kind,role,lead,actions=''):
    meta=f'<div><dt>角色</dt><dd>{role}</dd></div>'+(f'<div><dt>链接</dt><dd class="case-actions">{actions}</dd></div>' if actions else '')
    return f'<header class="case-cover wrap"><p class="case-kind">{kind}</p><h1 class="case-title">{name}</h1><p class="case-lead">{lead}</p><dl class="case-meta">{meta}</dl></header>'
def image(src,alt,caption=''):
    return f'<figure><button class="image-expand" data-expand-image aria-label="放大：{alt}"><img src="assets/{src}" alt="{alt}" loading="lazy"><span>放大查看</span></button><figcaption>{caption or alt}</figcaption></figure>'
def section(title,body,extra='',id=''):
    counter[0]+=1
    return f'<section class="case-section wrap" {f"id={id}" if id else ""}><div class="section-copy"><h2><span class="section-no">{counter[0]:02d}</span>{title}</h2><div>{body}</div></div>{extra}</section>'
def case_end(slug):
    order=[c[0] for c in CASES]; nxt=CASES[(order.index(slug)+1)%len(CASES)]
    return f'<nav class="case-next wrap" aria-label="继续浏览"><a class="next" href="{nxt[3]}"><span class="k">下一个作品</span><span class="t">{nxt[1]}</span></a>{link("index.html#"+slug,"返回作品","data-return")}</nav>'
def stage(slug,inner,dark=False):
    color=STAGE.get(slug)
    style=f' style="--stage:{color}"' if color else ''
    return f'<div class="stage{" is-dark" if dark else ""}"{style}>{inner}</div>'
def thinking():
    return '''<div class="thinking-player" data-thinking><iframe data-thinking-frame src="thinking-showcase/index.html" loading="lazy" title="Thinking 动态原型：文件删除与备份规则"></iframe><div class="thinking-controls"><span>动态原型 · 模拟数据</span><div><button data-pause-thinking>暂停</button><button data-restart-thinking>重新演示</button><a href="thinking-prototype/index.html" target="_blank" rel="noopener">独立打开</a></div></div></div>'''
def video(name,poster,preview=False,alt='CanvasFlow 工作流构建画面',label=None,length='0:48',cls='full-film'):
    label=label or ('CanvasFlow 15 秒预览' if preview else 'CanvasFlow 48 秒完整演示')
    # 完整影片先只露封面和一枚播放键，点了才出原生控制条
    attr='class="preview-film" muted data-preview' if preview else f'class="{cls}"'
    surface=f'<img class="preview-still" src="assets/{poster}" alt="{alt}"><canvas data-preview-surface class="preview-surface" aria-hidden="true"></canvas>' if preview else ''
    extra='<span class="mobile-preview-note">局部预览</span><button class="preview-control" data-play>播放预览</button>' if preview else f'<button class="film-play" data-film-play aria-label="播放：{label}"><span class="film-play-icon" aria-hidden="true"></span><span class="film-play-text">播放<small>{length}</small></span></button>'
    return f'''<div class="film-shell{' preview-shell' if preview else ' is-idle'}">{surface}<video {attr} playsinline preload="metadata" poster="assets/{poster}" aria-label="{label}"><source src="assets/{name}" type="video/mp4"></video>{extra}<p class="media-error" role="status" hidden>暂时无法播放，请使用下方独立播放入口。</p></div>'''
def work(slug,credit,deck,media='',note='',links='',extra=''):
    i=[w[0] for w in WORKS].index(slug); _,name,_,page=WORKS[i]
    title=f'<a href="{page}" data-case-link>{name}</a>' if page else name
    foot=f'<footer class="work-foot">{f"<p>{note}</p>" if note else ""}<nav>{links}</nav></footer>' if note or links else ''
    return f'<section class="work{"" if media else " is-text"}" id="{slug}"><header class="work-head"><div><p class="work-no">{i+1:02d}</p><h2 class="work-title">{title}</h2></div><p class="work-credit">{credit}</p><p class="work-deck">{deck}</p></header>{extra}{media}{foot}</section>'

# Case first: the home page is edited against the finished cases below.
canvas=head('CanvasFlow','AI 画布工作流：规划、逐步构建与局部修订。')
canvas+=case_header('CanvasFlow','AI 画布工作流','独立产品定义、交互设计、Agent 架构与实现','用自然语言提出需求，在画布上核对计划、看节点逐步构建，并沿着已有流程继续修改。',link('prototype/index.html','体验原型','target="_blank" rel="noopener"')+link('https://github.com/Bai-009/canvas-first-workflow','GitHub','target="_blank" rel="noopener"'))
canvas+='<section class="case-media" aria-label="CanvasFlow 演示">'+stage('canvasflow',video('canvasflow-film.mp4','grow.webp'))+'''<div class="chapters wrap"><span>48 秒 · 交互原型</span><div><button data-seek="5">核对理解 <small>00:05</small></button><button data-seek="13">逐步构建 <small>00:13</small></button><button data-seek="29">修改流程 <small>00:29</small></button></div></div><p class="media-note wrap">短片以合同处理为固定场景，修改由全局输入框发起。<a href="assets/canvasflow-film.mp4" target="_blank" rel="noopener">独立播放</a></p></section>'''
canvas+=section('从生成整图，到逐步构建','<p>使用 AI 工作流产品时，我发现画布常常只在最后展示成品。用户要先理解整张图，修改时还得回到对话框，把眼前的问题重新描述一遍。</p><p>CanvasFlow 将需求核对、构建和修订放在同一张画布中。用户在流程生成时逐渐熟悉每一步，将理解成本摊还到生成过程中。</p>')
canvas+=section('需求进入计划之前','<p>规划 Agent 并列呈现用户原话与自己的理解，再形成包含目标、输入输出和依赖关系的结构化计划。未决问题关联到受影响的步骤，用户能够在开始构建前纠正。</p><p>演示中补充“PDF 都是扫描件”后，OCR 成为计划的前置步骤。这一条件继续约束后续构建。</p>',image('understand.webp','用户补充扫描件条件后，计划加入 OCR 步骤。'))
canvas+=section('看见全局，每次执行一步','<p>状态机按计划派发单步任务，执行 Agent 同时看到完整计划、当前任务与已有成果。每次完成节点选型、配置与连接后，由代码校验参数和连线，再推进后续步骤。</p><p>画布随构建逐个呈现节点；全局信息帮助单步执行兼顾前后依赖，分步提交则让错误可以在当前步骤被检查和处理。</p>',image('grow.webp','OCR 节点展开，显示处理内容及与上游节点的连接。'))
canvas+=section('修改沿着已有成果继续','<p>节点内对话承接局部修改，全局对话用于整体规划。模型结合完整计划与当前画布分析关联影响，以 Diff 提交节点和连线变更。</p><p>改动经整图结构与版本校验后统一生效；未通过则原图保留。节点内对话及整图 Diff 是项目机制，短片展示的是从全局输入框修改抽取方式。</p>',image('revise.webp','抽取方式更新后，对应节点显示已修改，其他节点保留。'))
canvas+=case_end('canvasflow')+foot();(ROOT/'canvasflow.html').write_text(canvas)

# Enterprise case, with the original supplied materials intact.
gap_page=head('GAP Analysis','药明生物企业 AI 解决方案，参数提取、专家核验与风险研判。')
gap_page+=case_header('GAP Analysis','药明生物 · 企业 AI 解决方案','主导产品定义、系统架构、原型与 MVP 验证','客户工艺转入时，研究员需要提取参数、对照内部标准，再结合风险和成本，决定哪些沿用、哪些调整。',link('gap/gap-prototype-review.html','打开核验原型','target="_blank" rel="noopener"')+link('gap/module-responsibility-restructure.html','查看需求与配图','target="_blank" rel="noopener"'))
gap_page+='''<div class="case-outcome wrap"><div><p class="result">50h+<span class="arrow">→</span><span class="zh">约</span>20min</p><p>同一历史项目的单客户参数提取耗时对照</p></div><div><p class="result">90%+</p><p>业务专家评估的参数识别率</p></div></div>'''
gap_page+=section('提取之后，专家如何判断','<p>如果提取结果没有可核验的依据，研究员只能按原办法再做一遍。我把参数、原文位置和判断依据放在同一操作中：点击参数回到出处，围绕具体差异判断风险，再决定是否接受修改。</p><p>下方保留核验交互原型，以及从业务流程到模块职责的需求梳理；两份材料可以切换查看。</p>',gap)
gap_page+=section('让提取结果有据可查','<p>客户资料先经 OCR 或 VLM 处理为 Markdown，再分批交给 LLM。JSON Schema 按字段组拆分，模型只填写本批证据支持的字段。</p><p>每轮输出经过类型、单位、范围和业务规则校验；未通过则重新提取，三轮未达标转人工复核。字段来源与原文位置随结果保留，形成可逐项核验的对照表。</p>')
gap_page+=section('风险研判中的思考助手','<p>与 SME 持续讨论，将多年经验中的默会判断梳理为标准化 Skills。系统召回候选 Skills，再由 AI 根据当前参数、工艺对照与原文选择适用依据。</p><p>专家拿不准时，可以围绕具体参数追问、比较工艺选择，与 AI 共同推敲风险评级。AI 修改先形成草稿，经确认后写入正式结果；权限、版本校验与历史追溯支持多人协作。</p>')
gap_page+=case_end('gap-analysis')+foot();(ROOT/'gap-analysis.html').write_text(gap_page)

co=head('Co-Thinker','在对话里共同思考，后台沉淀地基，一键凝成 Prompt 交给执行 agent 的独立产品。')
co+=case_header('Co-Thinker','人机共同思考','独立产品设计与实现','一个想法还说不清时，追问、联想和反驳能让更多经验进来。Co-Thinker 把这样的讨论分成两层：前台的对话，后台的地基。要动手的时候，点一下，就凝成一段 Prompt，交给执行的 agent。',link('assets/co-thinker-film.mp4','独立播放','target="_blank" rel="noopener"')+link('https://github.com/Bai-009/Co-Thinker','GitHub','target="_blank" rel="noopener"'))
co+='<section class="case-media" aria-label="Co-Thinker 演示">'+stage('co-thinker',video('co-thinker-film.mp4','co-thinker-poster.webp',alt='Co-Thinker 对话画面',label='Co-Thinker 1 分 19 秒 完整演示',length='1:19'))+'''<div class="chapters wrap"><span>1 分 19 秒 · 真实模型连线</span><div><button data-seek="5">对话 <small>00:05</small></button><button data-seek="22">改口 <small>00:22</small></button><button data-seek="26">引用 <small>00:26</small></button><button data-seek="59">Prompt <small>00:59</small></button></div></div><p class="media-note wrap">短片连着 DeepSeek 录制，模型的回话和生成的 Prompt 都是原样。等模型的时候只留开头和结尾，中间剪掉；录制时浏览器卡住的空档也剪掉了。指针是录制时叠上去的，标出点在哪里。<a href="assets/co-thinker-film.mp4" target="_blank" rel="noopener">独立播放</a></p></section>'''
co+=section('想法是在讨论中形成的','<p>人往往知道自己喜欢什么、哪里不对，却暂时说不出理由。一次长回答容易让人顺着 AI 的结论走，自己的感受和判断反而没有机会展开。</p><p>前台是即时消息的节奏，每轮只推进一点：问出眼前最关键的一个岔路，等人来定；依据够了，就给出有理由的判断或反例。讨论本身就是思考的过程。</p>',image('co-thinker-thread.webp','每轮只问一个岔路，等人来定。'))
co+=section('记忆在后台更新','<p>前台继续交流，后台晚一拍维护「地基」：来路写成一段话，定下来的列进「共识」，还没定的列进「待定」。只有双方确认过的才进共识，模型自己的提议留在待定里。</p><p>地基每轮整份重写，做全局校验而不是打补丁；清单只许追加和取代。改过的条目句末标着旧编号，指针停上去，就变回原来的说法，理由也跟着浮上来。人回改一句话，后面的沉淀跟着退回去重来。</p>',image('co-thinker-records.webp','地基分共识和待定两节，写的都是自己的话。'))
co+=section('从共同思考到后续执行','<p>要动手时点一下，地基和整场对话就凝成一段 Prompt，交给 Claude Code、Codex 这类执行 agent。Prompt 保留目标、边界、关键判断和它们的理由，执行从已经一起想清的地方开始。</p><p>密度来自持续的维护：判断关联到来源，重复和冲突被处理过，没定的照实写着。人不必为了交接，回头重新整理整段对话。</p>',image('co-thinker-prompt.webp','Prompt 和地基在同一张纸上，复制下来就能交出去。'))
co+='<p class="case-note wrap">短片和截图来自真实模型连线，对话内容未经剪辑。模型的思考质量随对话变化，短片只展示一次完整的走法。</p>'+case_end('co-thinker')+foot();(ROOT/'co-thinker.html').write_text(co)

th=head('Thinking','智能体运行过程的信息架构、阅读节奏与证据追溯。')
th+=case_header('Thinking','智能体运行过程呈现','信息架构、交互设计与原型实现','将 AI 正在作出的判断、为此采取的行动和执行结果关联呈现。阅读随当前思路推进，完整过程留待回看。',link('thinking-prototype/index.html','独立打开原型','target="_blank" rel="noopener"')+link('https://github.com/Bai-009/agent-thinking-ui','GitHub','target="_blank" rel="noopener"'))
th+='<section class="case-media" aria-label="Thinking 动态原型">'+stage('thinking',thinking())+'</section>'
th+=section('信息随所属的判断进退','<p>一项判断下面可以有多次行动，每次行动又有自己的执行信息。切换行动时，当前判断保留，执行信息随行动更新；进入下一项判断时，原有行动及执行信息一起退出当前视野。</p><p>演示以知识库问答为例。AI 发现旧文档与现行规则冲突后，改变判断并继续检索。用户能看出它是在同一思路中补证据，还是已经调整了思路。</p>')
th+=section('运行速度与阅读节奏分开','<p>工具事件连续到达，不等于要立即全部显示。运行记录与呈现队列分开维护，界面按判断、行动与结果的关系展开，给刚出现的信息留出阅读时间。</p><p>迟到的执行事件仍归属于原来的行动，不混入当前判断。退出视野的内容继续留在记录中，前台的简洁不以丢失过程为代价。</p>')
th+=section('完成后，沿答案回到依据','<p>任务结束，运行过程归档为证据树。答案引用直接连接到相应调用和材料，读者可以从结论回查依据。原始工程事件放在开发者入口，按需查看。</p>')
th+='<p class="case-note wrap">原型中的文档、条款、调用和模型消息均为模拟数据，用于展示信息组织与交互节奏。</p>'+case_end('thinking')+foot();(ROOT/'thinking.html').write_text(th)

af=head('AfterSpark','基于问题结构的 AI 社交引荐探索。')
af+=case_header('AfterSpark','AI 社交引荐','独立产品设计与实现 · 研究性原型','人与 AI 的长期讨论，能否成为人与人相识的依据？AfterSpark 探索从对话理解出发，连接能够继续共同思考的人。')
af+=section('从相同话题，深入到问题结构','<p>两个来自不同领域的人，可能关心相似的关系与矛盾。共同话题容易发现，这种更深的联系却常常藏在长期表达中。</p><p>系统将对话中的关切、动机与判断关联到原话，再比较不同讨论中的要素和关系。候选引荐必须说明对应在哪里、仍有哪些疑点，不能只给出一个相似度。</p>')
af+=section('引荐需要经得起审议','<p>多个 Agent 先独立判断，再交叉复议，并检查重复判断是否稳定。依据不足或结果不稳定，就不发出引荐。用户可以继续与人格 Agent 讨论，交流不以尽快匹配为前提。</p>')
af+=section('相识之后，讨论能够接续','<p>设计中的真人引荐需要双方同意。进入共同交流后，Agent 携带双方相关的讨论背景，解释引荐缘由、帮助澄清误解，并记录随后形成的想法，把主要交流空间留给参与者。</p><p>这一设计也面向围绕同一问题逐渐形成的小群体；连接的价值，要在后续共同做下去的过程中实现。</p>')
af+=section('当前原型','<p>自动候选池由 39 个人格 Agent 组成，另有手工指定真人参与者的后端通路。真人自动匹配与小群体共创仍属于产品方向，尚未作为已验证能力展示。</p>')
af+=case_end('afterspark')+foot();(ROOT/'afterspark.html').write_text(af)

home=head('作品集','白东昊的企业 AI 解决方案、独立产品与交互设计作品。',True)
wide_index='<text class="cover-index" x="1440" y="1212" text-anchor="middle">'+''.join(f'<a href="#{slug}"><tspan class="no" dx="{0 if i==0 else 52}">{i+1:02d}</tspan><tspan class="t" dx="12">{name}</tspan></a>' for i,(slug,name,_,_) in enumerate(WORKS))+'</text>'
tall_index=''.join(f'<a href="#{slug}"><text class="cover-index" x="645" y="{1440+i*92}" text-anchor="middle"><tspan class="no">{i+1:02d}</tspan><tspan class="t" dx="16">{name}</tspan></text></a>' for i,(slug,name,_,_) in enumerate(WORKS))
home+='<section class="cover" aria-labelledby="cover-title"><h1 class="visually-hidden" id="cover-title">白东昊 作品集</h1>'+cover_scene('wide',2880,1800,0.54,178,748,wide_index)+cover_scene('tall',1290,2560,0.47,150,1016,tall_index)+'<div class="cover-grain" aria-hidden="true"></div></section><div id="work">'
home+=work('canvasflow','独立产品设计与实现','用自然语言构建数据工作流，在画布上核对、理解和修改。',stage('canvasflow',video('canvasflow-film.mp4','grow.webp')),'计划先与用户对齐，节点随后逐个构建。',more('canvasflow.html','查看项目')+link('assets/canvasflow-film.mp4','独立播放','target="_blank" rel="noopener"','0:48 · 含音轨'))
home+=work('astra','矩阵起源 · 产品研究与概念影片创作','企业 Agent 运行时 · 概念宣传片',stage('astra',video('agent-film-v9.mp4','astra-film-poster.png',label='Astra 概念宣传片，1 分 27 秒',length='1:27',cls='astra-film'),dark=True),'借鉴数据库的查询规划与 EXPLAIN，以一次支付系统迁移串起上下文的组装与追溯，呈现 Agent 围绕任务持续工作、延续判断依据的产品愿景。',link('assets/agent-film-v9.mp4','独立播放','target="_blank" rel="noopener"','1:27 · 含音轨'))
home+=work('gap-analysis','药明生物 · 企业 AI 解决方案','生物药工艺转移中的参数提取、专家核验与风险研判。',stage('gap-analysis','''<div class="gap-home-view"><div class="gap-viewport" data-scaled-gap><iframe src="gap/gap-portfolio-view.html" loading="lazy" title="GAP 核验原型：查看接种密度的提取依据"></iframe></div><div class="gap-mobile-excerpt"><p class="excerpt-label">接种密度 · 原型核验示例</p><h3>Target density</h3><dl><div><dt>当前值</dt><dd>2.0×10⁵</dd></div><div><dt>建议修正</dt><dd>2.0×10⁶</dd></div><div><dt>原文位置</dt><dd>Batch Record BR-009 · p2</dd></div></dl><p>原文手写栏的读图结果与当前值不一致，修正先保留为待确认建议。</p></div><div class="media-footer"><span>交互原型 · 示例数据</span><a href="gap/gap-prototype-review.html" target="_blank" rel="noopener">打开完整原型</a></div></div>'''),'主导产品定义、系统架构与原型验证。',more('gap-analysis.html','查看方案与材料'),extra='<div class="work-figures"><div><p class="result">50h+<span class="arrow">→</span><span class="zh">约</span>20min</p><p>同一历史项目的单客户参数提取耗时对照</p></div><div><p class="result">90%+</p><p>业务专家评估的参数识别率</p></div></div>')
home+=work('co-thinker','独立产品设计与实现','在对话里把想法说清，定下来的沉进地基，需要时一键凝成 Prompt，交给执行。',stage('co-thinker',video('co-thinker-film.mp4','co-thinker-poster.webp',alt='Co-Thinker 对话画面',label='Co-Thinker 1 分 19 秒 完整演示',length='1:19')),'地基在对话旁边一轮轮长出来。读完点一下，凝成一段能直接交出去的 Prompt。',more('co-thinker.html','查看设计')+link('assets/co-thinker-film.mp4','独立播放','target="_blank" rel="noopener"','1:19 · 含音轨'))
home+=work('thinking','信息架构与交互设计','按思路组织智能体的运行信息，完成后沿答案追溯依据。',stage('thinking',thinking()),'切换行动时保留判断；切换判断时，所属执行信息一起退出。',more('thinking.html','查看设计'))
home+=work('afterspark','独立产品 · AI 社交引荐','两个人所处的领域不同，却可能一直在思考相似的问题。AfterSpark 从长期对话中寻找这种联系，经多 Agent 审议和双方同意后，尝试把讨论带向共同交流。',links=more('afterspark.html','阅读设计与机制'))
home+='''</div><section class="about wrap" id="about"><h2>经历与文章</h2><div><article><h3>药明生物</h3><p>主导 GAP Analysis AI 解决方案的产品定义与系统架构，完成原型及 MVP 验证。</p></article><article><h3>矩阵起源</h3><p>端到端负责工作流模块的产品定义、交互设计与验收；参与平台体验迭代，设计智能体运行过程的信息呈现。</p></article><article><h3>产品研究</h3><p>YouWare、Kimi 与 AI 的现实应用。'''+more('https://github.com/Bai-009/ai-product-research','阅读文章','target="_blank" rel="noopener"')+'''</p></article></div></section>'''+foot()
(ROOT/'index.html').write_text(home)
print('Six pages generated with shared presentation shell.')
