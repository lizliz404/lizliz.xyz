import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';
import { render } from '@solidjs/web';
import { Icon, type IconName } from '../src/Icon';

const names = ['ArrowRight', 'Search', 'OpenInWindow', 'NavArrowDown', 'HalfMoon', 'SunLight', 'Translate', 'Plus', 'Minus', 'Xmark'] satisfies IconName[];
describe('chosen typography and the existing main Iconoir identity', () => {
  it('renders canonical regular artwork, currentColor and 1.5 stroke without a React adapter', async () => {
    for (const name of names) {
      const root = document.createElement('div');
      const dispose = render(() => <Icon name={name}/>, root);
      try {
        const svg = root.querySelector('svg');
        const source = new DOMParser().parseFromString(await readFile(`assets/iconoir/${name}.svg`, 'utf8'), 'image/svg+xml').documentElement;
        expect(svg?.isEqualNode(source), name).toBe(true);
        expect(svg?.getAttribute('stroke-width')).toBe('1.5');
        expect(svg?.matches('[color=currentColor],[stroke=currentColor]') || Boolean(svg?.querySelector('[stroke=currentColor]'))).toBe(true);
        expect(root.firstElementChild?.getAttribute('aria-hidden')).toBe('true');
        expect(root.querySelector('[tabindex],a,button')).toBeNull();
      } finally { dispose(); }
    }
    const app = await readFile('src/App.tsx', 'utf8');
    expect(app).not.toMatch(/<svg\b|[↗↓◐◑×−]|<span aria-hidden="true">\+<\/span>/);
    expect(app).not.toMatch(/lucide|heroicons|iconoir-react/);
  });
  it('uses Inter body/UI and official Geist Serif display with main\'s local Arial fallback faces, not a new CJK stack', async () => {
    const css = await readFile('src/global.css', 'utf8');
    const styles = await readFile('src/styles.ts', 'utf8');
    expect(css).toContain('--font-body:Inter,MainBodyFallback');
    expect(css).toContain('--font-ui:Inter,MainUiFallback');
    expect(css).toContain('--font-display:"Geist Serif",MainDisplayFallback');
    for (const face of [
      'font-family:MainBodyFallback;src:local(Arial);ascent-override:95.74%;descent-override:26.08%;line-gap-override:0%;size-adjust:105.08%',
      'font-family:MainUiFallback;src:local(Arial);ascent-override:92.83%;descent-override:30.94%;line-gap-override:8.84%;size-adjust:113.11%',
      'font-family:MainDisplayFallback;src:local(Arial);ascent-override:128.92%;descent-override:40.37%;line-gap-override:0%;size-adjust:76.79%',
    ]) expect(css).toContain(face);
    expect(css + styles).not.toMatch(/Poppins|Lora|Instrument|Noto|Songti|Georgia/);
    expect(styles).toContain("fontFamily: 'var(--font-reader-title)'");
    // This is CSS/source proof, not proof of which OS CJK glyph Chrome actually renders.
  });
  it('ships official variable Latin subsets and licenses without replacing Chinese glyph coverage', async () => {
    const css = await readFile('assets/fonts/fonts.css', 'utf8');
    const files = [...css.matchAll(/url\(['"]?\/fonts\/([^'")]+)['"]?\)/g)].map(match => match[1]);
    expect(files).toHaveLength(5);
    for (const file of files) expect((await readFile(`assets/fonts/${file}`)).subarray(0, 4).toString()).toBe('wOF2');
    expect(css.match(/font-weight: 100 900/g)).toHaveLength(4);
    expect(css).toContain("font-family:'Geist Serif';font-style:normal;font-weight:400");
    expect(css).not.toContain('Geist Sans');
    expect(css).toContain('font-style: italic');
    expect(css).not.toMatch(/U\+3000|U\+3400|U\+4E00|fonts\.gstatic\.com/);
    for (const family of ['inter', 'geist']) expect(await readFile(`assets/fonts/${family}-OFL.txt`, 'utf8')).toContain('SIL OPEN FONT LICENSE');
    expect(await readFile('assets/iconoir/LICENSE', 'utf8')).toContain('MIT License');
  });
});
