# Forte CSS Components

## Cards

```css
.card {
  background: var(--surface);
  border: 1px solid rgba(255, 106, 61, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
}
.card-red { border-color: rgba(81, 30, 41, 0.3); background: var(--surface); }
.card-green { border-color: rgba(45, 138, 98, 0.3); background: var(--surface); }
.card-plum { border-color: rgba(57, 52, 75, 0.3); background: var(--surface); }
```

Usage:
```html
<div class="card card-red">
  <h3 style="color: var(--burgundy);">Card Title</h3>
  <p class="small muted">Card description text.</p>
</div>
```

## Badges

```css
.badge {
  display: inline-block;
  padding: 0.2rem 0.65rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.badge-red { background: rgba(81,30,41,0.08); color: var(--burgundy); border: 1px solid rgba(81,30,41,0.25); }
.badge-green { background: rgba(45,138,98,0.08); color: var(--green); border: 1px solid rgba(45,138,98,0.25); }
.badge-blue { background: rgba(57,52,75,0.08); color: var(--plum); border: 1px solid rgba(57,52,75,0.2); }
.badge-purple { background: rgba(57,52,75,0.08); color: var(--plum); border: 1px solid rgba(57,52,75,0.2); }
.badge-cyan { background: rgba(90,122,120,0.08); color: var(--cyan); border: 1px solid rgba(90,122,120,0.25); }
```

Usage:
```html
<span class="badge badge-red">Backend</span>
<span class="badge badge-green">Ferdig</span>
<span class="badge badge-blue">Frontend</span>
```

## Grids

```css
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.2rem; }
```

Usage:
```html
<div class="grid-2">
  <div class="card card-red">Left column</div>
  <div class="card card-green">Right column</div>
</div>
```

## Flow Diagrams (Horizontal)

```css
.flow { display: flex; align-items: center; gap: 0.4rem; flex-wrap: wrap; margin: 1rem 0; }
.flow-box { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem 1rem; font-size: 0.82rem; font-weight: 500; text-align: center; }
.flow-box.highlight { border-color: rgba(81, 30, 41, 0.4); background: rgba(81, 30, 41, 0.06); }
.flow-box.highlight-red { border-color: rgba(81, 30, 41, 0.4); background: rgba(81, 30, 41, 0.06); }
.flow-box.highlight-green { border-color: rgba(45, 138, 98, 0.4); background: rgba(45, 138, 98, 0.06); }
.flow-arrow { color: var(--text-muted); font-size: 1.2rem; }
```

Usage:
```html
<div class="flow">
  <div class="flow-box">Steg 1</div>
  <span class="flow-arrow">&#8594;</span>
  <div class="flow-box highlight-red">Steg 2</div>
  <span class="flow-arrow">&#8594;</span>
  <div class="flow-box highlight-green">Steg 3</div>
</div>
```

## Flow Diagrams (Vertical)

```css
.vflow { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; margin: 0.75rem 0; }
.vflow .flow-box { width: 100%; text-align: center; }
```

Usage:
```html
<div class="vflow">
  <div class="flow-box">Input</div>
  <span class="flow-arrow">&#8595;</span>
  <div class="flow-box highlight-red">Prosessering</div>
  <span class="flow-arrow">&#8595;</span>
  <div class="flow-box highlight-green">Output</div>
</div>
```

## Tables

```css
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th { text-align: left; padding: 0.6rem 0.8rem; border-bottom: 2px solid var(--border); font-weight: 600; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
td { padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--border); }
tr:last-child td { border-bottom: none; }
```

Usage:
```html
<table>
  <tr>
    <td style="font-weight: 600; color: var(--burgundy);">Label</td>
    <td class="muted">Description text</td>
  </tr>
</table>
```

## Highlight Box

```css
.highlight-box { background: var(--surface); border-left: 3px solid var(--burgundy); border-radius: 0 8px 8px 0; padding: 1rem 1.25rem; }
.highlight-box.red { border-left-color: var(--burgundy); }
.highlight-box.green { border-left-color: var(--green); }
```

Usage:
```html
<div class="highlight-box green">
  <p class="small mb-0"><strong>Viktig:</strong> Key insight or callout text here.</p>
</div>
```

## Bar Charts

```css
.bar-chart { margin: 1rem 0; }
.bar-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.6rem; }
.bar-label { font-size: 0.82rem; width: 140px; text-align: right; flex-shrink: 0; }
.bar-track { flex: 1; height: 28px; background: var(--surface2); border-radius: 6px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding-left: 0.75rem; font-size: 0.75rem; font-weight: 700; color: var(--cream); }
```

