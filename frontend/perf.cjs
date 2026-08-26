const { chromium } = require('playwright')
const BASE='http://localhost:3001'

// Hover back and forth across a project figure and a button, sampling every
// animation frame. Long frames are what "lag" actually is.
const RUN = `(async () => {
  const frames = []
  let last = performance.now()
  let stop = false
  const tick = t => { frames.push(t - last); last = t; if (!stop) requestAnimationFrame(tick) }
  requestAnimationFrame(tick)

  const fig = document.querySelector('article figure')
  const btn = document.querySelector('article h3 button')
  const fire = (el, type) => {
    if (!el) return
    const r = el.getBoundingClientRect()
    el.dispatchEvent(new MouseEvent(type, {bubbles:true, clientX:r.left+r.width/2, clientY:r.top+r.height/2}))
  }
  for (let i = 0; i < 14; i++) {
    fire(fig,'mouseover'); fire(fig,'mouseenter')
    await new Promise(r => setTimeout(r, 120))
    fire(fig,'mouseout');  fire(fig,'mouseleave')
    fire(btn,'mouseover'); fire(btn,'mouseenter')
    await new Promise(r => setTimeout(r, 120))
    fire(btn,'mouseout');  fire(btn,'mouseleave')
  }
  await new Promise(r => setTimeout(r, 300))
  stop = true
  const f = frames.slice(3).sort((a,b)=>a-b)
  const pct = q => f[Math.floor(f.length*q)] || 0
  return {
    frames: f.length,
    median: +pct(0.5).toFixed(1),
    p95: +pct(0.95).toFixed(1),
    worst: +f[f.length-1].toFixed(1),
    over50: f.filter(x=>x>50).length,
    over100: f.filter(x=>x>100).length,
  }
}) ()`

const CASES = [
  ['baseline (as shipped)',            ''],
  ['no image scale on hover',          '.lift:hover img{transform:none!important}'],
  ['no backdrop-filter',               'header,[class*=filterBar]{backdrop-filter:none!important}'],
  ['no image scale + no backdrop',     '.lift:hover img{transform:none!important} header,[class*=filterBar]{backdrop-filter:none!important}'],
  ['images hidden entirely',           'article figure img{display:none!important}'],
]

;(async()=>{
  const b = await chromium.launch()
  for (const route of ['/work','/']) {
    console.log(`\n===== ${route} =====`)
    console.log('  case'.padEnd(34), 'median'.padStart(7), 'p95'.padStart(7), 'worst'.padStart(7), '>50ms'.padStart(7), '>100ms'.padStart(8))
    for (const [name, css] of CASES) {
      const ctx = await b.newContext({ viewport:{width:1440,height:900} })
      const p = await ctx.newPage()
      await p.goto(BASE+route, { waitUntil:'domcontentloaded' })
      if (css) await p.addStyleTag({ content: css })
      // let the heavy images finish arriving so we measure steady state
      await p.waitForTimeout(9000)
      await p.evaluate(()=>window.scrollTo(0, 700))
      await p.waitForTimeout(1200)
      const r = await p.evaluate(RUN)
      console.log(' ', name.padEnd(32), String(r.median).padStart(7), String(r.p95).padStart(7),
                  String(r.worst).padStart(7), String(r.over50).padStart(7), String(r.over100).padStart(8))
      await ctx.close()
    }
  }
  await b.close()
})()
