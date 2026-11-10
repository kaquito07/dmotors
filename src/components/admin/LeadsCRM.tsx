import React, { useState } from 'react';
import { LeadProposal, LeadStatus } from '../../types/vehicle';
import { formatBRL, formatDateBR } from '../../utils/formatters';
import {
  Users,
  PhoneCall,
  Car,
} from 'lucide-react';
import { CONTACT_INFO } from '../../config/contact';

interface LeadsCRMProps {
  leads: LeadProposal[];
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onDeleteLead?: (leadId: string) => void;
}

export const LeadsCRM: React.FC<LeadsCRMProps> = ({ leads, onUpdateLeadStatus }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredLeads = leads.filter((lead) => {
    if (filterType !== 'all' && lead.type !== filterType) return false;
    return true;
  });

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'novo':
        return (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase animate-pulse">
            Novo Lead
          </span>
        );
      case 'em_atendimento':
        return (
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            Em Atendimento
          </span>
        );
      case 'visita_agendada':
        return (
          <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            Visita Agendada
          </span>
        );
      case 'proposta_aceita':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            Negócio Fechado
          </span>
        );
      case 'perdido':
        return (
          <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
            Arquivado / Perdido
          </span>
        );
    }
  };

  const getLeadTypeLabel = (type: LeadProposal['type']) => {
    switch (type) {
      case 'financiamento':
        return 'Simulação de Financiamento';
      case 'test_drive':
        return 'Agendamento de Visita';
      case 'troca':
        return 'Proposta com Veículo na Troca';
      case 'avaliacao_venda':
        return 'Avaliação Venda seu Carro/Moto';
      case 'compra_imediata':
        return 'Compra Imediata à Vista';
      default:
        return 'Contato Geral';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            CRM de Leads & Propostas da Vitrine
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie contatos recebidos em tempo real via simulações, agendamentos e formulário de troca.
          </p>
        </div>

        {/* Filter by lead type */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Todos ({leads.length})
          </button>
          <button
            onClick={() => setFilterType('financiamento')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'financiamento' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Financiamento
          </button>
          <button
            onClick={() => setFilterType('test_drive')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'test_drive' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Visita
          </button>
          <button
            onClick={() => setFilterType('avaliacao_venda')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterType === 'avaliacao_venda' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Avaliação
          </button>
        </div>
      </div>

      {/* Leads List / Cards */}
      <div className="space-y-3">
        {filteredLeads.map((lead) => {
          const cleanPhone = lead.phone.replace(/\D/g, '');
          const whatsappUrl = `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(
            `Olá, ${lead.customerName}! Aqui é da ${CONTACT_INFO.brandName} (${CONTACT_INFO.brandHandle}). Recebemos sua solicitação sobre ${
              lead.vehicleName || 'a avaliação do seu veículo'
            }. Como podemos te atender melhor hoje?`
          )}`;

          return (
            <div
              key={lead.id}
              className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-sm shrink-0">
                    {lead.customerName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-white text-sm">{lead.customerName}</strong>
                      {getStatusBadge(lead.status)}
                    </div>
                    <span className="text-xs text-zinc-400 block mt-0.5">
                      {getLeadTypeLabel(lead.type)} · Recebido em {formatDateBR(lead.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Status selector */}
                <div className="flex items-center gap-2">
                  <label htmlFor={`leadStatusSelect-${lead.id}`} className="text-xs text-zinc-400">Status:</label>
                  <select
                    id={`leadStatusSelect-${lead.id}`}
                    value={lead.status}
                    onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                    className="bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="novo">Novo</option>
                    <option value="em_atendimento">Em Atendimento</option>
                    <option value="visita_agendada">Visita Agendada</option>
                    <option value="proposta_aceita">Negócio Fechado</option>
                    <option value="perdido">Arquivado</option>
                  </select>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Responder WhatsApp
                  </a>
                </div>
              </div>

              {/* Lead details summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-zinc-950/60 p-3.5 rounded-xl border border-zinc-800/60">
                <div>
                  <span className="text-zinc-500 block">Veículo de Interesse:</span>
                  <strong className="text-zinc-200">
                    {lead.vehicleName || 'Avaliação / Captação para Compra'}
                  </strong>
                </div>

                <div>
                  <span className="text-zinc-500 block">Telefone / WhatsApp:</span>
                  <strong className="text-emerald-400 font-mono">{lead.phone}</strong>
                  {lead.email && <span className="text-[11px] text-zinc-400 block truncate">{lead.email}</span>}
                </div>

                {lead.monthlyPayment ? (
                  <div>
                    <span className="text-zinc-500 block">Simulação Solicitada:</span>
                    <strong className="text-amber-400 font-mono">
                      Ent. {formatBRL(lead.downPayment || 0)} + {lead.installments}x de {formatBRL(lead.monthlyPayment)}
                    </strong>
                  </div>
                ) : lead.preferredDate ? (
                  <div>
                    <span className="text-zinc-500 block">Data de Visita Solicitada:</span>
                    <strong className="text-amber-400">{lead.preferredDate}</strong>
                  </div>
                ) : (
                  <div>
                    <span className="text-zinc-500 block">Tipo de Proposta:</span>
                    <strong className="text-zinc-300">Avaliação para compra direta</strong>
                  </div>
                )}
              </div>

              {/* Trade-in info if any */}
              {lead.hasTradeIn && lead.tradeInDetails && (
                <div className="text-xs bg-zinc-950 p-3 rounded-lg border border-zinc-800 text-zinc-300 flex items-start gap-2">
                  <Car className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-400">Veículo na Troca Informado pelo Cliente:</strong>
                    <p className="text-zinc-300 mt-0.5">{lead.tradeInDetails}</p>
                  </div>
                </div>
              )}

              {lead.notes && (
                <p className="text-xs text-zinc-400 italic">
                  <strong>Observação:</strong> {lead.notes}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
