import { renderToString, generateHydrationScript } from '@solidjs/web';
import { App, type AppProps } from './App';
export function renderPage(props: AppProps) {
  return { html: renderToString(() => <App {...props}/>), hydration: generateHydrationScript() };
}
