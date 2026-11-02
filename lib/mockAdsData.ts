export type AdNiche =
  | 'Saúde & Estética'
  | 'Finanças & Renda Extra'
  | 'Infoprodutos & Educação'
  | 'E-commerce & Dropshipping'
  | 'B2B & SaaS'
  | 'Imobiliário & High-Ticket';

export type SubNicheTag =
  | 'Todos'
  | 'Geral'
  | 'Espiritualidade'
  | 'Maternidade'
  | 'Beleza/Estética'
  | 'Renda Extra'
  | 'Ansiedade'
  | 'Memória'
  | 'Dores'
  | 'Relacionamento'
  | 'Emagrecimento';

export const SUB_NICHE_CHIPS: SubNicheTag[] = [
  'Todos',
  'Geral',
  'Espiritualidade',
  'Maternidade',
  'Beleza/Estética',
  'Renda Extra',
  'Ansiedade',
  'Memória',
  'Dores',
  'Relacionamento',
  'Emagrecimento',
];

export type AdFormat = 'Vídeo VSL' | 'Reels / UGC' | 'Imagem Estática' | 'Carrossel';

export type CheckoutPlatform =
  | 'Kiwify'
  | 'Hotmart'
  | 'Kirvano'
  | 'Eduzz'
  | 'Guru'
  | 'Clickbank'
  | 'Monetizze'
  | 'PerfectPay'
  | 'Yampi'
  | 'Cartpanda'
  | ' WhatsApp / CRM';

export interface FunnelData {
  landing_page_url: string;
  checkout_platform: CheckoutPlatform;
  funnel_type:
    | 'VSL Direta'
    | 'Advertorial + VSL'
    | 'Quiz Interativo'
    | 'Página de Vendas Express'
    | 'Funil WhatsApp X1'
    | 'Aplicação High-Ticket';
  product_price_brl: number;
  estimated_daily_spend_brl: number;
  estimated_roas: number;
  order_bumps: string[];
  upsell_offer: string;
  pixel_events_detected: string[];
  traffic_temperature: 'Frio (Escala Aberta)' | 'Morno (Lookalike 1%)' | 'Retargeting 7D';
}

export type VideoSceneStyle =
  | 'pip_creator'
  | 'unboxing_parcel'
  | 'beauty_ugc'
  | 'dark_vsl_typography'
  | 'bolo_vulcao'
  | 'book_pages'
  | 'honeycomb_caption'
  | 'banana_trick'
  | 'serum_dropper'
  | 'finance_chart'
  | 'luxury_watch'
  | 'saas_dashboard';

export interface AdCreativeVisual {
  accentHex: string;
  secondaryHex: string;
  hookOverlayText: string;
  subHookText: string;
  durationLabel?: string;
  aspectRatioLabel: '9:16 Vertical' | '4:5 Feed' | '1:1 Quadrado' | '16:9 Cinema';
  visualTheme: 'serum' | 'finance' | 'watch' | 'studio' | 'saas' | 'realestate';
  sceneStyle?: VideoSceneStyle;
  avatarInitials?: string;
  avatarBgHex?: string;
  domainDisplay?: string;
  publishedDateLabel?: string;
  productName?: string;
  productCategoryLabel?: string;
  videoCaptions?: string[];
}

export interface AdItem {
  id: string;
  library_id: string;
  advertiser_name: string;
  advertiser_handle: string;
  verified_advertiser: boolean;
  niche: AdNiche;
  sub_niche?: SubNicheTag;
  format: AdFormat;
  days_active: number;
  active_adsets: number;
  scale_score: number;
  original_copy: string;
  headline: string;
  cta_text: string;
  captured_at: string;
  country: 'Brasil (BR)';
  language?: string;
  platforms: ('Instagram' | 'Facebook' | 'Audience Network' | 'Messenger')[];
  visual: AdCreativeVisual;
  funnel: FunnelData;
}

export interface AiCopyVariationResult {
  analysis: {
    dominantTrigger: string;
    corePromise: string;
    uniqueMechanism: string;
    complianceRiskLevel: 'Baixo' | 'Moderado' | 'Alto (Requer Blindagem)';
    complianceNotes: string;
  };
  frameworks: {
    aida: { title: string; headline: string; body: string; cta: string };
    pas: { title: string; headline: string; body: string; cta: string };
    hookStoryOffer: { title: string; headline: string; body: string; cta: string };
  };
  antiBlockVersion: {
    safeHeadline: string;
    safeBody: string;
    replacedTerms: { original: string; safeReplacement: string; reason: string }[];
  };
  videoScript: {
    hook_0_3s: string;
    agitation_3_15s: string;
    mechanism_15_35s: string;
    offer_cta_35_45s: string;
    visualDirectionNotes: string;
  };
}

