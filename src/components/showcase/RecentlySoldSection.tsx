import React from 'react';
import { Vehicle } from '../../types/vehicle';
import { formatBRL, formatKM } from '../../utils/formatters';
import { CheckCircle2, History } from 'lucide-react';

interface RecentlySoldSectionProps {
  soldVehicles: Vehicle[];
}

export const RecentlySoldSection: React.FC<RecentlySoldSectionProps> = ({ soldVehicles }) => {
  if (soldVehicles.length === 0) return null;

  return (
    <section className="py-12 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <History className="w-4 h-4" />
              Histórico de Vendas
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Vendidos recentemente
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Prova de que aqui o negócio acontece.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Negócios concretizados em Guarulhos e região</span>
          </div>
        </div>

        {/* Grid of recently sold vehicles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {soldVehicles.map((vehicle) => {
            const firstImage = vehicle.images[0] || 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80';
            return (
              <div
                key={vehicle.id}
                className="relative rounded-2xl bg-zinc-900/60 border border-zinc-800/80 overflow-hidden group shadow-lg flex flex-col justify-between"
              >
                {/* Photo container in Grayscale with Red Angled Stamp */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950">
                  <img
                    src={firstImage}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="w-full h-full object-cover filter grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                  {/* Stamp "VENDIDO" in red angled box, matching Instagram style */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="transform -rotate-12 border-4 border-red-600 bg-red-600/90 text-white font-black tracking-widest text-2xl sm:text-3xl px-6 py-2 rounded-lg shadow-2xl uppercase select-none drop-shadow-[0_4px_12px_rgba(220,38,38,0.8)]">
                      VENDIDO
                    </div>
                  </div>

                  {/* Corner date pill */}
                  {vehicle.soldDate && (
                    <div className="absolute bottom-2.5 right-2.5 bg-zinc-950/90 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-mono border border-zinc-800">
                      Entregue em {vehicle.soldDate}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-base font-bold text-zinc-200 truncate">
                      {vehicle.brand} {vehicle.model}
                    </h3>
                    <span className="text-xs text-zinc-400 font-mono shrink-0">
                      {vehicle.yearFabrication}/{vehicle.yearModel}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1">{vehicle.version}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs">
                    <span className="text-zinc-400 font-medium">{formatKM(vehicle.mileage)}</span>
                    <span className="text-zinc-300 font-semibold">{formatBRL(vehicle.salePrice || vehicle.price)}</span>
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
