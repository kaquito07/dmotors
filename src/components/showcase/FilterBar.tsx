import React, { useState } from 'react';
import { SlidersHorizontal, Flame, RotateCcw, ArrowUpDown, ChevronDown, ChevronUp, Check } from 'lucide-react';

export type SortOption = 'price_asc' | 'price_desc' | 'km_asc' | 'year_desc';

interface FilterBarProps {
  selectedBrand: string;
  onBrandChange: (brand: string) => void;
  brands: string[];
  selectedModel: string;
  onModelChange: (model: string) => void;
  availableModels: string[];
  selectedBodyType: string;
  onBodyTypeChange: (body: string) => void;
  selectedTransmission: string;
  onTransmissionChange: (trans: string) => void;
  onlyOpportunities: boolean;
  onToggleOpportunities: (val: boolean) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  totalFiltered: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedBrand,
  onBrandChange,
  brands,
  selectedModel,
  onModelChange,
  availableModels,
  selectedBodyType,
  onBodyTypeChange,
  selectedTransmission,
  onTransmissionChange,
  onlyOpportunities,
  onToggleOpportunities,
  sortBy,
  onSortChange,
  totalFiltered,
  onResetFilters,
  hasActiveFilters,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const isBrandSelected = selectedBrand !== 'all';

  // Calculate count of active specific filters
  let activeFilterCount = 0;
  if (selectedBrand !== 'all') activeFilterCount++;
  if (selectedModel !== 'all') activeFilterCount++;
  if (selectedBodyType !== 'all') activeFilterCount++;
  if (selectedTransmission !== 'all') activeFilterCount++;
  if (onlyOpportunities) activeFilterCount++;

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-5 mb-6 sm:mb-8 space-y-3 sm:space-y-4 shadow-xl">
      {/* Mobile Top Bar (< 640px) */}
      <div className="sm:hidden flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Estoque
          </span>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
            {totalFiltered}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Opportunities quick toggle button */}
          <button
            onClick={() => onToggleOpportunities(!onlyOpportunities)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              onlyOpportunities
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
            }`}
          >
            <Flame className={`w-3 h-3 ${onlyOpportunities ? 'fill-white' : 'text-red-500'}`} />
            <span>Promo</span>
          </button>

          {/* Compact Sort Selector on mobile */}
          <div className="relative">
            <select
              aria-label="Ordenar veículos"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer max-w-[105px] truncate"
            >
              <option value="price_desc">↓ Preço</option>
              <option value="price_asc">↑ Preço</option>
              <option value="km_asc">↓ KM</option>
              <option value="year_desc">Ano</option>
            </select>
          </div>

          {/* Mobile Accordion Toggle Button */}
          <button
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
              isMobileExpanded || activeFilterCount > 0
                ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm'
                : 'bg-zinc-950 text-zinc-300 hover:text-white border-zinc-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-red-500" />
            <span>Filtros</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-600 text-[10px] font-mono text-white flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
            {isMobileExpanded ? (
              <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Top Row (>= 640px) */}
      <div className="hidden sm:flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-red-500" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Filtros do Catálogo
          </span>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
            {totalFiltered} veículos
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Opportunities quick toggle button */}
          <button
            onClick={() => onToggleOpportunities(!onlyOpportunities)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              onlyOpportunities
                ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-950'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border-zinc-800'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${onlyOpportunities ? 'fill-white' : 'text-red-500'}`} />
            Apenas Oportunidades
          </button>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 px-2.5 py-1.5 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Limpar todos os filtros"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar Filtros</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter controls: Expandable accordion on mobile, always visible on desktop */}
      <div
        className={`${
          isMobileExpanded ? 'block' : 'hidden'
        } sm:block pt-1 sm:pt-0 border-t sm:border-t-0 border-zinc-800/60`}
      >
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {/* 1. Brand */}
          <div className="col-span-1">
            <label htmlFor="filterBrandInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 block mb-1">
              Marca
            </label>
            <select
              id="filterBrandInput"
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 sm:px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">Todas ({brands.length})</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Model (Chained to Brand) */}
          <div className="col-span-1">
            <label htmlFor="filterModelInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 block mb-1">
              Modelo
            </label>
            <select
              id="filterModelInput"
              value={selectedModel}
              onChange={(e) => onModelChange(e.target.value)}
              disabled={!isBrandSelected && availableModels.length === 0}
              className={`w-full border rounded-xl px-2.5 sm:px-3 py-2 text-xs text-white focus:outline-none transition-colors ${
                !isBrandSelected
                  ? 'bg-zinc-950/50 border-zinc-800/50 text-zinc-500 cursor-not-allowed'
                  : 'bg-zinc-950 border-zinc-800 focus:border-red-500 cursor-pointer'
              }`}
            >
              {!isBrandSelected ? (
                <option value="all">Selecione marca</option>
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

          {/* 3. Body type */}
          <div className="col-span-1">
            <label htmlFor="filterBodyTypeInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 block mb-1">
              Carroceria
            </label>
            <select
              id="filterBodyTypeInput"
              value={selectedBodyType}
              onChange={(e) => onBodyTypeChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 sm:px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">Todas</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>

          {/* 4. Transmission */}
          <div className="col-span-1">
            <label htmlFor="filterTransmissionInput" className="text-[10px] sm:text-[11px] font-semibold text-zinc-400 block mb-1">
              Câmbio
            </label>
            <select
              id="filterTransmissionInput"
              value={selectedTransmission}
              onChange={(e) => onTransmissionChange(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-2.5 sm:px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">Todos</option>
              <option value="Automático">Automático</option>
              <option value="Dupla Embreagem">Dupla Embreagem</option>
              <option value="CVT">CVT</option>
              <option value="Manual">Manual</option>
            </select>
          </div>

          {/* 5. Sorting (Desktop view) */}
          <div className="col-span-2 lg:col-span-1 hidden sm:block">
            <label htmlFor="filterSortByInput" className="text-[11px] font-semibold text-zinc-400 block mb-1 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3 text-zinc-500" />
              Ordenar por
            </label>
            <select
              id="filterSortByInput"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="price_asc">Menor Preço</option>
              <option value="price_desc">Maior Preço</option>
              <option value="km_asc">Menor KM</option>
              <option value="year_desc">Mais Recentes (Ano)</option>
            </select>
          </div>
        </div>

        {/* Mobile action bar inside accordion */}
        <div className="sm:hidden flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-zinc-800/80">
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-lg bg-zinc-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Limpar
            </button>
          )}

          <button
            onClick={() => setIsMobileExpanded(false)}
            className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-1.5 shadow-md shadow-red-950"
          >
            <Check className="w-3.5 h-3.5" />
            Aplicar Filtros ({totalFiltered})
          </button>
        </div>
      </div>
    </div>
  );
};
