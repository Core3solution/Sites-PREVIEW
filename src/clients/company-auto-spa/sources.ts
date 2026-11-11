import type { Source } from '../../core/types';

/** Fontes verificáveis usadas no conteúdo. Cada dado factual do site referencia uma delas. */
export const sources: Source[] = [
  {
    id: 'google-perfil',
    label: 'Perfil público da empresa na Pesquisa Google (captura de tela)',
    kind: 'captura',
    observedAt: '2026-11-11',
    file: 'clientes/company-auto-spa/anexos/01_google_company_auto_spa.jpg',
    note: 'Nota 4,9 com 55 avaliações; categoria “Serviço de envelopamento de veículos”; texto institucional em “Visão geral criada por IA”.',
  },
  {
    id: 'whatsapp-catalogo',
    label: 'Catálogo comercial da empresa no WhatsApp (duas capturas de tela)',
    kind: 'captura',
    observedAt: '2026-11-11',
    file: 'clientes/company-auto-spa/anexos/02_whatsapp_catalogo_inicio.jpg; clientes/company-auto-spa/anexos/03_whatsapp_catalogo_continuacao.jpg',
    note: 'Dez serviços com valores. Nomes e descrições aparecem parcialmente truncados.',
  },
  {
    id: 'instagram-perfil',
    label: 'Perfil @company.autospa no Instagram (duas capturas de tela)',
    kind: 'captura',
    observedAt: '2026-11-11',
    file: 'clientes/company-auto-spa/anexos/05_instagram_company_autospa_perfil.jpg; clientes/company-auto-spa/anexos/06_instagram_company_autospa_grade.jpg',
    url: 'https://www.instagram.com/company.autospa/',
    note: 'Capturas recebidas em 11/11/2026 (horário 17:22 visível; data da captura não exibida). Nome “Company Auto Spa | ABC”, endereço e link beacons.ai/companyautospa na bio.',
  },
  {
    id: 'imagens-ia',
    label: 'Imagens ilustrativas geradas por IA (ChatGPT) pela equipe CORE 3',
    kind: 'briefing',
    observedAt: '2026-11-11',
    file: 'clientes/company-auto-spa/anexos/07_imagens_ia_chatgpt_mosaico.png',
    note: 'Recebidas em mosaico de 16 quadros (baixa resolução por quadro). Uso ilustrativo; não retratam a empresa.',
  },
  {
    id: 'site-atual',
    label: 'Domínio companyautospa.com.br (encontrado em busca pública)',
    kind: 'web',
    url: 'https://companyautospa.com.br/',
    note: 'Possível site atual, não confirmado: o domínio não pôde ser aberto no ambiente de desenvolvimento (rede restrita).',
  },
];
