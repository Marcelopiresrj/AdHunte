'use client';

import React, { useState, useMemo } from 'react';
import {
  Check,
  Download,
  FileText,
  Sparkles,
  Bookmark,
  SearchCode,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AdItem } from '@/lib/mockAdsData';
import AdCreativePreview, {
  downloadAdCreativeCanvas,
  downloadAdDossierTxt,
} from './AdCreativePreview';
import { useToast } from './ToastProvider';

interface AdCardProps {
  ad: AdItem;
  isFavorite: boolean;
  onToggleFavorite: (ad: AdItem) => void;
  onOpenCopyModeler: (ad: AdItem) => void;
  onOpenFunnelXRay: (ad: AdItem) => void;
}

interface SparklinePoint {
  dayLabel: string;
  dayNumber: number;
  activeAdsets: number;
  scaleScore: number;
}

function buildAdTrendSeries(ad: AdItem): SparklinePoint[] {
  const checkpoints = [0.1, 0.25, 0.42, 0.6, 0.78, 0.9, 1.0];
  const seed = ad.id.charCodeAt(ad.id.length - 1) || 5;

  return checkpoints.map((ratio, idx) => {
    const dayNumber = Math.max(1, Math.round(ad.days_active * ratio));
    const curveFactor = Math.pow(ratio, 0.82);
    const jitter = idx === checkpoints.length - 1 ? 0 : ((seed + idx * 3) % 4) - 1;
    const activeAdsets =
      idx === checkpoints.length - 1
        ? ad.active_adsets
        : Math.max(1, Math.round(ad.active_adsets * curveFactor + jitter));

    const scaleScore =
      idx === checkpoints.length - 1
        ? ad.scale_score
        : Math.min(99, Math.max(40, Math.round(ad.scale_score * (0.6 + 0.4 * ratio))));

    return {
      dayLabel: `Dia ${dayNumber}`,
      dayNumber,
      activeAdsets,
      scaleScore,
    };
  });
}

