import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Liz — Compact V2",
  description:
    "A compact personal-site template with editorial warmth, systems structure, and lightweight motion — 3D tilt, canvas grain, scroll reveal.",
};

const styles = `
:root {
  --paper: #faf9f5; --paper-warm: #fffdf8; --paper-muted: #f1eee6;
  --ink: #141413; --ink-soft: #3a3630; --muted: #716d64; --faint: #9b9488;
  --line: #ddd7ca; --line-strong: #c9c1b1;
  --accent: #b14e22; --blue: #4f6f8f; --green: #6f8f72;
  --selection: #c0fe04; --container: 1120px;
  --sans: "Inter", system-ui, -apple-system, sans-serif;
  --serif: "Instrument Serif", Georgia, serif;
  --mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  --ease-66: cubic-bezier(0.66, 0, 0.01, 1);
}
.pv2 * { box-sizing: border-box; margin: 0; padding: 0; }
.pv2 { background: var(--paper); color: var(--ink); font-family: var(--font-poppins, var(--sans)); -webkit-font-smoothing: antialiased; overflow-x: hidden; position: relative; min-height: 100vh; }
.pv2::selection, .pv2 *::selection { background: var(--selection); color: #000; }
.pv2 a { color: inherit; text-decoration: none; }
.pv2 h1, .pv2 h2, .pv2 h3 { font-weight: 400; }
.pv2-canvas { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; opacity: 0.06; }
.pv2-ctn { width: min(var(--container), calc(100% - 40px)); margin: 0 auto; position: relative; z-index: 1; }
.pv2-reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.8s var(--ease-66), transform 0.8s var(--ease-66); }
.pv2-reveal.in { opacity: 1; transform: translateY(0); }
.pv2-dot { position: relative; }
.pv2-dot::before { content: ""; position: absolute; inset: 0; border: 2px dotted transparent; pointer-events: none; transition: border-color 0.2s; z-index: 1; }
.pv2-dot:hover::before { border-color: var(--ink); }
.pv2-mono { font-family: var(--font-mono, var(--mono)); font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); }
.pv2-mono-a { color: var(--accent); }
.pv2-header { position: sticky; top: 0; z-index: 100; border-bottom: 1px solid var(--line); background: rgba(250,249,245,0.85); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
.pv2-hdr-in { display: flex; align-items: center; justify-content: space-between; height: 60px; }
.pv2-brand { display: flex; align-items: center; gap: 10px; font-family: var(--font-poppins, var(--sans)); font-weight: 600; font-size: 0.875rem; letter-spacing: -0.02em; }
.pv2-mark { display: grid; place-items: center; width: 26px; height: 26px; border-radius: 999px; background: var(--ink); color: var(--paper); font-size: 13px; font-weight: 700; }
.pv2-nav { display: flex; gap: 20px; }
.pv2-nav a { font-family: var(--font-mono, var(--mono)); font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); transition: color 0.15s; }
.pv2-nav a:hover { color: var(--ink); }
.pv2-sys { display: flex; align-items: center; gap: 12px; }
@keyframes pv2-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }
.pv2-dot-live { display: inline-block; width: 6px; height: 6px; border-radius: 999px; background: var(--green); animation: pv2-pulse 2.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .pv2-dot-live { animation: none; } }
.pv2-hero { padding: 100px 0 80px; }
.pv2-hero-grid { display: grid; grid-template-columns: minmax(0, 0.95fr) minmax(380px, 0.85fr); gap: 60px; align-items: center; }
.pv2-hero h1 { font-family: var(--font-instrument-serif, var(--serif)); font-size: clamp(44px, 6.5vw, 80px); font-weight: 400; line-height: 1; letter-spacing: -0.025em; max-width: 780px; }
.pv2-hero h1 .pv2-acc { color: var(--accent); }
.pv2-hero h1 .pv2-blue { color: var(--blue); }
.pv2-hero-sub { font-family: var(--font-lora, var(--serif)); font-size: clamp(18px, 1.6vw, 22px); line-height: 1.6; color: var(--muted); max-width: 600px; margin-top: 22px; }
.pv2-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
.pv2-tag { padding: 0.2em 0.6em; border: 1px solid var(--line); border-radius: 999px; font-family: var(--font-poppins, var(--sans)); font-size: 0.72rem; font-weight: 500; color: var(--muted); background: rgba(255,253,248,0.6); transition: border-color 0.15s, color 0.15s; }
.pv2-tag:hover { border-color: var(--accent); color: var(--ink); }
@keyframes pv2-orbit { from { transform: translate(-50%,-50%) rotate(0); } to { transform: translate(-50%,-50%) rotate(360deg); } }
@keyframes pv2-orbit-rev { from { transform: translate(-50%,-50%) rotate(0); } to { transform: translate(-50%,-50%) rotate(-360deg); } }
@media (prefers-reduced-motion: reduce) { .pv2-orbit-spin, .pv2-orbit-rev { animation: none !important; } }
.pv2-panel { position: relative; border: 1px solid var(--line); border-radius: 24px; background: linear-gradient(180deg, rgba(255,253,248,0.96), rgba(241,238,230,0.72)); box-shadow: 0 22px 70px rgba(43,37,27,0.09); overflow: hidden; min-height: 460px; }
.pv2-tilt { position: absolute; inset: 0; transition: transform 0.5s var(--ease-66); }
.pv2-panel-bar { border-bottom: 1px solid var(--line); padding: 16px 20px; display: flex; justify-content: space-between; font-size: 0.68rem; letter-spacing: 0.16em; text-transform: uppercase; color: var(--faint); }
.pv2-stage { position: relative; min-height: 400px; display: grid; place-items: center; }
.pv2-orbit { position: absolute; top: 50%; left: 50%; border-radius: 50%; }
.pv2-oa { width: 280px; height: 280px; border: 1px solid rgba(177,78,34,0.18); animation: pv2-orbit 20s linear infinite; }
.pv2-ob { width: 190px; height: 190px; border: 1px solid rgba(79,111,143,0.16); animation: pv2-orbit-rev 24s linear infinite; }
.pv2-oc { width: 110px; height: 110px; border: 1px solid rgba(111,143,114,0.18); animation: pv2-orbit 28s linear infinite; }
.pv2-node { position: absolute; width: 12px; height: 12px; border-radius: 999px; box-shadow: 0 0 0 10px rgba(255,255,255,0.16); }
.pv2-na { background: var(--accent); top: 80px; right: 100px; }
.pv2-nb { background: var(--blue); bottom: 100px; left: 80px; }
.pv2-nc { background: var(--green); bottom: 140px; right: 60px; }
.pv2-pill { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); padding: 8px 16px; border: 1px solid var(--line); border-radius: 999px; background: rgba(255,253,248,0.82); font-size: 0.72rem; font-weight: 600; color: var(--ink-soft); letter-spacing: 0.02em; }
.pv2-display { font-family: var(--font-poppins, var(--sans)); font-weight: 700; text-transform: uppercase; letter-spacing: -0.04em; line-height: 0.85; font-size: clamp(2.8rem, 9vw, 7rem); color: var(--ink); }
.pv2-display-soft { color: var(--muted); }
.pv2-sec-label { display: flex; align-items: center; gap: 12px; margin-bottom: 36px; }
.pv2-sec-label .pv2-mono { white-space: nowrap; }
.pv2-sec-line { flex: 1; height: 1px; background: var(--line); }
.pv2-clusters { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
.pv2-clusters-in { padding: 72px 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.pv2-cluster { display: flex; flex-direction: column; gap: 12px; }
.pv2-cidx { color: var(--accent); font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase; }
.pv2-cluster h3 { font-family: var(--font-instrument-serif, var(--serif)); font-size: 1.5rem; line-height: 1.05; letter-spacing: -0.02em; }
.pv2-cluster p { font-size: 0.88rem; line-height: 1.65; color: var(--muted); max-width: 280px; }
.pv2-projects { padding: 80px 0; }
.pv2-grid { display: grid; grid-template-columns: repeat(12, 1fr); gap: 28px; }
.pv2-card { display: block; cursor: pointer; transition: transform 0.4s var(--ease-66); }
.pv2-card:hover { transform: translateY(-4px); }
.pv2-ph { position: relative; width: 100%; aspect-ratio: 1/1; border: 1px solid var(--line); border-radius: 18px; background: linear-gradient(135deg, rgba(250,249,245,0.9), rgba(241,238,230,0.6)); overflow: hidden; transition: transform 0.4s var(--ease-66); }
.pv2-ph::after { content: ""; position: absolute; inset: 0; background: radial-gradient(circle at 50% 50%, rgba(177,78,34,0.05) 0%, transparent 60%); }
.pv2-pmeta { margin-top: 14px; display: flex; align-items: center; justify-content: space-between; }
.pv2-ptag { font-family: var(--font-mono, var(--mono)); font-size: 0.6rem; letter-spacing: 0.12em; color: var(--accent); }
.pv2-pyear { font-family: var(--font-mono, var(--mono)); font-size: 0.6rem; letter-spacing: 0.08em; color: var(--muted); }
.pv2-ptitle { margin-top: 4px; font-family: var(--font-instrument-serif, var(--serif)); font-size: 1.18rem; line-height: 1.1; }
.p1 { grid-column: span 6; } .p2 { grid-column: span 4; } .p3 { grid-column: span 3; }
.p4 { grid-column: span 4; } .p5 { grid-column: span 5; } .p6 { grid-column: span 3; }
.pv2-writing { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: rgba(255,253,248,0.5); }
.pv2-writing-in { padding: 80px 0; }
.pv2-wrow { border-top: 1px solid var(--line); padding: 1.1rem 0; transition: padding-left 0.3s var(--ease-66); }
.pv2-wrow:hover { padding-left: 0.6rem; }
.pv2-wrow:last-child { border-bottom: 1px solid var(--line); }
.pv2-wgrid { display: grid; grid-template-columns: 1fr auto; gap: 1.5rem; align-items: baseline; }
.pv2-wrow h3 { font-family: var(--font-instrument-serif, var(--serif)); font-size: 1.2rem; line-height: 1.25; }
.pv2-wrow p { font-size: 0.85rem; color: var(--muted); margin-top: 2px; }
.pv2-wdate { font-family: var(--font-mono, var(--mono)); font-size: 0.7rem; color: var(--muted); }
.pv2-footer { padding: 80px 0 60px; }
.pv2-foot { font-family: var(--font-poppins, var(--sans)); font-weight: 700; text-transform: uppercase; letter-spacing: -0.04em; line-height: 0.82; font-size: clamp(2.5rem, 8vw, 6rem); color: var(--ink); }
.pv2-foot-soft { color: var(--muted); }
.pv2-foot-bar { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 48px; border-top: 1px solid var(--line); padding-top: 24px; }
.pv2-foot-col { display: flex; flex-direction: column; gap: 6px; }
.pv2-foot-meta { font-family: var(--font-mono, var(--mono)); font-size: 0.68rem; color: var(--faint); }
@media (max-width: 1060px) {
  .pv2-hero-grid { grid-template-columns: 1fr; }
  .pv2-panel { min-height: 360px; margin-top: 20px; }
  .pv2-clusters-in { grid-template-columns: 1fr; }
  .pv2-grid { grid-template-columns: repeat(6, 1fr); }
  .p1,.p2,.p3,.p4,.p5,.p6 { grid-column: span 3; }
}
@media (max-width: 640px) {
  .pv2-hero { padding-top: 60px; }
  .pv2-hero h1 { font-size: clamp(36px, 12vw, 56px); }
  .pv2-nav { display: none; }
  .pv2-grid { grid-template-columns: 1fr; }
  .p1,.p2,.p3,.p4,.p5,.p6 { grid-column: 1; }
  .pv2-foot-bar { flex-direction: column; gap: 20px; }
}
`;

