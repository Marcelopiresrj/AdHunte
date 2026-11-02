'use client';

import React, { useState } from 'react';
import {
  X,
  SearchCode,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  CreditCard,
  Activity,
  Layers,
} from 'lucide-react';
import { AdItem } from '@/lib/mockAdsData';
import { downloadAdDossierTxt } from './AdCreativePreview';
import { useToast } from './ToastProvider';

interface FunnelXRayModalProps {
  ad: AdItem | null;
  onClose: () => void;
  onSwitchToCopyModeler: (ad: AdItem) => void;
}

export default function FunnelXRayModal({
  ad,
  onClose,
  onSwitchToCopyModeler,
}: FunnelXRayModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const { showToast } = useToast();

  if (!ad) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(ad.funnel.landing_page_url);
    setCopiedUrl(true);
    showToast(
      'Copy exported · URL copiada',
      ad.funnel.landing_page_url,
      'info'
    );
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const monthlySpendEstimate = ad.funnel.estimated_daily_spend_brl * 30;
  const estimatedMonthlyRevenue = monthlySpendEstimate * ad.funnel.estimated_roas;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <SearchCode className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Raio-X do Funil & Engenharia de Checkout
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Operação Mapeada: <span className="text-slate-200">{ad.advertiser_name}</span> ·{' '}
              <span className="font-mono tabular-nums text-emerald-400">
                {ad.library_id}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Top Financial Telemetry Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Ticket Principal</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-100 mt-1 block">
                R$ {ad.funnel.product_price_brl.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Gasto Diário Est.</span>
              <span className="text-base font-bold font-mono tabular-nums text-emerald-400 mt-1 block">
                R$ {ad.funnel.estimated_daily_spend_brl.toLocaleString('pt-BR')}/dia
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">ROAS Estimado</span>
              <span className="text-base font-bold font-mono tabular-nums text-slate-100 mt-1 block">
                {ad.funnel.estimated_roas.toFixed(2)}x
              </span>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">Faturamento 30D Est.</span>
              <span className="text-base font-bold font-mono tabular-nums text-emerald-300 mt-1 block">
                R$ {(estimatedMonthlyRevenue / 1000).toFixed(0)}k/mês
              </span>
            </div>
          </div>

          {/* Landing Page URL & Checkout Tech */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>
                  Checkout Detectado:{' '}
                  <strong className="text-slate-100">{ad.funnel.checkout_platform}</strong>
                </span>
                <span aria-hidden="true">·</span>
                <span>
                  Arquitetura: <strong className="text-emerald-400">{ad.funnel.funnel_type}</strong>
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Tráfego: {ad.funnel.traffic_temperature}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200">
              <span className="truncate">{ad.funnel.landing_page_url}</span>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 cursor-pointer"
                >
                  {copiedUrl ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">URL Copiada</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Visual Step-by-Step Funnel Flow */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Fluxo de Monetização & Maximização de LTV (AOV)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>ETAPA 01</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
                <p className="text-xs font-semibold text-slate-100">
                  Atração & Qualificação ({ad.format})
                </p>
                <p className="text-xs text-slate-400">
                  {ad.active_adsets} conjuntos ativos enviando tráfego para{' '}
                  {ad.funnel.funnel_type}.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-emerald-400 font-mono">
                  <span>ETAPA 02 · ORDER BUMPS</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-xs font-semibold text-slate-100">
                  Aumento de Ticket no Checkout
                </p>
                <ul className="text-xs text-slate-300 space-y-1 pt-1">
                  {ad.funnel.order_bumps.map((bump, i) => (
                    <li key={i} className="truncate">
                      + {bump}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                  <span>ETAPA 03 · PÓS-COMPRA</span>
                </div>
                <p className="text-xs font-semibold text-slate-100">
                  Oferta de Upsell Imediato
                </p>
                <p className="text-xs text-slate-300 pt-1">{ad.funnel.upsell_offer}</p>
              </div>
            </div>
          </div>

          {/* Pixel Events Tracked */}
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Eventos do Pixel Meta Detectados:</span>
            </div>
            <div className="font-mono text-slate-200">
              {ad.funnel.pixel_events_detected.join('  ·  ')}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => downloadAdDossierTxt(ad)}
              className="px-4 py-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Exportar Dossiê Completo (.TXT)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onSwitchToCopyModeler(ad);
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs cursor-pointer"
            >
              Modelar Copy Deste Funil com IA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
