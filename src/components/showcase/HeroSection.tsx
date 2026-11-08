import React from 'react';
import { Search, ShieldCheck, Award, Truck, Flame, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: string[];
  selectedBodyType: string;
  onBodyTypeChange: (body: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onExploreClick: () => void;
  availableCount: number;
  onQuickFilter?: (type: string) => void;
  activeQuickFilter?: string;
}

const QUICK_FILTER_CHIPS = [
  { id: 'opportunities', label: 'Oportunidades' },
  { id: 'suv', label: 'SUVs' },
  { id: 'sedan', label: 'Sedans' },
  { id: 'hatchback', label: 'Hatchbacks' },
  { id: 'price_120', label: 'Até R$ 120 mil' },
  { id: 'price_120_180', label: 'R$ 120 a R$ 180 mil' },
  { id: 'price_180_plus', label: 'Acima de R$ 180 mil' },
  { id: 'year_2022', label: 'Ano 2022+' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  brands,
  selectedBrand,
  onBrandChange,
  selectedModel,
  onModelChange,
  availableModels,
  selectedBodyType,
  onBodyTypeChange,
  searchTerm,
  onSearchChange,
  onExploreClick,
  availableCount,
  onQuickFilter,
  activeQuickFilter,
}) => {
  const isBrandSelected = selectedBrand !== 'all';

  return (
    <section className="relative overflow-hidden bg-zinc-950 pt-5 pb-7 sm:pt-8 sm:pb-14 border-b border-zinc-900">
      {/* Background glow and subtle automotive grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/25 via-zinc-950/50 to-zinc-950 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Editorial Brand Intro */}
        <div className="max-w-3xl mb-5 sm:mb-8">
          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-red-400 bg-red-950/70 border border-red-800/60 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Seleção Dmotors · @_dmotors
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-mono hidden sm:inline">
              Guarulhos - SP (Av. Paulo Faccini, 32 - Macedo)
            </span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-4">
            Curadoria Automotiva de Alta Classe.
          </h1>

          <p className="text-xs sm:text-base text-zinc-400 leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
            Seminovos de alta performance e veículos premium selecionados com rigor absoluto em Guarulhos.
            Cada modelo passa por inspeção cautelar de 150 pontos, histórico documentado e garantia total.
          </p>
        </div>

        {/* Quick Search & Filter Console (Hero Embedded) */}
        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-3.5 sm:p-5 rounded-2xl shadow-2xl shadow-black/80 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {/* 1. Search input (Full width in mobile, 1 col in desktop) */}
            <div className="col-span-2 lg:col-span-1">
              <label htmlFor="searchVehicleInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Buscar Modelo ou Versão
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="searchVehicleInput"
                  type="text"
                  placeholder="Ex: Golf GTI, Audi A3..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 sm:py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition-colors"
                />
              </div>
            </div>

            {/* 2. Brand Dropdown (Col 1 on mobile, 1 col on desktop) */}
            <div className="col-span-1 lg:col-span-1">
              <label htmlFor="selectBrandInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Marca
              </label>
              <select
                id="selectBrandInput"
                value={selectedBrand}
                onChange={(e) => onBrandChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
              >
                <option value="all">Marcas ({brands.length})</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Model Dropdown (Col 2 on mobile, side-by-side with Brand!) */}
            <div className="col-span-1 lg:col-span-1">
              <label htmlFor="selectModelInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Modelo
              </label>
              <select
                id="selectModelInput"
                value={selectedModel}
                onChange={(e) => onModelChange(e.target.value)}
                disabled={!isBrandSelected && availableModels.length === 0}
                className={`w-full border rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs text-white focus:outline-none transition-colors ${
                  !isBrandSelected
                    ? 'bg-zinc-950/50 border-zinc-800/50 text-zinc-500 cursor-not-allowed'
                    : 'bg-zinc-950 border-zinc-800 focus:border-red-500 cursor-pointer'
                }`}
              >
                {!isBrandSelected ? (
                  <option value="all">Escolha a marca</option>
                ) : (
                  <>
                    <option value="all">Todos ({availableModels.length})</option>
                    {availableModels.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* 4. Body Type Dropdown (Col 1 on mobile, 1 col on desktop) */}
            <div className="col-span-1 lg:col-span-1">
              <label htmlFor="selectBodyTypeInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Carroceria
              </label>
              <select
                id="selectBodyTypeInput"
                value={selectedBodyType}
                onChange={(e) => onBodyTypeChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs text-white focus:outline-none focus:border-red-500 transition-colors cursor-pointer"
              >
                <option value="all">Todas</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>

            {/* 5. Submit CTA (Col 2 on mobile, 1 col on desktop) */}
            <div className="col-span-1 lg:col-span-1 flex flex-col justify-end">
              <button
                type="button"
                onClick={onExploreClick}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs py-2 sm:py-2.5 px-3 rounded-xl transition-all shadow-lg shadow-red-950/60 flex items-center justify-center gap-1.5 h-[38px] cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="truncate">
                  {availableCount === 1 ? 'Ver 1 Carro' : `Ver ${availableCount} Carros`}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Filter Chips (Horizontal swipeable mobile strip) */}
          <div className="pt-2 sm:pt-3 border-t border-zinc-800/80">
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 -mx-3.5 px-3.5 sm:mx-0 sm:px-0 sm:flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 shrink-0 hidden sm:inline">
                Atalhos:
              </span>
              {QUICK_FILTER_CHIPS.map((chip) => {
                const isActive = activeQuickFilter === chip.id;
                return (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => onQuickFilter && onQuickFilter(chip.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950/50'
                        : 'bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800'
                    }`}
                  >
                    {chip.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quality assurance pillars (Mobile 2x2 grid with neat cards) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-900/80 text-xs text-zinc-400">
          <div className="flex items-center gap-2 sm:gap-3 bg-zinc-900/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-zinc-800/60">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-zinc-200 block text-[11px] sm:text-xs truncate">Perícia Dekra 100%</strong>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">Laudo sem apontamento</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-zinc-900/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-zinc-800/60">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-zinc-200 block text-[11px] sm:text-xs truncate">Garantia Dmotors</strong>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">Até 1 ano de cobertura</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-zinc-900/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-zinc-800/60">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-zinc-200 block text-[11px] sm:text-xs truncate">Entrega Nacional</strong>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">Prancha segurada</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 bg-zinc-900/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-zinc-800/60">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-400 shrink-0">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-zinc-200 block text-[11px] sm:text-xs truncate">Showroom Guarulhos</strong>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">Av. Paulo Faccini, 32</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
