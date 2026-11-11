import { useEffect } from 'react';
import type { SiteConfig } from './core/types';
import { SiteProvider } from './core/state/site';
import { QuoteProvider } from './core/state/quote';
import { ToastProvider } from './core/state/toast';
import { applyTheme } from './core/lib/theme';
import { useRevealOnScroll, useRichMotion } from './core/hooks/motion';
import { DemoBar, Header } from './core/sections/Header';
import { Hero } from './core/sections/Hero';
import { TrustStrip } from './core/sections/TrustStrip';
import { Services } from './core/sections/Services';
import { Catalog } from './core/sections/Catalog';
import { Quote } from './core/sections/Quote';
import { Gallery } from './core/sections/Gallery';
import { About } from './core/sections/About';
import { Reputation } from './core/sections/Reputation';
import { Location } from './core/sections/Location';
import { FinalCta, Footer, MobileQuoteBar } from './core/sections/Closing';

function Page() {
  const rich = useRichMotion();
  useRevealOnScroll(rich);
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:text-accent-ink">
        Pular para o conteúdo
      </a>
      <DemoBar />
      <Header />
      <main id="conteudo">
        <Hero />
        <TrustStrip />
        <Services />
        <Catalog />
        <Quote />
        <Gallery />
        <About />
        <Reputation />
        <Location />
        <FinalCta />
      </main>
      <Footer />
      <MobileQuoteBar />
    </>
  );
}

export function App({ config }: { config: SiteConfig }) {
  useEffect(() => {
    applyTheme(config.brand.theme);
    document.documentElement.lang = config.meta.lang;
    document.title = config.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', config.meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', config.meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', config.meta.description);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', config.brand.theme.bg);
    if (config.brand.favicon) document.querySelector('link[rel="icon"]')?.setAttribute('href', config.brand.favicon);
  }, [config]);
  return (
    <SiteProvider config={config}>
      <QuoteProvider items={config.catalog.items}>
        <ToastProvider>
          <Page />
        </ToastProvider>
      </QuoteProvider>
    </SiteProvider>
  );
}
