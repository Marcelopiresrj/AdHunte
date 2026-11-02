'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Radar,
  Star,
  User,
  PlaySquare,
  Database,
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Calendar,
  Settings,
  Check,
  Scale,
} from 'lucide-react';
import {
  AdItem,
  AdNiche,
  CheckoutPlatform,
  SubNicheTag,
  SUB_NICHE_CHIPS,
  INITIAL_ADS_DATABASE,
  SavedFavoriteItem,
  AiCopyVariationResult,
} from '@/lib/mockAdsData';
import {
  loadAdsFromStore,
  addAdToStore,
  loadFavoritesFromStore,
  saveFavoritesToStore,
  loadFoldersFromStore,
  saveFoldersToStore,
  attachAiVariationToFavorite,
} from '@/lib/supabaseClient';
import AdCard from '@/components/AdCard';
import CopyModelerModal from '@/components/CopyModelerModal';
import FunnelXRayModal from '@/components/FunnelXRayModal';
import NicheComparator from '@/components/NicheComparator';
import FavoritesSwipeView from '@/components/FavoritesSwipeView';
import SupabaseConfigView from '@/components/SupabaseConfigView';
import NewAdImportModal from '@/components/NewAdImportModal';
import { useToast } from '@/components/ToastProvider';

type ActiveTab = 'library' | 'comparator' | 'favorites' | 'supabase';

const AVAILABLE_GATEWAYS: CheckoutPlatform[] = [
  'Clickbank',
  'Eduzz',
  'Guru',
  'Hotmart',
  'Kirvano',
  'Kiwify',
  'Monetizze',
  'PerfectPay',
  'Yampi',
];

