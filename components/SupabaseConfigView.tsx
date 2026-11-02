'use client';

import React, { useState, useEffect } from 'react';
import {
  Database,
  Copy,
  Check,
  Download,
  KeyRound,
  Terminal,
  ShieldCheck,
} from 'lucide-react';
import {
  SUPABASE_CLIENT_SOURCE_CODE,
  SUPABASE_SQL_SCHEMA_SCRIPT,
  getSupabaseConnectionConfig,
  saveCustomSupabaseCredentials,
  SupabaseConnectionConfig,
} from '@/lib/supabaseClient';

export default function SupabaseConfigView() {
  const [config, setConfig] = useState<SupabaseConnectionConfig>({
    url: '',
    anonKey: '',
    isConfigured: false,
    mode: 'hybrid_local',
  });
  const [urlInput, setUrlInput] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [copiedTab, setCopiedTab] = useState<'client' | 'sql' | null>(null);
  const [savedStatus, setSavedStatus] = useState(false);

  useEffect(() => {
    const current = getSupabaseConnectionConfig();
    setConfig(current);
    if (current.isConfigured) {
      setUrlInput(current.url);
      setKeyInput(current.anonKey);
    }
  }, []);

  const handleSaveCreds = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = saveCustomSupabaseCredentials(urlInput, keyInput);
    setConfig(updated);
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  const handleCopyCode = (type: 'client' | 'sql', content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedTab(type);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([SUPABASE_SQL_SCHEMA_SCRIPT], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'adhunter_supabase_schema.sql';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Arquitetura Supabase (PostgreSQL) & Script SQL
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Configuração completa do cliente <code className="text-emerald-400">supabaseClient.js</code> e
            script DDL relacional para criação das tabelas <code className="text-slate-200">users</code>,{' '}
            <code className="text-slate-200">ads_database</code> e{' '}
            <code className="text-slate-200">favorites</code> com políticas RLS no Supabase.
          </p>
        </div>

        <div className="text-xs font-mono text-emerald-400">
          Modo Ativo:{' '}
          {config.mode === 'supabase_cloud'
            ? 'Conectado ao Supabase Cloud'
            : 'Híbrido Funcional (Persistência Local Ativa)'}
        </div>
      </div>

      {/* Interactive Connection Credentials Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">
              Conector de Credenciais Supabase (Opcional em Modo Híbrido)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Suporta variáveis de ambiente ou conexão direta
          </span>
        </div>

        <form onSubmit={handleSaveCreds} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs text-slate-400 mb-1">
              Project URL (NEXT_PUBLIC_SUPABASE_URL)
            </label>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://seu-projeto.supabase.co"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs text-slate-400 mb-1">
              Anon Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {savedStatus ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Salvo!</span>
                </>
              ) : (
                <span>Salvar Conexão</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Code Viewers: supabaseClient.js and schema.sql */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. supabaseClient.js */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-slate-100">
                src/services/supabaseClient.js
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleCopyCode('client', SUPABASE_CLIENT_SOURCE_CODE)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedTab === 'client' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Código Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Cliente JS</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed flex-1 max-h-[520px]">
            <code>{SUPABASE_CLIENT_SOURCE_CODE}</code>
          </pre>
        </div>

        {/* 2. SQL Schema Script */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-semibold text-slate-100">
                supabase/migrations/001_adhunter_schema.sql
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSql}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Baixar .SQL</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyCode('sql', SUPABASE_SQL_SCHEMA_SCRIPT)}
                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold text-xs flex items-center gap-1 cursor-pointer"
              >
                {copiedTab === 'sql' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>SQL Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Script SQL</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed flex-1 max-h-[520px]">
            <code>{SUPABASE_SQL_SCHEMA_SCRIPT}</code>
          </pre>
        </div>
      </div>

      {/* Security & Architecture Notes */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Políticas de Row Level Security (RLS) ativadas por padrão para isolar pastas de
            favoritos e controle de créditos por usuário.
          </span>
        </div>
        <span className="font-mono text-slate-400">
          Tabelas: public.users · public.ads_database · public.favorites
        </span>
      </div>
    </div>
  );
}