const script = `
// Canvas grain background
(function(){
  var canvas = document.getElementById('pv2-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var w,h,dots=[];
  function resize(){
    w=canvas.width=window.innerWidth*0.5;
    h=canvas.height=window.innerHeight*0.5;
    canvas.style.width=window.innerWidth+'px';
    canvas.style.height=window.innerHeight+'px';
    dots=[];
    for(var i=0;i<40;i++){
      dots.push({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,r:Math.random()*1.5+0.5});
    }
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    for(var d of dots){
      d.x+=d.vx; d.y+=d.vy;
      if(d.x<0||d.x>w) d.vx*=-1;
      if(d.y<0||d.y>h) d.vy*=-1;
      ctx.beginPath();
      ctx.arc(d.x,d.y,d.r,0,Math.PI*2);
      ctx.fillStyle='rgba(177,78,34,0.4)';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize',resize);
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();
})();

// 3D tilt panel
(function(){
  var panel=document.getElementById('pv2-tiltPanel');
  var inner=document.getElementById('pv2-tiltInner');
  if(!panel||!inner) return;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!window.matchMedia('(hover: hover)').matches) return;
  var raf=null;
  panel.addEventListener('mousemove',function(e){
    if(raf) cancelAnimationFrame(raf);
    raf=requestAnimationFrame(function(){
      var rect=panel.getBoundingClientRect();
      var cx=rect.left+rect.width/2, cy=rect.top+rect.height/2;
      var dx=(e.clientX-cx)/(rect.width/2), dy=(e.clientY-cy)/(rect.height/2);
      inner.style.transform='perspective(800px) rotateX('+(-dy*8)+'deg) rotateY('+(dx*8)+'deg)';
    });
  });
  panel.addEventListener('mouseleave',function(){
    if(raf) cancelAnimationFrame(raf);
    inner.style.transform='perspective(800px) rotateX(0) rotateY(0)';
  });
})();

// Project card 3D tilt
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.pv2-card').forEach(function(card){
    var ph=card.querySelector('.pv2-ph');
    if(!ph) return;
    var raf=null;
    card.addEventListener('mousemove',function(e){
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(function(){
        var rect=ph.getBoundingClientRect();
        var cx=rect.left+rect.width/2, cy=rect.top+rect.height/2;
        var dx=(e.clientX-cx)/(rect.width/2), dy=(e.clientY-cy)/(rect.height/2);
        ph.style.transform='perspective(600px) rotateX('+(-dy*6)+'deg) rotateY('+(dx*6)+'deg)';
      });
    });
    card.addEventListener('mouseleave',function(){
      if(raf) cancelAnimationFrame(raf);
      ph.style.transform='perspective(600px) rotateX(0) rotateY(0)';
    });
  });
})();

// Scroll reveal
(function(){
  if(!('IntersectionObserver' in window)){
    document.querySelectorAll('.pv2-reveal').forEach(function(el){el.classList.add('in')});
    return;
  }
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.pv2-reveal').forEach(function(el){obs.observe(el)});
})();

// Active nav
(function(){
  var sections=document.querySelectorAll('section[id],footer[id]');
  var links=document.querySelectorAll('.pv2-nav a');
  if(!sections.length||!links.length) return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        var id=entry.target.id;
        links.forEach(function(a){a.style.color=a.getAttribute('href')==='#'+id?'var(--ink)':'var(--muted)';});
      }
    });
  },{threshold:0.2});
  sections.forEach(function(s){obs.observe(s)});
})();
`;

