import React from 'react';
import { Vehicle } from '../../types/vehicle';
import { formatBRL, formatKM } from '../../utils/formatters';
import { Flame, ShieldCheck, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

interface OpportunityCarouselProps {
  opportunities: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenSimulate: (vehicle: Vehicle) => void;
}

export const OpportunityCarousel: React.FC<OpportunityCarouselProps> = ({
  opportunities,
  onSelectVehicle,
  onOpenSimulate: _onOpenSimulate,
}) => {
  if (opportunities.length === 0) return null;

  return (
    <section className="py-6 sm:py-12 bg-gradient-to-b from-zinc-950 via-zinc-900/40 to-zinc-950 border-b border-zinc-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-2 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-500 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-red-500" />
              Seleção Exclusiva da Semana
            </div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Oportunidades Especiais Dmotors
              </h2>
              {/* Subtle visual swipe indicator on mobile */}
              <span className="md:hidden text-[11px] font-semibold text-red-400 flex items-center gap-0.5 shrink-0 bg-red-950/60 border border-red-800/50 px-2 py-0.5 rounded-full">
                Deslize para o lado <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 line-clamp-1 sm:line-clamp-none">
              Veículos com preços promocionais abaixo da FIPE e condições diferenciadas de entrada.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-medium shrink-0">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>Atualizado hoje com {opportunities.length} unidades limitadas</span>
          </div>
        </div>

        {/* Opportunities Horizontal Carousel with Scroll Snap on mobile, 3-col grid on desktop */}
        <div className="flex md:grid md:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
          {opportunities.map((car) => {
            const fipeSaving = car.fipePrice - car.price;
            return (
              <div
                key={car.id}
                onClick={() => onSelectVehicle(car)}
                className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center shrink-0 group relative rounded-2xl bg-zinc-900/90 border border-red-500/30 hover:border-red-500/80 p-1.5 transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/40 cursor-pointer flex flex-col justify-between"
              >
                {/* Special Ribbon */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-1.5 bg-red-600 text-white text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 sm:px-3 py-1 rounded-md shadow-lg shadow-black/80">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white" />
                  <span>Oportunidade</span>
                </div>

                {/* Image */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-950">
                  <img
                    src={car.images[0]}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />

                  {/* Below FIPE banner on image */}
                  {fipeSaving > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 bg-zinc-950/90 backdrop-blur-sm border border-emerald-500/40 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>{formatBRL(fipeSaving)} abaixo da FIPE</span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-red-400 transition-colors truncate">
                        {car.brand} {car.model}
                      </h3>
                      <span className="text-xs text-zinc-400 font-mono shrink-0">
                        {car.yearFabrication}/{car.yearModel}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{car.version}</p>

                    <div className="flex items-center gap-2 sm:gap-3 text-xs text-zinc-400 mt-2.5 pt-2.5 border-t border-zinc-800">
                      <span>{formatKM(car.mileage)}</span>
                      <span>·</span>
                      <span className="truncate">{car.transmission}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 text-emerald-400 shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Laudo 100%
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Valor Promocional</span>
                      <span className="text-lg sm:text-xl font-black text-white">{formatBRL(car.price)}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectVehicle(car);
                      }}
                      className="px-3 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-colors shadow-md shadow-red-950"
                    >
                      Ver Detalhes
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
