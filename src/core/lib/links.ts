import type { SiteConfig } from '../types';

export function fullAddress(c: SiteConfig['contact']['address']): string {
  return `${c.street} — ${c.district}, ${c.city}/${c.state}`;
}

export const mapsUrl = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
export const mapsEmbedUrl = (q: string) => `https://www.google.com/maps?q=${encodeURIComponent(q)}&output=embed`;
export const wazeUrl = (q: string) => `https://waze.com/ul?q=${encodeURIComponent(q)}&navigate=yes`;

/** Só gera link de WhatsApp quando há número oficial confirmado na configuração. */
export function whatsappUrl(contact: SiteConfig['contact'], text: string): string | null {
  if (!contact.whatsapp?.number) return null;
  return `https://wa.me/${contact.whatsapp.number}?text=${encodeURIComponent(text)}`;
}

export const isExternal = (href: string) => /^https?:\/\//.test(href);
