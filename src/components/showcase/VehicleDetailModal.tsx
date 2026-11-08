import React, { useState } from 'react';
import { Vehicle } from '../../types/vehicle';
import { formatBRL, formatKM, calculateInstallment, createWhatsAppLeadMessage } from '../../utils/formatters';
import {
  X,
  ShieldCheck,
  Flame,
  Gauge,
  Fuel,
  Calendar,
  Layers,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  Zap,
  Sliders,
  Share2
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
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80'
  ];

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Financing State
  const defaultDownPayment = Math.round(vehicle.price * 0.3);
  const [downPayment, setDownPayment] = useState<number>(defaultDownPayment);
  const [installments, setInstallments] = useState<number>(48);
  const [activeTab, setActiveTab] = useState<'details' | 'financing' | 'schedule'>('details');

  // Lead Form State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [hasTradeIn, setHasTradeIn] = useState(false);
  const [tradeInDetails, setTradeInDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [leadSuccess, setLeadSuccess] = useState(false);

  const simulation = calculateInstallment(vehicle.price, downPayment, installments);

  const handlePercentageClick = (percent: number) => {
    setDownPayment(Math.round(vehicle.price * (percent / 100)));
  };

  const handleSendSimulationLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    onSubmitLead({
      vehicleId: vehicle.id,
      vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.yearFabrication}`,
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
      vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.yearFabrication}`,
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

  const whatsappMessage = createWhatsAppLeadMessage({
    vehicleName: `${vehicle.brand} ${vehicle.model} ${vehicle.version}`,
    vehicleYear: vehicle.yearFabrication,
    vehiclePrice: vehicle.price,
    intent: activeTab === 'financing' ? 'financiamento' : 'interesse',
    downPayment: activeTab === 'financing' ? downPayment : undefined,
    installments: activeTab === 'financing' ? installments : undefined,
    monthlyPayment: activeTab === 'financing' ? simulation.monthlyInstallment : undefined,
  });

  const whatsappUrl = `https://wa.me/5511999998888?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-zinc-900 border-t sm:border border-zinc-800 rounded-t-2xl sm:rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col h-[94vh] sm:h-auto max-h-[100dvh] sm:max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {vehicle.brand} <span className="font-extrabold">{vehicle.model}</span>
                </span>
                {vehicle.isOpportunity && (
                  <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded shadow-sm">
                    <Flame className="w-3.5 h-3.5" />
                    Oportunidade
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
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: `${vehicle.brand} ${vehicle.model} - Dmotors`,
                    text: `Confira este ${vehicle.brand} ${vehicle.model} na Dmotors (@_dmotors)`,
                    url: window.location.href,
                  }).catch(() => {});
                }
              }}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors"
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
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImageIdx === idx
                          ? 'border-red-500 ring-2 ring-red-500/30'
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

              {/* Provenance Checklist Banner */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  Padrão de Procedência Dmotors
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Laudo Dekra 100%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Sem Sinistro / Leilão
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Garantia Dmotors {vehicle.warrantyMonths}m
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Manual & Chave Reserva
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Revisões Rigorosas
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    Documentação 2026 OK
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
                      Preço à Vista Showroom
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

                {vehicle.price < vehicle.fipePrice && (
                  <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-400 flex items-center justify-between">
                    <span>Oportunidade Real:</span>
                    <strong className="font-bold">
                      {formatBRL(vehicle.fipePrice - vehicle.price)} abaixo da FIPE!
                    </strong>
                  </div>
                )}

                {/* Technical highlights chips */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block">Quilometragem</span>
                    <strong className="text-zinc-200 text-sm">{formatKM(vehicle.mileage)}</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block">Câmbio</span>
                    <strong className="text-zinc-200 text-sm">{vehicle.transmission}</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block">Combustível</span>
                    <strong className="text-zinc-200 text-sm">{vehicle.fuel}</strong>
                  </div>
                  <div className="p-2.5 bg-zinc-900 rounded-lg border border-zinc-800/80">
                    <span className="text-zinc-500 block">Cor / Acabamento</span>
                    <strong className="text-zinc-200 text-sm truncate block">{vehicle.color}</strong>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Chamar Consultor no WhatsApp
                  </a>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveTab('financing')}
                      className={`py-2.5 px-3 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'financing'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5 text-amber-400" />
                      Simular Parcelas
                    </button>
                    <button
                      onClick={() => setActiveTab('schedule')}
                      className={`py-2.5 px-3 rounded-xl font-semibold text-xs border transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'schedule'
                          ? 'bg-red-500/20 text-red-300 border-red-500/50'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
                      }`}
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-red-400" />
                      Agendar Visita
                    </button>
                  </div>
                </div>
              </div>

              {/* Showroom location tag */}
              <div className="text-[11px] text-zinc-500 text-center py-1">
                📍 Disponível para visitação imediata no showroom Guarulhos · Av. Paulo Faccini, 32 - Macedo · Dmotors @_dmotors
              </div>
            </div>
          </div>

          {/* Interactive Tabs Section: Details, Financing Simulator, Schedule Visit */}
          <div className="border-t border-zinc-800 pt-6">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                  activeTab === 'details'
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Ficha Técnica & Opcionais
              </button>
              <button
                onClick={() => setActiveTab('financing')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'financing'
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Simulador de Financiamento
              </button>
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'schedule'
                    ? 'bg-red-950/60 text-red-300 border border-red-800/60'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5 text-red-400" />
                Proposta & Test Drive
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
                    Especificações do Conjunto Mecânico
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
                      <span className="text-zinc-500 block">Torque Máximo</span>
                      <strong className="text-zinc-200 text-sm">{vehicle.torqueKgfm} kgfm</strong>
                    </div>
                    <div className="bg-zinc-950/80 p-3 rounded-lg border border-zinc-800">
                      <span className="text-zinc-500 block">Consumo Médio</span>
                      <strong className="text-zinc-200 text-sm">
                        {vehicle.cityConsumption} urb / {vehicle.roadConsumption} rod
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Equipment & Features list */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                    Itens de Série e Opcionais Inclusos
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
              </div>
            )}

            {/* TAB 2: INTERACTIVE FINANCING SIMULATOR */}
            {activeTab === 'financing' && (
              <div className="pt-5 space-y-6 animate-in fade-in">
                <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Simulador de Financiamento Bancário
                      </h4>
                      <p className="text-xs text-zinc-400">
                        Cálculo estimado com as principais financeiras parceiras da Dmotors (Santander, Itaú, BV, Bradesco). Taxa ref. 1.39% a.m.
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
                        {[20, 30, 40, 50, 70].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => handlePercentageClick(pct)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors ${
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
                      max={Math.round(vehicle.price * 0.9)}
                      step={1000}
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full accent-amber-500 bg-zinc-800 h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Installments selection */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-zinc-300 block">Número de Parcelas</span>
                    <div className="grid grid-cols-5 gap-2">
                      {[12, 24, 36, 48, 60].map((term) => {
                        const termCalc = calculateInstallment(vehicle.price, downPayment, term);
                        const isSelected = installments === term;
                        return (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setInstallments(term)}
                            className={`p-3 rounded-xl border text-center transition-all ${
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

                  {/* Summary of simulation */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs">
                    <div>
                      <span className="text-zinc-500 block">Entrada Selecionada</span>
                      <strong className="text-zinc-200">{formatBRL(downPayment)}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Saldo a Financiar</span>
                      <strong className="text-zinc-200">{formatBRL(simulation.financedAmount)}</strong>
                    </div>
                    <div>
                      <span className="text-zinc-500 block">Condição Prévia</span>
                      <strong className="text-emerald-400">
                        {installments}x de {formatBRL(simulation.monthlyInstallment)}
                      </strong>
                    </div>
                  </div>

                  {/* Quick Form to save simulation as Lead in Owner CRM */}
                  <form onSubmit={handleSendSimulationLead} className="space-y-3 pt-2">
                    <h5 className="text-xs font-semibold text-zinc-300">
                      Gostou da simulação? Envie seus dados para aprovação rápida de crédito:
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Seu Nome Completo"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="tel"
                        placeholder="WhatsApp com DDD (ex: 11 99999-8888)"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="modalTradeIn"
                        checked={hasTradeIn}
                        onChange={(e) => setHasTradeIn(e.target.checked)}
                        className="rounded bg-zinc-900 border-zinc-700 text-amber-500 focus:ring-amber-500"
                      />
                      <label htmlFor="modalTradeIn" className="text-xs text-zinc-400">
                        Tenho um veículo para entrar como parte de pagamento (Troca)
                      </label>
                    </div>

                    {hasTradeIn && (
                      <input
                        type="text"
                        placeholder="Modelo, ano e km do seu veículo (ex: Polo TSI 2021 com 40.000km)"
                        value={tradeInDetails}
                        onChange={(e) => setTradeInDetails(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                      />
                    )}

                    {leadSuccess && (
                      <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Proposta e simulação enviadas com sucesso! Nossa equipe entrará em contato.
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center gap-1.5 transition-colors shadow-lg"
                      >
                        Enviar Simulação para Análise
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        Simular Direto no WhatsApp
                      </a>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: SCHEDULE VISIT / TEST DRIVE */}
            {activeTab === 'schedule' && (
              <div className="pt-5 space-y-6 animate-in fade-in">
                <div className="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800 space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <CalendarCheck className="w-4 h-4 text-red-400" />
                      Agendamento VIP de Visita & Test Drive
                    </h4>
                    <p className="text-xs text-zinc-400">
                      Reserve um horário exclusivo com um dos nossos consultores para avaliar o carro, ouvir o motor e tomar um café no nosso showroom na Av. Paulo Faccini, 32 - Macedo, Guarulhos - SP.
                    </p>
                  </div>

                  <form onSubmit={handleScheduleVisitLead} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Seu Nome Completo</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Carlos Eduardo"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">WhatsApp com DDD</label>
                        <input
                          type="tel"
                          required
                          placeholder="(11) 98765-4321"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">E-mail para confirmação</label>
                        <input
                          type="email"
                          placeholder="seuemail@exemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-400 mb-1 block">Data / Horário Pretendido</label>
                        <input
                          type="text"
                          placeholder="Ex: Amanhã às 15h ou Sábado de manhã"
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
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
                          className="rounded bg-zinc-900 border-zinc-700 text-red-500 focus:ring-red-500"
                        />
                        <label htmlFor="scheduleTradeIn" className="text-xs text-zinc-400">
                          Pretendo levar meu carro atual para avaliação presencial na troca
                        </label>
                      </div>

                      {hasTradeIn && (
                        <input
                          type="text"
                          placeholder="Qual veículo você trará para avaliação? (Marca, Modelo, Ano, KM)"
                          value={tradeInDetails}
                          onChange={(e) => setTradeInDetails(e.target.value)}
                          className="w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                        />
                      )}
                    </div>

                    {leadSuccess && (
                      <div className="p-3 bg-emerald-950/80 border border-emerald-800 rounded-lg text-emerald-400 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Visita pré-agendada com sucesso! Aguarde contato da recepção Dmotors.
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all"
                    >
                      <CalendarCheck className="w-4 h-4" />
                      Confirmar Solicitação de Agendamento
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
            <span className="text-[10px] text-zinc-400 uppercase font-semibold">Valor à vista</span>
            <span className="text-base font-black text-white truncate">{formatBRL(vehicle.price)}</span>
          </div>

          <a
            href={whatsappUrl}
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