export default function AdCard({
  ad,
  isFavorite,
  onToggleFavorite,
  onOpenCopyModeler,
  onOpenFunnelXRay,
}: AdCardProps) {
  const [expandedCopy, setExpandedCopy] = useState(false);
  const { showToast } = useToast();

  const trendData = useMemo(() => buildAdTrendSeries(ad), [ad]);
  const gradientId = `radar-spark-${ad.id}`;

  const domainLabel =
    ad.visual.domainDisplay ||
    ad.funnel.landing_page_url.replace(/^https?:\/\//, '').split('/')[0];

  const publishedDate = ad.visual.publishedDateLabel || ad.captured_at;

  return (
    <article className="bg-[#15171C] border border-neutral-800/90 rounded-2xl p-3.5 flex flex-col justify-between transition-colors hover:border-[#C084FC]/50">
      <div className="space-y-2.5">
        {/* 1. Top Row: "✓ Ativo" Light Badge + Bookmark Star */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-950 text-[11px] font-bold">
            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
            <span>Ativo</span>
          </div>

          <button
            type="button"
            onClick={() => onToggleFavorite(ad)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isFavorite
                ? 'text-[#C084FC]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
            title={isFavorite ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
          >
            <Bookmark
              className={`w-4 h-4 ${isFavorite ? 'fill-[#C084FC]' : ''}`}
            />
          </button>
        </div>

        {/* 2. Full-Width Rounded Bar: "X Anúncios utilizam este criativo" */}
        <div className="w-full py-1.5 px-3 rounded-full bg-[#22252D] border border-neutral-700/60 text-center text-xs font-bold text-neutral-100 tabular-nums">
          {ad.active_adsets}{' '}
          {ad.active_adsets === 1
            ? 'anúncio utiliza este criativo'
            : 'Anúncios utilizam este criativo'}
        </div>

        {/* 3. Centered "X Dias ativo" in Green + Interactive Recharts Sparkline in Lilac */}
        <div className="text-center space-y-1">
          <div className="text-xs font-extrabold text-emerald-400 tabular-nums">
            {ad.days_active} Dias ativo
          </div>

          {/* Compact Recharts Sparkline visualizing days_active trend */}
          <div className="h-8 w-full px-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 2, right: 2, left: 2, bottom: 0 }}
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C084FC" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C084FC" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="dayLabel" hide />
                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip
                  cursor={{ stroke: '#52525B', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const pt = payload[0].payload as SparklinePoint;
                    return (
                      <div className="bg-neutral-950 border border-neutral-700 px-2 py-1 rounded text-[10px] font-mono tabular-nums text-white shadow-lg">
                        <span className="text-[#C084FC] font-bold">{pt.dayLabel}</span>:{' '}
                        {pt.activeAdsets} ads ({pt.scaleScore}%)
                      </div>
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="activeAdsets"
                  stroke="#C084FC"
                  strokeWidth={1.75}
                  fill={`url(#${gradientId})`}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Two-Column Row: Plataformas (Left) & Publicado (Right) in Lilac */}
        <div className="grid grid-cols-2 gap-2 pt-1 pb-2 border-b border-neutral-800/80 text-center">
          <div>
            <span className="text-[11px] font-medium text-[#C084FC] block mb-1">
              Plataformas
            </span>
            <div className="flex items-center justify-center gap-1.5">
              <span
                className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-950 text-[10px] font-extrabold flex items-center justify-center"
                title="Facebook"
              >
                f
              </span>
              <span
                className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-950 text-[9px] font-bold flex items-center justify-center"
                title="Instagram"
              >
                ◎
              </span>
              {ad.platforms.length > 2 && (
                <span
                  className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-950 text-[9px] font-bold flex items-center justify-center"
                  title="Messenger"
                >
                  ⚡
                </span>
              )}
              {ad.platforms.length > 3 && (
                <span
                  className="w-4 h-4 rounded-full bg-neutral-200 text-neutral-950 text-[9px] font-bold flex items-center justify-center"
                  title="Audience Network"
                >
                  ◈
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium text-[#C084FC] block mb-1">
              Publicado
            </span>
            <span className="text-xs font-bold text-white tabular-nums">
              {publishedDate}
            </span>
          </div>
        </div>

        {/* 5. Advertiser Profile Row */}
        <div className="flex items-center gap-2.5 pt-0.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 border border-white/15"
            style={{ backgroundColor: ad.visual.avatarBgHex || '#9333EA' }}
          >
            {ad.visual.avatarInitials ||
              ad.advertiser_name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-white truncate">
              {ad.advertiser_name}
            </h3>
            <p className="text-[11px] text-neutral-400 truncate">{domainLabel}</p>
          </div>
        </div>

        {/* 6. Bold 1-Line Hook Title right above the video */}
        <p className="text-xs font-bold text-white truncate pt-0.5">
          {ad.headline}
        </p>

        {/* 7. Vertical Portrait Video Player */}
        <AdCreativePreview ad={ad} />

        {/* 8. Copy Preview + Brand/Saiba mais Bar */}
        <div className="space-y-2 pt-1">
          <p
            onClick={() => setExpandedCopy((prev) => !prev)}
            className={`text-xs text-neutral-300 leading-relaxed cursor-pointer ${
              expandedCopy ? '' : 'line-clamp-2'
            }`}
            title="Clique para expandir/recolher a copy"
          >
            {ad.original_copy}
          </p>

          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-xs font-bold text-white truncate">
              {ad.advertiser_name.split('·')[0].trim()}
            </span>

            <button
              type="button"
              onClick={() => onOpenFunnelXRay(ad)}
              className="px-3 py-1.5 rounded-lg bg-[#1E2028] hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {ad.cta_text || 'Saiba mais'}
            </button>
          </div>
        </div>
      </div>

      {/* 9. Bottom Action Buttons */}
      <div className="pt-2.5 mt-2.5 border-t border-neutral-800/90 space-y-1.5">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => {
              downloadAdCreativeCanvas(ad);
              showToast(
                'Copy exported · Criativo baixado',
                `${ad.advertiser_name} (.PNG)`,
                'success'
              );
            }}
            className="py-1.5 px-2 rounded-lg bg-[#1C1E26] hover:bg-neutral-800 border border-neutral-800 text-[11px] font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-[#C084FC] shrink-0" />
            <span>Baixar criativo</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadAdDossierTxt(ad);
              showToast(
                'Copy exported · Transcrição salva',
                `Dossiê completo de ${ad.advertiser_name} (.TXT)`,
                'info'
              );
            }}
            className="py-1.5 px-2 rounded-lg bg-[#1C1E26] hover:bg-neutral-800 border border-neutral-800 text-[11px] font-medium text-neutral-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>Baixar transcrição</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-1.5">
          <button
            type="button"
            onClick={() => onOpenFunnelXRay(ad)}
            className="col-span-4 py-1.5 px-2 rounded-lg bg-[#1C1E26] hover:bg-neutral-800 border border-neutral-800 text-[11px] font-medium text-neutral-300 flex items-center justify-center gap-1 transition-colors cursor-pointer whitespace-nowrap"
          >
            <SearchCode className="w-3.5 h-3.5 text-[#C084FC] shrink-0" />
            <span>Raio-X</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenCopyModeler(ad)}
            className="col-span-8 py-1.5 px-2.5 rounded-lg bg-[#C084FC] hover:bg-[#D8B4FE] text-neutral-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Modelar Copy com IA</span>
          </button>
        </div>
      </div>
    </article>
  );
}
