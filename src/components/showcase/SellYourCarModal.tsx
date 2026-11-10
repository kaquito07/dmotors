import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Car, DollarSign } from 'lucide-react';
import { LeadProposal } from '../../types/vehicle';
import { CONTACT_INFO } from '../../config/contact';

interface SellYourCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (lead: Omit<LeadProposal, 'id' | 'createdAt' | 'status'>) => void;
}

export const SellYourCarModal: React.FC<SellYourCarModalProps> = ({
  isOpen,
  onClose,
  onSubmitLead,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState<'carro' | 'moto'>('carro');
  const [carBrand, setCarBrand] = useState('');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('');
  const [carKm, setCarKm] = useState('');
  const [desiredPrice, setDesiredPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !carModel) return;

    const summaryDetails = `[${vehicleType.toUpperCase()}] ${carBrand} ${carModel} Ano ${carYear || 'N/I'}, ${carKm ? `${carKm} km` : ''}. Valor pretendido: ${desiredPrice || 'A combinar'}. Obs: ${notes || 'Nenhuma'}`;

    onSubmitLead({
      customerName,
      phone,
      email: email || 'contato@cliente.com',
      type: 'avaliacao_venda',
      hasTradeIn: false,
      tradeInDetails: summaryDetails,
      notes: `Captação online: ${summaryDetails}`,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Venda ou Troque com a {CONTACT_INFO.brandName}</h3>
              <p className="text-xs text-zinc-400">Avaliação ágil, pagamento seguro e sem burocracia</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Dados Recebidos com Sucesso!</h4>
              <p className="text-xs text-zinc-300 max-w-sm mx-auto">
                A equipe {CONTACT_INFO.brandName} entrará em contato via WhatsApp com uma proposta justa para seu veículo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Pagamento via <strong>TED/PIX imediato</strong> na unidade {CONTACT_INFO.cityState} após vistoria.
                </span>
              </div>

              {/* Personal info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Seu Nome</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Marcelo Costa"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 98888-7777"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Vehicle Type selector */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Tipo de Veículo</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setVehicleType('carro')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      vehicleType === 'carro'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    🚗 Carro
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('moto')}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      vehicleType === 'moto'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    🏍️ Moto
                  </button>
                </div>
              </div>

              {/* Vehicle details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Marca</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fiat, Honda, BMW, Ford"
                    value={carBrand}
                    onChange={(e) => setCarBrand(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Modelo e Versão</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Toro Volcano ou CR-V EX"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Ano</label>
                  <input
                    type="text"
                    placeholder="Ex: 2021"
                    value={carYear}
                    onChange={(e) => setCarYear(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">KM Atual</label>
                  <input
                    type="text"
                    placeholder="Ex: 45.000"
                    value={carKm}
                    onChange={(e) => setCarKm(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Valor Desejado (R$)</label>
                  <input
                    type="text"
                    placeholder="Ex: 85.000"
                    value={desiredPrice}
                    onChange={(e) => setDesiredPrice(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1">Observações ou Opcionais</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Único dono, manual, chave reserva, revisado recentemente..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-950/50 cursor-pointer"
                >
                  <Car className="w-4 h-4" />
                  Solicitar Avaliação Gratuita {CONTACT_INFO.brandName}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
