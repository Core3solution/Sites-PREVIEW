import { useEffect } from 'react';
import { SiteProvider } from './core/state/site';
import { ToastProvider } from './core/state/toast';
import { applyTheme } from './core/lib/theme';
import { nichePages, type SiteConfig } from './niches';

/** Núcleo do app: aplica marca e tema, fornece o contexto e renderiza a página do nicho do cliente. */
export function App({ config }: { config: SiteConfig }) {
  useEffect(() => {
    applyTheme(config.brand.theme, config.brand.fonts);
    document.documentElement.lang = config.meta.lang;
    document.title = config.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', config.meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', config.meta.description);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', config.brand.theme.bg);
    if (config.brand.favicon) document.querySelector('link[rel="icon"]')?.setAttribute('href', config.brand.favicon);
  }, [config]);
  const Page = nichePages[config.niche];
  return (
    <SiteProvider config={config}>
      <ToastProvider>
        <Page />
      </ToastProvider>
    </SiteProvider>
  );
}
