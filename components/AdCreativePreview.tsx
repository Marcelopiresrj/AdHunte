'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  MoreVertical,
  Download,
  FileText,
} from 'lucide-react';
import { AdItem } from '@/lib/mockAdsData';
import { useToast } from './ToastProvider';

interface AdCreativePreviewProps {
  ad: AdItem;
}

export function downloadAdCreativeCanvas(ad: AdItem) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
  grad.addColorStop(0, '#0D0E12');
  grad.addColorStop(0.6, '#14171F');
  grad.addColorStop(1, ad.visual.secondaryHex || '#1E293B');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1350);

  ctx.fillStyle = '#1E293B';
  ctx.fillRect(60, 60, 960, 80);
  ctx.fillStyle = '#C084FC';
  ctx.font = 'bold 26px monospace';
  ctx.fillText(
    `ADHUNTER  ·  ${ad.active_adsets} ANÚNCIOS ATIVOS  ·  ${ad.days_active} DIAS NO AR`,
    90,
    110
  );

  ctx.fillStyle = '#F8FAFC';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText(`${ad.advertiser_name}`, 60, 220);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '24px sans-serif';
  ctx.fillText(
    `${ad.visual.domainDisplay || ad.funnel.landing_page_url}  ·  ${ad.sub_niche || ad.niche}`,
    60,
    262
  );

  ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
  ctx.strokeStyle = '#C084FC';
  ctx.lineWidth = 4;
  ctx.strokeRect(60, 320, 960, 480);
  ctx.fillRect(60, 320, 960, 480);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 46px sans-serif';
  const words = ad.visual.hookOverlayText.split(' ');
  let line = '';
  let yPos = 440;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > 860 && n > 0) {
      ctx.fillText(line, 100, yPos);
      line = words[n] + ' ';
      yPos += 64;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, 100, yPos);

  ctx.fillStyle = '#C084FC';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText(ad.headline.slice(0, 62), 60, 900);

  ctx.fillStyle = '#111318';
  ctx.fillRect(60, 980, 960, 260);
  ctx.fillStyle = '#10B981';
  ctx.font = 'bold 28px monospace';
  ctx.fillText(
    `GATEWAY: ${ad.funnel.checkout_platform}   |   TICKET: R$ ${ad.funnel.product_price_brl.toFixed(2)}`,
    90,
    1060
  );
  ctx.fillStyle = '#E2E8F0';
  ctx.font = '24px monospace';
  ctx.fillText(`PUBLICADO: ${ad.visual.publishedDateLabel || ad.captured_at}`, 90, 1130);
  ctx.fillStyle = '#94A3B8';
  ctx.font = '22px monospace';
  ctx.fillText(`URL: ${ad.funnel.landing_page_url}`, 90, 1190);

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `criativo-${ad.id}-${ad.days_active}dias.png`;
  link.href = dataUrl;
  link.click();
}

