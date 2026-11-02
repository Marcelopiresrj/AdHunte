'use client';

import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import {
  AdItem,
  AdNiche,
  AdFormat,
  CheckoutPlatform,
  NICHE_BENCHMARKS,
} from '@/lib/mockAdsData';

interface NewAdImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAd: (newAd: AdItem) => void;
}

export default function NewAdImportModal({
  isOpen,
  onClose,
  onAddAd,
}: NewAdImportModalProps) {
  const [advertiserName, setAdvertiserName] = useState('');
  const [niche, setNiche] = useState<AdNiche>('Saúde & Estética');
  const [format, setFormat] = useState<AdFormat>('Vídeo VSL');
  const [daysActive, setDaysActive] = useState(45);
  const [activeAdsets, setActiveAdsets] = useState(20);
  const [checkoutPlatform, setCheckoutPlatform] =
    useState<CheckoutPlatform>('Kiwify');
  const [priceBrl, setPriceBrl] = useState(147);
  const [landingPageUrl, setLandingPageUrl] = useState('https://ofertaexemplo.com.br/vsl');
  const [hookText, setHookText] = useState('');
  const [headline, setHeadline] = useState('');
  const [originalCopy, setOriginalCopy] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!advertiserName.trim() || !originalCopy.trim()) return;

    const calculatedScale = Math.min(
      99,
      Math.max(55, Math.round(daysActive * 0.6 + activeAdsets * 1.4))
    );

    const newAd: AdItem = {
      id: `ad-br-custom-${Date.now()}`,
      library_id: `META-BR-${Math.floor(10000000 + Math.random() * 89999999)}`,
      advertiser_name: advertiserName.trim(),
      advertiser_handle: `@${advertiserName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 16)}.oficial`,
      verified_advertiser: true,
      niche,
      format,
      days_active: Number(daysActive) || 30,
      active_adsets: Number(activeAdsets) || 12,
      scale_score: calculatedScale,
      original_copy: originalCopy.trim(),
      headline:
        headline.trim() ||
        `Oferta Validada · ${advertiserName.trim()} (${daysActive} Dias no Ar)`,
      cta_text: 'Saiba Mais',
      captured_at: 'Importado manualmente hoje',
      country: 'Brasil (BR)',
      platforms: ['Instagram', 'Facebook'],
      visual: {
        accentHex: '#10B981',
        secondaryHex: '#0F172A',
        hookOverlayText:
          hookText.trim() ||
          `“Hook capturado da operação ${advertiserName.trim()}...”`,
        subHookText: `Criativo ${format} · ${activeAdsets} conjuntos ativos`,
        durationLabel: format.includes('Vídeo') || format.includes('Reels') ? '02:10' : 'Estático',
        aspectRatioLabel: format === 'Reels / UGC' ? '9:16 Vertical' : '4:5 Feed',
        visualTheme: 'serum',
      },
      funnel: {
        landing_page_url: landingPageUrl.trim() || 'https://sualandingpage.com.br',
        checkout_platform: checkoutPlatform,
        funnel_type: 'VSL Direta',
        product_price_brl: Number(priceBrl) || 147,
        estimated_daily_spend_brl: Math.max(1500, activeAdsets * 320),
        estimated_roas: 2.5,
        order_bumps: ['Order Bump Complementar (+R$ 29,90)', 'Acesso VIP Acelerador (+R$ 37,00)'],
        upsell_offer: 'Protocolo Avançado / Mentoria (R$ 297,00)',
        pixel_events_detected: ['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase'],
        traffic_temperature: 'Frio (Escala Aberta)',
      },
    };

    onAddAd(newAd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">
              Importar Novo Anúncio da Biblioteca Meta Ads
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Nome do Anunciante / Operação *
              </label>
              <input
                type="text"
                required
                value={advertiserName}
                onChange={(e) => setAdvertiserName(e.target.value)}
                placeholder="Ex: VitaPrime Suplementos BR"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Categoria / Nicho
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value as AdNiche)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {NICHE_BENCHMARKS.map((n) => (
                  <option key={n.niche} value={n.niche}>
                    {n.niche}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">Formato</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as AdFormat)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Vídeo VSL">Vídeo VSL</option>
                <option value="Reels / UGC">Reels / UGC</option>
                <option value="Imagem Estática">Imagem Estática</option>
                <option value="Carrossel">Carrossel</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Dias Ativo</label>
              <input
                type="number"
                min={1}
                value={daysActive}
                onChange={(e) => setDaysActive(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Conj. Ativos</label>
              <input
                type="number"
                min={1}
                value={activeAdsets}
                onChange={(e) => setActiveAdsets(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">Checkout</label>
              <select
                value={checkoutPlatform}
                onChange={(e) => setCheckoutPlatform(e.target.value as CheckoutPlatform)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Kiwify">Kiwify</option>
                <option value="Hotmart">Hotmart</option>
                <option value="Kirvano">Kirvano</option>
                <option value="PerfectPay">PerfectPay</option>
                <option value="Yampi">Yampi</option>
                <option value="Cartpanda">Cartpanda</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                URL da Página de Destino
              </label>
              <input
                type="url"
                value={landingPageUrl}
                onChange={(e) => setLandingPageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Ticket do Produto (R$)
              </label>
              <input
                type="number"
                min={1}
                value={priceBrl}
                onChange={(e) => setPriceBrl(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Gancho Visual (Primeiros 3 Segundos) / Headline
            </label>
            <input
              type="text"
              value={hookText}
              onChange={(e) => {
                setHookText(e.target.value);
                setHeadline(e.target.value);
              }}
              placeholder="Ex: O erro nº 1 que faz você perder vendas no WhatsApp..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">
              Copy Original do Anúncio *
            </label>
            <textarea
              rows={3}
              required
              value={originalCopy}
              onChange={(e) => setOriginalCopy(e.target.value)}
              placeholder="Cole aqui o texto completo do anúncio capturado na Biblioteca de Anúncios da Meta para modelar com IA..."
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs cursor-pointer"
            >
              Adicionar à Biblioteca & Modelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
