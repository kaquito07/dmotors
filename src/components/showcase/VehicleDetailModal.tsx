import React, { useState } from 'react';
import { Vehicle } from '../../types/vehicle';
import {
  formatBRL,
  formatKM,
  calculateInstallment,
  calculateCardDownPayment,
  createWhatsAppLeadMessage,
} from '../../utils/formatters';
import { CONTACT_INFO, getVehicleInterestWhatsAppUrl } from '../../config/contact';
import {
  X,
  Gauge,
  Fuel,
  Calendar,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  CalendarCheck,
  CreditCard,
  Zap,
  Share2,
  Check,
  Flame
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (leadData: {
    vehicleId: string;
    vehicleName: string;
    customerName: string;
    phone: string;
    email: string;
    type: 'financiamento' | 'test_drive' | 'troca';
    downPayment?: number;
    installments?: number;
    monthlyPayment?: number;
    hasTradeIn: boolean;
    tradeInDetails?: string;
    preferredDate?: string;
  }) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onSubmitLead,
}) => {
  if (!isOpen || !vehicle) return null;

  const images = vehicle.images.length > 0 ? vehicle.images : [
    'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80'
  ];

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Financing State (up to 60x, up to 21x on credit card)
  const defaultDownPayment = Math.round(vehicle.price * 0.3);
  const [downPayment, setDownPayment] = useState<number>(defaultDownPayment);
  const [installments, setInstallments] = useState<number>(48);
  const [cardDownInstallments, setCardDownInstallments] = useState<number>(12);
  const [useCardDownPayment, setUseCardDownPayment] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'financing' | 'schedule'>('details');

  // Lead Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInDetails, setTradeInDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const simulation = calculateInstallment(vehicle.price, downPayment, installments);
  const cardSplit = calculateCardDownPayment(downPayment, cardDownInstallments);

  const handlePercentageClick = (pct: number) => {
    setDownPayment(Math.round((vehicle.price * pct) / 100));
  };

  const handleShare = () => {
    const url = window.location.href;
    const shareText = `Confira ${vehicle.brand} ${vehicle.model} (${vehicle.yearModel}) na D'MOTORS: ${formatBRL(vehicle.price)}`;

    if (navigator.share) {
      navigator.share({
        title: `${vehicle.brand} ${vehicle.model} - D'MOTORS`,
        text: shareText,
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${shareText}\n${url}`);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleFinancingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    onSubmitLead({
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.yearModel}`,
      customerName,
      phone,
      email,
      type: 'financiamento',
      downPayment,
      installments,
      monthlyPayment: simulation.monthlyInstallment,
      hasTradeIn,
      tradeInDetails: hasTradeIn ? tradeInDetails : undefined,
    });

    setLeadSuccess(true);
    setTimeout(() => {
      setLeadSuccess(false);
      onClose();
    }, 2500);
  };

  const handleScheduleVisitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    onSubmitLead({
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.yearModel}`,
      customerName,
      phone,
      email,
      type: 'test_drive',
      hasTradeIn,
      tradeInDetails: hasTradeIn ? tradeInDetails : undefined,
      preferredDate,
    });

    setLeadSuccess(true);
    setTimeout(() => {
      setLeadSuccess(false);
      onClose();
    }, 2500);
  };

  // WhatsApp lead URL: Prompt #9 standard template
  const directWhatsAppUrl = getVehicleInterestWhatsAppUrl({
    brand: vehicle.brand,
    model: vehicle.model,
    yearModel: vehicle.yearModel,
    price: vehicle.price,
  });

  const detailedWhatsAppUrl = `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${createWhatsAppLeadMessage({
    vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.version}`,
    vehicleYear: vehicle.yearModel,
    vehiclePrice: vehicle.price,
    intent: activeTab === 'financing' ? 'financiamento' : 'interesse',
    downPayment: activeTab === 'financing' ? downPayment : undefined,
    installments: activeTab === 'financing' ? installments : undefined,
    monthlyPayment: activeTab === 'financing' ? simulation.monthlyInstallment : undefined,
    cardDownPaymentInstallments: useCardDownPayment ? cardDownInstallments : undefined,
  })}`;

  const isBelowFipe = vehicle.price < vehicle.fipePrice;
  const isMoto = vehicle.type === 'moto';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-2xl sm:rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col h-[94vh] sm:h-auto max-h-[100dvh] sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/90 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {vehicle.brand} <span className="font-extrabold text-amber-400">{vehicle.model}</span>
                </span>
                {vehicle.isOpportunity && (
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-amber-600 text-black px-2 py-0.5 rounded shadow-sm">
                    <Flame className="w-3.5 h-3.5 fill-black" />
                    Oportunidade
                  </span>
                )}
                {vehicle.isIllustrativePrice && (
                  <span className="text-[11px] font-semibold text-amber-300 bg-black/80 border border-amber-500/50 px-2 py-0.5 rounded">
                    Preço ilustrativo
                  </span>
                )}
              </div>
              <span className="text-xs text-zinc-400 font-medium">
                {vehicle.version} · Ano {vehicle.yearFabrication}/{vehicle.yearModel} · Final {vehicle.plateEnd}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Compartilhar veículo"
            >
              {copiedShare ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] text-emerald-400 hidden sm:inline">Copiado!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span className="text-[11px] hidden sm:inline">Compartilhar</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Top Gallery and Highlights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery Column (7 cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="aspect-[16/10] w-full rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 relative group">
                <img
                  src={images[selectedImageIdx]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
                <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-zinc-300 font-mono border border-zinc-800">
                  {selectedImageIdx + 1} de {images.length} fotos
                </div>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        selectedImageIdx === idx
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt="Miniatura"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Real Store Pillars Banner */}
              <div className="bg-zinc-950/70 border border-amber-500/20 rounded-xl p-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5 font-medium text-amber-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Financiamento até 60x
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-amber-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Cartão até 21x
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-amber-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Troca com Troco
                  </span>
                  <span className="flex items-center gap-1.5 font-medium text-amber-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Atendimento Ágil
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Pricing & Action Column (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="bg-zinc-950/90 border border-zinc-800/90 rounded-xl p-5 space-y-4">
                <div className="flex items-baseline justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                      Preço Showroom
                    </span>
                    <span className="text-3xl font-black text-white tracking-tight">
                      {formatBRL(vehicle.price)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-zinc-400">Tabela FIPE</span>
                    <p className="text-sm font-semibold text-zinc-300">{formatBRL(vehicle.fipePrice)}</p>
                  </div>
                </div>

                {isBelowFipe && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-400 flex items-center justify-between">
                    <span>Oportunidade:</span>
                    <strong className="font-bold">
                      {formatBRL(vehicle.fipePrice - vehicle.price)} abaixo da FIPE!
                    </strong>
                  </div>
                )}

                {/* Technical highlights chips - ALWAYS HIGHLIGHTED MILEAGE */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-amber-950/30 rounded-lg border border-amber-600/40">
                    <span className="text-amber-400 block text-[10px] font-bold uppercase tracking-wider">
                      Quilometragem (Destaque)
                    </span>
                    <strong className="text-white text-base font-black font-mono">
                      {formatKM(vehicle.mileage)}
                    </strong>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Câmbio</span>
                    <strong className="text-zinc-200 text-sm truncate block">{vehicle.transmission}</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Combustível</span>
                    <strong className="text-zinc-200 text-sm truncate block">{vehicle.fuel}</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Cor / Acabamento</span>
                    <strong className="text-zinc-200 text-sm truncate block">{vehicle.color}</strong>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Chamar no WhatsApp Oficial
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveTab('financing')}
                      className={`py-2.5 px-3 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeTab === 'financing'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Simular Entrada/Parcelas
                    </button>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className={`py-2.5 px-3 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeTab === 'schedule'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
                      Proposta com Troca
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-zinc-400 text-center pt-1">
                  Atendimento em {CONTACT_INFO.city} · {CONTACT_INFO.whatsappFormatted}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Tabs Header */}
          <div className="pt-2">
            <div className="flex border-b border-zinc-800 gap-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'details'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Ficha do Veículo
              </button>
              <button
                onClick={() => setActiveTab('financing')}
                className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'financing'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Simulador de Financiamento (até 60x)
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'schedule'
                    ? 'border-amber-400 text-amber-300'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5 text-amber-400" />
                Proposta & Troca
              </button>
            </div>

            {/* TAB 1: DETAILS & TECHNICAL SPECS */}
            {activeTab === 'details' && (
              <div className="pt-5 space-y-6 animate-in fade-in">
                {vehicle.description && (
                  <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/80">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                      Apresentação do Veículo
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">{vehicle.description}</p>
                  </div>
                )}

                {/* Specs Grid */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    Especificações Técnicas
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block">Motorização</span>
                      <strong className="text-zinc-200 text-sm">{vehicle.engine}</strong>
                    </div>
                    <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block">Potência</span>
                      <strong className="text-zinc-200 text-sm">{vehicle.powerCv} cv</strong>
                    </div>
                    <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block">Tipo</span>
                      <strong className="text-zinc-200 text-sm capitalize">{vehicle.type}</strong>
                    </div>
                    {/* Motos não exibem portas */}
                    {!isMoto ? (
                      <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800">
                        <span className="text-zinc-500 block">Portas</span>
                        <strong className="text-zinc-200 text-sm">{vehicle.doors || 4} portas</strong>
                      </div>
                    ) : (
                      <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800">
                        <span className="text-zinc-500 block">Categoria</span>
                        <strong className="text-zinc-200 text-sm">Motocicleta</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* Features list */}
                {vehicle.features.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                      Itens e Destaques
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs text-zinc-300">
                      {vehicle.features.map((feat, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-medium">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INTERACTIVE FINANCING SIMULATOR (60X + 21X CARD) */}
            {activeTab === 'financing' && (
              <div className="pt-5 space-y-6 animate-in fade-in">
                <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-5 rounded-2xl border border-amber-500/20 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Simulador de Financiamento
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Financiamento em até 60x e entrada parcelada no cartão de crédito em até 21x.
                      </p>
                    </div>

                    <div className="text-right sm:border-l sm:border-zinc-800 sm:pl-4">
                      <span className="text-xs text-zinc-400">Parcela Estimada</span>
                      <div className="text-2xl font-black text-amber-400 font-mono">
                        {formatBRL(simulation.monthlyInstallment)}
                        <span className="text-xs text-zinc-400 font-sans font-normal">/mês</span>
                      </div>
                    </div>
                  </div>

                  {/* Down payment control */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor="downPaymentInput" className="font-semibold text-zinc-300">
                        Valor da Entrada: <strong className="text-white font-mono">{formatBRL(downPayment)}</strong>
                        <span className="text-zinc-500 ml-1.5">
                          ({Math.round((downPayment / vehicle.price) * 100)}% do valor)
                        </span>
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[20, 30, 40, 50].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handlePercentageClick(pct)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                              Math.round((downPayment / vehicle.price) * 100) === pct
                                ? 'bg-amber-500 text-black'
                                : 'bg-zinc-800 text-zinc-400 hover:text-white'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>

                    <input
                      id="downPaymentInput"
                      type="range"
                      min={Math.round(vehicle.price * 0.1)}
                      max={Math.round(vehicle.price * 0.8)}
                      step={1000}
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* PROMPT #6: NOVA OPÇÃO ENTRADA NO CARTÃO EM ATÉ 21X */}
                  <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-amber-400" />
                        <div>
                          <strong className="text-xs text-white block">Entrada no cartão de crédito em até 21x</strong>
                          <span className="text-[11px] text-zinc-400">
                            Parcele a entrada de {formatBRL(downPayment)} direto na maquininha
                          </span>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={useCardDownPayment}
                        onChange={(e) => setUseCardDownPayment(e.target.checked)}
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>

                    {useCardDownPayment && (
                      <div className="pt-2 border-t border-zinc-800/80 flex flex-wrap items-center gap-2">
                        <span className="text-xs text-zinc-400">Parcelar entrada em:</span>
                        {[6, 10, 12, 18, 21].map((split) => (
                          <button
                            key={split}
                            type="button"
                            onClick={() => setCardDownInstallments(split)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              cardDownInstallments === split
                                ? 'bg-amber-500 text-black border-amber-400 font-bold'
                                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                            }`}
                          >
                            {split}x de {formatBRL(calculateCardDownPayment(downPayment, split).installmentAmount)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Installments selection: Up to 60x */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-zinc-300 block">
                      Número de Parcelas do Financiamento (até 60x)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[12, 24, 36, 48, 60].map((term) => {
                        const termCalc = calculateInstallment(vehicle.price, downPayment, term);
                        const isSelected = installments === term;
                        return (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setInstallments(term)}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-white shadow-md'
                                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
                            }`}
                          >
                            <span className="text-xs font-bold block">{term}x</span>
                            <span className="text-[11px] font-mono text-zinc-300 mt-0.5 block truncate">
                              {formatBRL(termCalc.monthlyInstallment)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* PROMPT #6: TEXTO DE AVISO OBRIGATÓRIO */}
                  <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed">
                    ℹ️ <strong>Simulação ilustrativa.</strong> Consulte condições de financiamento. Equipamentos sujeitos à confirmação na unidade.
                  </div>

                  <div className="pt-2">
                    <a
                      href={detailedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Enviar Esta Simulação para o Consultor no WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROPOSTA & VISITA */}
            {activeTab === 'schedule' && (
              <div className="pt-5 animate-in fade-in">
                <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Envie sua Proposta ou Agende uma Visita
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Entraremos em contato rapidamente para confirmar os detalhes e avaliar seu veículo na troca.
                    </p>
                  </div>

                  <form onSubmit={handleScheduleVisitLead} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">Seu Nome *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: João da Silva"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">WhatsApp com DDD *</label>
                        <input
                          type="tel"
                          required
                          placeholder="(11) 99999-9999"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">E-mail (opcional)</label>
                        <input
                          type="email"
                          placeholder="seuemail@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-zinc-300 block mb-1">Data preferencial para visita</label>
                        <input
                          type="date"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="scheduleTradeIn"
                          checked={hasTradeIn}
                          onChange={(e) => setHasTradeIn(e.target.checked)}
                          className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-amber-500"
                        />
                        <label htmlFor="scheduleTradeIn" className="text-xs text-zinc-300 cursor-pointer">
                          Tenho um carro ou moto para dar na troca
                        </label>
                      </div>

                      {hasTradeIn && (
                        <input
                          type="text"
                          placeholder="Qual veículo você trará para avaliação? (Marca, Modelo, Ano, KM)"
                          value={tradeInDetails}
                          onChange={(e) => setTradeInDetails(e.target.value)}
                          className="w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      )}
                    </div>

                    {leadSuccess && (
                      <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Solicitação enviada com sucesso! Aguarde o contato da equipe {CONTACT_INFO.brandName}.
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-950 transition-all cursor-pointer"
                    >
                      <CalendarCheck className="w-4 h-4 text-black" />
                      Enviar Proposta de Agendamento
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Mobile Bottom Bar (< 640px) */}
        <div className="sm:hidden sticky bottom-0 z-30 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 p-3 px-4 flex items-center justify-between gap-3 shadow-2xl shrink-0">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Preço à vista</span>
            <span className="text-base font-black text-white truncate">{formatBRL(vehicle.price)}</span>
          </div>

          <a
            href={directWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Chamar WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