export function downloadAdDossierTxt(ad: AdItem) {
  const content = `====================================================================
ADHUNTER — DOSSIÊ DE ANÚNCIO & TRANSCRIÇÃO DE COPY
====================================================================
ID Biblioteca: ${ad.library_id}
Anunciante: ${ad.advertiser_name}
Domínio: ${ad.visual.domainDisplay || ad.funnel.landing_page_url}
Nicho: ${ad.niche} (${ad.sub_niche || 'Geral'})
Anúncios Utilizando Este Criativo: ${ad.active_adsets}
Dias Ativo: ${ad.days_active} dias
Publicado em: ${ad.visual.publishedDateLabel || ad.captured_at}

TÍTULO / HEADLINE:
${ad.headline}

GANCHO VISUAL DO VÍDEO:
${ad.visual.hookOverlayText}

TRANSCRIÇÃO / COPY COMPLETA:
${ad.original_copy}

FUNIL & GATEWAY:
Gateway Detectado: ${ad.funnel.checkout_platform}
URL: ${ad.funnel.landing_page_url}
Ticket: R$ ${ad.funnel.product_price_brl.toFixed(2)}
====================================================================`;

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transcricao-criativo-${ad.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

function parseDurationToSeconds(label?: string): number {
  if (!label || !label.includes(':')) return 54;
  const parts = label.split(':').map(Number);
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return Math.max(10, parts[0] * 60 + parts[1]);
  }
  return 54;
}

function formatSeconds(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const mins = Math.floor(s / 60);
  const rem = s % 60;
  return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
}

function getProductInfoForAd(ad: AdItem): {
  productTitle: string;
  nicheBadge: string;
  sceneKey: string;
  captions: [string, string, string];
} {
  const sub = ad.sub_niche || 'Geral';
  const scene = ad.visual.sceneStyle || '';

  if (scene === 'book_pages' || sub === 'Relacionamento') {
    return {
      productTitle: 'Livro Digital: Código Masculino (28 Leis)',
      nicheBadge: 'Relacionamento',
      sceneKey: 'book_pages',
      captions: [
        '“Chega de ser apenas mais um na vida dela...”',
        'Folheando o capítulo 28: Postura e Presença',
        'Acesso imediato ao Livro + Audiobook hoje!',
      ],
    };
  }

  if (scene === 'banana_trick') {
    return {
      productTitle: 'Protocolo Matinal Truque da Banana',
      nicheBadge: 'Emagrecimento',
      sceneKey: 'banana_trick',
      captions: [
        '“1 banana verde + 3 especiarias antes do café...”',
        'Ativando a queima metabólica natural em 21 dias',
        'Mais de 14.000 alunas aplicando a receita!',
      ],
    };
  }

  if (scene === 'bolo_vulcao' || (sub === 'Emagrecimento' && ad.id.includes('03'))) {
    return {
      productTitle: 'Apostila Bolos Vulcão Zero Açúcar',
      nicheBadge: 'Emagrecimento',
      sceneKey: 'bolo_vulcao',
      captions: [
        '“Bolo vulcão fofinho, zero açúcar e sem trigo!”',
        'Olha essa calda cremosa de cacau derretendo...',
        'Baixe todas as 60 receitas da Nutri agora!',
      ],
    };
  }

  if (scene === 'honeycomb_caption' || sub === 'Memória') {
    return {
      productTitle: 'NeuroHoney Pro · Enzima da Memória',
      nicheBadge: 'Memória',
      sceneKey: 'honeycomb_caption',
      captions: [
        '“Esquecendo palavras simples no meio da frase?”',
        'A enzima do mel silvestre que protege os neurônios',
        'Clareza mental e foco restaurados naturalmente!',
      ],
    };
  }

  if (scene === 'pip_creator' || sub === 'Espiritualidade') {
    return {
      productTitle: 'Kit +200 Atividades Bíblicas Infantis',
      nicheBadge: 'Espiritualidade',
      sceneKey: 'pip_creator',
      captions: [
        '“Ensinamentos bíblicos para crianças longe das telas!”',
        'Mais de 200 folhas ilustradas prontas para imprimir',
        'Envio imediato no seu e-mail e WhatsApp!',
      ],
    };
  }

  if (scene === 'unboxing_parcel' || sub === 'Maternidade') {
    return {
      productTitle: 'Atelier Lucrativo: Moldes & Papelaria',
      nicheBadge: 'Maternidade',
      sceneKey: 'unboxing_parcel',
      captions: [
        '“Veja como mães criam papelaria em casa...”',
        'Abrindo a caixa com os moldes prontos para cortar',
        'Comece com apenas uma impressora doméstica!',
      ],
    };
  }

  if (scene === 'beauty_ugc' || scene === 'serum_dropper' || sub === 'Beleza/Estética') {
    return {
      productTitle:
        scene === 'serum_dropper'
          ? 'Sérum Bio-Retinol Japonês 3 Gotas'
          : 'Alisamento Espelhado & Glow Facial',
      nicheBadge: 'Beleza/Estética',
      sceneKey: scene === 'serum_dropper' ? 'serum_dropper' : 'beauty_ugc',
      captions: [
        '“Parei de gastar R$ 350 em clínica depois disso...”',
        'Aplicação em 3 minutos: absorção 7x mais profunda',
        'Efeito lifting e fios alinhados já na 1ª semana!',
      ],
    };
  }

  if (sub === 'Ansiedade') {
    return {
      productTitle: 'NeuroFoco 40Hz · Destrave Mental',
      nicheBadge: 'Ansiedade',
      sceneKey: 'ansiedade_neuro',
      captions: [
        '“30 abas abertas e sensação de mente travada?”',
        'O protocolo de áudio binaural que reduz a ansiedade',
        'Faça o diagnóstico de 60s e receba seu plano!',
      ],
    };
  }

  if (scene === 'luxury_watch' || sub === 'Dores') {
    return {
      productTitle: 'Travesseiro Ortopédico Cervical CloudFoam',
      nicheBadge: 'Dores',
      sceneKey: 'cervical_pillow',
      captions: [
        '“Acorda com dor no pescoço e ombros travados?”',
        'Alinhamento anatômico das 7 vértebras cervicais',
        'Alívio imediato já na 1ª noite · Frete Grátis!',
      ],
    };
  }

  // Default / Renda Extra / Finanças
  return {
    productTitle:
      scene === 'finance_chart'
        ? 'Agente IA para Negócios Locais'
        : 'Sistema Micro-Serviços em Dólar c/ IA',
    nicheBadge: sub === 'Geral' ? ad.niche : sub,
    sceneKey: scene === 'finance_chart' ? 'finance_chart' : 'dark_vsl_typography',
    captions: [
      '“O problema não é quanto você ganha, é como escala...”',
      'Notificações reais de comissões em Dólar e Pix',
      'Veja o passo a passo completo clicando em Saiba Mais!',
    ],
  };
}

export default function AdCreativePreview({ ad }: AdCreativePreviewProps) {
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPlayingRef = useRef<boolean>(true);
  const progressRef = useRef<number>(0);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const productInfo = getProductInfoForAd(ad);
  const totalSeconds = parseDurationToSeconds(ad.visual.durationLabel);
  const currentSeconds = (progress / 100) * totalSeconds;
  const timeDisplay = `${formatSeconds(currentSeconds)} / ${
    ad.visual.durationLabel || '0:54'
  }`;

  // Determine current dynamic caption based on playback phase
  const captionIndex = progress < 34 ? 0 : progress < 68 ? 1 : 2;
  const activeCaption = productInfo.captions[captionIndex];

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Optional Portuguese Voiceover synthesis when user unmutes the product video
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    if (!isMuted && isPlaying) {
      const utterance = new SpeechSynthesisUtterance(
        `${productInfo.productTitle}. ${ad.headline}. ${ad.original_copy}`
      );
      utterance.lang = 'pt-BR';
      utterance.rate = 1.08;
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isMuted, isPlaying, ad.headline, ad.original_copy, productInfo.productTitle]);

  // Continuous 60fps Product Video Renderer (No dependency on `progress` so it never stutters or resets)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;
    let lastUiSync = 0;

    const scene = productInfo.sceneKey;

    const renderFrame = (timestamp: number) => {
      if (isPlayingRef.current) {
        tick += 0.04;
        progressRef.current = (progressRef.current + 0.14) % 100;
        if (timestamp - lastUiSync > 120) {
          setProgress(progressRef.current);
          lastUiSync = timestamp;
        }
      }

      const w = canvas.width;
      const h = canvas.height;
      const phase = progressRef.current < 34 ? 0 : progressRef.current < 68 ? 1 : 2;

      ctx.save();

      // =======================================================================
      // 1. RELACIONAMENTO / LIVRO ABERTO GRIFADO (book_pages)
      // =======================================================================
      if (scene === 'book_pages') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#292524');
        bgGrad.addColorStop(1, '#0C0A09');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Wooden desk surface & stacked books
        ctx.fillStyle = '#991B1B';
        ctx.fillRect(w * 0.25, 36, w * 0.5, 18);
        ctx.fillStyle = '#E7E5E4';
        ctx.fillRect(w * 0.27, 54, w * 0.46, 12);

        const pageWave = Math.sin(tick * 1.6) * 3;
        // Left & Right Open Book Pages
        ctx.fillStyle = '#F5F5F0';
        ctx.fillRect(16, 74 + pageWave, w * 0.38, h - 145);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(w * 0.38 + 14, 70 + pageWave, w * 0.55, h - 140);

        // Book Spine Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(w * 0.38 + 10, 72 + pageWave, 6, h - 142);

        // Chapter Header & Drop-caps
        ctx.fillStyle = '#7C2D12';
        ctx.font = 'bold 10px sans-serif';
        ctx.fillText('LEI #28 · CÓDIGO DE VALOR', w * 0.43, 92 + pageWave);

        ctx.fillStyle = '#1C1917';
        ctx.font = 'bold 24px serif';
        ctx.fillText('Q', w * 0.43, 130 + pageWave);
        ctx.fillText('N', w * 0.43, 215 + pageWave);

        // Animated Lilac/Black Highlighter scanning across the lines in real time!
        const highlightWidth = ((Math.sin(tick * 1.4) + 1) * 0.5) * (w * 0.44);
        ctx.fillStyle = '#18181B';
        ctx.fillRect(w * 0.43, 140 + pageWave, w * 0.44, 10);
        ctx.fillRect(w * 0.43, 155 + pageWave, w * 0.4, 10);
        ctx.fillStyle = '#9333EA';
        ctx.fillRect(w * 0.43, 172 + pageWave, Math.max(25, highlightWidth), 12);

        // Paragraph lines
        ctx.fillStyle = '#57534E';
        for (let ly = 110; ly < h - 95; ly += 13) {
          if (ly >= 136 && ly <= 185) continue;
          ctx.fillRect(w * 0.51, ly + pageWave, w * 0.36, 3);
          ctx.fillRect(26, ly + pageWave, w * 0.28, 3);
        }

        // Hand thumb holding book at bottom-left
        ctx.fillStyle = '#D6A286';
        ctx.beginPath();
        ctx.ellipse(42, h - 75, 22, 42, -0.25, 0, Math.PI * 2);
        ctx.fill();
      }

      // =======================================================================
      // 2. EMAGRECIMENTO / TRUQUE DA BANANA MATINAL (banana_trick)
      // =======================================================================
      else if (scene === 'banana_trick') {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#064E3B');
        bgGrad.addColorStop(0.55, '#022C22');
        bgGrad.addColorStop(1, '#090D16');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Marble kitchen counter at bottom
        ctx.fillStyle = '#1E293B';
        ctx.fillRect(0, h * 0.65, w, h * 0.35);

        // Glowing Blender / Glass Jar with Golden Banana Elixir swirling
        const swirl = Math.sin(tick * 2.5) * 6;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.strokeStyle = '#34D399';
        ctx.lineWidth = 3;
        ctx.strokeRect(w * 0.28, h * 0.26, w * 0.44, h * 0.42);
        ctx.fillRect(w * 0.28, h * 0.26, w * 0.44, h * 0.42);

        // Swirling Yellow-Green Thermogenic Liquid inside Glass
        const liqGrad = ctx.createLinearGradient(0, h * 0.34, 0, h * 0.68);
        liqGrad.addColorStop(0, '#FACC15');
        liqGrad.addColorStop(1, '#10B981');
        ctx.fillStyle = liqGrad;
        ctx.fillRect(
          w * 0.3,
          h * 0.36 + swirl * 0.4,
          w * 0.4,
          h * 0.3 - swirl * 0.4
        );

        // Floating Banana Slices & Cinnamon/Turmeric particles rising
        for (let i = 0; i < 4; i++) {
          const bx = w * 0.37 + i * 22;
          const by = h * 0.45 + Math.sin(tick * 2 + i) * 12;
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(bx, by, 11, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#CA8A04';
          ctx.beginPath();
          ctx.arc(bx, by, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Animated Weight Loss Meter Badge on Top-Right
        const kgLost = (4.2 + ((Math.sin(tick) + 1) * 1.4)).toFixed(1);
        ctx.fillStyle = '#0F172A';
        ctx.strokeStyle = '#C084FC';
        ctx.lineWidth = 2;
        ctx.fillRect(w * 0.54, 48, w * 0.4, 44);
        ctx.strokeRect(w * 0.54, 48, w * 0.4, 44);
        ctx.fillStyle = '#34D399';
        ctx.font = 'bold 15px monospace';
        ctx.fillText(`-${kgLost} kg / 21d`, w * 0.58, 75);
      }

      // =======================================================================
      // 3. EMAGRECIMENTO / BOLO VULCÃO ZERO AÇÚCAR (bolo_vulcao)
      // =======================================================================
      else if (scene === 'bolo_vulcao') {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#78350F');
        bgGrad.addColorStop(0.5, '#451A03');
        bgGrad.addColorStop(1, '#1C0A00');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // White ceramic plate
        ctx.fillStyle = '#F5F5F4';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.68, w * 0.44, 50, 0, 0, Math.PI * 2);
        ctx.fill();

        // Rich Chocolate Bundt Cake Body
        ctx.fillStyle = '#3B1406';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.5, w * 0.38, 78, 0, 0, Math.PI * 2);
        ctx.fill();

        // Fluffy Golden-Orange Cake Slice Cutout
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.moveTo(w * 0.34, h * 0.37);
        ctx.lineTo(w * 0.58, h * 0.34);
        ctx.lineTo(w * 0.55, h * 0.62);
        ctx.lineTo(w * 0.32, h * 0.58);
        ctx.closePath();
        ctx.fill();

        // Animated Flowing Chocolate Volcano Lava
        const lavaFlow = Math.sin(tick * 2) * 5;
        ctx.fillStyle = '#260B01';
        ctx.beginPath();
        ctx.ellipse(
          w * 0.52,
          h * 0.64 + lavaFlow * 0.4,
          w * 0.3,
          36,
          0.08,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Spoon lifting a bite of cake & chocolate sauce
        const spoonY = h * 0.64 + Math.sin(tick * 2.2) * 8;
        ctx.strokeStyle = '#E7E5E4';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(w * 0.96, spoonY - 8);
        ctx.lineTo(w * 0.6, spoonY);
        ctx.stroke();

        // Title Banner
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Bolo Vulcão Zero Açúcar', w * 0.5, 58);
        ctx.fillStyle = '#FDE047';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('ZERO TRIGO · PRONTO EM 15 MIN', w * 0.5, 76);
        ctx.textAlign = 'left';
      }

      // =======================================================================
      // 4. MEMÓRIA / FAVO DE MEL & CÁPSULAS NEURO (honeycomb_caption)
      // =======================================================================
      else if (scene === 'honeycomb_caption') {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#78350F');
        bgGrad.addColorStop(0.5, '#B45309');
        bgGrad.addColorStop(1, '#1E1B4B');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Honeycomb cells pulsing with golden honey drops
        ctx.strokeStyle = 'rgba(253, 224, 71, 0.35)';
        ctx.lineWidth = 1.5;
        for (let y = 36; y < h - 85; y += 18) {
          for (let x = 18; x < w - 18; x += 20) {
            ctx.strokeRect(
              x + ((y / 18) % 2) * 9,
              y + Math.sin(tick + x * 0.04) * 2,
              14,
              14
            );
          }
        }

        // Animated Golden Honey Drop Falling into Neuro Bottle
        const dropY = 75 + ((tick * 28) % 120);
        ctx.fillStyle = '#FACC15';
        ctx.beginPath();
        ctx.arc(w * 0.5, dropY, 9, 0, Math.PI * 2);
        ctx.fill();

        // High-Contrast Caption Box in Center
        ctx.fillStyle = '#C084FC';
        ctx.fillRect(w * 0.1, h * 0.38, w * 0.8, 78);
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 17px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Blanking out a', w * 0.5, h * 0.38 + 25);
        ctx.fillText('lot lately?', w * 0.5, h * 0.38 + 47);
        ctx.fillText('Watch this.', w * 0.5, h * 0.38 + 69);
        ctx.textAlign = 'left';
      }

      // =======================================================================
      // 5. ESPIRITUALIDADE / KIT ATIVIDADES BÍBLICAS INFANTIS (pip_creator)
      // =======================================================================
      else if (scene === 'pip_creator') {
        ctx.fillStyle = '#FAF5EF';
        ctx.fillRect(0, 0, w, h);

        // Illustrated Kids Bible Activity Pages scrolling gently
        const pageSlide = Math.sin(tick * 1.3) * 6;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.fillRect(18, 42 + pageSlide, w * 0.43, 105);
        ctx.strokeRect(18, 42 + pageSlide, w * 0.43, 105);

        ctx.fillRect(w * 0.52, 46 - pageSlide, w * 0.42, 105);
        ctx.strokeRect(w * 0.52, 46 - pageSlide, w * 0.42, 105);

        // Noah's Ark & Rainbow illustration on activity sheet
        ctx.strokeStyle = '#EC4899';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(58, 86 + pageSlide, 22, Math.PI, 0);
        ctx.stroke();
        ctx.fillStyle = '#38BDF8';
        ctx.fillRect(w * 0.58, 68 - pageSlide, 52, 34);

        // Circular PiP Creator Webcam at center-bottom
        const cx = w * 0.5;
        const cy = h * 0.58;
        const radius = 68;

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = '#1E1B4B';
        ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
        ctx.fillStyle = '#C084FC';
        ctx.fillRect(cx + 34, cy - 55, 7, 110);

        const talkBob = Math.sin(tick * 3.2) * 3;
        ctx.fillStyle = '#D99B78';
        ctx.beginPath();
        ctx.ellipse(cx - 4, cy + talkBob, 32, 40, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 26, cy - 12 + talkBob, 18, 12);
        ctx.strokeRect(cx - 2, cy - 12 + talkBob, 18, 12);
        ctx.restore();

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = '#9333EA';
        ctx.lineWidth = 4;
        ctx.stroke();
      }

      // =======================================================================
      // 6. MATERNIDADE / UNBOXING MOLDES & PAPELARIA (unboxing_parcel)
      // =======================================================================
      else if (scene === 'unboxing_parcel') {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#78350F');
        bgGrad.addColorStop(0.6, '#451A03');
        bgGrad.addColorStop(1, '#1C1917');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Kraft Parcel Box Opening Animation
        const flapLift = Math.sin(tick * 1.8) * 8;
        ctx.fillStyle = '#D6B892';
        ctx.beginPath();
        ctx.moveTo(24, h * 0.42);
        ctx.lineTo(w * 0.62, h * 0.26 + flapLift);
        ctx.lineTo(w - 20, h * 0.46);
        ctx.lineTo(w * 0.46, h * 0.72);
        ctx.closePath();
        ctx.fill();

        // Colorful Custom Party Toppers & Stickers emerging from the box
        ctx.fillStyle = '#F472B6';
        ctx.beginPath();
        ctx.arc(w * 0.42, h * 0.42 - Math.abs(flapLift), 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#C084FC';
        ctx.fillRect(w * 0.52, h * 0.36 - Math.abs(flapLift), 48, 36);

        // Barcode Label on Box
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(w * 0.32, h * 0.52, 84, 34);
        ctx.fillStyle = '#0F172A';
        for (let bx = 0; bx < 68; bx += 6) {
          ctx.fillRect(w * 0.35 + bx, h * 0.55, (bx % 4) + 2, 18);
        }
      }

      // =======================================================================
      // 7. BELEZA/ESTÉTICA / SÉRUM GOTAS & UGC SKINCARE (beauty_ugc / serum_dropper)
      // =======================================================================
      else if (scene === 'beauty_ugc' || scene === 'serum_dropper') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#4A044E');
        bgGrad.addColorStop(0.5, '#2E1065');
        bgGrad.addColorStop(1, '#0F172A');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Luxury Frosted Serum Bottle Mockup on Left
        const floatY = Math.sin(tick * 1.8) * 5;
        ctx.fillStyle = '#C084FC';
        ctx.fillRect(34, h * 0.34 + floatY, 64, 110);
        // Gold collar & black dropper bulb
        ctx.fillStyle = '#FACC15';
        ctx.fillRect(46, h * 0.29 + floatY, 40, 16);
        ctx.fillStyle = '#1E1B4B';
        ctx.fillRect(54, h * 0.21 + floatY, 24, 26);

        // Bottle Label
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(40, h * 0.42 + floatY, 52, 58);
        ctx.fillStyle = '#581C87';
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('BIO-RETINOL', 42, h * 0.5 + floatY);
        ctx.fillText('3 GOTAS', 46, h * 0.55 + floatY);

        // Glass Pipette Dropping Animated Golden Serum Drops on Right
        const dropOffset = (tick * 34) % 90;
        ctx.fillStyle = '#FDE047';
        ctx.beginPath();
        ctx.arc(w * 0.68, h * 0.32 + dropOffset, 8, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Skin Collagen Renewal Rings
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          w * 0.68,
          h * 0.58,
          28 + Math.sin(tick * 2.5) * 8,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }

      // =======================================================================
      // 8. ANSIEDADE / NEUROFOCO ONDAS BINAURAIS 40HZ (ansiedade_neuro)
      // =======================================================================
      else if (scene === 'ansiedade_neuro') {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#0F172A');
        bgGrad.addColorStop(0.5, '#1E1B4B');
        bgGrad.addColorStop(1, '#090D16');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Animated 40Hz Brainwave Oscilloscope Waveform
        ctx.strokeStyle = '#C084FC';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (let x = 16; x < w - 16; x += 4) {
          const y =
            h * 0.44 +
            Math.sin(x * 0.06 + tick * 3) * 24 * Math.sin(tick * 0.8);
          if (x === 16) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Interactive Quiz Progress Card
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 1.5;
        ctx.fillRect(24, h * 0.56, w - 48, 54);
        ctx.strokeRect(24, h * 0.56, w - 48, 54);

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('TESTE DE DOPAMINA & FOCO · 60s', 36, h * 0.62);
        ctx.fillStyle = '#C084FC';
        const barW = ((Math.sin(tick) + 1) * 0.4 + 0.2) * (w - 72);
        ctx.fillRect(36, h * 0.66, barW, 8);
      }

      // =======================================================================
      // 9. DORES / TRAVESSEIRO ORTOPÉDICO CERVICAL 3D (cervical_pillow)
      // =======================================================================
      else if (scene === 'cervical_pillow') {
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        bgGrad.addColorStop(0, '#0C4A6E');
        bgGrad.addColorStop(0.5, '#0F172A');
        bgGrad.addColorStop(1, '#090D16');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Ergonomic Contoured CloudFoam Pillow Shape
        const breath = Math.sin(tick * 1.8) * 4;
        ctx.fillStyle = '#F8FAFC';
        ctx.beginPath();
        ctx.roundRect(28, h * 0.44 + breath, w - 56, 68, 24);
        ctx.fill();

        // 7 Cervical Spine Vertebrae Alignment Dots pulsing green/lilac
        for (let v = 0; v < 7; v++) {
          const vx = 52 + v * 28;
          const vy = h * 0.42 + breath + Math.sin(v * 0.5) * 4;
          ctx.fillStyle = v < 5 ? '#34D399' : '#C084FC';
          ctx.beginPath();
          ctx.arc(vx, vy, 7, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('ALINHAMENTO CERVICAL 7 VÉRTEBRAS', 34, 62);
      }

      // =======================================================================
      // 10. RENDA EXTRA & FINANÇAS / NOTIFICAÇÕES PIX & DÓLAR IA
      // =======================================================================
      else {
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, '#0F172A');
        bgGrad.addColorStop(0.5, '#1E1B4B');
        bgGrad.addColorStop(1, '#090D16');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Bold VSL Headline at Top
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('O PROBLEMA NÃO ESTÁ', 18, 56);
        ctx.fillText('EM QUANTO VOCÊ GANHA', 18, 76);

        // Animated Revenue Bar Chart Climbing
        for (let b = 0; b < 6; b++) {
          const bh = 28 + b * 14 + Math.sin(tick * 2 + b) * 8;
          const bx = 26 + b * 42;
          const by = h * 0.64 - bh;
          ctx.fillStyle = b >= 4 ? '#C084FC' : '#334155';
          ctx.fillRect(bx, by, 28, bh);
        }

        // Pop-up Smartphone Commission Notification Card
        const cardSlide = Math.sin(tick * 2) * 3;
        ctx.fillStyle = 'rgba(17, 24, 39, 0.95)';
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 1.5;
        ctx.fillRect(18, h * 0.34 + cardSlide, w - 36, 48);
        ctx.strokeRect(18, h * 0.34 + cardSlide, w - 36, 48);

        ctx.fillStyle = '#10B981';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('✓ PIX / COMISSÃO APROVADA', 28, h * 0.34 + 19 + cardSlide);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(
          `+ R$ ${(ad.funnel.product_price_brl * 3.2).toFixed(2)}`,
          28,
          h * 0.34 + 38 + cardSlide
        );
      }

      // =======================================================================
      // PHASE 3 OVERLAY: PRODUCT OFFER MOCKUP BADGE (68% - 100% of video)
      // =======================================================================
      if (phase === 2) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = '#C084FC';
        ctx.lineWidth = 1.5;
        ctx.fillRect(16, 42, w - 32, 34);
        ctx.strokeRect(16, 42, w - 32, 34);
        ctx.fillStyle = '#C084FC';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(
          `OFERTA: R$ ${ad.funnel.product_price_brl.toFixed(2)} · ${ad.funnel.checkout_platform}`,
          26,
          63
        );
      }

      // Bottom dark gradient scrim for captions & controls
      const bottomScrim = ctx.createLinearGradient(0, h - 115, 0, h);
      bottomScrim.addColorStop(0, 'rgba(0, 0, 0, 0)');
      bottomScrim.addColorStop(0.45, 'rgba(0, 0, 0, 0.72)');
      bottomScrim.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
      ctx.fillStyle = bottomScrim;
      ctx.fillRect(0, h - 115, w, 115);

      ctx.restore();

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    animationFrameId = requestAnimationFrame(renderFrame);
    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [ad.funnel.checkout_platform, ad.funnel.product_price_brl, productInfo.sceneKey]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-black border border-neutral-800 select-none group transition-all ${
        isExpanded ? 'h-[400px]' : 'h-[310px]'
      }`}
    >
      {/* Top-Left Product & Niche Indicator Pill */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between gap-2 pointer-events-none">
        <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-[#C084FC]/50 text-[10px] font-bold text-[#D8B4FE] truncate">
          {productInfo.productTitle}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-[#9333EA]/90 text-[10px] font-extrabold text-white shrink-0">
          {productInfo.nicheBadge}
        </span>
      </div>

      {/* Interactive 60fps Product Video Stream Canvas */}
      <canvas
        ref={canvasRef}
        width={300}
        height={380}
        onClick={() => setIsPlaying((prev) => !prev)}
        className="w-full h-full object-cover cursor-pointer"
      />

      {/* Synchronized Dynamic Video Subtitle Pill (Above Controls) */}
      <div className="absolute inset-x-2.5 bottom-12 z-10 pointer-events-none flex justify-center">
        <div className="px-2.5 py-1 rounded-lg bg-black/85 border border-neutral-700/80 text-[11px] font-semibold text-white text-center leading-tight shadow-lg">
          {activeCaption}
        </div>
      </div>

      {/* Native-Style Bottom Video Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 px-3 pt-3 pb-2.5 bg-gradient-to-t from-black/95 via-black/75 to-transparent flex flex-col gap-2 z-20">
        {/* Controls Row: Play + Timecode on left | Volume + Fullscreen + 3-dots on right */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className="hover:text-[#C084FC] transition-colors cursor-pointer"
              title={isPlaying ? 'Pausar vídeo do produto' : 'Reproduzir vídeo do produto'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-white" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white" />
              )}
            </button>
            <span className="text-[11px] font-mono tabular-nums tracking-tight text-neutral-200">
              {timeDisplay}
            </span>
          </div>

          <div className="flex items-center gap-2.5 relative">
            <button
              type="button"
              onClick={() => setIsMuted((prev) => !prev)}
              className="hover:text-[#C084FC] transition-colors cursor-pointer"
              title={isMuted ? 'Ativar narração em áudio' : 'Silenciar áudio'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-[#C084FC]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="hover:text-[#C084FC] transition-colors cursor-pointer"
              title="Expandir player"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="hover:text-[#C084FC] transition-colors cursor-pointer"
              title="Opções do Vídeo"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMoreMenu && (
              <div className="absolute right-0 bottom-full mb-2 w-44 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl p-1 z-30">
                <button
                  type="button"
                  onClick={() => {
                    downloadAdCreativeCanvas(ad);
                    showToast(
                      'Copy exported · Criativo baixado',
                      `${ad.advertiser_name} (.png)`,
                      'success'
                    );
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs text-neutral-200 hover:bg-neutral-800 rounded flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#C084FC]" />
                  <span>Baixar Criativo</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadAdDossierTxt(ad);
                    showToast(
                      'Copy exported · Transcrição salva',
                      `transcricao-criativo-${ad.id}.txt`,
                      'success'
                    );
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-2.5 py-1.5 text-left text-xs text-neutral-200 hover:bg-neutral-800 rounded flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Baixar Transcrição</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Horizontal Video Scrubber Line */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
            progressRef.current = pct;
            setProgress(pct);
          }}
          className="w-full h-1 bg-neutral-600/80 rounded-full overflow-hidden cursor-pointer"
        >
          <div
            className="h-full bg-[#C084FC] transition-all duration-100"
            style={{ width: `${Math.max(10, progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
