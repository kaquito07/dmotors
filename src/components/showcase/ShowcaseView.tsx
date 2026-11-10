import React, { useState, useMemo, useRef } from 'react';
import { Vehicle, LeadProposal } from '../../types/vehicle';
import { HeroSection } from './HeroSection';
import { OpportunityCarousel } from './OpportunityCarousel';
import { FilterBar, SortOption } from './FilterBar';
import { VehicleCard } from './VehicleCard';
import { RecentlySoldSection } from './RecentlySoldSection';
import { VehicleDetailModal } from './VehicleDetailModal';
import { SellYourCarModal } from './SellYourCarModal';
import { AboutDmotors } from './AboutDmotors';
import { Footer } from './Footer';
import { Sparkles, Car, RotateCcw } from 'lucide-react';

interface ShowcaseViewProps {
  vehicles: Vehicle[];
  onAddLead: (lead: Omit<LeadProposal, 'id' | 'createdAt' | 'status'>) => void;
  isSellModalOpen: boolean;
  setIsSellModalOpen: (open: boolean) => void;
}

export const ShowcaseView: React.FC<ShowcaseViewProps> = ({
  vehicles,
  onAddLead,
  isSellModalOpen,
  setIsSellModalOpen,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'carro' | 'moto'
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedModel, setSelectedModel] = useState('all');
  const [selectedBodyType, setSelectedBodyType] = useState('all');
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [onlyOpportunities, setOnlyOpportunities] = useState(false);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [minYear, setMinYear] = useState<number>(0);
  const [sortBy, setSortBy] = useState<SortOption>('price_desc');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);

  const catalogRef = useRef<HTMLDivElement>(null);

  // Available vehicles only in the showcase!
  const availableVehicles = useMemo(() => {
    return vehicles.filter((v) => v.status === 'available');
  }, [vehicles]);

  // Recently sold vehicles
  const soldVehicles = useMemo(() => {
    return vehicles.filter((v) => v.status === 'sold');
  }, [vehicles]);

  // Opportunities
  const opportunityVehicles = useMemo(() => {
    return availableVehicles.filter((v) => v.isOpportunity);
  }, [availableVehicles]);

  // Available Brands list (filtered by selectedType if set)
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    availableVehicles
      .filter((v) => (selectedType === 'all' ? true : (v.type || 'carro') === selectedType))
      .forEach((v) => brandSet.add(v.brand));
    return Array.from(brandSet).sort();
  }, [availableVehicles, selectedType]);

  // Chained Models list based strictly on current available inventory
  const availableModels = useMemo(() => {
    if (selectedBrand === 'all') {
      return [];
    }
    const modelSet = new Set<string>();
    availableVehicles
      .filter((v) => {
        const matchesBrand = v.brand === selectedBrand;
        const matchesType = selectedType === 'all' ? true : (v.type || 'carro') === selectedType;
        return matchesBrand && matchesType;
      })
      .forEach((v) => modelSet.add(v.model));

    return Array.from(modelSet).sort();
  }, [availableVehicles, selectedBrand, selectedType]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel('all');
    setActiveQuickFilter(null);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setSelectedBrand('all');
    setSelectedModel('all');
    setActiveQuickFilter(null);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickFilter = (chipId: string) => {
    if (activeQuickFilter === chipId) {
      // Toggle off
      setActiveQuickFilter(null);
      handleResetFilters();
      return;
    }

    // Always reset other filters first so quick filters do not accumulate
    setSearchTerm('');
    setSelectedBrand('all');
    setSelectedModel('all');
    setSelectedTransmission('all');
    setSelectedBodyType('all');
    setSelectedType('all');
    setOnlyOpportunities(false);
    setMinPrice(0);
    setMaxPrice(1000000);
    setMinYear(0);

    setActiveQuickFilter(chipId);

    // Apply specific quick filter exclusively
    switch (chipId) {
      case 'opportunities':
        setOnlyOpportunities(true);
        break;
      case 'carros':
        setSelectedType('carro');
        break;
      case 'motos':
        setSelectedType('moto');
        break;
      case 'suv':
        setSelectedBodyType('SUV');
        setSelectedType('carro');
        break;
      case 'sedan':
        setSelectedBodyType('Sedan');
        setSelectedType('carro');
        break;
      case 'price_50':
        setMinPrice(0);
        setMaxPrice(50000);
        break;
      case 'price_50_100':
        setMinPrice(50000);
        setMaxPrice(100000);
        break;
      case 'price_100_plus':
        setMinPrice(100000);
        setMaxPrice(1000000);
        break;
      default:
        break;
    }

    scrollToCatalog();
  };

  // Filtered & Sorted inventory
  const filteredVehicles = useMemo(() => {
    return availableVehicles
      .filter((car) => {
        // Vehicle Type (Carro / Moto)
        const carType = car.type || 'carro';
        if (selectedType !== 'all' && carType !== selectedType) {
          return false;
        }

        // Search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = `${car.brand} ${car.model} ${car.version}`.toLowerCase().includes(term);
          const matchEngine = car.engine.toLowerCase().includes(term);
          if (!matchName && !matchEngine) return false;
        }

        // Brand
        if (selectedBrand !== 'all' && car.brand !== selectedBrand) {
          return false;
        }

        // Model (Chained)
        if (selectedModel !== 'all' && car.model !== selectedModel) {
          return false;
        }

        // Body type
        if (selectedBodyType !== 'all' && car.bodyType !== selectedBodyType) {
          return false;
        }

        // Transmission
        if (selectedTransmission !== 'all' && car.transmission !== selectedTransmission) {
          return false;
        }

        // Opportunities only
        if (onlyOpportunities && !car.isOpportunity) {
          return false;
        }

        // Price range
        if (car.price < minPrice || car.price > maxPrice) {
          return false;
        }

        // Min Year
        if (minYear > 0 && car.yearModel < minYear) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'km_asc') return a.mileage - b.mileage;
        if (sortBy === 'year_desc') return b.yearModel - a.yearModel;
        return 0;
      });
  }, [
    availableVehicles,
    selectedType,
    searchTerm,
    selectedBrand,
    selectedModel,
    selectedBodyType,
    selectedTransmission,
    onlyOpportunities,
    minPrice,
    maxPrice,
    minYear,
    sortBy,
  ]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedType !== 'all' ||
    selectedBrand !== 'all' ||
    selectedModel !== 'all' ||
    selectedBodyType !== 'all' ||
    selectedTransmission !== 'all' ||
    onlyOpportunities ||
    minPrice > 0 ||
    maxPrice < 1000000 ||
    minYear > 0 ||
    activeQuickFilter !== null;

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedBrand('all');
    setSelectedModel('all');
    setSelectedBodyType('all');
    setSelectedTransmission('all');
    setOnlyOpportunities(false);
    setMinPrice(0);
    setMaxPrice(1000000);
    setMinYear(0);
    setActiveQuickFilter(null);
  };

  const handleOpenCarDetail = (car: Vehicle) => {
    setSelectedVehicle(car);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* 1. Hero Section with Quick Search */}
      <HeroSection
        brands={availableBrands}
        selectedBrand={selectedBrand}
        onBrandChange={handleBrandChange}
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        availableModels={availableModels}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
        selectedBodyType={selectedBodyType}
        onBodyTypeChange={setSelectedBodyType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExploreClick={scrollToCatalog}
        availableCount={filteredVehicles.length}
        onQuickFilter={handleQuickFilter}
        activeQuickFilter={activeQuickFilter || undefined}
      />

      {/* 2. Spotlight: Oportunidades da Semana D'MOTORS */}
      {opportunityVehicles.length > 0 && (
        <OpportunityCarousel
          opportunities={opportunityVehicles}
          onSelectVehicle={handleOpenCarDetail}
          onOpenSimulate={handleOpenCarDetail}
        />
      )}

      {/* 3. Main Catalog Section */}
      <main ref={catalogRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
              <Car className="w-4 h-4" />
              Estoque Oficial @_dmotors
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Todos os Veículos no Showroom
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Carros e motos revisados, higienizados e prontos para entrega imediata em Guarulhos e região.
            </p>
          </div>
        </div>

        {/* Dynamic Filter Bar */}
        <FilterBar
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
          selectedBrand={selectedBrand}
          onBrandChange={handleBrandChange}
          brands={availableBrands}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
          availableModels={availableModels}
          selectedBodyType={selectedBodyType}
          onBodyTypeChange={setSelectedBodyType}
          selectedTransmission={selectedTransmission}
          onTransmissionChange={setSelectedTransmission}
          onlyOpportunities={onlyOpportunities}
          onToggleOpportunities={setOnlyOpportunities}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalFiltered={filteredVehicles.length}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Vehicles Grid */}
        {filteredVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((car) => (
              <VehicleCard
                key={car.id}
                vehicle={car}
                onSelect={handleOpenCarDetail}
                onOpenSimulate={handleOpenCarDetail}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/40 rounded-2xl border border-zinc-800/80 p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Nenhum veículo encontrado com esses filtros</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Tente redefinir a busca ou limpar os filtros para visualizar os outros veículos disponíveis no showroom.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-400 text-black transition-colors cursor-pointer font-bold"
            >
              Restaurar Todos os Filtros
            </button>
          </div>
        )}

        {/* Sell / Trade Banner CTA */}
        <div className="mt-16 bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 flex items-center gap-1.5 justify-center md:justify-start">
              <Sparkles className="w-4 h-4" />
              Quer Vender ou Trocar seu Carro ou Moto?
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              A D'MOTORS compra seu veículo ou aceita como entrada na troca.
            </h3>
            <p className="text-xs text-zinc-400 max-w-xl">
              Avaliação ágil baseada nas condições reais do mercado. Pagamento seguro e sem burocracia na unidade de Guarulhos.
            </p>
          </div>

          <button
            onClick={() => setIsSellModalOpen(true)}
            className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-lg shadow-amber-950/60 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Car className="w-4 h-4" />
            Solicitar Avaliação Grátis
          </button>
        </div>
      </main>

      {/* 4. Recently Sold Section */}
      <RecentlySoldSection soldVehicles={soldVehicles} />

      {/* 5. About D'MOTORS & Reviews */}
      <AboutDmotors />

      {/* 6. Footer */}
      <Footer />

      {/* Modals */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onSubmitLead={(lead) => {
          onAddLead(lead);
        }}
      />

      <SellYourCarModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onSubmitLead={(lead) => {
          onAddLead(lead);
        }}
      />
    </div>
  );
};
