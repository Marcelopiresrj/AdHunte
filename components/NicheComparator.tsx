'use client';

import React, { useState } from 'react';
import {
  Scale,
  ArrowUpRight,
  Compass,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { AdNiche, NICHE_BENCHMARKS, NicheBenchmark } from '@/lib/mockAdsData';

interface NicheComparatorProps {
  onSelectNicheFilter: (niche: AdNiche) => void;
}

export default function NicheComparator({ onSelectNicheFilter }: NicheComparatorProps) {
  const [nicheA, setNicheA] = useState<AdNiche>('Saúde & Estética');
  const [nicheB, setNicheB] = useState<AdNiche>('Finanças & Renda Extra');
  const [selectedVerdictNiche, setSelectedVerdictNiche] = useState<NicheBenchmark>(
    NICHE_BENCHMARKS[0]
  );

  const benchmarkA =
    NICHE_BENCHMARKS.find((b) => b.niche === nicheA) || NICHE_BENCHMARKS[0];
  const benchmarkB =
    NICHE_BENCHMARKS.find((b) => b.niche === nicheB) || NICHE_BENCHMARKS[1];

  const getScaleColorClass = (level: NicheBenchmark['scale_level']) => {
    switch (level) {
      case 'Muito Alta':
        return 'text-emerald-400 font-semibold';
      case 'Alta':
        return 'text-emerald-300 font-medium';
      case 'Moderada':
        return 'text-amber-300 font-medium';
      case 'Seletiva':
        return 'text-sky-300 font-medium';
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Comparador Estratégico de Nichos · Mercado Brasileiro
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Compare lado a lado o volume de anúncios em circulação, a longevidade média (dias
            no ar), o nível de escala e o veredito tático do AdHunter antes de alocar orçamento
            de tráfego.
          </p>
        </div>

        <div className="text-xs font-mono tabular-nums text-slate-400">
          Base Analisada: 62.210 Anúncios Ativos · Meta Ads Brasil
        </div>
      </div>

      {/* Side-by-Side Matrix Table (All Niches) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-100">
            Matriz Comparativa de Inteligência por Nicho (Clique em uma linha para ver o
            Veredito Completo)
          </h2>
          <span className="text-xs text-slate-400">
            Dados consolidados dos últimos 90 dias de leilão
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/90 border-b border-slate-800 text-xs text-slate-400">
                <th className="py-3.5 px-4 font-medium">Nicho / Categoria</th>
                <th className="py-3.5 px-4 font-medium text-right">Volume Ativo</th>
                <th className="py-3.5 px-4 font-medium text-right">Média Dias no Ar</th>
                <th className="py-3.5 px-4 font-medium text-right">Ticket Médio</th>
                <th className="py-3.5 px-4 font-medium text-right">CPM Médio (BR)</th>
                <th className="py-3.5 px-4 font-medium">Formato Dominante</th>
                <th className="py-3.5 px-4 font-medium">Nível de Escala</th>
                <th className="py-3.5 px-4 font-medium">Veredito Estratégico AdHunter</th>
                <th className="py-3.5 px-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {NICHE_BENCHMARKS.map((row) => {
                const isSelected = selectedVerdictNiche.niche === row.niche;
                return (
                  <tr
                    key={row.niche}
                    onClick={() => setSelectedVerdictNiche(row)}
                    className={`transition-colors cursor-pointer ${
                      isSelected ? 'bg-emerald-950/20' : 'hover:bg-slate-800/50'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-100 whitespace-nowrap">
                      {row.niche}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                      {row.active_ads_volume.toLocaleString('pt-BR')} ads
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-400 font-semibold">
                      {row.avg_days_active} dias
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-200">
                      R$ {row.avg_ticket_brl.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-300">
                      R$ {row.avg_cpm_brl.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {row.dominant_format} · {row.dominant_checkout}
                    </td>
                    <td className={`py-3.5 px-4 whitespace-nowrap ${getScaleColorClass(row.scale_level)}`}>
                      {row.scale_level}
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 max-w-xs">
                      <p className="line-clamp-2 leading-relaxed">{row.adhunter_verdict}</p>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectNicheFilter(row.niche);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-950 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 border border-slate-800 font-medium transition-colors cursor-pointer"
                      >
                        <span>Espionar</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Strategic Verdict Spotlight + Head-to-Head Confrontation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 cols: Selected Niche Deep Strategic Verdict */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">
                  Dossiê Estratégico: {selectedVerdictNiche.niche}
                </h3>
              </div>
              <span className="text-xs font-mono tabular-nums text-emerald-400">
                Média {selectedVerdictNiche.avg_days_active}d Ativo
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-400 block">
                Veredito do AdHunter para o Anunciante
              </span>
              <p className="text-sm text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
                {selectedVerdictNiche.adhunter_verdict}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 block">
                  Estrutura de Funil Vencedora
                </span>
                <p className="text-xs font-semibold text-emerald-400 mt-1 leading-relaxed">
                  {selectedVerdictNiche.winning_funnel_structure}
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-400 block">
                  Nível de Saturação no Leilão
                </span>
                <p className="text-xs font-semibold text-slate-200 mt-1 leading-relaxed">
                  {selectedVerdictNiche.competition_saturation}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 block">
                Ângulo de Gancho (Hook) Recomendado
              </span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {selectedVerdictNiche.recommended_hook_angle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onSelectNicheFilter(selectedVerdictNiche.niche)}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              Filtrar Biblioteca por {selectedVerdictNiche.niche}
            </span>
          </button>
        </div>

        {/* Right 6 cols: Interactive Head-to-Head Confrontation (Nicho A vs Nicho B) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <h3 className="text-base font-bold text-slate-100">
                Confronto Direto Lado a Lado (Nicho A vs. Nicho B)
              </h3>
            </div>
            <TrendingUp className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nicho A</label>
              <select
                value={nicheA}
                onChange={(e) => setNicheA(e.target.value as AdNiche)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {NICHE_BENCHMARKS.map((n) => (
                  <option key={n.niche} value={n.niche}>
                    {n.niche}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Nicho B</label>
              <select
                value={nicheB}
                onChange={(e) => setNicheB(e.target.value as AdNiche)}
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

          {/* Comparison Bars / Metrics */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-3 items-center text-xs">
              <div className="font-mono tabular-nums font-semibold text-emerald-400">
                {benchmarkA.active_ads_volume.toLocaleString('pt-BR')} ads
              </div>
              <div className="text-center text-slate-400">Volume de Anúncios</div>
              <div className="text-right font-mono tabular-nums font-semibold text-slate-200">
                {benchmarkB.active_ads_volume.toLocaleString('pt-BR')} ads
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-3 items-center text-xs">
              <div className="font-mono tabular-nums font-semibold text-emerald-400">
                {benchmarkA.avg_days_active} dias no ar
              </div>
              <div className="text-center text-slate-400">Longevidade Média</div>
              <div className="text-right font-mono tabular-nums font-semibold text-slate-200">
                {benchmarkB.avg_days_active} dias no ar
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-3 items-center text-xs">
              <div className="font-mono tabular-nums font-semibold text-slate-100">
                R$ {benchmarkA.avg_cpm_brl.toFixed(2)}
              </div>
              <div className="text-center text-slate-400">CPM Médio (Custo/Mil)</div>
              <div className="text-right font-mono tabular-nums font-semibold text-slate-100">
                R$ {benchmarkB.avg_cpm_brl.toFixed(2)}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-3 items-center text-xs">
              <div className="font-mono tabular-nums font-semibold text-slate-100">
                R$ {benchmarkA.avg_ticket_brl.toLocaleString('pt-BR')}
              </div>
              <div className="text-center text-slate-400">Ticket Médio</div>
              <div className="text-right font-mono tabular-nums font-semibold text-slate-100">
                R$ {benchmarkB.avg_ticket_brl.toLocaleString('pt-BR')}
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-3 items-center text-xs">
              <div className="font-semibold text-emerald-400">
                {benchmarkA.dominant_checkout}
              </div>
              <div className="text-center text-slate-400">Checkout Dominante</div>
              <div className="text-right font-semibold text-slate-200">
                {benchmarkB.dominant_checkout}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
