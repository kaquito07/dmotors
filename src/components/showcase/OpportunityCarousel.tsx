import React from 'react';
import { Vehicle } from '../../types/vehicle';
import { formatBRL, formatKM } from '../../utils/formatters';
import { Flame, ArrowRight, Sparkles, ChevronRight, Gauge } from 'lucide-react';
import { CONTACT_INFO } from '../../config/contact';

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
            <div className="flex items-center gap-2 text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
              Destaques da Semana
            </div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Oportunidades {CONTACT_INFO.brandName}
              </h2>
              {/* Subtle visual swipe indicator on mobile */}
              <span className="md:hidden text-[11px] font-semibold text-amber-300 flex items-center gap-0.5 shrink-0 bg-amber-950/60 border border-amber-600/50 px-2 py-0.5 rounded-full">
                Deslize para o lado <ChevronRight className="w-3 h-3" />
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 line-clamp-1 sm:line-clamp-none">
              Veículos e motos selecionados com excelentes condições de financiamento e entrada no cartão.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400 font-medium shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>{opportunities.length} unidades em destaque</span>
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
                className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center shrink-0 group relative rounded-2xl bg-zinc-900/90 border border-amber-500/30 hover:border-amber-400/80 p-1.5 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-950/30 cursor-pointer flex flex-col justify-between"
              >
                {/* Special Ribbon in Gold */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-10 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] sm:text-[11px] font-extrabold uppercase px-2.5 sm:px-3 py-1 rounded-md shadow-lg shadow-black/80">
                  <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
                  <span>Oportunidade</span>
                </div>

                {/* Preço ilustrativo badge if applicable */}
                {car.isIllustrativePrice && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-10 bg-zinc-950/90 border border-zinc-700 text-amber-300 text-[10px] font-semibold px-2 py-0.5 rounded shadow">
                    Preço ilustrativo
                  </div>
                )}

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
                      <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-400 transition-colors truncate">
                        {car.brand} {car.model}
                      </h3>
                      <span className="text-xs text-zinc-400 font-mono shrink-0">
                        {car.yearFabrication}/{car.yearModel}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 mt-0.5">{car.version}</p>

                    {/* SEMPRE QUILOMETRAGEM EM DESTAQUE */}
                    <div className="flex items-center gap-2 sm:gap-3 text-xs mt-2.5 pt-2.5 border-t border-zinc-800">
                      <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-950/50 border border-amber-600/30 px-2 py-0.5 rounded">
                        <Gauge className="w-3.5 h-3.5 text-amber-400" />
                        {formatKM(car.mileage)}
                      </span>
                      <span className="text-zinc-500">·</span>
                      <span className="text-zinc-400 truncate">{car.transmission}</span>
                      <span className="text-zinc-500">·</span>
                      <span className="text-zinc-400 capitalize">{car.type}</span>
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
                      className="px-3 py-2 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1.5 transition-colors shadow-md shadow-amber-950 cursor-pointer"
                    >
                      Ver Detalhes
                      <ArrowRight className="w-3.5 h-3.5 text-black" />
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
