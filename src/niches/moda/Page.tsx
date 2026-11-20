import './moda.css';
import { useRevealOnScroll, useRichMotion } from '../../core/hooks/motion';
import { useModaSite } from './state/site';
import { ShopProvider } from './state/shop';
import { TopBar, Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { CategoryRail } from './sections/CategoryRail';
import { Collection } from './sections/Collection';
import { Spotlight } from './sections/Spotlight';
import { Editorial } from './sections/Editorial';
import { Footer } from './sections/Footer';
import { QuickView } from './components/QuickView';
import { FiltersPanel } from './components/FiltersPanel';
import { LookFinder } from './components/LookFinder';
import { BagDrawer } from './components/BagDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { SearchOverlay } from './components/SearchOverlay';
import { InfoDialog } from './components/InfoDialog';

/** Página do nicho moda: ordem das seções + painéis (todos controlados por `useShop().panel`). */
export function ModaPage() {
  const rich = useRichMotion();
  useRevealOnScroll(rich);
  return (
    <div className="m-root min-h-dvh">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-[var(--brand-text)] focus:px-5 focus:py-3 focus:text-[var(--brand-bg)]">
        Pular para o conteúdo
      </a>
      <TopBar />
      <Header />
      <main id="conteudo">
        <Hero />
        <CategoryRail />
        <Collection />
        <Spotlight />
        <Editorial />
      </main>
      <Footer />
      <QuickView />
      <FiltersPanel />
      <LookFinder />
      <BagDrawer />
      <FavoritesDrawer />
      <SearchOverlay />
      <InfoDialog />
    </div>
  );
}

/** Ponto de entrada do nicho: providers + página. */
export default function ModaNiche() {
  const site = useModaSite();
  return (
    <ShopProvider looks={site.looks} storageKey={`core3:${site.brand.shortName.toLowerCase()}:favoritos`}>
      <ModaPage />
    </ShopProvider>
  );
}