export default function PreviewPage() {
  return (
    <main className="pv2">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <script dangerouslySetInnerHTML={{ __html: script }} />

      <canvas id="pv2-canvas" className="pv2-canvas" />

      {/* Header */}
      <header className="pv2-header">
        <div className="pv2-ctn pv2-hdr-in">
          <div className="pv2-brand">
            <span className="pv2-mark">L</span>
            <span>lizliz.xyz</span>
          </div>
          <nav className="pv2-nav" aria-label="Primary">
            <a href="#identity">Index</a>
            <a href="#capabilities">Work</a>
            <a href="#writing">Writing</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="pv2-sys">
            <span className="pv2-mono" style={{ cursor: "pointer" }}>THEME</span>
            <span className="pv2-mono" style={{ cursor: "pointer" }}>SOUND</span>
            <span className="pv2-mono" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <span className="pv2-dot-live" />GMT+8
            </span>
          </div>
        </div>
      </header>

      {/* Hero / Identity */}
      <section id="identity" className="pv2-hero">
        <div className="pv2-ctn">
          <p className="pv2-mono pv2-mono-a pv2-reveal" style={{ marginBottom: "20px" }}>00 / IDENTITY</p>
          <div className="pv2-hero-grid">
            <div className="pv2-reveal">
              <h1>
                Independent<br />
                developer building<br />
                at the edge of<br />
                <span className="pv2-acc">agents</span>,<br />
                <span className="pv2-blue">markets</span>, and <em>words</em>.
              </h1>
              <p className="pv2-hero-sub">
                Hi — I&apos;m Liz. I build agent systems, ship products, and write about the infrastructure of how we work and think.
              </p>
              <div className="pv2-tags">
                <span className="pv2-tag">Agent systems</span>
                <span className="pv2-tag">Product</span>
                <span className="pv2-tag">Writing</span>
                <span className="pv2-tag">Markets</span>
              </div>
            </div>

            {/* 3D tilt panel */}
            <div className="pv2-panel pv2-reveal" id="pv2-tiltPanel">
              <div className="pv2-tilt" id="pv2-tiltInner">
                <div className="pv2-panel-bar">
                  <span>THEME</span><span>SOUND</span><span>GMT+8</span>
                </div>
                <div className="pv2-stage">
                  <div className="pv2-orbit pv2-oa" />
                  <div className="pv2-orbit pv2-ob" />
                  <div className="pv2-orbit pv2-oc" />
                  <span className="pv2-orbit pv2-na" />
                  <span className="pv2-orbit pv2-nb" />
                  <span className="pv2-orbit pv2-nc" />
                </div>
                <div className="pv2-pill">writing / projects / experiments</div>
              </div>
            </div>
          </div>

          <div className="pv2-reveal" style={{ marginTop: "72px" }}>
            <p className="pv2-display">ship signal,<br /><span className="pv2-display-soft">not noise</span></p>
          </div>
        </div>
      </section>

      {/* Capability clusters */}
      <section id="capabilities" className="pv2-clusters">
        <div className="pv2-ctn">
          <div className="pv2-sec-label pv2-reveal" style={{ paddingTop: "72px" }}>
            <span className="pv2-mono pv2-mono-a">01 / CAPABILITIES</span>
            <span className="pv2-sec-line" />
          </div>
          <div className="pv2-clusters-in">
            <div className="pv2-cluster pv2-reveal">
              <span className="pv2-cidx">01</span>
              <h3>Agent systems</h3>
              <div className="pv2-tags"><span className="pv2-tag">autonomous workflows</span><span className="pv2-tag">tool routing</span><span className="pv2-tag">eval loops</span></div>
              <p>Building agents that ship real output — not demos. From multi-provider orchestration to cron-driven autonomous tasks.</p>
            </div>
            <div className="pv2-cluster pv2-reveal">
              <span className="pv2-cidx">02</span>
              <h3>Product &amp; writing</h3>
              <div className="pv2-tags"><span className="pv2-tag">personal site</span><span className="pv2-tag">content pipeline</span><span className="pv2-tag">GEO</span></div>
              <p>Writing about the systems that shape how we work. Publishing infrastructure that treats content as product.</p>
            </div>
            <div className="pv2-cluster pv2-reveal">
              <span className="pv2-cidx">03</span>
              <h3>Markets &amp; health</h3>
              <div className="pv2-tags"><span className="pv2-tag">trading systems</span><span className="pv2-tag">risk control</span><span className="pv2-tag">health tech</span></div>
              <p>Exploring the intersection of market structure, payments, and health data — where engineering compounds into outcomes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Selected work */}
      <section className="pv2-projects">
        <div className="pv2-ctn">
          <div className="pv2-sec-label pv2-reveal">
            <span className="pv2-mono pv2-mono-a">02 / SELECTED WORK</span>
            <span className="pv2-sec-line" />
            <span className="pv2-mono">6 PROJECTS</span>
          </div>
          <div className="pv2-grid">
            <a href="#" className="pv2-card p1 pv2-reveal pv2-dot"><div className="pv2-ph" /><div className="pv2-pmeta"><span className="pv2-ptag">PLATFORM</span><span className="pv2-pyear">2024—26</span></div><h3 className="pv2-ptitle">Hermes Agent</h3></a>
            <a href="#" className="pv2-card p2 pv2-reveal pv2-dot"><div className="pv2-ph" /><div className="pv2-pmeta"><span className="pv2-ptag">SITE</span><span className="pv2-pyear">2023—26</span></div><h3 className="pv2-ptitle">lizliz.xyz</h3></a>
            <a href="#" className="pv2-card p3 pv2-reveal pv2-dot"><div className="pv2-ph" /><div className="pv2-pmeta"><span className="pv2-ptag">WEB GAME</span><span className="pv2-pyear">2024</span></div><h3 className="pv2-ptitle">Pep Words</h3></a>
            <a href="#" className="pv2-card p4 pv2-reveal pv2-dot"><div className="pv2-ph" /><div className="pv2-pmeta"><span className="pv2-ptag">EDTECH</span><span className="pv2-pyear">2025</span></div><h3 className="pv2-ptitle">BrainRush</h3></a>
            <a href="#" className="pv2-card p5 pv2-reveal pv2-dot"><div className="pv2-ph" /><div className="pv2-pmeta"><span className="pv2-ptag">SYSTEM</span><span className="pv2-pyear">2025</span></div><h3 className="pv2-ptitle">Writing pipeline</h3></a>
            <a href="#" className="pv2-card p6 pv2-reveal pv2-dot"><div className="pv2-ph" /><div className="pv2-pmeta"><span className="pv2-ptag">TOOLING</span><span className="pv2-pyear">2026</span></div><h3 className="pv2-ptitle">Orion review</h3></a>
          </div>
        </div>
      </section>

      {/* Writing */}
      <section id="writing" className="pv2-writing">
        <div className="pv2-ctn pv2-writing-in">
          <div className="pv2-sec-label pv2-reveal">
            <span className="pv2-mono pv2-mono-a">03 / WRITING</span>
            <span className="pv2-sec-line" />
          </div>
          <div className="pv2-reveal">
            <div className="pv2-wrow"><div className="pv2-wgrid"><div><h3>The anti-echo-chamber principle for AI agents</h3><p>Progress is not defined by system growth — but by externally verified output.</p></div><span className="pv2-wdate">2026.06</span></div></div>
            <div className="pv2-wrow"><div className="pv2-wgrid"><div><h3>Wealth is value exchange, not magic</h3><p>Any system that claims to generate money without strategy, risk, and validation is a scam.</p></div><span className="pv2-wdate">2026.05</span></div></div>
            <div className="pv2-wrow"><div className="pv2-wgrid"><div><h3>Slow is fast: building assets with friction</h3><p>The path that looks slower — building durable systems — is the one that compounds.</p></div><span className="pv2-wdate">2026.04</span></div></div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="pv2-projects" style={{ paddingBottom: "40px" }}>
        <div className="pv2-ctn">
          <div className="pv2-hero-grid" style={{ gridTemplateColumns: "4fr 7fr", gap: "40px" }}>
            <div className="pv2-reveal">
              <span className="pv2-mono pv2-mono-a">04 / ABOUT</span>
            </div>
            <div className="pv2-reveal">
              <p style={{ fontFamily: "var(--font-instrument-serif, var(--serif))", fontSize: "1.15rem", lineHeight: 1.7, color: "var(--ink-soft)" }}>
                I run a small cloud server with AI agents that ship real output — content pipelines, monitoring systems, and autonomous tasks. Outside of building, I write about the intersection of agent systems, market structure, and the writing craft. Based in GMT+8. Independent by choice.
              </p>
              <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
                <a href="#" className="pv2-mono pv2-dot" style={{ padding: "2px 4px" }}>GitHub ↗</a>
                <a href="#" className="pv2-mono pv2-dot" style={{ padding: "2px 4px" }}>X / Twitter ↗</a>
                <a href="#" className="pv2-mono pv2-dot" style={{ padding: "2px 4px" }}>RSS ↗</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="pv2-footer">
        <div className="pv2-ctn">
          <div className="pv2-reveal">
            <p className="pv2-foot">let&apos;s make<br /><span className="pv2-foot-soft">something</span><br />that matters</p>
          </div>
          <div className="pv2-foot-bar pv2-reveal">
            <div className="pv2-foot-col">
              <span className="pv2-mono">CONTACT</span>
              <a href="mailto:" className="pv2-dot" style={{ fontFamily: "var(--font-instrument-serif, var(--serif))", fontSize: "1.1rem" }}>liz@lizliz.xyz</a>
            </div>
            <div style={{ textAlign: "center" }}>
              <span className="pv2-mono">BUILT IN GMT+8</span><br />
              <span className="pv2-foot-meta">© 2026 Liz</span>
            </div>
            <div className="pv2-foot-col" style={{ alignItems: "flex-end" }}>
              <span className="pv2-mono">ELSEWHERE</span>
              <div style={{ display: "flex", gap: "12px" }}>
                <a href="#" className="pv2-mono pv2-dot" style={{ padding: "2px 4px" }}>GH</a>
                <a href="#" className="pv2-mono pv2-dot" style={{ padding: "2px 4px" }}>X</a>
                <a href="#" className="pv2-mono pv2-dot" style={{ padding: "2px 4px" }}>RSS</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}