import { startPage } from './bootstrap';
import './global.css';

void startPage().catch(error => {
  console.error(JSON.stringify({ event: 'site-start-failed', message: error instanceof Error ? error.message : String(error) }));
  const root = document.getElementById('root');
  if (root && !root.textContent?.trim()) root.textContent = '页面未能载入。请刷新重试，或访问 https://lizliz.xyz';
});
