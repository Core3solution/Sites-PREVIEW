import { render, screen, within, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';
import { companyAutoSpa } from '../src/clients/company-auto-spa';

beforeAll(() => {
  // jsdom não implementa estas APIs
  window.matchMedia = ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  window.scrollTo = () => {};
  Element.prototype.scrollIntoView = () => {};
});

function setup() {
  const user = userEvent.setup();
  render(<App config={companyAutoSpa} />);
  return user;
}

describe('App', () => {
  it('mostra aviso de demonstração e os 10 serviços', () => {
    setup();
    expect(screen.getAllByText(/não é o site oficial da Company Auto SPA/).length).toBeGreaterThan(0);
    const catalog = document.getElementById('catalogo')!;
    expect(within(catalog).getAllByRole('button', { name: /^Adicionar/ })).toHaveLength(10);
    expect(within(catalog).getByRole('heading', { name: 'PPF FULL GSWF' })).toBeInTheDocument();
    expect(within(catalog).getByRole('heading', { name: 'PPF FULL' })).toBeInTheDocument();
    expect(within(catalog).getByText('A partir de')).toBeInTheDocument();
  });

  it('busca e filtro por categoria', async () => {
    const user = setup();
    const catalog = document.getElementById('catalogo')!;
    await user.type(within(catalog).getByRole('searchbox'), 'farol');
    expect(within(catalog).getAllByRole('button', { name: /^Adicionar/ })).toHaveLength(2);
    await user.click(within(catalog).getByRole('button', { name: 'Limpar busca' }));
    await user.click(within(catalog).getByRole('button', { name: /^Insulfilm/ }));
    expect(within(catalog).getAllByRole('button', { name: /^Adicionar/ })).toHaveLength(1);
  });

  it('seleciona serviços, preenche veículo e copia a mensagem', async () => {
    const user = setup();
    // depois do userEvent.setup(), que instala o próprio stub de clipboard
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    const catalog = document.getElementById('catalogo')!;
    await user.click(within(catalog).getByRole('button', { name: /^Adicionar\s*PPF FULL$/ }));
    await user.click(within(catalog).getByRole('button', { name: /^Adicionar\s*Envelopamento de teto$/ }));
    expect(within(catalog).getAllByRole('button', { name: /^Selecionado/ })).toHaveLength(2);

    const quote = document.getElementById('solicitacao')!;
    await user.type(within(quote).getByPlaceholderText('Ex.: Porsche'), 'BMW');
    await user.type(within(quote).getByPlaceholderText('Ex.: 911 Carrera'), 'M3');
    const preview = within(quote).getByLabelText('Mensagem de solicitação') as HTMLTextAreaElement;
    expect(preview.value).toContain('Veículo: BMW M3');
    expect(preview.value).toContain('PPF FULL — referência no catálogo: R$ 10.900,00');

    await act(async () => {
      fireEvent.click(within(quote).getByRole('button', { name: /Copiar solicitação/ }));
    });
    expect(writeText).toHaveBeenCalledWith(preview.value);
    expect(await screen.findByText(/Solicitação copiada/)).toBeInTheDocument();
  });

  it('sem WhatsApp confirmado, "Como enviar" abre modal com cópia (sem link wa.me)', async () => {
    const user = setup();
    const catalog = document.getElementById('catalogo')!;
    await user.click(within(catalog).getByRole('button', { name: /^Adicionar\s*Lavagem Premium$/ }));
    const quote = document.getElementById('solicitacao')!;
    await user.click(within(quote).getByRole('button', { name: /Como enviar/ }));
    const dialog = screen.getByRole('dialog', { name: 'Contato oficial ainda não confirmado' });
    expect(within(dialog).getByRole('button', { name: /Copiar solicitação/ })).toBeInTheDocument();
    expect(document.querySelector('a[href*="wa.me"]')).toBeNull();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('copiar sem serviços mostra erro em vez de copiar', async () => {
    const user = setup();
    const quote = document.getElementById('solicitacao')!;
    await user.click(within(quote).getByRole('button', { name: /Copiar solicitação/ }));
    expect(within(quote).getAllByRole('alert')[0]).toHaveTextContent('Selecione pelo menos um serviço');
  });

  it('galeria abre a especificação do espaço de foto e navega', async () => {
    const user = setup();
    const gallery = document.getElementById('galeria')!;
    await user.click(within(gallery).getByRole('button', { name: 'Ver especificação: PPF no farol' }));
    const dialog = screen.getByRole('dialog', { name: 'PPF no farol' });
    expect(within(dialog).getByText('Aguardando foto autorizada')).toBeInTheDocument();
    await user.click(within(dialog).getByRole('button', { name: 'Próxima imagem' }));
    expect(screen.getByRole('dialog', { name: 'PPF frontal' })).toBeInTheDocument();
  });

  it('não exibe imagens sem fotografia aprovada (somente placeholders identificados)', () => {
    setup();
    expect(document.querySelectorAll('main img')).toHaveLength(0);
    expect(document.querySelectorAll('[data-photo-status="pendente"]').length).toBeGreaterThan(10);
  });

  it('links externos abrem em nova aba com rel seguro', () => {
    setup();
    for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]')) {
      expect(a.target).toBe('_blank');
      expect(a.rel).toContain('noopener');
    }
  });
});
