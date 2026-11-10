import React from 'react';
import { Search, CreditCard, Repeat, MessageCircle, CalendarCheck, Sparkles } from 'lucide-react';
import { CONTACT_INFO } from '../../config/contact';
import { VehicleType } from '../../types/vehicle';

interface HeroSectionProps {
  brands: string[];
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: string[];
  selectedType: string; // 'all' | 'carro' | 'moto'
  onTypeChange: (type: string) => void;
  selectedBodyType: string;
  onBodyTypeChange: (body: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onExploreClick: () => void;
  availableCount: number;
  onQuickFilter?: (type: string) => void;
  activeQuickFilter?: string;
}

const QUICK_FILTER_CHIPS = [
  { id: 'opportunities', label: 'Oportunidades' },
  { id: 'carros', label: 'Carros' },
  { id: 'motos', label: 'Motos' },
  { id: 'suv', label: 'SUVs' },
  { id: 'sedan', label: 'Sedans' },
  { id: 'price_50', label: 'Até R$ 50 mil' },
  { id: 'price_50_100', label: 'R$ 50 a 100 mil' },
  { id: 'price_100_plus', label: 'Acima de R$ 100 mil' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  brands,
  selectedBrand,
  onBrandChange,
  selectedModel,
  onModelChange,
  availableModels,
  selectedType,
  onTypeChange,
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
    <section className="relative overflow-hidden bg-zinc-950 pt-6 pb-8 sm:pt-10 sm:pb-16 border-b border-zinc-900">
      {/* Background glow in warm gold */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/20 via-zinc-950/60 to-zinc-950 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Intro Section - Real Store Positioning */}
        <div className="max-w-3xl mb-6 sm:mb-8">
          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-amber-300 bg-amber-950/70 border border-amber-600/50 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {CONTACT_INFO.brandName} · {CONTACT_INFO.brandHandle}
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">
              {CONTACT_INFO.city}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-2 sm:mb-4">
            Seu próximo carro <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600">está aqui.</span>
          </h1>

          <p className="text-xs sm:text-base text-zinc-300 leading-relaxed max-w-2xl">
            Populares e premium com procedência, financiamento em até 60x e entrada no cartão em até 21x. Aceitamos seu veículo na troca.
          </p>
        </div>

        {/* Quick Search & Filter Console in Gold & Black */}
        <div className="bg-zinc-900/90 backdrop-blur-md border border-amber-500/20 p-3.5 sm:p-5 rounded-2xl shadow-2xl shadow-black/80 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {/* 1. Search input */}
            <div className="col-span-2 lg:col-span-2">
              <label htmlFor="searchVehicleInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Buscar Modelo, Versão ou Moto
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="searchVehicleInput"
                  type="text"
                  placeholder="Ex: Toro, CR-V, Focus, BMW GS..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 sm:py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            {/* 2. Tipo (Carro vs Moto) */}
            <div className="col-span-1 lg:col-span-1">
              <label htmlFor="selectVehicleTypeInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Tipo
              </label>
              <select
                id="selectVehicleTypeInput"
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              >
                <option value="all">Todos (Carro/Moto)</option>
                <option value="carro">Carros</option>
                <option value="moto">Motos</option>
              </select>
            </div>

            {/* 3. Brand Dropdown */}
            <div className="col-span-1 lg:col-span-1">
              <label htmlFor="selectBrandInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                Marca
              </label>
              <select
                id="selectBrandInput"
                value={selectedBrand}
                onChange={(e) => onBrandChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 sm:px-3 py-2 sm:py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              >
                <option value="all">Marcas ({brands.length})</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Model Dropdown (Chained & Only in stock) */}
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
                    : 'bg-zinc-950 border-zinc-800 focus:border-amber-500 cursor-pointer'
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

            {/* 5. Submit CTA (Dynamic count) */}
            <div className="col-span-1 lg:col-span-1 flex flex-col justify-end">
              <button
                type="button"
                onClick={onExploreClick}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs py-2 sm:py-2.5 px-3 rounded-xl transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-1.5 h-[38px] cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-black" />
                <span className="truncate">
                  {availableCount === 1 ? 'Ver 1 veículo' : `Ver ${availableCount} veículos`}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Filter Chips (No emojis, exclusive filter) */}
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
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-500 text-black border-amber-400 shadow-md shadow-amber-950/50'
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

        {/* Real Store Pillars (No exaggerated promises, matching prompt item 8) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-zinc-900/80 text-xs text-zinc-400">
          <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-900/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-zinc-800/60">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-zinc-200 block text-[11px] sm:text-xs truncate">Financiamento em até 60x</strong>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">Diversas financeiras parceiras</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-900/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-zinc-800/60">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-zinc-200 block text-[11px] sm:text-xs truncate">Entrada no cartão em até 21x</strong>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">Facilidade no pagamento</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-900/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-zinc-800/60">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Repeat className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-zinc-200 block text-[11px] sm:text-xs truncate">Aceitamos sua troca</strong>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">Avaliação justa do seu usado</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 bg-zinc-900/50 sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-zinc-800/60">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <strong className="text-zinc-200 block text-[11px] sm:text-xs truncate">Atendimento no WhatsApp</strong>
              <span className="text-[10px] sm:text-[11px] text-zinc-400 block truncate">{CONTACT_INFO.whatsappFormatted}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
