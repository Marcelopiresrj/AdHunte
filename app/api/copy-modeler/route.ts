import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      originalCopy,
      headline,
      niche,
      format,
      daysActive,
      customProductName,
      customTargetAudience,
      customTone,
    } = body;

    if (!originalCopy) {
      return NextResponse.json(
        { error: 'A copy original do anúncio é obrigatória para a modelagem.' },
        { status: 400 }
      );
    }

    const prompt = `
Analise e modele o seguinte anúncio validado no mercado brasileiro de tráfego pago (Meta Ads):

- Nicho: ${niche || 'Geral'}
- Formato: ${format || 'Vídeo VSL'}
- Tempo Ativo no Leilão: ${daysActive || 30} dias
- Headline Original: "${headline || ''}"
- Copy Original: "${originalCopy}"
- Produto/Oferta do Usuário (para adaptação): "${customProductName || 'Manter oferta similar adaptada com novo mecanismo'}"
- Público-Alvo Específico: "${customTargetAudience || 'Compradores brasileiros de resposta direta no Meta Ads'}"
- Tom de Voz Desejado: "${customTone || 'Persuasivo, direto e focado em conversão'}"

Gere um pacote completo de remodelagem de copy em Português do Brasil (PT-BR) contendo:
1. Diagnóstico psicológico do anúncio original (gatilho dominante, promessa central, mecanismo único e nível de risco de bloqueio no Meta Ads).
2. Três variações completas de Copy Textual baseadas nos frameworks clássicos de Direct Response:
   - Framework AIDA (Atenção, Interesse, Desejo, Ação)
   - Framework PAS (Problema, Agitação, Solução)
   - Framework HSO (Hook, Story, Offer)
3. Versão Blindada Anti-Bloqueio para o Meta Ads (reescreva removendo promessas irreais, atributos pessoais diretos "Você sofre de..." ou termos sensíveis que geram reprovação automática, mantendo alta conversão, e liste os termos substituídos).
4. Roteiro completo de Vídeo Curto (Reels / TikTok / Mini-VSL de 45 segundos) dividido por blocos de tempo ([00-03s] Hook, [03-15s] Agitação, [15-35s] Mecanismo Único, [35-45s] Oferta e CTA) mais notas de direção visual.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Você é um Copywriter Sênior de Resposta Direta e Especialista em Tráfego Pago no Brasil, mestre em escalar ofertas no Meta Ads sem sofrer bloqueios de conta. Responda estritamente no formato JSON especificado pelo schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: {
              type: Type.OBJECT,
              properties: {
                dominantTrigger: { type: Type.STRING },
                corePromise: { type: Type.STRING },
                uniqueMechanism: { type: Type.STRING },
                complianceRiskLevel: {
                  type: Type.STRING,
                  description: 'Deve ser Baixo, Moderado ou Alto (Requer Blindagem)',
                },
                complianceNotes: { type: Type.STRING },
              },
              required: [
                'dominantTrigger',
                'corePromise',
                'uniqueMechanism',
                'complianceRiskLevel',
                'complianceNotes',
              ],
            },
            frameworks: {
              type: Type.OBJECT,
              properties: {
                aida: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    body: { type: Type.STRING },
                    cta: { type: Type.STRING },
                  },
                  required: ['title', 'headline', 'body', 'cta'],
                },
                pas: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    body: { type: Type.STRING },
                    cta: { type: Type.STRING },
                  },
                  required: ['title', 'headline', 'body', 'cta'],
                },
                hookStoryOffer: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    headline: { type: Type.STRING },
                    body: { type: Type.STRING },
                    cta: { type: Type.STRING },
                  },
                  required: ['title', 'headline', 'body', 'cta'],
                },
              },
              required: ['aida', 'pas', 'hookStoryOffer'],
            },
            antiBlockVersion: {
              type: Type.OBJECT,
              properties: {
                safeHeadline: { type: Type.STRING },
                safeBody: { type: Type.STRING },
                replacedTerms: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      safeReplacement: { type: Type.STRING },
                      reason: { type: Type.STRING },
                    },
                    required: ['original', 'safeReplacement', 'reason'],
                  },
                },
              },
              required: ['safeHeadline', 'safeBody', 'replacedTerms'],
            },
            videoScript: {
              type: Type.OBJECT,
              properties: {
                hook_0_3s: { type: Type.STRING },
                agitation_3_15s: { type: Type.STRING },
                mechanism_15_35s: { type: Type.STRING },
                offer_cta_35_45s: { type: Type.STRING },
                visualDirectionNotes: { type: Type.STRING },
              },
              required: [
                'hook_0_3s',
                'agitation_3_15s',
                'mechanism_15_35s',
                'offer_cta_35_45s',
                'visualDirectionNotes',
              ],
            },
          },
          required: ['analysis', 'frameworks', 'antiBlockVersion', 'videoScript'],
        },
      },
    });

    const jsonText = (response.text ?? '{}').trim();
    const parsed = JSON.parse(jsonText);

    return NextResponse.json({ result: parsed });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : 'Erro ao processar modelagem de copy com a API Gemini.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
