'use client';

import React, { useState } from 'react';
import {
  FolderPlus,
  Bookmark,
  Trash2,
  Sparkles,
  SearchCode,
  Save,
  Check,
  FolderOpen,
} from 'lucide-react';
import { AdItem, SavedFavoriteItem } from '@/lib/mockAdsData';

interface FavoritesSwipeViewProps {
  ads: AdItem[];
  favorites: SavedFavoriteItem[];
  folders: string[];
  onCreateFolder: (folderName: string) => void;
  onRemoveFavorite: (adId: string) => void;
  onUpdateFavoriteMeta: (adId: string, folderName: string, tacticalNotes: string) => void;
  onOpenCopyModeler: (ad: AdItem) => void;
  onOpenFunnelXRay: (ad: AdItem) => void;
}

export default function FavoritesSwipeView({
  ads,
  favorites,
  folders,
  onCreateFolder,
  onRemoveFavorite,
  onUpdateFavoriteMeta,
  onOpenCopyModeler,
  onOpenFunnelXRay,
}: FavoritesSwipeViewProps) {
  const [selectedFolder, setSelectedFolder] = useState<string>('Todas as Pastas');
  const [newFolderInput, setNewFolderInput] = useState('');
  const [editingNotesMap, setEditingNotesMap] = useState<Record<string, string>>({});
  const [savedToastId, setSavedToastId] = useState<string | null>(null);

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderInput.trim();
    if (!trimmed) return;
    onCreateFolder(trimmed);
    setSelectedFolder(trimmed);
    setNewFolderInput('');
  };

  const filteredFavorites = favorites.filter((fav) =>
    selectedFolder === 'Todas as Pastas' ? true : fav.folderName === selectedFolder
  );

  const handleSaveNotes = (fav: SavedFavoriteItem) => {
    const currentNote =
      editingNotesMap[fav.adId] !== undefined
        ? editingNotesMap[fav.adId]
        : fav.tacticalNotes;
    onUpdateFavoriteMeta(fav.adId, fav.folderName, currentNote);
    setSavedToastId(fav.adId);
    setTimeout(() => setSavedToastId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Swipe File & Pastas de Espionagem Salvas
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Organize os anúncios validados em pastas temáticas, registre anotações táticas
            para sua equipe de criação e consulte suas copies modeladas por IA.
          </p>
        </div>

        {/* Create New Spy Folder Form */}
        <form onSubmit={handleAddFolder} className="flex items-center gap-2">
          <input
            type="text"
            value={newFolderInput}
            onChange={(e) => setNewFolderInput(e.target.value)}
            placeholder="Nova pasta (ex: VSLs Black Friday)"
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 w-56"
          />
          <button
            type="submit"
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Criar Pasta</span>
          </button>
        </form>
      </div>

      {/* Folder Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-xl w-fit">
        <button
          type="button"
          onClick={() => setSelectedFolder('Todas as Pastas')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            selectedFolder === 'Todas as Pastas'
              ? 'bg-emerald-600 text-slate-950 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Todas as Pastas ({favorites.length})
        </button>

        {folders.map((folder) => {
          const count = favorites.filter((f) => f.folderName === folder).length;
          return (
            <button
              key={folder}
              type="button"
              onClick={() => setSelectedFolder(folder)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                selectedFolder === folder
                  ? 'bg-emerald-600 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {folder} ({count})
            </button>
          );
        })}
      </div>

      {/* Saved Items List */}
      {filteredFavorites.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <FolderOpen className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-base font-semibold text-slate-200">
            Nenhum anúncio salvo nesta pasta
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Clique no ícone de marcador nos cards da Biblioteca de Anúncios Validados ou
            salve uma variação gerada no Modelador de Copy com IA.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredFavorites.map((fav) => {
            const ad = ads.find((a) => a.id === fav.adId);
            if (!ad) return null;

            const currentNote =
              editingNotesMap[fav.adId] !== undefined
                ? editingNotesMap[fav.adId]
                : fav.tacticalNotes;

            return (
              <div
                key={fav.adId}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Bookmark className="w-4 h-4 text-emerald-400 fill-emerald-400 shrink-0" />
                        <h3 className="text-base font-semibold text-slate-100">
                          {ad.advertiser_name}
                        </h3>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5 font-mono tabular-nums">
                        {ad.niche} ·{' '}
                        <span className="text-emerald-400 font-bold">
                          {ad.days_active} dias ativo
                        </span>{' '}
                        · Score {ad.scale_score}/100
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={fav.folderName}
                        onChange={(e) =>
                          onUpdateFavoriteMeta(fav.adId, e.target.value, currentNote)
                        }
                        className="px-2.5 py-1.5 rounded bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      >
                        {folders.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => onRemoveFavorite(fav.adId)}
                        className="p-1.5 rounded bg-slate-950 hover:bg-rose-950/60 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remover dos favoritos"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Original Copy Snippet */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <p className="text-xs font-semibold text-emerald-400">{ad.headline}</p>
                    <p className="text-xs text-slate-300 line-clamp-2">{ad.original_copy}</p>
                  </div>

                  {/* Tactical Notes Editor */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="text-slate-400 font-medium">
                        Anotações Táticas de Modelagem
                      </label>
                      <button
                        type="button"
                        onClick={() => handleSaveNotes(fav)}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                      >
                        {savedToastId === fav.adId ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Nota Salva</span>
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5" />
                            <span>Salvar Nota</span>
                          </>
                        )}
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={currentNote}
                      onChange={(e) =>
                        setEditingNotesMap((prev) => ({
                          ...prev,
                          [fav.adId]: e.target.value,
                        }))
                      }
                      placeholder="Anote ideias de ganchos, referências de VSL ou testes de criativo..."
                      className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Saved AI Copy Preview if available */}
                  {fav.savedAiResults && (
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-800/40 space-y-1">
                      <span className="text-xs font-semibold text-emerald-400 block">
                        Copy Modelada com IA Salva (AIDA):
                      </span>
                      <p className="text-xs text-slate-200 font-medium">
                        {fav.savedAiResults.frameworks.aida.headline}
                      </p>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {fav.savedAiResults.frameworks.aida.body}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenFunnelXRay(ad)}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <SearchCode className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Raio-X Funil</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenCopyModeler(ad)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Abrir no Modelador IA</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
