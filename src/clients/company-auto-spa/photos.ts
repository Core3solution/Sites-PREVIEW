import type { PhotoSlot } from '../../core/types';

/**
 * Espaços de fotografia da Company Auto SPA.
 * Nenhuma fotografia autorizada foi recebida até o momento: todos os espaços estão PENDENTES e o site exibe
 * placeholders identificados. Para aprovar uma foto, preencha `photo` (ver docs/REUTILIZACAO_TEMPLATE.md).
 * A direção de arte considera o ambiente visto no Instagram da empresa (teto com linhas de LED, piso
 * quadriculado, emblema na parede), mas nada aqui afirma como é uma foto que ainda não existe.
 */
const slot = (id: string, label: string, brief: string, aspect: string, minWidth: number): PhotoSlot => ({
  id,
  label,
  brief,
  aspect,
  minWidth,
  photo: null,
});

export const photos: Record<string, PhotoSlot> = Object.fromEntries(
  [
    slot('hero', 'Fotografia principal', 'Veículo finalizado no estúdio da Company, com as linhas de LED do teto refletidas na pintura. Horizontal, com área livre à esquerda para o título.', '16:9', 2400),
    slot('ppf', 'Proteção PPF', 'Aplicação de PPF em andamento ou borda da película sobre a pintura, em close nítido.', '4:3', 1600),
    slot('envelopamento', 'Envelopamento', 'Teto envelopado em veículo atendido, vista lateral elevada.', '4:3', 1600),
    slot('vitrificacao', 'Vitrificação', 'Roda vitrificada em close, com reflexo ou gotas d’água.', '4:3', 1600),
    slot('insulfilm', 'Insulfilm', 'Vidro com Insulfilm Carbon aplicado, visto de fora em ângulo.', '4:3', 1600),
    slot('polimento', 'Polimento técnico', 'Polimento técnico em execução, com a pintura refletindo a iluminação do estúdio.', '4:3', 1600),
    slot('lavagem', 'Lavagem premium', 'Etapa da lavagem premium (espuma ou secagem) em veículo atendido.', '4:3', 1600),
    slot('estudio', 'Estúdio', 'Ambiente da Company: teto com linhas de LED, piso quadriculado e emblema na parede.', '4:5', 1600),
    slot('cta', 'Fundo do CTA final', 'Detalhe de pintura com reflexos das luzes do estúdio, escuro o bastante para texto sobreposto.', '21:9', 2400),
    slot('galeria-1', 'Veículo entregue', 'Veículo finalizado, vista dianteira 3/4 no estúdio.', '16:9', 2000),
    slot('galeria-2', 'PPF no farol', 'Detalhe de farol com PPF (comum ou smoke) aplicado.', '1:1', 1200),
    slot('galeria-3', 'PPF frontal', 'Frente do veículo com PPF frontal, luz rasante revelando o acabamento.', '1:1', 1200),
    slot('galeria-4', 'Processo', 'Profissional aplicando película (com autorização de uso de imagem).', '3:4', 1200),
    slot('galeria-5', 'Rodas', 'Roda após vitrificação, close lateral.', '1:1', 1200),
    slot('galeria-6', 'Fachada', 'Entrada da Company na Rua Pinheiro Machado, 34.', '16:9', 2000),
    slot('galeria-7', 'Acabamento', 'Detalhe de envelopamento ou insulfilm finalizado.', '1:1', 1200),
    slot('galeria-8', 'Ensaio externo', 'Veículo atendido em ensaio externo, como os publicados no Instagram.', '1:1', 1200),
  ].map((s) => [s.id, s]),
);
