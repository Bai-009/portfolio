// 重截仓库首页 README 的配图，写进 .github/images/。
// 直接打开 dist/index.html，不需要本地服务；需要 Node 22 以上和 Google Chrome。
//
//     node editorial/readme-images.mjs
//
// 换了影片、改了首屏或原型之后运行一次。Chrome 不在默认位置时，用环境变量 CHROME 指定。
import { spawn } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { setTimeout as sleep } from 'node:timers/promises'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, '.github', 'images')
const PAGE = pathToFileURL(join(ROOT, 'dist', 'index.html')).href
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
// 作品画面：[锚点, 等多久再截（毫秒）, 先等原型里出现的字]。Thinking 等答案第一节的末句写完，大约要一分钟；
// 句末的引用标记随后 0.1 秒出来，再过半秒多，下一段就从输入框上沿冒出来了，所以只等 0.3 秒。
const WORKS = [['canvasflow', 1500], ['astra', 1500], ['gap-analysis', 3500], ['co-thinker', 1500], ['thinking', 300, '两者并不矛盾。']]

const port = 9400 + Math.floor(Math.random() * 400)
const profile = join(tmpdir(), `portfolio-readme-${port}`)
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${port}`, '--hide-scrollbars', '--force-color-profile=srgb',
  '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })

let ws, session, id = 0
const pending = new Map()
const send = (method, params = {}, sessionId = session) => new Promise((res, rej) => {
  const n = ++id
  pending.set(n, { res, rej })
  ws.send(JSON.stringify({ id: n, method, params, sessionId }))
})
for (let i = 0; i < 100 && !ws; i++) {
  try {
    const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json()
    const socket = new WebSocket(webSocketDebuggerUrl)
    await new Promise((ok, fail) => { socket.onopen = ok; socket.onerror = fail })
    ws = socket
  } catch { await sleep(200) }
}
if (!ws) throw new Error(`Chrome 没有启动：${CHROME}`)
ws.onmessage = ({ data }) => {
  const m = JSON.parse(data)
  if (!pending.has(m.id)) return
  const { res, rej } = pending.get(m.id)
  pending.delete(m.id)
  m.error ? rej(new Error(m.error.message)) : res(m.result)
}
const run = async (expression) => {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.text}：${expression.slice(0, 80)}`)
  return r.result.value
}
// 原型在 iframe 里，直接打开时和页面不算同一个来源，页面读不到它的字，从 Chrome 这边进去读
const frameText = async (slug) => {
  const { frameTree } = await send('Page.getFrameTree')
  const src = await run(`document.querySelector('#${slug} iframe').src`)
  const frame = (frameTree.childFrames || []).map((node) => node.frame).find((f) => f.url === src)
  if (!frame) return ''
  const { executionContextId } = await send('Page.createIsolatedWorld', { frameId: frame.id })
  const r = await send('Runtime.evaluate', { contextId: executionContextId, expression: 'document.body.innerText', returnByValue: true })
  return r.result.value || ''
}
const open = async (css) => {
  await send('Page.navigate', { url: PAGE })
  for (let i = 0; i < 100 && (await run('document.readyState')) !== 'complete'; i++) await sleep(100)
  await run('document.fonts.ready.then(() => true)')
  await run(`document.head.insertAdjacentHTML('beforeend', ${JSON.stringify(`<style>${css}</style>`)}); true`)
}
// 以 CSS 像素给出区域，按 width 输出像素宽的 JPEG；放大截图时 Chrome 按目标尺寸重新绘制，字是清楚的。
// 区域要在屏幕以内：截屏幕外的部分时页面会重画，首屏标题的入场动画会回到开头，字就没了
const shoot = async (name, clip, width) => {
  const { data } = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, clip: { ...clip, scale: width / clip.width } })
  writeFileSync(join(OUT, `${name}.jpg`), Buffer.from(data, 'base64'))
  console.log(`.github/images/${name}.jpg`)
}

mkdirSync(OUT, { recursive: true })
const { targetId } = await send('Target.createTarget', { url: 'about:blank' }, undefined)
session = (await send('Target.attachToTarget', { targetId, flatten: true }, undefined)).sessionId
await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })

// 首屏：收起顶栏，等晨光和墨迹入场走完。README 里图只有八百来像素宽，裁掉两边各一成半，按 2:1 取中间，
// 名字和目录才看得清；光的弧线仍然看得出来
await open('.site-header{display:none!important}')
await sleep(4500)
await shoot('cover', { x: 216, y: 233, width: 1008, height: 504 }, 1800)

// 作品画面：停掉入场动画，收起播放键和原型下方的操作条；四边各裁掉一个圆角半径，图是方角的
await open('.site-header,.film-play,.media-footer,.thinking-controls{display:none!important} .stage{animation:none!important} .js .reveal{opacity:1!important;transform:none!important}')
for (const [slug, wait, text] of WORKS) {
  await run(`document.querySelector('#${slug} .stage').scrollIntoView({ block: 'center', behavior: 'instant' }); true`)
  for (let i = 0; text && i < 600 && !(await frameText(slug)).includes(text); i++) await sleep(200)
  await sleep(wait)
  const clip = await run(`(() => {
    const stage = document.querySelector('#${slug} .stage'), box = stage.getBoundingClientRect()
    const r = parseFloat(getComputedStyle(stage).borderTopLeftRadius)
    return { x: Math.round(box.left + scrollX + r), y: Math.round(box.top + scrollY + r), width: Math.round(box.width - 2 * r), height: Math.round(box.height - 2 * r) }
  })()`)
  await shoot(slug, clip, 1600)
}

chrome.kill()
await sleep(300)
rmSync(profile, { recursive: true, force: true })
process.exit(0)
