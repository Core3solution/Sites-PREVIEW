/** Página do nicho automotivo: ordem das seções e providers próprios do nicho. */
import { QuoteProvider } from './state/quote';
import { useRevealOnScroll, useRichMotion } from '../../core/hooks/motion';
import { DemoBar, Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { TrustStrip } from './sections/TrustStrip';
import { Services } from './sections/Services';
import { Catalog } from './sections/Catalog';
import { Quote } from './sections/Quote';
import { Gallery } from './sections/Gallery';
import { About } from './sections/About';
import { Reputation } from './sections/Reputation';
import { Location } from './sections/Location';
import { FinalCta, Footer, MobileQuoteBar } from './sections/Closing';

import { useAutoSite } from './state/site';

export function AutomotivoPage() {
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

/** Ponto de entrada do nicho: providers + página. */
export default function AutomotivoNiche() {
  const site = useAutoSite();
  return (
    <QuoteProvider items={site.catalog.items}>
      <AutomotivoPage />
    </QuoteProvider>
  );
}
