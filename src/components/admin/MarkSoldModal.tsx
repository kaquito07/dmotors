import React, { useState } from 'react';
import { Vehicle } from '../../types/vehicle';
import { formatBRL, calculateDaysInStock } from '../../utils/formatters';
import { X, CheckCircle2, DollarSign, Calendar, User, Tag, Sparkles } from 'lucide-react';

interface MarkSoldModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSold: (data: {
    vehicleId: string;
    salePrice: number;
    soldDate: string;
    buyerName: string;
    saleChannel: 'Instagram @_dmotors' | 'Loja Física' | 'Webmotors' | 'Indicação' | 'WhatsApp Direto';
  }) => void;
}

export const MarkSoldModal: React.FC<MarkSoldModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onConfirmSold,
}) => {
  if (!isOpen || !vehicle) return null;

  const [salePrice, setSalePrice] = useState<number>(vehicle.price);
  const [soldDate, setSoldDate] = useState<string>('2026-10-26');
  const [buyerName, setBuyerName] = useState<string>('');
  const [saleChannel, setSaleChannel] = useState<
    'Instagram @_dmotors' | 'Loja Física' | 'Webmotors' | 'Indicação' | 'WhatsApp Direto'
  >('Instagram @_dmotors');

  const grossProfit = salePrice - vehicle.purchasePrice;
  const marginPct = salePrice > 0 ? ((grossProfit / salePrice) * 100).toFixed(1) : '0';
  const daysInStock = calculateDaysInStock(vehicle.entryDate, soldDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmSold({
      vehicleId: vehicle.id,
      salePrice,
      soldDate,
      buyerName: buyerName || 'Cliente Dmotors',
      saleChannel,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Registrar Venda do Veículo</h3>
              <p className="text-xs text-zinc-400">
                {vehicle.brand} {vehicle.model} ({vehicle.yearFabrication})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Financial summary banner */}
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Custo de Aquisição (Compra):</span>
              <strong className="text-zinc-200 font-mono">{formatBRL(vehicle.purchasePrice)}</strong>
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Dias em Estoque até a Venda:</span>
              <strong className="text-zinc-200 font-mono">{daysInStock} dias</strong>
            </div>

            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-400">Lucro Bruto Projetado:</span>
              <div className="text-right">
                <span className="text-base font-black text-emerald-400 font-mono">
                  +{formatBRL(grossProfit)}
                </span>
                <span className="text-xs text-zinc-400 ml-1.5">({marginPct}% margem)</span>
              </div>
            </div>
          </div>

          {/* Final Sale Price Input */}
          <div>
            <label htmlFor="finalSalePriceInput" className="text-xs font-semibold text-zinc-300 block mb-1">
              Valor Final Fechado da Venda (R$)
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="finalSalePriceInput"
                type="number"
                required
                min={1000}
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Sold Date & Buyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="soldDateInput" className="text-xs font-semibold text-zinc-300 block mb-1">
                Data do Fechamento
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="soldDateInput"
                  type="date"
                  required
                  value={soldDate}
                  onChange={(e) => setSoldDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="buyerNameInput" className="text-xs font-semibold text-zinc-300 block mb-1">
                Nome do Comprador
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="buyerNameInput"
                  type="text"
                  placeholder="Ex: Carlos Mendes"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Sale Channel */}
          <div>
            <label htmlFor="saleChannelInput" className="text-xs font-semibold text-zinc-300 block mb-1">
              Canal de Aquisição / Origem do Cliente
            </label>
            <select
              id="saleChannelInput"
              value={saleChannel}
              onChange={(e) => setSaleChannel(e.target.value as any)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Instagram @_dmotors">Instagram Oficial @_dmotors</option>
              <option value="Loja Física">Loja Física / Showroom Jardins</option>
              <option value="Webmotors">Portal Webmotors</option>
              <option value="Indicação">Indicação de Cliente Satisfeito</option>
              <option value="WhatsApp Direto">WhatsApp Direto Showroom</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Confirmar Venda e Atualizar BI Instantaneamente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
