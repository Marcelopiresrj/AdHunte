'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Video,
  FileText,
  Copy,
  Check,
  BookmarkCheck,
  Loader2,
  AlertTriangle,
  Wand2,
} from 'lucide-react';
import { AdItem, AiCopyVariationResult } from '@/lib/mockAdsData';
import { useToast } from './ToastProvider';

interface CopyModelerModalProps {
  ad: AdItem | null;
  onClose: () => void;
  onSaveAiVariation: (adId: string, variation: AiCopyVariationResult) => void;
}

function buildDeterministicVariation(
  ad: AdItem,
  productName: string,
  targetAudience: string
): AiCopyVariationResult {
  const offerLabel = productName.trim() || `Método ${ad.niche.split(' ')[0]} Pro`;
  const audienceLabel =
    targetAudience.trim() || `público qualificado de ${ad.niche.toLowerCase()}`;

  return {
    analysis: {
      dominantTrigger:
        'Descoberta Contraintuitiva + Inimigo Comum (Quebra de Crença Tradicional)',
      corePromise: ad.headline,
      uniqueMechanism: `Mecanismo proprietário validado por ${ad.days_active} dias no leilão com ${ad.active_adsets} conjuntos ativos.`,
      complianceRiskLevel:
        ad.niche === 'Saúde & Estética' || ad.niche === 'Finanças & Renda Extra'
          ? 'Alto (Requer Blindagem)'
          : 'Moderado',
      complianceNotes:
        'Evitar perguntas diretas sobre condições pessoais sensíveis ("Você está endividado?", "Sofre com...") e substituir garantias absolutas de prazo por estudos de caso ou médias observadas.',
    },
    frameworks: {
      aida: {
        title: 'Framework AIDA (Atenção · Interesse · Desejo · Ação)',
        headline: `${offerLabel}: O Novo Padrão que Está Substituindo Métodos Antigos`,
        body: `[ATENÇÃO] Por que 87% do ${audienceLabel} continua tentando resolver isso do jeito mais caro e demorado?\n\n[INTERESSE] Enquanto a maioria insiste em soluções superficiais, um novo protocolo estruturado no ${offerLabel} ataca diretamente a causa raiz em fração do tempo.\n\n[DESEJO] Imagine aplicar exatamente a mesma engenharia validada por milhares de brasileiros sem precisar depender de tentativa e erro.\n\n[AÇÃO] Toque no botão abaixo e acesse a apresentação oficial enquanto o acesso promocional está liberado.`,
        cta: ad.cta_text,
      },
      pas: {
        title: 'Framework PAS (Problema · Agitação · Solução)',
        headline: 'O Erro Silencioso que Trava Seus Resultados Todos os Dias',
        body: `[PROBLEMA] Tentar evoluir em ${ad.niche} usando estratégias genéricas de 3 anos atrás é o caminho mais rápido para a frustração.\n\n[AGITAÇÃO] Cada semana que passa sem um processo validado significa mais tempo, energia e dinheiro desperdiçados enquanto o mercado avança.\n\n[SOLUÇÃO] Foi exatamente para estancar esse ciclo que criamos o ${offerLabel}: um passo a passo direto ao ponto, desenhado para ${audienceLabel} destravar resultados reais logo nos primeiros dias.`,
        cta: 'Ver Passo a Passo Agora',
      },
      hookStoryOffer: {
        title: 'Framework HSO (Hook · Story · Offer)',
        headline: `Como Descobrimos o Mecanismo por Trás do ${offerLabel}`,
        body: `[HOOK] Ninguém acreditou quando mostramos que bastava ajustar um único detalhe na rotina para mudar completamente o jogo.\n\n[STORY] Depois de analisar centenas de casos reais no Brasil, percebemos que o problema nunca foi falta de esforço do ${audienceLabel} — era a ausência de um sistema replicável.\n\n[OFFER] Hoje você pode acessar o ${offerLabel} completo + bônus de implementação rápida com garantia incondicional. Clique em Saiba Mais para começar agora.`,
        cta: 'Liberar Meu Acesso Com Bônus',
      },
    },
    antiBlockVersion: {
      safeHeadline: `Conheça a Metodologia ${offerLabel} Aplicada por Especialistas no Brasil`,
      safeBody: `Estudos recentes e testes práticos revelam por que abordagens tradicionais de ${ad.niche.toLowerCase()} costumam perder eficiência ao longo do tempo. O sistema ${offerLabel} apresenta uma estrutura atualizada e prática para quem busca consistência e previsibilidade. Toque em Saiba Mais para assistir à demonstração explicativa.`,
      replacedTerms: [
        {
          original: 'Pergunta direta em 2ª pessoa ("Você sofre com...")',
          safeReplacement: 'Afirmação em 3ª pessoa ("Quem busca otimizar...")',
          reason:
            'Evita flag automático de Atributos Pessoais nas políticas de anúncios da Meta.',
        },
        {
          original: 'Promessa com prazo fixo agressivo ("Resultado garantido em X dias")',
          safeReplacement: 'Ancoragem em método ("Protocolo estruturado em etapas claras")',
          reason:
            'Reduz risco de reprovação por promessa enganosa ou irrealista em contas novas.',
        },
        {
          original: 'Termos absolutos ("100% garantido / Sem esforço")',
          safeReplacement: 'Termos de eficiência ("Processo simplificado e validado")',
          reason:
            'Protege o score de qualidade da página e mantém o CPM estável na escala.',
        },
      ],
    },
    videoScript: {
      hook_0_3s: `[00–03s | GANCHO VISUAL + QUEBRA DE PADRÃO]\n(Câmera próxima ou demonstração visual imediata na tela)\n"Para tudo o que você está fazendo se você ainda tenta resolver [dor principal de ${ad.niche}] do jeito antigo..."`,
      agitation_3_15s: `[03–15s | AGITAÇÃO & IDENTIFICAÇÃO]\n(Cortes dinâmicos a cada 2.5s + legenda destacada em esmeralda)\n"A verdade é que 9 em cada 10 pessoas perdem semanas batendo cabeça simplesmente porque ignoram o que acontece nos bastidores. Olha só essa comparação na prática..."`,
      mechanism_15_35s: `[15–35s | APRESENTAÇÃO DO MECANISMO ÚNICO (${offerLabel})]\n(Mostra a solução / tela / produto em ação)\n"Quando você ativa o protocolo do ${offerLabel}, você substitui o esforço manual por uma estrutura que já foi validada. É simples, direto e qualquer pessoa do ${audienceLabel} consegue aplicar hoje mesmo."`,
      offer_cta_35_45s: `[35–45s | OFERTA IRRESISTÍVEL & CHAMADA PARA AÇÃO]\n(Aponta para o botão inferior esquerdo do criativo)\n"Eu gravei uma apresentação rápida mostrando o passo a passo completo. Toque em '${ad.cta_text}' aqui embaixo antes que essa condição saia do ar."`,
      visualDirectionNotes: `Formato recomendado: ${ad.visual.aspectRatioLabel}. Utilize legendas com alto contraste (branco/esmeralda), B-roll demonstrativo nos primeiros 3 segundos e evite música de fundo mais alta que -18dB.`,
    },
  };
}

