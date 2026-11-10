import React from 'react';
import { Eye, ShieldCheck, PhoneCall, Sparkles, Instagram, Flame } from 'lucide-react';
import { CONTACT_INFO, getWhatsAppUrl } from '../config/contact';
import { GoldShield } from './common/GoldShield';

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
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 transition-colors">
      {/* Mobile micro top bar (< 640px) */}
      <div className="sm:hidden border-b border-zinc-900 bg-zinc-950/95 px-3 py-1 text-[10px] text-zinc-400 flex items-center justify-between">
        <span className="flex items-center gap-1 text-zinc-300 font-medium truncate max-w-[210px]">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
          {CONTACT_INFO.city}
        </span>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={CONTACT_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400/90 hover:text-amber-300 font-medium"
          >
            {CONTACT_INFO.brandHandle}
          </a>
          <span className="text-zinc-700">·</span>
          <a
            href={getWhatsAppUrl(`Olá ${CONTACT_INFO.brandName}!`)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 font-semibold"
          >
            WhatsApp
          </a>
        </div>
      </div>

      {/* Desktop micro bar (>= 640px) */}
      <div className="hidden sm:block border-b border-zinc-900 bg-zinc-950/70 py-1.5 px-4 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Atendimento Showroom · {CONTACT_INFO.city}
            </span>
            <span className="text-zinc-700 hidden md:inline">|</span>
            <a
              href={CONTACT_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1 text-zinc-400 hover:text-amber-400 transition-colors"
            >
              <Instagram className="w-3.5 h-3.5 text-amber-400" />
              <span>{CONTACT_INFO.brandHandle}</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-zinc-400 hidden md:inline">
              Financiamento em até <strong className="text-amber-400">60x</strong> · Entrada no cartão em até <strong className="text-amber-400">21x</strong>
            </span>
            <span className="text-zinc-700 hidden sm:inline">·</span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              {CONTACT_INFO.whatsappFormatted}
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-15 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo with Gold Shield */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-zinc-900 border border-amber-500/40 flex items-center justify-center shadow-lg shadow-black/80 shrink-0">
            <GoldShield className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base sm:text-xl font-black tracking-wider text-white uppercase font-sans">
                D'<span className="text-amber-400">MOTORS</span>
              </span>
              <span className="text-[10px] font-semibold text-amber-300 bg-amber-950/70 border border-amber-600/50 px-1.5 py-0.2 rounded tracking-wide hidden xs:inline-block">
                {CONTACT_INFO.brandHandle}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-zinc-400 font-medium tracking-tight hidden sm:block">
              {CONTACT_INFO.slogan}
            </span>
          </div>
        </div>

        {/* GOLDEN RULE: VISIBLE AND ELEGANT MODE SWITCHER */}
        <div className="flex items-center bg-zinc-900/90 p-0.5 sm:p-1 rounded-xl border border-zinc-800 shadow-inner shrink-0">
          <button
            onClick={() => onViewChange('client')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
              currentView === 'client'
                ? 'bg-zinc-800 text-amber-300 shadow-md border border-amber-500/40'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Visualização da Vitrine Pública do Cliente"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Visão do Cliente</span>
            <span className="sm:hidden">Vitrine</span>
            <span className="text-[10px] font-mono bg-zinc-700/80 px-1 sm:px-1.5 py-0.2 rounded text-zinc-300">
              {availableCount}
            </span>
          </button>

          <button
            onClick={() => onViewChange('admin')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 cursor-pointer ${
              currentView === 'admin'
                ? 'bg-amber-950/70 text-amber-200 shadow-md border border-amber-500/60'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title="Painel Administrativo, Estoque e BI do Proprietário"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Painel do Proprietário</span>
            <span className="sm:hidden">Painel</span>
            {newLeadsCount > 0 && (
              <span className="text-[10px] font-mono bg-amber-500 text-black font-bold px-1 sm:px-1.5 py-0.2 rounded-full animate-pulse">
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
                  className="px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Venda seu Veículo
                </button>
              )}
              <a
                href={getWhatsAppUrl(`Olá ${CONTACT_INFO.brandName}! Quero atendimento sobre o estoque de veículos e motos.`)}
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
                <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{opportunityCount} Destaques</span>
              </span>
              <span className="bg-amber-950/60 border border-amber-600/40 text-amber-300 px-2.5 py-1.5 rounded-lg font-mono">
                Admin Conectado
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