export interface SavedFavoriteItem {
  adId: string;
  folderName: string;
  tacticalNotes: string;
  savedAt: string;
  savedAiResults?: AiCopyVariationResult;
}

export interface NicheBenchmark {
  niche: AdNiche;
  active_ads_volume: number;
  avg_days_active: number;
  avg_ticket_brl: number;
  avg_cpm_brl: number;
  dominant_format: AdFormat;
  dominant_checkout: CheckoutPlatform;
  scale_level: 'Muito Alta' | 'Alta' | 'Moderada' | 'Seletiva';
  competition_saturation:
    | 'Saturado (Exige Mecanismo Único)'
    | 'Competitivo (Alta Liquidez)'
    | 'Oceano Azul (Baixo Custo)'
    | 'Qualificado (Ciclo Médio)';
  winning_funnel_structure: string;
  adhunter_verdict: string;
  recommended_hook_angle: string;
}

export const INITIAL_ADS_DATABASE: AdItem[] = [
  {
    id: 'ad-br-radar-01',
    library_id: 'META-BR-2026101',
    advertiser_name: 'Autor de Livros J.F Rozza',
    advertiser_handle: '@sujeitohomem.oficial',
    verified_advertiser: true,
    niche: 'Infoprodutos & Educação',
    sub_niche: 'Relacionamento',
    format: 'Vídeo VSL',
    days_active: 43,
    active_adsets: 42,
    scale_score: 94,
    original_copy:
      'Chega de ser apenas "mais um" na vida dela. Você já percebeu que, por mais que tente, parece que as regras do jogo mudaram? Neste livro digital direto ao ponto revelo os 28 princípios de postura, comunicação e alto valor que transformam sua presença em qualquer ambiente.',
    headline: 'Você precisa ler esse livro',
    cta_text: 'Saiba mais',
    captured_at: '23 de nov. de 2025',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'],
    visual: {
      accentHex: '#FACC15',
      secondaryHex: '#1E293B',
      hookOverlayText: '28 — NUNCA A PERCA DE VISTA: O CÓDIGO DA POSTURA MASCULINA',
      subHookText: 'Vídeo Folheando Páginas Grifadas · Alta Retenção de Leitura',
      durationLabel: '0:48',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'studio',
      sceneStyle: 'book_pages',
      avatarInitials: 'JF',
      avatarBgHex: '#1D4ED8',
      domainDisplay: 'sujeitohomem.fun',
      publishedDateLabel: '23 de nov. de 2025',
    },
    funnel: {
      landing_page_url: 'https://sujeitohomem.fun/livro-oficial',
      checkout_platform: 'Kiwify',
      funnel_type: 'Página de Vendas Express',
      product_price_brl: 47.0,
      estimated_daily_spend_brl: 8400,
      estimated_roas: 2.75,
      order_bumps: ['Audiobook Narrado Completo (+R$ 19,90)', 'Guia de Conversas Magnéticas (+R$ 27,00)'],
      upsell_offer: 'Mentoria Código Masculino (R$ 197,00)',
      pixel_events_detected: ['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-radar-02',
    library_id: 'META-BR-2026102',
    advertiser_name: 'Emily Kent',
    advertiser_handle: '@naturehealthperformance',
    verified_advertiser: true,
    niche: 'Saúde & Estética',
    sub_niche: 'Emagrecimento',
    format: 'Vídeo VSL',
    days_active: 49,
    active_adsets: 40,
    scale_score: 93,
    original_copy:
      '"Poucas pessoas conhecem este método simples com banana e 3 ingredientes naturais que já ajudou milhares de mulheres a destravarem o metabolismo matinal sem dietas malucas e sem efeito sanfona..."',
    headline: 'Descobre o truque da banana que está...',
    cta_text: 'Saiba mais',
    captured_at: '17 de nov. de 2025',
    country: 'Brasil (BR)',
    language: 'Português, Espanhol',
    platforms: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'],
    visual: {
      accentHex: '#10B981',
      secondaryHex: '#090D16',
      hookOverlayText: 'O ritual matinal da banana verde + 3 especiarias termogênicas',
      subHookText: 'VSL Longa 7:23 · Retenção Contínua c/ Explicação Científica',
      durationLabel: '7:23',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'serum',
      sceneStyle: 'banana_trick',
      avatarInitials: 'EK',
      avatarBgHex: '#047857',
      domainDisplay: 'www.naturehealthperformance.com',
      publishedDateLabel: '17 de nov. de 2025',
    },
    funnel: {
      landing_page_url: 'https://www.naturehealthperformance.com/protocolo-banana',
      checkout_platform: 'Kirvano',
      funnel_type: 'VSL Direta',
      product_price_brl: 147.0,
      estimated_daily_spend_brl: 9200,
      estimated_roas: 2.6,
      order_bumps: ['Lista de Substituições Inteligentes (+R$ 29,00)'],
      upsell_offer: 'Protocolo Desinflamação 90 Dias (R$ 297,00)',
      pixel_events_detected: ['PageView', 'VSL_Play', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-radar-03',
    library_id: 'META-BR-2026103',
    advertiser_name: 'Ana Ruiz',
    advertiser_handle: '@receitinhasdanutri',
    verified_advertiser: true,
    niche: 'Saúde & Estética',
    sub_niche: 'Emagrecimento',
    format: 'Reels / UGC',
    days_active: 51,
    active_adsets: 60,
    scale_score: 98,
    original_copy:
      'Vive com vontade de doce, mas foge dos bolos porque eles são cheios de açúcar e farinha? 🍰 Com a apostila de Bolos Vulcão Zero Açúcar e Zero Trigo da Nutri você prepara sobremesas que derretem na boca em 15 minutos!',
    headline: 'Bolo vulcão Zero Açúcar que derrete na boca',
    cta_text: 'Saiba mais',
    captured_at: '15 de nov. de 2025',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'],
    visual: {
      accentHex: '#F59E0B',
      secondaryHex: '#451A03',
      hookOverlayText: 'Bolo vulcão',
      subHookText: 'Close-up Colher Cortando Calda de Cacau Cremosa · 0:22',
      durationLabel: '0:22',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'serum',
      sceneStyle: 'bolo_vulcao',
      avatarInitials: 'AR',
      avatarBgHex: '#B45309',
      domainDisplay: 'www.receitinhasdanutri.com.br',
      publishedDateLabel: '15 de nov. de 2025',
    },
    funnel: {
      landing_page_url: 'https://www.receitinhasdanutri.com.br/bolos-vulcao',
      checkout_platform: 'Hotmart',
      funnel_type: 'Página de Vendas Express',
      product_price_brl: 37.0,
      estimated_daily_spend_brl: 12400,
      estimated_roas: 3.15,
      order_bumps: ['60 Doces Fit de Travessa (+R$ 17,00)', 'Pães Low Carb em 5 Minutos (+R$ 19,90)'],
      upsell_offer: 'Clube Confeitaria Saudável da Nutri (R$ 97,00)',
      pixel_events_detected: ['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-radar-04',
    library_id: 'META-BR-2026104',
    advertiser_name: 'Dicas da Luana',
    advertiser_handle: '@vitanews.health',
    verified_advertiser: true,
    niche: 'Saúde & Estética',
    sub_niche: 'Memória',
    format: 'Vídeo VSL',
    days_active: 52,
    active_adsets: 53,
    scale_score: 96,
    original_copy:
      'Esquecendo palavras simples no meio da conversa ou sentindo névoa mental após o almoço? Cientistas descobriram como uma enzima presente no mel silvestre puro reativa a clareza cognitiva e protege os neurônios.',
    headline: 'Watch Now',
    cta_text: 'Saiba mais',
    captured_at: '14 de nov. de 2025',
    country: 'Brasil (BR)',
    language: 'Inglês, Português',
    platforms: ['Facebook', 'Instagram', 'Audience Network'],
    visual: {
      accentHex: '#FACC15',
      secondaryHex: '#422006',
      hookOverlayText: 'Blanking out a lot lately? Watch this.',
      subHookText: 'Favo de Mel Dourado + Caixa de Legenda Amarela de Alto Contraste',
      durationLabel: '1:46',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'serum',
      sceneStyle: 'honeycomb_caption',
      avatarInitials: 'DL',
      avatarBgHex: '#A16207',
      domainDisplay: 'vitanews-health.org',
      publishedDateLabel: '14 de nov. de 2025',
    },
    funnel: {
      landing_page_url: 'https://vitanews-health.org/memory-honey-protocol',
      checkout_platform: 'Clickbank',
      funnel_type: 'Advertorial + VSL',
      product_price_brl: 247.0,
      estimated_daily_spend_brl: 15800,
      estimated_roas: 2.85,
      order_bumps: ['Guia Neuro-Nutrição Longevidade (+R$ 39,00)'],
      upsell_offer: 'Kit 6 Frascos NeuroHoney Pro',
      pixel_events_detected: ['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-radar-05',
    library_id: 'META-BR-2026105',
    advertiser_name: 'Motivação e sucesso',
    advertiser_handle: '@motivacaoesucesso.br',
    verified_advertiser: true,
    niche: 'Infoprodutos & Educação',
    sub_niche: 'Espiritualidade',
    format: 'Reels / UGC',
    days_active: 34,
    active_adsets: 18,
    scale_score: 86,
    original_copy:
      'Ensinamentos bíblicos desde o berço! Com nosso kit de atividades ilustradas, as crianças aprendem valores cristãos, histórias da Bíblia e desenvolvem a coordenação motora longe das telas do celular.',
    headline: 'Atividades Bíblicas Ilustradas para Crianças',
    cta_text: 'Saiba mais',
    captured_at: '21 de jan. de 2026',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'],
    visual: {
      accentHex: '#38BDF8',
      secondaryHex: '#1E293B',
      hookOverlayText: 'Kit Cristão Infantil: +200 Atividades Prontas para Imprimir',
      subHookText: 'Criador em Webcam Circular Azul sobre Folhas de Atividades',
      durationLabel: '0:54',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'studio',
      sceneStyle: 'pip_creator',
      avatarInitials: 'M',
      avatarBgHex: '#EC4899',
      domainDisplay: 'pay.kiwify.com.br',
      publishedDateLabel: '21 de jan. de 2026',
    },
    funnel: {
      landing_page_url: 'https://pay.kiwify.com.br/kit-biblico-infantil',
      checkout_platform: 'Kiwify',
      funnel_type: 'Página de Vendas Express',
      product_price_brl: 29.9,
      estimated_daily_spend_brl: 4900,
      estimated_roas: 3.1,
      order_bumps: ['Jogos da Memória Bíblicos p/ Imprimir (+R$ 12,90)', '30 Histórias para Dormir (+R$ 14,90)'],
      upsell_offer: 'Pacote Completo Escola Dominical & Catequese (R$ 67,00)',
      pixel_events_detected: ['PageView', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-radar-06',
    library_id: 'META-BR-2026106',
    advertiser_name: 'Roma.Estudio',
    advertiser_handle: '@roma.estudio',
    verified_advertiser: true,
    niche: 'Infoprodutos & Educação',
    sub_niche: 'Maternidade',
    format: 'Reels / UGC',
    days_active: 36,
    active_adsets: 24,
    scale_score: 88,
    original_copy:
      'Descubre cómo personas comunes están creando moldes y papelería creativa desde casa con solo una impresora doméstica y generando ingresos extra todas las semanas.',
    headline: 'Descubre cómo personas comunes...',
    cta_text: 'Saiba mais',
    captured_at: '20 de jan. de 2026',
    country: 'Brasil (BR)',
    language: 'Espanhol, Português',
    platforms: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'],
    visual: {
      accentHex: '#F59E0B',
      secondaryHex: '#27272A',
      hookOverlayText: 'Unboxing de encomendas feitas em casa no final de semana',
      subHookText: 'Mãos Abrindo Caixa Kraft + Demonstração Produto Artesanal',
      durationLabel: '1:52',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'watch',
      sceneStyle: 'unboxing_parcel',
      avatarInitials: 'RE',
      avatarBgHex: '#52525B',
      domainDisplay: 'go.hotmart.com',
      publishedDateLabel: '20 de jan. de 2026',
    },
    funnel: {
      landing_page_url: 'https://go.hotmart.com/atelier-lucrativo',
      checkout_platform: 'Hotmart',
      funnel_type: 'VSL Direta',
      product_price_brl: 67.0,
      estimated_daily_spend_brl: 6100,
      estimated_roas: 2.7,
      order_bumps: ['Pack 500 Arquivos Corte Prontos (+R$ 19,90)', 'Lista Fornecedores Atacado (+R$ 17,00)'],
      upsell_offer: 'Clube Mensal de Moldes Exclusivos (R$ 147/ano)',
      pixel_events_detected: ['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-radar-07',
    library_id: 'META-BR-2026107',
    advertiser_name: 'batista.danny',
    advertiser_handle: '@batista.danny',
    verified_advertiser: true,
    niche: 'Saúde & Estética',
    sub_niche: 'Beleza/Estética',
    format: 'Reels / UGC',
    days_active: 38,
    active_adsets: 29,
    scale_score: 90,
    original_copy:
      'O melhor alisamento de chuveiro e drenagem facial que já testei em casa! Garanta o seu com frete grátis e veja como o efeito espelhado dura até 4 semanas sem formol e sem ardência.',
    headline: 'Pele de porcelana e fios alinhados no chuveiro',
    cta_text: 'Saiba mais',
    captured_at: '22 de jan. de 2026',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Facebook', 'Instagram'],
    visual: {
      accentHex: '#EC4899',
      secondaryHex: '#3B0764',
      hookOverlayText: '“Eu parei de gastar R$ 350 no salão depois que descobri isso...”',
      subHookText: 'UGC Caseiro Autêntico Aplicando no Rosto/Cabelo · 0:54',
      durationLabel: '0:54',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'serum',
      sceneStyle: 'beauty_ugc',
      avatarInitials: 'B',
      avatarBgHex: '#EA580C',
      domainDisplay: 'app.monetizze.com.br',
      publishedDateLabel: '22 de jan. de 2026',
    },
    funnel: {
      landing_page_url: 'https://app.monetizze.com.br/r/beleza-espelhada',
      checkout_platform: 'Monetizze',
      funnel_type: 'Página de Vendas Express',
      product_price_brl: 127.0,
      estimated_daily_spend_brl: 7800,
      estimated_roas: 2.55,
      order_bumps: ['Sérum Reparador de Pontas (+R$ 29,90)'],
      upsell_offer: 'Kit 3 Frascos Tratamento Completo (R$ 247,00)',
      pixel_events_detected: ['PageView', 'AddToCart', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-radar-08',
    library_id: 'META-BR-2026108',
    advertiser_name: 'Dr. Giovanna Reis',
    advertiser_handle: '@drgiovannareis',
    verified_advertiser: true,
    niche: 'Finanças & Renda Extra',
    sub_niche: 'Renda Extra',
    format: 'Vídeo VSL',
    days_active: 64,
    active_adsets: 45,
    scale_score: 97,
    original_copy:
      'Você trabalha, se esforça, o mês começa e o dinheiro some antes do dia 15? Ganhar em dólar prestando micro-serviços digitais com IA não é luxo — é sobrevivência para quem quer construir clareza financeira.',
    headline: 'Renda forte. Mente forte. Vida estável!',
    cta_text: 'Saiba mais',
    captured_at: '20 de jan. de 2026',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Facebook', 'Instagram', 'Messenger', 'Audience Network'],
    visual: {
      accentHex: '#FACC15',
      secondaryHex: '#090D16',
      hookOverlayText: 'O PROBLEMA NÃO ESTÁ EM QUANTO VOCÊ GANHA E SIM NO QUE...',
      subHookText: 'Tipografia Bold Impactante sobre Cena de Escritório Noturno',
      durationLabel: '2:15',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'finance',
      sceneStyle: 'dark_vsl_typography',
      avatarInitials: 'GR',
      avatarBgHex: '#0284C7',
      domainDisplay: 'chk.eduzz.com',
      publishedDateLabel: '20 de jan. de 2026',
    },
    funnel: {
      landing_page_url: 'https://chk.eduzz.com/renda-dolar-ia',
      checkout_platform: 'Eduzz',
      funnel_type: 'VSL Direta',
      product_price_brl: 97.0,
      estimated_daily_spend_brl: 13500,
      estimated_roas: 2.95,
      order_bumps: ['Lista de 40 Plataformas que Pagam em Dólar (+R$ 27,00)', 'Prompts IA de Execução Rápida (+R$ 19,90)'],
      upsell_offer: 'Acelerador Internacional 60 Dias (R$ 297,00)',
      pixel_events_detected: ['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-001',
    library_id: 'META-BR-98412031',
    advertiser_name: 'DermaVita Labs Brasil',
    advertiser_handle: '@dermavitalabs.br',
    verified_advertiser: true,
    niche: 'Saúde & Estética',
    sub_niche: 'Beleza/Estética',
    format: 'Vídeo VSL',
    days_active: 94,
    active_adsets: 42,
    scale_score: 98,
    original_copy:
      'As clínicas de estética em São Paulo tentaram esconder esse protocolo noturno de 3 gotas. Enquanto cremes caros de R$ 400 ficam apenas na camada superficial da epiderme, o Peptídeo Bio-Retinol Japonês penetra 7x mais fundo durante o sono REM para dissolver manchas solares em 21 dias.',
    headline: 'Protocolo Japonês de 3 Gotas: Efeito Lifting em 21 Dias',
    cta_text: 'Saiba mais',
    captured_at: '10 de nov. de 2025',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Instagram', 'Facebook', 'Messenger', 'Audience Network'],
    visual: {
      accentHex: '#10B981',
      secondaryHex: '#064E3B',
      hookOverlayText: '“O erro nº 1 depois dos 38 anos não é a falta de colágeno...”',
      subHookText: 'VSL Retenção 44% nos primeiros 15s · Demonstração Textura Sérum',
      durationLabel: '3:42',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'serum',
      sceneStyle: 'serum_dropper',
      avatarInitials: 'DV',
      avatarBgHex: '#059669',
      domainDisplay: 'pay.kirvano.com.br',
      publishedDateLabel: '10 de nov. de 2025',
    },
    funnel: {
      landing_page_url: 'https://protocolodermavita.com.br/vsl-oficial',
      checkout_platform: 'Kirvano',
      funnel_type: 'Advertorial + VSL',
      product_price_brl: 197.0,
      estimated_daily_spend_brl: 14500,
      estimated_roas: 2.65,
      order_bumps: ['Guia Alimentação Pró-Colágeno (+R$ 29,90)', 'Sérum Área dos Olhos 15ml (+R$ 47,00)'],
      upsell_offer: 'Kit Tratamento Completo 6 Meses com 50% OFF (R$ 397,00)',
      pixel_events_detected: ['PageView', 'ViewContent', 'VSL_Pitch_50pct', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-002',
    library_id: 'META-BR-88294102',
    advertiser_name: 'Lucas Mendes · Fluxo IA',
    advertiser_handle: '@lucasmendes.digital',
    verified_advertiser: true,
    niche: 'Finanças & Renda Extra',
    sub_niche: 'Renda Extra',
    format: 'Reels / UGC',
    days_active: 68,
    active_adsets: 35,
    scale_score: 95,
    original_copy:
      'Para de tentar vender curso pra quem já vende curso. Existe um mercado invisível de clínicas médicas, escritórios de advocacia e imobiliárias locais no Brasil que pagam de R$ 1.500 a R$ 3.200 por mês apenas para alguém instalar um Agente de Atendimento no WhatsApp deles em 40 minutos.',
    headline: 'Micro-Agência de Automação Local com IA',
    cta_text: 'Saiba mais',
    captured_at: '04 de dez. de 2025',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Instagram', 'Facebook'],
    visual: {
      accentHex: '#34D399',
      secondaryHex: '#0F172A',
      hookOverlayText: '“Olha quanto as clínicas locais pagam por essa automação:”',
      subHookText: 'Bastidor Tela Real + Notificação Pix Recorrente',
      durationLabel: '1:28',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'finance',
      sceneStyle: 'finance_chart',
      avatarInitials: 'LM',
      avatarBgHex: '#0D9488',
      domainDisplay: 'pay.kiwify.com.br',
      publishedDateLabel: '04 de dez. de 2025',
    },
    funnel: {
      landing_page_url: 'https://operacaofluxoia.com.br/estudo-de-caso',
      checkout_platform: 'Kiwify',
      funnel_type: 'VSL Direta',
      product_price_brl: 147.0,
      estimated_daily_spend_brl: 11200,
      estimated_roas: 2.8,
      order_bumps: ['Pack 18 Templates N8N & Typebot Prontos (+R$ 37,00)', 'Contrato Jurídico Blindado B2B (+R$ 19,90)'],
      upsell_offer: 'Mentoria Acelerador de Contratos B2B (R$ 497,00)',
      pixel_events_detected: ['PageView', 'Lead', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-004',
    library_id: 'META-BR-66391827',
    advertiser_name: 'Instituto NeuroFoco',
    advertiser_handle: '@neurofoco.oficial',
    verified_advertiser: true,
    niche: 'Infoprodutos & Educação',
    sub_niche: 'Ansiedade',
    format: 'Vídeo VSL',
    days_active: 112,
    active_adsets: 49,
    scale_score: 99,
    original_copy:
      'Você começa 5 projetos ao mesmo tempo, abre 30 abas no navegador e chega às 18h sentindo que não concluiu nada importante? Isso NÃO é preguiça — é o Ciclo de Dopamina Fragmentada. Faça o teste de 60 segundos.',
    headline: 'Teste de 60s: Descubra Seu Perfil de Foco e Ansiedade',
    cta_text: 'Saiba mais',
    captured_at: '02 de out. de 2025',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Instagram', 'Facebook', 'Audience Network'],
    visual: {
      accentHex: '#38BDF8',
      secondaryHex: '#0F172A',
      hookOverlayText: 'QUAL É O SEU NÍVEL DE SOBRECARGA MENTAL? (Teste 60s)',
      subHookText: 'Criativo Estilo Quiz Interativo · CTR Médio 4.8% no Feed',
      durationLabel: '1:55',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'studio',
      sceneStyle: 'dark_vsl_typography',
      avatarInitials: 'NF',
      avatarBgHex: '#2563EB',
      domainDisplay: 'go.hotmart.com',
      publishedDateLabel: '02 de out. de 2025',
    },
    funnel: {
      landing_page_url: 'https://neurofoco.com.br/quiz-diagnostico',
      checkout_platform: 'Hotmart',
      funnel_type: 'Quiz Interativo',
      product_price_brl: 97.0,
      estimated_daily_spend_brl: 18400,
      estimated_roas: 3.1,
      order_bumps: ['Áudios Binaurais de Foco Profundo 40Hz (+R$ 19,90)', 'Planner Notion Segundo Cérebro (+R$ 27,00)'],
      upsell_offer: 'Formação Produtividade Neurocientífica (R$ 297,00)',
      pixel_events_detected: ['PageView', 'QuizStart', 'QuizComplete_Step7', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
  {
    id: 'ad-br-009',
    library_id: 'META-BR-19283746',
    advertiser_name: 'OrtoComfort · Coluna & Dores',
    advertiser_handle: '@ortocomfort.br',
    verified_advertiser: true,
    niche: 'E-commerce & Dropshipping',
    sub_niche: 'Dores',
    format: 'Reels / UGC',
    days_active: 81,
    active_adsets: 38,
    scale_score: 94,
    original_copy:
      'Acordar com dor na cervical e formigamento nos ombros todos os dias destrói sua produtividade antes mesmo do café da manhã. O Travesseiro Ortopédico Cervical alinha as 7 vértebras do pescoço já na primeira noite.',
    headline: 'Alívio Cervical na 1ª Noite · Teste por 30 Dias',
    cta_text: 'Saiba mais',
    captured_at: '18 de nov. de 2025',
    country: 'Brasil (BR)',
    language: 'Português',
    platforms: ['Instagram', 'Facebook'],
    visual: {
      accentHex: '#38BDF8',
      secondaryHex: '#0F172A',
      hookOverlayText: 'Se você acorda com dor no pescoço e nas costas, veja isso:',
      subHookText: 'Animação 3D Alinhamento das 7 Vértebras + Teste Fisioterapeuta',
      durationLabel: '1:12',
      aspectRatioLabel: '9:16 Vertical',
      visualTheme: 'watch',
      sceneStyle: 'luxury_watch',
      avatarInitials: 'OC',
      avatarBgHex: '#0284C7',
      domainDisplay: 'checkout.guru.com.br',
      publishedDateLabel: '18 de nov. de 2025',
    },
    funnel: {
      landing_page_url: 'https://ortocomfort.com.br/products/travesseiro-cloudfoam',
      checkout_platform: 'Guru',
      funnel_type: 'Página de Vendas Express',
      product_price_brl: 179.9,
      estimated_daily_spend_brl: 12300,
      estimated_roas: 2.55,
      order_bumps: ['Fronha Termorreguladora Fibra de Bambu (+R$ 39,90)'],
      upsell_offer: 'Kit Casal: Leve a 2ª Unidade por Apenas R$ 99,00',
      pixel_events_detected: ['PageView', 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase'],
      traffic_temperature: 'Frio (Escala Aberta)',
    },
  },
];

export const NICHE_BENCHMARKS: NicheBenchmark[] = [
  {
    niche: 'Saúde & Estética',
    active_ads_volume: 14820,
    avg_days_active: 48,
    avg_ticket_brl: 177,
    avg_cpm_brl: 38.5,
    dominant_format: 'Vídeo VSL',
    dominant_checkout: 'Kirvano',
    scale_level: 'Muito Alta',
    competition_saturation: 'Saturado (Exige Mecanismo Único)',
    winning_funnel_structure: 'Advertorial Científico + VSL 12min + Order Bump Duplo',
    adhunter_verdict:
      'Alta escala e volume massivo de compradores impulsivos, porém exige "Novo Mecanismo Científico" (ex: Truque da Banana, Bolo Vulcão Zero, Mel Neuro) e blindagem rigorosa de copy para evitar reprovação no Meta Ads.',
    recommended_hook_angle:
      'Descoberta contraintuitiva nos primeiros 3 segundos + Demonstração visual em vídeo vertical.',
  },
  {
    niche: 'Finanças & Renda Extra',
    active_ads_volume: 18450,
    avg_days_active: 39,
    avg_ticket_brl: 147,
    avg_cpm_brl: 46.2,
    dominant_format: 'Reels / UGC',
    dominant_checkout: 'Kiwify',
    scale_level: 'Muito Alta',
    competition_saturation: 'Saturado (Exige Mecanismo Único)',
    winning_funnel_structure: 'Criativo VSL Impacto + Mini-VSL 6min + Checkout c/ 2 Order Bumps',
    adhunter_verdict:
      'Os anúncios que sobrevivem +45 dias vendem micro-serviços em dólar com IA, automação local ou modelos práticos com prova técnica na tela.',
    recommended_hook_angle:
      'Tipografia de alto contraste ("O PROBLEMA NÃO ESTÁ EM QUANTO VOCÊ GANHA...") ou bastidor real.',
  },
  {
    niche: 'Infoprodutos & Educação',
    active_ads_volume: 11900,
    avg_days_active: 56,
    avg_ticket_brl: 67,
    avg_cpm_brl: 24.8,
    dominant_format: 'Vídeo VSL',
    dominant_checkout: 'Hotmart',
    scale_level: 'Alta',
    competition_saturation: 'Competitivo (Alta Liquidez)',
    winning_funnel_structure: 'Criativo Nichado (Relacionamento / Cristão / Maternidade) -> LP Express Low-Ticket',
    adhunter_verdict:
      'Subnichos inexplorados como Espiritualidade Infantil, Maternidade, Livros Digitais e Receitas Zero Açúcar possuem os menores CPMs do Brasil e altíssima conversão no checkout.',
    recommended_hook_angle:
      'Demonstração física do material (livro aberto, apostila impressa ou webcam PiP mostrando as páginas).',
  },
  {
    niche: 'E-commerce & Dropshipping',
    active_ads_volume: 9640,
    avg_days_active: 44,
    avg_ticket_brl: 189,
    avg_cpm_brl: 26.4,
    dominant_format: 'Reels / UGC',
    dominant_checkout: 'Yampi',
    scale_level: 'Alta',
    competition_saturation: 'Competitivo (Alta Liquidez)',
    winning_funnel_structure: 'Vídeo UGC Demonstração de Dor/Solução -> LP Express -> Kit 2 Unidades no Upsell',
    adhunter_verdict:
      'Produtos solucionadores de dores físicas imediatas (coluna/cervical/visão) dominam a escala com ROAS consistente acima de 2.4x.',
    recommended_hook_angle: 'Comparação anatômica antes/depois logo no primeiro frame do vídeo.',
  },
  {
    niche: 'B2B & SaaS',
    active_ads_volume: 4120,
    avg_days_active: 67,
    avg_ticket_brl: 590,
    avg_cpm_brl: 52.0,
    dominant_format: 'Vídeo VSL',
    dominant_checkout: ' WhatsApp / CRM',
    scale_level: 'Moderada',
    competition_saturation: 'Oceano Azul (Baixo Custo)',
    winning_funnel_structure: 'Criativo Dor Financeira do Empresário -> Calculadora/Diagnóstico -> Sessão X1',
    adhunter_verdict:
      'Embora o CPM seja mais alto, os criativos rodam por +60 dias sem fadiga e o LTV garante o maior ROAS líquido (4.0x+) entre todos os nichos.',
    recommended_hook_angle: 'Chamada direta ao decisor com cálculo de perda invisível.',
  },
  {
    niche: 'Imobiliário & High-Ticket',
    active_ads_volume: 3280,
    avg_days_active: 59,
    avg_ticket_brl: 15000,
    avg_cpm_brl: 48.9,
    dominant_format: 'Vídeo VSL',
    dominant_checkout: ' WhatsApp / CRM',
    scale_level: 'Seletiva',
    competition_saturation: 'Qualificado (Ciclo Médio)',
    winning_funnel_structure: 'Vídeo Tese de Investimento Patrimonial -> Filtro de Renda -> Consultor no WhatsApp',
    adhunter_verdict:
      'Vencedores anunciam teses financeiras (valorização patrimonial, preço de custo, rentabilidade) em vez de apenas características físicas do imóvel.',
    recommended_hook_angle: 'Comparativo de rentabilidade financeira contra Renda Fixa tradicional.',
  },
];
