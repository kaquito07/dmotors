import React, { useState } from 'react';
import { Vehicle } from '../../types/vehicle';
import { formatBRL, formatKM, calculateInstallment } from '../../utils/formatters';
import { Flame, ChevronLeft, ChevronRight, Gauge, Fuel, Calendar, ArrowRight, MessageSquareText, Sparkles } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicle: Vehicle) => void;
  onOpenSimulate: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onSelect, onOpenSimulate }) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  const images = vehicle.images.length > 0 ? vehicle.images : [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80'
  ];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  // Simulation preview: 30% down payment, 60x (up to 60x as requested)
  const downPaymentEstimate = Math.round(vehicle.price * 0.3);
  const sim = calculateInstallment(vehicle.price, downPaymentEstimate, 60);

  const isBelowFipe = vehicle.price < vehicle.fipePrice;
  const fipeDiff = vehicle.fipePrice - vehicle.price;

  return (
    <div
      onClick={() => onSelect(vehicle)}
      className="group bg-zinc-900/90 rounded-2xl border border-zinc-800/90 hover:border-amber-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/20 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Photo carousel container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
        <img
          src={images[currentImgIdx]}
          alt={`${vehicle.brand} ${vehicle.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80';
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-black/30 pointer-events-none" />

        {/* Carousel controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-sm opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-10"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentImgIdx ? 'w-4 bg-amber-400' : 'w-1.5 bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between z-10 pointer-events-none">
          {vehicle.isOpportunity ? (
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md shadow-md shadow-black/80">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
              Oportunidade
            </span>
          ) : (
            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-300 bg-zinc-900/80 backdrop-blur-sm px-2 py-0.5 rounded border border-zinc-700/60 capitalize">
              {vehicle.type}
            </span>
          )}

          {vehicle.isIllustrativePrice && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-amber-300 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded border border-amber-500/50">
              Preço ilustrativo
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Model */}
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-400 transition-colors truncate">
              {vehicle.brand} <span className="font-extrabold">{vehicle.model}</span>
            </h3>
            <span className="text-[11px] sm:text-xs font-mono text-zinc-400 shrink-0">
              Final {vehicle.plateEnd}
            </span>
          </div>

          {/* Version */}
          <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5 font-medium">
            {vehicle.version}
          </p>

          {/* Quick specs grid with ALWAYS HIGHLIGHTED MILEAGE */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 py-2.5 sm:py-3 my-2.5 sm:my-3 border-y border-zinc-800/80 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1 text-amber-300 font-bold truncate bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-600/30">
              <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{formatKM(vehicle.mileage)}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-300 truncate justify-center">
              <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{vehicle.yearFabrication}/{vehicle.yearModel}</span>
            </div>
            <div className="flex items-center gap-1 text-zinc-300 truncate justify-end">
              <Fuel className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <span className="truncate">{vehicle.fuel}</span>
            </div>
          </div>
        </div>

        {/* Pricing & Simulation snippet */}
        <div>
          <div className="flex items-baseline justify-between gap-1">
            <div className="flex flex-col min-w-0">
              <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {formatBRL(vehicle.price)}
              </span>
              {isBelowFipe && (
                <span className="text-[10px] sm:text-[11px] text-emerald-400 font-semibold truncate">
                  {formatBRL(fipeDiff)} abaixo da FIPE ({formatBRL(vehicle.fipePrice)})
                </span>
              )}
            </div>
            <span className="text-[11px] sm:text-xs text-zinc-400 font-medium bg-zinc-800 px-2 py-0.5 sm:py-1 rounded shrink-0">
              {vehicle.transmission}
            </span>
          </div>

          {/* Monthly financing snippet in up to 60x */}
          <div className="mt-2 text-[10px] sm:text-[11px] text-zinc-400 flex items-center justify-between bg-zinc-950/60 p-2 rounded-lg border border-zinc-800/60">
            <span>Simulação: Ent. + 60x</span>
            <strong className="text-amber-300 font-mono">
              {formatBRL(sim.monthlyInstallment)}/mês
            </strong>
          </div>

          {/* Action buttons (min 42px touch target) */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenSimulate(vehicle);
              }}
              className="min-h-[42px] py-2.5 px-3 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Simular</span>
            </button>
            <button
              onClick={() => onSelect(vehicle)}
              className="min-h-[42px] py-2.5 px-3 text-xs font-bold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black transition-colors flex items-center justify-center gap-1 shadow-md shadow-amber-950/40 cursor-pointer"
            >
              <span>Ver Detalhes</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
