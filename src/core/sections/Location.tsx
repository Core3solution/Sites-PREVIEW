import { useState } from 'react';
import { Copy, MapPin, Navigation, Map as MapIcon, ArrowUpRight } from 'lucide-react';
import { useSite } from '../state/site';
import { useToast } from '../state/toast';
import { SmartLink } from '../components/SmartLink';
import { copyText } from '../lib/clipboard';
import { fullAddress, mapsEmbedUrl, mapsUrl, wazeUrl } from '../lib/links';

/** Mapa ilustrativo em SVG (não é cartografia real) usado como fachada antes de carregar o Google Maps. */
function MapArt() {
  return (
    <svg viewBox="0 0 600 420" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--brand-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--brand-accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="420" fill="var(--brand-surface)" />
      <g stroke="rgb(255 255 255 / 0.07)" strokeWidth="14" fill="none" strokeLinecap="round">
        <path d="M-20 120 L640 60" />
        <path d="M-20 300 L640 250" />
        <path d="M120 -20 L180 460" />
        <path d="M430 -20 L380 460" />
      </g>
      <g stroke="rgb(255 255 255 / 0.04)" strokeWidth="6" fill="none">
        <path d="M-20 200 L640 160" />
        <path d="M-20 380 L640 340" />
        <path d="M270 -20 L300 460" />
        <path d="M540 -20 L520 460" />
        <path d="M30 -20 L60 460" />
      </g>
      <circle cx="300" cy="210" r="120" fill="url(#glow)" />
    </svg>
  );
}

export function Location() {
  const { location, contact } = useSite();
  const toast = useToast();
  const [loadMap, setLoadMap] = useState(false);
  const address = fullAddress(contact.address);

  const copy = async () => {
    const ok = await copyText(address);
    toast(ok ? 'Endereço copiado.' : 'Não foi possível copiar o endereço.', ok ? 'ok' : 'error');
  };

  return (
    <section id="localizacao" aria-labelledby="localizacao-title" className="relative border-t border-line/60 py-24 sm:py-32">
      <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:items-stretch lg:gap-14">
        <div className="flex flex-col" data-reveal>
          <p className="eyebrow">{location.eyebrow}</p>
          <h2 id="localizacao-title" className="display mt-5 text-[2.15rem] text-balance sm:text-5xl">
            {location.title}
          </h2>
          <address className="mt-8 flex items-start gap-4 not-italic">
            <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent">
              <MapPin className="size-5" aria-hidden />
            </span>
            <span className="text-lg leading-relaxed">
              {contact.address.street}
              <br />
              <span className="text-muted">
                {contact.address.district} · {contact.address.city}/{contact.address.state}
              </span>
            </span>
          </address>
          <p className="mt-6 text-[0.95rem] leading-relaxed text-muted">{location.intro}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:mt-auto lg:pt-10">
            <SmartLink href={mapsUrl(location.mapQuery)} className="btn btn-primary">
              <MapIcon className="size-4" aria-hidden /> Abrir no Google Maps
            </SmartLink>
            <SmartLink href={wazeUrl(location.mapQuery)} className="btn btn-ghost">
              <Navigation className="size-4" aria-hidden /> Abrir no Waze
            </SmartLink>
            <button type="button" onClick={copy} className="btn btn-ghost sm:col-span-2">
              <Copy className="size-4" aria-hidden /> Copiar endereço
            </button>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-[28px] border border-line sm:min-h-[420px]" data-reveal style={{ ['--d' as string]: 1 }}>
          {loadMap ? (
            <iframe
              title={`Mapa: ${address}`}
              src={mapsEmbedUrl(location.mapQuery)}
              className="absolute inset-0 h-full w-full grayscale-[0.6] invert-[0.92] hue-rotate-180"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <>
              <MapArt />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center">
                <span className="relative grid size-16 place-items-center rounded-full bg-accent text-accent-ink shadow-[0_0_0_10px_var(--brand-accent-soft)]">
                  <MapPin className="size-7" aria-hidden />
                </span>
                <p className="max-w-xs font-display text-xl font-semibold">{contact.address.street}</p>
                <button type="button" onClick={() => setLoadMap(true)} className="btn btn-ghost bg-black/30 backdrop-blur">
                  Carregar mapa interativo
                </button>
                <p className="max-w-xs text-[0.72rem] leading-relaxed text-white/45">
                  O mapa é carregado do Google somente após o clique. Ilustração acima não é cartografia real.
                </p>
              </div>
            </>
          )}
          {loadMap && (
            <SmartLink href={mapsUrl(location.mapQuery)} className="btn btn-ghost absolute bottom-4 right-4 !min-h-10 bg-black/60 text-sm backdrop-blur">
              Ampliar <ArrowUpRight className="size-4" aria-hidden />
            </SmartLink>
          )}
        </div>
      </div>
    </section>
  );
}
