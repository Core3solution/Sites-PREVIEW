import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { isExternal } from '../lib/links';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode; showExternalIcon?: boolean };

/** Âncora interna com rolagem suave ou link externo seguro (nova aba, sem referrer). */
export function SmartLink({ href, children, showExternalIcon, ...rest }: Props) {
  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        {showExternalIcon && <ArrowUpRight className="size-4 shrink-0" aria-hidden />}
        <span className="sr-only"> (abre em nova aba)</span>
      </a>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}
