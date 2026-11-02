import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  AdItem,
  INITIAL_ADS_DATABASE,
  SavedFavoriteItem,
  AiCopyVariationResult,
} from './mockAdsData';

const defaultSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const defaultSupabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const STORAGE_KEYS = {
  ADS: 'adhunter_ads_db_v5',
  FAVORITES: 'adhunter_favorites_v5',
  FOLDERS: 'adhunter_folders_v5',
  CUSTOM_CREDS: 'adhunter_supabase_creds_v5',
};

export interface SupabaseConnectionConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  mode: 'supabase_cloud' | 'hybrid_local';
}

export function getSupabaseConnectionConfig(): SupabaseConnectionConfig {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_CREDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.url && parsed.anonKey && parsed.url.startsWith('https://')) {
          return {
            url: parsed.url,
            anonKey: parsed.anonKey,
            isConfigured: true,
            mode: 'supabase_cloud',
          };
        }
      }
    } catch {
      // Fallback para env vars
    }
  }

  const hasValidEnv =
    Boolean(defaultSupabaseUrl) &&
    defaultSupabaseUrl.startsWith('https://') &&
    !defaultSupabaseUrl.includes('seu-projeto') &&
    Boolean(defaultSupabaseAnonKey) &&
    defaultSupabaseAnonKey !== 'sua-chave-anon-publica-supabase';

  return {
    url: hasValidEnv ? defaultSupabaseUrl : 'https://xyzcompany.supabase.co',
    anonKey: hasValidEnv ? defaultSupabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    isConfigured: hasValidEnv,
    mode: hasValidEnv ? 'supabase_cloud' : 'hybrid_local',
  };
}

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConnectionConfig();
  if (!config.isConfigured) return null;
  try {
    return createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch {
    return null;
  }
}

export function saveCustomSupabaseCredentials(url: string, anonKey: string): SupabaseConnectionConfig {
  if (typeof window !== 'undefined') {
    if (!url.trim() || !anonKey.trim()) {
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_CREDS);
    } else {
      localStorage.setItem(
        STORAGE_KEYS.CUSTOM_CREDS,
        JSON.stringify({ url: url.trim(), anonKey: anonKey.trim() })
      );
    }
  }
  return getSupabaseConnectionConfig();
}

export function loadAdsFromStore(): AdItem[] {
  if (typeof window === 'undefined') return INITIAL_ADS_DATABASE;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(INITIAL_ADS_DATABASE));
      return INITIAL_ADS_DATABASE;
    }
    const parsed = JSON.parse(raw) as AdItem[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_ADS_DATABASE;
  } catch {
    return INITIAL_ADS_DATABASE;
  }
}

export function addAdToStore(newAd: AdItem): AdItem[] {
  const current = loadAdsFromStore();
  const updated = [newAd, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(updated));
  }
  return updated;
}

export function loadFoldersFromStore(): string[] {
  const defaultFolders = [
    'Criativos VSL Escalados',
    'Hooks Renda Extra & IA',
    'Low Ticket Infoprodutos',
    'Referências Anti-Bloqueio',
  ];
  if (typeof window === 'undefined') return defaultFolders;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(defaultFolders));
      return defaultFolders;
    }
    return JSON.parse(raw);
  } catch {
    return defaultFolders;
  }
}

export function saveFoldersToStore(folders: string[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }
}

export function loadFavoritesFromStore(): SavedFavoriteItem[] {
  const defaultFavorites: SavedFavoriteItem[] = [
    {
      adId: 'ad-br-radar-03',
      folderName: 'Low Ticket Infoprodutos',
      tacticalNotes:
        'Criativo Bolo Vulcão (Ana Ruiz) com 60 anúncios ativos e 51 dias rodando na Hotmart. Altíssima conversão visual.',
      savedAt: 'Salvo no Swipe File',
    },
    {
      adId: 'ad-br-radar-08',
      folderName: 'Hooks Renda Extra & IA',
      tacticalNotes:
        'Headline forte ("O PROBLEMA NÃO ESTÁ EM QUANTO VOCÊ GANHA...") escalando na Eduzz.',
      savedAt: 'Salvo no Swipe File',
    },
  ];

  if (typeof window === 'undefined') return defaultFavorites;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(defaultFavorites));
      return defaultFavorites;
    }
    return JSON.parse(raw);
  } catch {
    return defaultFavorites;
  }
}

export function saveFavoritesToStore(favorites: SavedFavoriteItem[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }
}

export function attachAiVariationToFavorite(
  adId: string,
  variation: AiCopyVariationResult,
  defaultFolder = 'Criativos VSL Escalados'
): SavedFavoriteItem[] {
  const current = loadFavoritesFromStore();
  const existingIndex = current.findIndex((item) => item.adId === adId);
  let updated: SavedFavoriteItem[];

  if (existingIndex >= 0) {
    updated = current.map((item, idx) =>
      idx === existingIndex ? { ...item, savedAiResults: variation } : item
    );
  } else {
    updated = [
      {
        adId,
        folderName: defaultFolder,
        tacticalNotes: 'Anúncio salvo automaticamente ao gerar modelagem de copy com IA.',
        savedAt: 'Salvo agora',
        savedAiResults: variation,
      },
      ...current,
    ];
  }

  saveFavoritesToStore(updated);
  return updated;
}

export const SUPABASE_CLIENT_SOURCE_CODE = `// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export async function fetchValidatedAds({ niche = 'Todos', minDaysActive = 0, format = 'Todos' }) {
  let query = supabase
    .from('ads_database')
    .select('*')
    .gte('days_active', minDaysActive)
    .order('days_active', { ascending: false });

  if (niche !== 'Todos') query = query.eq('niche', niche);
  if (format !== 'Todos') query = query.eq('format', format);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}`;

export const SUPABASE_SQL_SCHEMA_SCRIPT = `-- ============================================================================
-- ADHUNTER SAAS — SCRIPT SQL COMPLETO PARA SUPABASE (POSTGRESQL)
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  plan_tier TEXT NOT NULL DEFAULT 'pro' CHECK (plan_tier IN ('starter', 'pro', 'agency')),
  subscription_status TEXT NOT NULL DEFAULT 'active',
  ai_credits_remaining INTEGER NOT NULL DEFAULT 250,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ads_database (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  library_id TEXT UNIQUE NOT NULL,
  advertiser_name TEXT NOT NULL,
  advertiser_handle TEXT NOT NULL,
  niche TEXT NOT NULL,
  sub_niche TEXT DEFAULT 'Geral',
  format TEXT NOT NULL,
  days_active INTEGER NOT NULL DEFAULT 1,
  active_adsets INTEGER NOT NULL DEFAULT 1,
  scale_score INTEGER NOT NULL DEFAULT 50,
  original_copy TEXT NOT NULL,
  headline TEXT NOT NULL,
  cta_text TEXT NOT NULL DEFAULT 'Saiba mais',
  funnel_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES public.ads_database(id) ON DELETE CASCADE,
  folder_name TEXT NOT NULL DEFAULT 'Criativos VSL Escalados',
  tactical_notes TEXT DEFAULT '',
  saved_ai_variations JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, ad_id)
);`;