Usage:
```html
<div class="bar-chart">
  <div class="bar-row">
    <div class="bar-label">Kubernetes</div>
    <div class="bar-track">
      <div class="bar-fill" style="width: 85%; background: var(--burgundy);">85%</div>
    </div>
  </div>
  <div class="bar-row">
    <div class="bar-label">Azure</div>
    <div class="bar-track">
      <div class="bar-fill" style="width: 72%; background: var(--green);">72%</div>
    </div>
  </div>
</div>
```

## Checklists

```css
ul.check { list-style: none; padding: 0; }
ul.check li { padding: 0.35rem 0; font-size: 0.88rem; display: flex; align-items: baseline; gap: 0.5rem; }
ul.check li::before { content: '\2192'; color: var(--burgundy); font-weight: 700; flex-shrink: 0; }
ul.check.green li::before { color: var(--green); }
```

Usage:
```html
<ul class="check">
  <li>First item with arrow prefix</li>
  <li>Second item with arrow prefix</li>
</ul>
<ul class="check green">
  <li>Green arrow items for positive lists</li>
</ul>
```

## Icon Circles

```css
.icon-circle { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; margin-bottom: 0.75rem; }
.icon-circle.red { background: rgba(81,30,41,0.1); color: var(--burgundy); }
.icon-circle.green { background: rgba(45,138,98,0.1); color: var(--green); }
.icon-circle.blue { background: rgba(57,52,75,0.1); color: var(--plum); }
.icon-circle.cyan { background: rgba(90,122,120,0.1); color: var(--cyan); }
```

Usage:
```html
<div class="icon-circle red">&#9889;</div>
<div class="icon-circle green">&#10003;</div>
```

## Scenario Cards

```css
.scenario { border-radius: 12px; padding: 1.25rem; text-align: center; }
.scenario-plum { background: rgba(57, 52, 75, 0.04); border: 1px solid rgba(57, 52, 75, 0.2); }
.scenario-red { background: rgba(81, 30, 41, 0.04); border: 1px solid rgba(81, 30, 41, 0.2); }
.scenario-green { background: rgba(45, 138, 98, 0.06); border: 1px solid rgba(45, 138, 98, 0.25); }
```

Usage:
```html
<div class="grid-3">
  <div class="scenario scenario-red">
    <div class="icon-circle red" style="margin: 0 auto 0.75rem;">&#9889;</div>
    <h3 style="color: var(--burgundy);">Title</h3>
    <p class="xs muted mb-0">Description text.</p>
  </div>
</div>
```

## Mockup / Browser Frame

```css
.mockup { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
.mockup-bar { background: var(--surface2); padding: 0.5rem 1rem; display: flex; align-items: center; gap: 0.5rem; border-bottom: 1px solid var(--border); }
.mockup-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); }
.mockup-body { padding: 1.25rem; }
```

Usage:
```html
<div class="mockup">
  <div class="mockup-bar">
    <div class="mockup-dot"></div>
    <div class="mockup-dot"></div>
    <span class="xs muted">Window title</span>
  </div>
  <div class="mockup-body">
    <p class="xs muted mb-0">Content inside the mockup frame.</p>
  </div>
</div>
```

## Stat Row / Big Numbers

```css
.stat-row { display: flex; gap: 2.5rem; margin: 1.5rem 0; }
.stat-item { text-align: center; }
.big-number { font-size: 4rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1; margin-bottom: 0.3rem; }
.big-label { font-size: 0.85rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; }
```

Usage:
```html
<div class="stat-row">
  <div class="stat-item">
    <div class="big-number text-red">42</div>
    <div class="big-label">Konsulenter</div>
  </div>
  <div class="stat-item">
    <div class="big-number text-green">156</div>
    <div class="big-label">Prosjekter</div>
  </div>
</div>
```

## Inline Code

```css
code { font-family: 'JetBrains Mono', 'Fira Code', monospace; font-size: 0.82em; }
.inline-code { background: var(--surface2); padding: 0.15rem 0.4rem; border-radius: 4px; border: 1px solid var(--border); }
```

Usage:
```html
<code class="inline-code">variableName</code>
```

## Divider

```css
.divider { height: 1px; background: var(--border); margin: 1.5rem 0; }
```

## Text Color Helpers

```css
.text-orange { color: var(--burgundy); }
.text-red { color: var(--burgundy); }
.text-green { color: var(--green); }
.text-cyan { color: var(--cyan); }
.text-purple { color: var(--plum); }
.text-blue { color: var(--blue); }
.muted { color: var(--text-muted); }
```
