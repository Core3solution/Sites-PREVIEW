import manifest from '../generated/visuals.manifest.json';

export interface MediaEntry {
  alt: string;
  width: number;
  height: number;
  files: { src: string; width: number }[];
  placeholder: string;
}

const base = import.meta.env.BASE_URL ?? '/';
const withBase = (src: string) => (src.startsWith('/') ? `${base}${src.slice(1)}` : src);

const registry: Record<string, MediaEntry> = Object.fromEntries(
  Object.entries(manifest as Record<string, MediaEntry>).map(([k, m]) => [
    k,
    { ...m, files: m.files.map((f) => ({ ...f, src: withBase(f.src) })) },
  ]),
);

export function getMedia(key: string): MediaEntry | undefined {
  return registry[key];
}

export function srcSet(m: MediaEntry): string {
  return m.files.map((f) => `${f.src} ${f.width}w`).join(', ');
}

/** Maior arquivo disponível (para lightbox). */
export function largest(m: MediaEntry): string {
  return [...m.files].sort((a, b) => b.width - a.width)[0].src;
}