export default function CopyModelerModal({
  ad,
  onClose,
  onSaveAiVariation,
}: CopyModelerModalProps) {
  const [customProductName, setCustomProductName] = useState('');
  const [customTargetAudience, setCustomTargetAudience] = useState('');
  const [customTone, setCustomTone] = useState('Resposta Direta Agressiva & Escala');
  const [activeTab, setActiveTab] = useState<'frameworks' | 'antiblock' | 'script'>(
    'frameworks'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<AiCopyVariationResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedToSwipe, setSavedToSwipe] = useState(false);
  const { showToast } = useToast();

  if (!ad) return null;

  const handleCopyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(
      'Copy exported',
      `Variação (${key.toUpperCase()}) copiada para a área de transferência`,
      'ai'
    );
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateWithGemini = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSavedToSwipe(false);

    try {
      const response = await fetch('/api/copy-modeler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalCopy: ad.original_copy,
          headline: ad.headline,
          niche: ad.niche,
          format: ad.format,
          daysActive: ad.days_active,
          customProductName,
          customTargetAudience,
          customTone,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Falha na comunicação com o motor Gemini.');
      }

      setResult(data.result);
      showToast(
        'Modelagem de Copy concluída',
        'Frameworks AIDA, PAS, HSO e Roteiro gerados com IA',
        'ai'
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Erro ao chamar API Gemini. Verifique sua chave em Settings > Secrets.';
      setErrorMessage(msg);
      const fallback = buildDeterministicVariation(
        ad,
        customProductName,
        customTargetAudience
      );
      setResult(fallback);
      showToast(
        'Copy modelada com sucesso',
        'Variações prontas para exportação',
        'ai'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstantLocalModel = () => {
    setErrorMessage(null);
    setSavedToSwipe(false);
    const generated = buildDeterministicVariation(
      ad,
      customProductName,
      customTargetAudience
    );
    setResult(generated);
    showToast(
      'Template Direct Response gerado',
      'Variações AIDA, PAS, Anti-Bloqueio e Roteiro prontas',
      'ai'
    );
  };

  const handleSaveToFavorites = () => {
    if (!result) return;
    onSaveAiVariation(ad.id, result);
    setSavedToSwipe(true);
    showToast(
      'Ad added to favorites',
      `Variações de IA de ${ad.advertiser_name} salvas no Swipe File`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-950/60">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="text-lg font-bold text-slate-100">
                Modelador de Copy com IA · Engenharia Reversa
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Anúncio Base: <span className="text-slate-200">{ad.advertiser_name}</span> ·{' '}
              <span className="font-mono tabular-nums text-emerald-400">
                {ad.days_active} dias ativo
              </span>{' '}
              · {ad.niche}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Original Copy Reference Box */}
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800/90 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Copy Vencedora Original (Referência de Modelagem)</span>
              <span className="font-mono tabular-nums">
                Score de Escala: {ad.scale_score}/100
              </span>
            </div>
            <p className="text-xs font-semibold text-emerald-400">{ad.headline}</p>
            <p className="text-xs text-slate-300 leading-relaxed">{ad.original_copy}</p>
          </div>

          {/* Input Customization Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Nome do Seu Produto / Oferta (Opcional)
              </label>
              <input
                type="text"
                value={customProductName}
                onChange={(e) => setCustomProductName(e.target.value)}
                placeholder="Ex: Protocolo LipoNatural 30D"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Público-Alvo Específico (Opcional)
              </label>
              <input
                type="text"
                value={customTargetAudience}
                onChange={(e) => setCustomTargetAudience(e.target.value)}
                placeholder="Ex: Mulheres 35+ ou Donos de Clínicas"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ângulo de Persuasão
              </label>
              <select
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="Resposta Direta Agressiva & Escala">
                  Resposta Direta & Alta Conversão
                </option>
                <option value="Científico / Autoridade Técnica">
                  Científico / Autoridade Técnica
                </option>
                <option value="Storytelling Conversacional UGC">
                  Storytelling Conversacional (UGC)
                </option>
                <option value="Ultra Conservador Anti-Bloqueio">
                  Ultra Conservador (Conta Nova Meta Ads)
                </option>
              </select>
            </div>
          </div>

          {/* Generation Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleGenerateWithGemini}
                disabled={isLoading}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-slate-950 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Modelando com Gemini IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar Variações com Gemini IA</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleInstantLocalModel}
                disabled={isLoading}
                className="px-3.5 py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Modelagem Rápida (Template DR)</span>
              </button>
            </div>

            {result && (
              <button
                type="button"
                onClick={handleSaveToFavorites}
                className={`px-3.5 py-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  savedToSwipe
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-emerald-500/50'
                }`}
              >
                <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {savedToSwipe
                    ? 'Salvo no Swipe File!'
                    : 'Salvar Variações no Swipe File'}
                </span>
              </button>
            )}
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">
                  Aviso da API Gemini ({errorMessage.slice(0, 110)})
                </p>
                <p className="text-amber-300/90">
                  Carregamos automaticamente a matriz de engenharia reversa de resposta
                  direta abaixo para você continuar trabalhando sem interrupção. Você pode
                  configurar uma chave com faturamento ativo no painel Settings &gt; Secrets.
                </p>
              </div>
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-5 pt-2 border-t border-slate-800">
              {/* Psychological Diagnosis Strip */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
                <div>
                  <span className="text-xs text-slate-400 block">Gatilho Dominante</span>
                  <span className="text-xs font-semibold text-slate-100 mt-0.5 block">
                    {result.analysis.dominantTrigger}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">Mecanismo Único</span>
                  <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">
                    {result.analysis.uniqueMechanism}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block">
                    Risco de Bloqueio (Copy Original)
                  </span>
                  <span className="text-xs font-semibold text-amber-300 mt-0.5 block">
                    {result.analysis.complianceRiskLevel} — {result.analysis.complianceNotes}
                  </span>
                </div>
              </div>

              {/* Segmented Controls for Output Mode */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab('frameworks')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'frameworks'
                      ? 'bg-emerald-600 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Frameworks AIDA · PAS · HSO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('antiblock')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'antiblock'
                      ? 'bg-emerald-600 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Blindagem Anti-Bloqueio Meta Ads</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('script')}
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    activeTab === 'script'
                      ? 'bg-emerald-600 text-slate-950 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Roteiro Reels / TikTok / VSL</span>
                </button>
              </div>

              {/* TAB 1: FRAMEWORKS AIDA, PAS, HOOK-STORY-OFFER */}
              {activeTab === 'frameworks' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(
                    [
                      { key: 'aida', data: result.frameworks.aida },
                      { key: 'pas', data: result.frameworks.pas },
                      { key: 'hso', data: result.frameworks.hookStoryOffer },
                    ] as const
                  ).map(({ key, data }) => (
                    <div
                      key={key}
                      className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-emerald-400">
                            {data.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                key,
                                `${data.headline}\n\n${data.body}\n\nCTA: ${data.cta}`
                              )
                            }
                            className="text-xs text-slate-400 hover:text-slate-100 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                          >
                            {copiedKey === key ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copiado</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="text-xs font-semibold text-slate-100 bg-slate-900 p-2.5 rounded border border-slate-800">
                          {data.headline}
                        </p>

                        <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                          {data.body}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Botão CTA:</span>
                        <span className="font-semibold text-emerald-400">{data.cta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 2: ANTI-BLOCK META ADS REWRITE */}
              {activeTab === 'antiblock' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400">
                        Versão Blindada p/ Aprovação Imediata no Meta Ads
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyText(
                            'antiblock',
                            `${result.antiBlockVersion.safeHeadline}\n\n${result.antiBlockVersion.safeBody}`
                          )
                        }
                        className="text-xs text-slate-300 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'antiblock' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copiada</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Copy Blindada</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-sm font-semibold text-slate-100">
                      Headline Segura: {result.antiBlockVersion.safeHeadline}
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                      {result.antiBlockVersion.safeBody}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-800 text-slate-400">
                          <th className="py-2.5 px-3 font-medium">Padrão de Risco Original</th>
                          <th className="py-2.5 px-3 font-medium">Substituição Blindada</th>
                          <th className="py-2.5 px-3 font-medium">Regra de Compliance Meta</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70 bg-slate-900/60">
                        {result.antiBlockVersion.replacedTerms.map((item, idx) => (
                          <tr key={idx}>
                            <td className="py-2.5 px-3 text-rose-300">{item.original}</td>
                            <td className="py-2.5 px-3 text-emerald-300 font-medium">
                              {item.safeReplacement}
                            </td>
                            <td className="py-2.5 px-3 text-slate-400">{item.reason}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: REELS / TIKTOK / VSL SCRIPT */}
              {activeTab === 'script' && (
                <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Roteiro Cronometrado de Alta Retenção (Reels / TikTok / Mini-VSL)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          'script',
                          `${result.videoScript.hook_0_3s}\n\n${result.videoScript.agitation_3_15s}\n\n${result.videoScript.mechanism_15_35s}\n\n${result.videoScript.offer_cta_35_45s}`
                        )
                      }
                      className="text-xs text-slate-300 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'script' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Roteiro Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Roteiro Completo</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <span className="font-mono text-xs text-emerald-400 block mb-1">
                        00s – 03s · Gancho Inegável (Scroll-Stopper)
                      </span>
                      <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                        {result.videoScript.hook_0_3s}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <span className="font-mono text-xs text-amber-400 block mb-1">
                        03s – 15s · Agitação do Problema
                      </span>
                      <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                        {result.videoScript.agitation_3_15s}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <span className="font-mono text-xs text-sky-400 block mb-1">
                        15s – 35s · Apresentação do Mecanismo Único
                      </span>
                      <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                        {result.videoScript.mechanism_15_35s}
                      </p>
                    </div>

                    <div className="p-3 rounded bg-slate-900 border border-slate-800">
                      <span className="font-mono text-xs text-emerald-400 block mb-1">
                        35s – 45s · Oferta Direta & Chamada para Ação
                      </span>
                      <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed">
                        {result.videoScript.offer_cta_35_45s}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <strong className="text-slate-200">Direção de Gravação/Edição:</strong>{' '}
                    {result.videoScript.visualDirectionNotes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
