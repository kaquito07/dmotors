import React from 'react';
import { Eye, ShieldAlert, Car, PhoneCall, Sparkles, Instagram, Flame } from 'lucide-react';

export type AppViewMode = 'client' | 'admin';

interface HeaderProps {
  currentView: AppViewMode;
  onViewChange: (mode: AppViewMode) => void;
  availableCount: number;
  opportunityCount: number;
  newLeadsCount: number;
  onOpenSellModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onViewChange,
  availableCount,
  opportunityCount,
  newLeadsCount,
  onOpenSellModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      {/* Mobile micro top bar (< 640px) */}
      <div className="sm:hidden border-b border-zinc-900 bg-zinc-950/90 px-3 py-1 text-[10px] text-zinc-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-zinc-300 font-medium truncate max-w-[210px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          Guarulhos (Av. Paulo Faccini, 32)
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="https://instagram.com/_dmotors"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-zinc-200"
          >
            @_dmotors
          </a>
          <span className="text-zinc-700">·</span>
          <a
            href={`https://wa.me/5511999998888?text=${encodeURIComponent('Olá Dmotors!')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-semibold"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Desktop micro bar (>= 640px) with branding & direct contacts */}
      <div className="hidden sm:block border-b border-zinc-900 bg-zinc-950/60 py-1.5 px-4 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Showroom Aberto · Guarulhos - SP (Av. Paulo Faccini, 32 - Macedo)
            </span>
            <span className="text-zinc-600 hidden md:inline">|</span>
            <a
              href="https://instagram.com/_dmotors"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 hover:text-zinc-200 transition-colors text-zinc-400"
            >
              <Instagram className="w-3.5 h-3.5 text-pink-500" />
              <span>@_dmotors</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-400">
              100% dos veículos com <strong className="text-zinc-200">Laudo Cautelar Dekra Aprovado</strong>
            </span>
            <span className="text-zinc-600 hidden sm:inline">·</span>
            <a
              href={`https://wa.me/5511999998888?text=${encodeURIComponent('Olá, equipe Dmotors! Gostaria de falar com um consultor.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              (11) 99999-8888
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-500/30 shrink-0">
            <Car className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-black tracking-wider text-white uppercase font-sans">
                D<span className="text-red-500">MOTORS</span>
              </span>
              <span className="text-[10px] font-semibold text-red-400 bg-red-950/60 border border-red-800/50 px-1.5 py-0.2 rounded tracking-wide hidden xs:inline-block">
                @_dmotors
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium tracking-tight hidden sm:block">
              Curadoria Premium & Seminovos Periciados
            </span>
          </div>
        </div>

        {/* GOLDEN RULE: VISIBLE AND ELEGANT MODE SWITCHER */}
        <div className="flex items-center bg-zinc-900/90 p-0.5 sm:p-1 rounded-xl border border-zinc-800 shadow-inner shrink-0">
          <button
            onClick={() => onViewChange('client')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 ${
              currentView === 'client'
                ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Visualização da Vitrine Pública do Cliente"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">Visão do Cliente</span>
            <span className="sm:hidden">Cliente</span>
            <span className="text-[10px] font-mono bg-zinc-700/80 px-1 sm:px-1.5 py-0.2 rounded text-zinc-300">
              {availableCount}
            </span>
          </button>

          <button
            onClick={() => onViewChange('admin')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 ${
              currentView === 'admin'
                ? 'bg-red-950/80 text-red-200 shadow-md border border-red-700/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Painel Administrativo, Estoque e BI do Proprietário"
          >
            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 shrink-0" />
            <span className="hidden sm:inline">Painel do Proprietário</span>
            <span className="sm:hidden">Admin & BI</span>
            {newLeadsCount > 0 && (
              <span className="text-[10px] font-mono bg-red-600 text-white font-bold px-1 sm:px-1.5 py-0.2 rounded-full animate-pulse">
                {newLeadsCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side CTA & Quick Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {currentView === 'client' ? (
            <>
              {onOpenSellModal && (
                <button
                  onClick={onOpenSellModal}
                  className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Venda seu Carro
                </button>
              )}
              <a
                href={`https://wa.me/5511999998888?text=${encodeURIComponent('Olá Dmotors! Quero atendimento sobre o estoque.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                WhatsApp Showroom
              </a>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>{opportunityCount} Oportunidades</span>
              </span>
              <span className="bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 px-2.5 py-1.5 rounded-lg font-mono">
                Admin Conectado
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