export default function AdHunterApp() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<ActiveTab>('library');
  const [ads, setAds] = useState<AdItem[]>(INITIAL_ADS_DATABASE);
  const [favorites, setFavorites] = useState<SavedFavoriteItem[]>([]);
  const [folders, setFolders] = useState<string[]>([
    'Criativos VSL Escalados',
    'Hooks Renda Extra & IA',
    'Low Ticket Infoprodutos',
    'Referências Anti-Bloqueio',
  ]);

  // Collapsible Left Filter Sidebar State
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(true);

  // Horizontal Sub-Niche Chips Scroll Ref
  const chipsContainerRef = useRef<HTMLDivElement | null>(null);

  // Draft Filter Controls (Sidebar with - / + steppers and multi-gateway checklist)
  const [minDaysRunning, setMinDaysRunning] = useState<number>(0);
  const [maxDaysRunning, setMaxDaysRunning] = useState<number>(0);
  const [minAdsCount, setMinAdsCount] = useState<number>(0);
  const [maxAdsCount, setMaxAdsCount] = useState<number>(100);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedAdType, setSelectedAdType] = useState<string>('Todos');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Todos');
  const [selectedCta, setSelectedCta] = useState<string>('Todos');
  const [dateRangeLabel, setDateRangeLabel] = useState<string>('Todos os períodos');

  // Gateway Multi-Select Checklist State
  const [isGatewayDropdownOpen, setIsGatewayDropdownOpen] = useState<boolean>(true);
  const [gatewaySearch, setGatewaySearch] = useState<string>('');
  const [selectedGateways, setSelectedGateways] = useState<CheckoutPlatform[]>([]);

  // Active Top Search & Sub-Niche Chip State
  const [searchMode, setSearchMode] = useState<'keyword' | 'advertiser' | 'domain'>(
    'keyword'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeSubNiche, setActiveSubNiche] = useState<SubNicheTag>('Todos');

  // Applied Filter Snapshot
  const [appliedFilters, setAppliedFilters] = useState({
    minDays: 0,
    maxDays: 0,
    minAds: 0,
    maxAds: 100,
    category: 'Todos',
    adType: 'Todos',
    language: 'Todos',
    cta: 'Todos',
    gateways: [] as CheckoutPlatform[],
  });

  // Modals State
  const [activeCopyModelerAd, setActiveCopyModelerAd] = useState<AdItem | null>(
    null
  );
  const [activeFunnelXRayAd, setActiveFunnelXRayAd] = useState<AdItem | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Hydrate persistent state
  useEffect(() => {
    setAds(loadAdsFromStore());
    setFavorites(loadFavoritesFromStore());
    setFolders(loadFoldersFromStore());
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters({
      minDays: minDaysRunning,
      maxDays: maxDaysRunning,
      minAds: minAdsCount,
      maxAds: maxAdsCount,
      category: selectedCategory,
      adType: selectedAdType,
      language: selectedLanguage,
      cta: selectedCta,
      gateways: selectedGateways,
    });
    setActiveTab('library');
    showToast(
      'Filtros aplicados',
      'Biblioteca de anúncios atualizada',
      'info'
    );
  };

  const handleClearFilters = () => {
    setMinDaysRunning(0);
    setMaxDaysRunning(0);
    setMinAdsCount(0);
    setMaxAdsCount(100);
    setSelectedCategory('Todos');
    setSelectedAdType('Todos');
    setSelectedLanguage('Todos');
    setSelectedCta('Todos');
    setDateRangeLabel('Todos os períodos');
    setSelectedGateways([]);
    setGatewaySearch('');
    setSearchQuery('');
    setActiveSubNiche('Todos');
    setAppliedFilters({
      minDays: 0,
      maxDays: 0,
      minAds: 0,
      maxAds: 100,
      category: 'Todos',
      adType: 'Todos',
      language: 'Todos',
      cta: 'Todos',
      gateways: [],
    });
    showToast(
      'Filtros restaurados',
      'Exibindo todos os anúncios validados',
      'info'
    );
  };

  const toggleGatewaySelection = (gw: CheckoutPlatform) => {
    setSelectedGateways((prev) =>
      prev.includes(gw) ? prev.filter((item) => item !== gw) : [...prev, gw]
    );
  };

  const visibleGatewayList = useMemo(() => {
    if (!gatewaySearch.trim()) return AVAILABLE_GATEWAYS;
    return AVAILABLE_GATEWAYS.filter((g) =>
      g.toLowerCase().includes(gatewaySearch.toLowerCase())
    );
  }, [gatewaySearch]);

  // Filtered Ads for the 4-Column Grid
  const filteredAds = useMemo(() => {
    return ads
      .filter((ad) => {
        if (activeSubNiche !== 'Todos' && activeSubNiche !== 'Geral') {
          const matchSub = ad.sub_niche === activeSubNiche;
          const matchNicheText = ad.niche
            .toLowerCase()
            .includes(activeSubNiche.toLowerCase().split('/')[0]);
          const matchCopyText = ad.original_copy
            .toLowerCase()
            .includes(activeSubNiche.toLowerCase().split('/')[0]);
          if (!matchSub && !matchNicheText && !matchCopyText) return false;
        }

        if (appliedFilters.minDays > 0 && ad.days_active < appliedFilters.minDays) {
          return false;
        }
        if (appliedFilters.maxDays > 0 && ad.days_active > appliedFilters.maxDays) {
          return false;
        }

        if (appliedFilters.minAds > 0 && ad.active_adsets < appliedFilters.minAds) {
          return false;
        }
        if (
          appliedFilters.maxAds > 0 &&
          appliedFilters.maxAds < 100 &&
          ad.active_adsets > appliedFilters.maxAds
        ) {
          return false;
        }

        if (
          appliedFilters.category !== 'Todos' &&
          ad.niche !== appliedFilters.category
        ) {
          return false;
        }

        if (
          appliedFilters.adType !== 'Todos' &&
          ad.format !== appliedFilters.adType
        ) {
          return false;
        }

        if (
          appliedFilters.language !== 'Todos' &&
          !(ad.language || 'Português')
            .toLowerCase()
            .includes(appliedFilters.language.toLowerCase())
        ) {
          return false;
        }

        if (
          appliedFilters.cta !== 'Todos' &&
          ad.cta_text.toLowerCase() !== appliedFilters.cta.toLowerCase()
        ) {
          return false;
        }

        if (
          appliedFilters.gateways.length > 0 &&
          !appliedFilters.gateways.includes(ad.funnel.checkout_platform)
        ) {
          return false;
        }

        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          if (searchMode === 'advertiser') {
            if (!ad.advertiser_name.toLowerCase().includes(q)) return false;
          } else if (searchMode === 'domain') {
            const dom = (
              ad.visual.domainDisplay || ad.funnel.landing_page_url
            ).toLowerCase();
            if (!dom.includes(q)) return false;
          } else {
            const matchAll =
              ad.original_copy.toLowerCase().includes(q) ||
              ad.headline.toLowerCase().includes(q) ||
              ad.advertiser_name.toLowerCase().includes(q) ||
              ad.funnel.checkout_platform.toLowerCase().includes(q);
            if (!matchAll) return false;
          }
        }

        return true;
      })
      .sort((a, b) => b.days_active - a.days_active);
  }, [ads, activeSubNiche, appliedFilters, searchQuery, searchMode]);

  // Handlers
  const handleToggleFavorite = (ad: AdItem) => {
    const exists = favorites.some((f) => f.adId === ad.id);
    let updated: SavedFavoriteItem[];
    if (exists) {
      updated = favorites.filter((f) => f.adId !== ad.id);
      showToast(
        'Removido dos Favoritos',
        ad.advertiser_name,
        'info'
      );
    } else {
      updated = [
        {
          adId: ad.id,
          folderName: folders[0] || 'Criativos VSL Escalados',
          tacticalNotes: `Anúncio validado há ${ad.days_active} dias (${ad.active_adsets} anúncios ativos).`,
          savedAt: 'Salvo agora',
        },
        ...favorites,
      ];
      showToast(
        'Ad added to favorites · Salvo no Swipe File',
        `${ad.advertiser_name} (${ad.days_active} dias ativo)`,
        'success'
      );
    }
    setFavorites(updated);
    saveFavoritesToStore(updated);
  };

  const handleSaveAiVariation = (adId: string, variation: AiCopyVariationResult) => {
    const updated = attachAiVariationToFavorite(
      adId,
      variation,
      folders[0] || 'Criativos VSL Escalados'
    );
    setFavorites(updated);
  };

  const handleCreateFolder = (folderName: string) => {
    if (folders.includes(folderName)) return;
    const updated = [...folders, folderName];
    setFolders(updated);
    saveFoldersToStore(updated);
    showToast('Nova pasta criada', folderName, 'success');
  };

  const handleRemoveFavorite = (adId: string) => {
    const updated = favorites.filter((f) => f.adId !== adId);
    setFavorites(updated);
    saveFavoritesToStore(updated);
    showToast('Removido dos Favoritos', 'Anúncio removido da pasta', 'info');
  };

  const handleUpdateFavoriteMeta = (
    adId: string,
    folderName: string,
    tacticalNotes: string
  ) => {
    const updated = favorites.map((item) =>
      item.adId === adId ? { ...item, folderName, tacticalNotes } : item
    );
    setFavorites(updated);
    saveFavoritesToStore(updated);
    showToast('Notas atualizadas', `Salvo na pasta ${folderName}`, 'success');
  };

  const handleAddImportedAd = (newAd: AdItem) => {
    const updated = addAdToStore(newAd);
    setAds(updated);
    setActiveTab('library');
    setActiveCopyModelerAd(newAd);
    showToast(
      'Novo anúncio importado',
      `${newAd.advertiser_name} adicionado à biblioteca`,
      'success'
    );
  };

  const scrollSubNichesRight = () => {
    if (chipsContainerRef.current) {
      chipsContainerRef.current.scrollBy({ left: 260, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0E12] text-white flex flex-col">
      {/* =====================================================================
          TOP HEADER BAR (Strict 3-Zone Contract in Dark/Lilac Theme)
         ===================================================================== */}
      <header className="flex items-center justify-between gap-8 px-6 py-3 border-b border-neutral-800/90 bg-[#111318] sticky top-0 z-30">
        {/* Zone 1: Brand Wordmark with Radar Icon in Lilac */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('library');
          }}
          className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          <span className="w-8 h-8 rounded-full border-2 border-[#C084FC] flex items-center justify-center text-[#C084FC]">
            <Radar className="w-4 h-4" />
          </span>
          <span>AdHunter</span>
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-400">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'library'
                ? 'text-[#C084FC] underline underline-offset-8 decoration-[#C084FC]'
                : 'hover:text-white'
            }`}
          >
            Biblioteca de Anúncios
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comparator')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'comparator'
                ? 'text-[#C084FC] underline underline-offset-8 decoration-[#C084FC]'
                : 'hover:text-white'
            }`}
          >
            Comparador de Nichos
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'favorites'
                ? 'text-[#C084FC] underline underline-offset-8 decoration-[#C084FC]'
                : 'hover:text-white'
            }`}
          >
            Favoritos ({favorites.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('supabase')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'supabase'
                ? 'text-[#C084FC] underline underline-offset-8 decoration-[#C084FC]'
                : 'hover:text-white'
            }`}
          >
            Supabase & SQL
          </button>
        </nav>

        {/* Zone 3: Primary Action / Settings Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-[#C084FC] hover:text-neutral-950 bg-neutral-900 hover:bg-[#C084FC] border border-[#C084FC]/50 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurações / Importar</span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE: LEFT ICON RAIL + COLLAPSIBLE FILTROS + VIEWPORT
         ===================================================================== */}
      <div className="flex-1 flex relative">
        {/* 1. Far-Left Vertical Icon Rail (Lilac Accent Border) */}
        <aside className="w-12 shrink-0 bg-[#111318] border-r border-[#9333EA]/40 flex flex-col items-center py-4 justify-between relative z-20">
          <div className="flex flex-col items-center gap-5">
            <button
              type="button"
              onClick={() => setActiveTab('library')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                activeTab === 'library'
                  ? 'bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/50'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Radar de Anúncios"
            >
              <Radar className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/50'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Favoritos / Swipe File"
            >
              <Star className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('comparator')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                activeTab === 'comparator'
                  ? 'bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/50'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Comparador Estratégico de Nichos"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (ads.length > 0) setActiveCopyModelerAd(ads[0]);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#C084FC] transition-colors cursor-pointer"
              title="Modelador de Copy com IA"
            >
              <PlaySquare className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('supabase')}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                activeTab === 'supabase'
                  ? 'bg-[#C084FC]/20 text-[#C084FC] border border-[#C084FC]/50'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Banco Supabase & Script SQL"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
            title="Conta & Importação"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Lilac Circular Collapse/Expand Toggle Button on the Border */}
          <button
            type="button"
            onClick={() => setIsFilterSidebarOpen((prev) => !prev)}
            className="hidden lg:flex w-6 h-6 rounded-full bg-[#C084FC] text-neutral-950 items-center justify-center shadow-md absolute -right-3 top-14 cursor-pointer hover:scale-105 transition-transform"
            title={isFilterSidebarOpen ? 'Recolher Filtros' : 'Expandir Filtros'}
          >
            {isFilterSidebarOpen ? (
              <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            )}
          </button>
        </aside>

        {/* 2. Left "Filtros" Drawer */}
        {isFilterSidebarOpen && activeTab === 'library' && (
          <aside className="hidden lg:flex w-64 shrink-0 bg-[#14161B] border-r border-neutral-800/90 flex-col justify-between p-4 select-none">
            <div className="space-y-4 overflow-y-auto pr-1 max-h-[calc(100vh-130px)]">
              <h2 className="text-sm font-bold text-white">Filtros</h2>

              {/* Row 1: Min de Dias Rodando & Máx de Dias Rodando (- 0 +) */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1.5 truncate">
                    Min de Dias Rodando
                  </label>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs font-bold text-white tabular-nums">
                    <button
                      type="button"
                      onClick={() =>
                        setMinDaysRunning((prev) => Math.max(0, prev - 5))
                      }
                      className="text-neutral-400 hover:text-white px-1 cursor-pointer"
                    >
                      -
                    </button>
                    <span>{minDaysRunning}</span>
                    <button
                      type="button"
                      onClick={() => setMinDaysRunning((prev) => prev + 5)}
                      className="text-neutral-400 hover:text-white px-1 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1.5 truncate">
                    Máx de Dias Rodando
                  </label>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs font-bold text-white tabular-nums">
                    <button
                      type="button"
                      onClick={() =>
                        setMaxDaysRunning((prev) => Math.max(0, prev - 10))
                      }
                      className="text-neutral-400 hover:text-white px-1 cursor-pointer"
                    >
                      -
                    </button>
                    <span>{maxDaysRunning}</span>
                    <button
                      type="button"
                      onClick={() => setMaxDaysRunning((prev) => prev + 10)}
                      className="text-neutral-400 hover:text-white px-1 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Nº Min Anúncios & Nº Máx Anúncios */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1.5 truncate">
                    Nº Min Anúncios
                  </label>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs font-bold text-white tabular-nums">
                    <button
                      type="button"
                      onClick={() =>
                        setMinAdsCount((prev) => Math.max(0, prev - 5))
                      }
                      className="text-neutral-400 hover:text-white px-1 cursor-pointer"
                    >
                      -
                    </button>
                    <span>{minAdsCount}</span>
                    <button
                      type="button"
                      onClick={() => setMinAdsCount((prev) => prev + 5)}
                      className="text-neutral-400 hover:text-white px-1 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-400 mb-1.5 truncate">
                    Nº Máx Anúncios
                  </label>
                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs font-bold text-white tabular-nums">
                    <button
                      type="button"
                      onClick={() =>
                        setMaxAdsCount((prev) => Math.max(10, prev - 10))
                      }
                      className="text-neutral-400 hover:text-white px-1 cursor-pointer"
                    >
                      -
                    </button>
                    <span>{maxAdsCount}</span>
                    <button
                      type="button"
                      onClick={() => setMaxAdsCount((prev) => prev + 10)}
                      className="text-neutral-400 hover:text-white px-1 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Data / Período */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1.5">
                  Data
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    value={dateRangeLabel}
                    onChange={(e) => setDateRangeLabel(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs text-neutral-200 focus:outline-none focus:border-[#C084FC]"
                  >
                    <option value="Todos os períodos">Selecione um período</option>
                    <option value="Últimos 7 dias">Últimos 7 dias</option>
                    <option value="Últimos 30 dias">Últimos 30 dias</option>
                    <option value="Últimos 90 dias">Últimos 90 dias</option>
                  </select>
                </div>
              </div>

              {/* Categoria / Operação */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1.5">
                  Categoria / Operação
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs text-neutral-200 focus:outline-none focus:border-[#C084FC]"
                >
                  <option value="Todos">Info Produtos & Todos</option>
                  <option value="Infoprodutos & Educação">Info Produtos</option>
                  <option value="Saúde & Estética">Saúde & Estética</option>
                  <option value="Finanças & Renda Extra">Finanças & Renda Extra</option>
                  <option value="E-commerce & Dropshipping">E-commerce & Drop</option>
                  <option value="B2B & SaaS">B2B & SaaS</option>
                </select>
              </div>

              {/* Tipo de Anúncio */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1.5">
                  Tipo de Anúncio
                </label>
                <select
                  value={selectedAdType}
                  onChange={(e) => setSelectedAdType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs text-neutral-200 focus:outline-none focus:border-[#C084FC]"
                >
                  <option value="Todos">Todos</option>
                  <option value="Vídeo VSL">Vídeo VSL</option>
                  <option value="Reels / UGC">Reels / UGC</option>
                </select>
              </div>

              {/* Idioma */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1.5">
                  Idioma
                </label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs text-neutral-200 focus:outline-none focus:border-[#C084FC]"
                >
                  <option value="Todos">Português, Inglês, Espanhol</option>
                  <option value="Português">Português</option>
                  <option value="Espanhol">Espanhol (LatAm)</option>
                  <option value="Inglês">Inglês</option>
                </select>
              </div>

              {/* CTA */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1.5">
                  CTA
                </label>
                <select
                  value={selectedCta}
                  onChange={(e) => setSelectedCta(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs text-neutral-200 focus:outline-none focus:border-[#C084FC]"
                >
                  <option value="Todos">Escolha os CTAs</option>
                  <option value="Saiba mais">Saiba mais</option>
                  <option value="Comprar Agora">Comprar Agora</option>
                </select>
              </div>

              {/* Gateway Multi-Select Accordion with Search & Lilac Checkboxes */}
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1.5">
                  Gateway
                </label>

                <button
                  type="button"
                  onClick={() => setIsGatewayDropdownOpen((prev) => !prev)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1F2229] border border-neutral-700/70 text-xs text-neutral-200 flex items-center justify-between cursor-pointer"
                >
                  <span>
                    {selectedGateways.length === 0
                      ? 'Todos os Gateways'
                      : `${selectedGateways.length} selecionados`}
                  </span>
                  {isGatewayDropdownOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                  )}
                </button>

                {isGatewayDropdownOpen && (
                  <div className="mt-1.5 p-2 rounded-lg bg-[#191B20] border border-neutral-700/70 space-y-2">
                    <input
                      type="text"
                      value={gatewaySearch}
                      onChange={(e) => setGatewaySearch(e.target.value)}
                      placeholder="Pesquisar..."
                      className="w-full px-2.5 py-1.5 rounded bg-[#121317] border border-neutral-700/80 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-[#C084FC]"
                    />

                    <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                      {visibleGatewayList.map((gw) => {
                        const isChecked = selectedGateways.includes(gw);
                        return (
                          <button
                            key={gw}
                            type="button"
                            onClick={() => toggleGatewaySelection(gw)}
                            className="w-full px-2 py-1.5 rounded hover:bg-neutral-800/80 flex items-center gap-2.5 text-xs text-neutral-200 cursor-pointer text-left"
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
                                isChecked
                                  ? 'bg-[#C084FC] border-[#C084FC] text-neutral-950'
                                  : 'bg-transparent border-neutral-600'
                              }`}
                            >
                              {isChecked && (
                                <Check className="w-3 h-3 stroke-[3]" />
                              )}
                            </span>
                            <span className="truncate">{gw}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Sticky Action Buttons: Limpar | Aplicar (Lilac) */}
            <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleClearFilters}
                className="py-2 px-3 rounded-lg bg-[#22252C] hover:bg-neutral-700 border border-neutral-700 text-xs font-bold text-neutral-200 transition-colors cursor-pointer"
              >
                Limpar
              </button>

              <button
                type="button"
                onClick={handleApplyFilters}
                className="py-2 px-3 rounded-lg bg-[#C084FC] hover:bg-[#D8B4FE] text-neutral-950 text-xs font-extrabold transition-colors cursor-pointer shadow-md"
              >
                Aplicar
              </button>
            </div>
          </aside>
        )}

        {/* 3. Main Content Viewport */}
        <main className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full space-y-6 overflow-x-hidden">
          {/* =================================================================
              VIEW 1: BIBLIOTECA DE ANÚNCIOS
             ================================================================= */}
          {activeTab === 'library' && (
            <div className="space-y-5">
              {/* Top Search Bar: [Palavra-chave ▾] + [Digite uma palavra-chave 🔍] */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 max-w-2xl mx-auto">
                <div className="relative w-full sm:w-44 shrink-0">
                  <select
                    value={searchMode}
                    onChange={(e) =>
                      setSearchMode(
                        e.target.value as 'keyword' | 'advertiser' | 'domain'
                      )
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#16181E] border border-neutral-800 text-xs font-bold text-[#C084FC] focus:outline-none focus:border-[#C084FC] cursor-pointer"
                  >
                    <option value="keyword">⊞ Palavra-chave</option>
                    <option value="advertiser">⊞ Nome da Página</option>
                    <option value="domain">⊞ Domínio / URL</option>
                  </select>
                </div>

                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Digite uma palavra-chave"
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-[#16181E] border border-neutral-800 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#C084FC]"
                  />
                  <Search className="w-4 h-4 text-neutral-300 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Horizontal Scrollable Sub-Niche Chips Bar (Lilac Active State) */}
              <div className="relative flex items-center gap-2">
                <div
                  ref={chipsContainerRef}
                  className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 pr-8"
                >
                  {SUB_NICHE_CHIPS.map((chip) => {
                    const isActive = activeSubNiche === chip;
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setActiveSubNiche(chip)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                          isActive
                            ? 'bg-[#C084FC] text-neutral-950 shadow-sm'
                            : 'bg-[#171920] hover:bg-neutral-800 text-neutral-200 border border-neutral-800'
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={scrollSubNichesRight}
                  className="w-7 h-7 rounded-full bg-[#1C1F26] hover:bg-neutral-700 border border-neutral-700 flex items-center justify-center text-neutral-200 shrink-0 cursor-pointer"
                  title="Mais nichos"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 4-Column Vertical Video Ad Cards Grid */}
              {filteredAds.length === 0 ? (
                <div className="bg-[#15171C] border border-neutral-800 rounded-2xl p-12 text-center space-y-3">
                  <h3 className="text-sm font-bold text-white">
                    Nenhum anúncio encontrado para os filtros aplicados
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Clique em Limpar para restaurar todos os criativos em vídeo.
                  </p>
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="px-4 py-2 rounded-lg bg-[#C084FC] text-neutral-950 font-extrabold text-xs cursor-pointer"
                  >
                    Limpar Filtros
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filteredAds.map((ad) => (
                    <AdCard
                      key={ad.id}
                      ad={ad}
                      isFavorite={favorites.some((f) => f.adId === ad.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenCopyModeler={(targetAd) =>
                        setActiveCopyModelerAd(targetAd)
                      }
                      onOpenFunnelXRay={(targetAd) =>
                        setActiveFunnelXRayAd(targetAd)
                      }
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              VIEW 3: COMPARADOR DE NICHOS
             ================================================================= */}
          {activeTab === 'comparator' && (
            <NicheComparator
              onSelectNicheFilter={(niche: AdNiche) => {
                setSelectedCategory(niche);
                setAppliedFilters((prev) => ({ ...prev, category: niche }));
                setActiveTab('library');
              }}
            />
          )}

          {/* =================================================================
              VIEW 4: FAVORITOS & SWIPE FILE
             ================================================================= */}
          {activeTab === 'favorites' && (
            <FavoritesSwipeView
              ads={ads}
              favorites={favorites}
              folders={folders}
              onCreateFolder={handleCreateFolder}
              onRemoveFavorite={handleRemoveFavorite}
              onUpdateFavoriteMeta={handleUpdateFavoriteMeta}
              onOpenCopyModeler={(targetAd) => setActiveCopyModelerAd(targetAd)}
              onOpenFunnelXRay={(targetAd) => setActiveFunnelXRayAd(targetAd)}
            />
          )}

          {/* =================================================================
              VIEW 5: SUPABASE & SQL BLUEPRINT
             ================================================================= */}
          {activeTab === 'supabase' && <SupabaseConfigView />}
        </main>
      </div>

      {/* =====================================================================
          INTERACTIVE MODALS
         ===================================================================== */}
      <CopyModelerModal
        ad={activeCopyModelerAd}
        onClose={() => setActiveCopyModelerAd(null)}
        onSaveAiVariation={handleSaveAiVariation}
      />

      <FunnelXRayModal
        ad={activeFunnelXRayAd}
        onClose={() => setActiveFunnelXRayAd(null)}
        onSwitchToCopyModeler={(targetAd) => setActiveCopyModelerAd(targetAd)}
      />

      <NewAdImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onAddAd={handleAddImportedAd}
      />
    </div>
  );
}
