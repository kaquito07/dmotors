/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Vehicle, LeadProposal, LeadStatus } from './types/vehicle';
import { INITIAL_VEHICLES, INITIAL_LEADS } from './data/mockVehicles';
import { Header, AppViewMode } from './components/Header';
import { ShowcaseView } from './components/showcase/ShowcaseView';
import { AdminView } from './components/admin/AdminView';
import { ToastContainer, ToastMessage } from './components/common/Toast';

const STORAGE_KEY_VEHICLES = 'dmotors_vehicles_v5';
const STORAGE_KEY_LEADS = 'dmotors_leads_v2';

export default function App() {
  // Global View Mode Toggle: Client (Public Showcase) vs Admin (Owner BI & Stock)
  const [currentView, setCurrentView] = useState<AppViewMode>('client');

  // Shared in-memory state with localStorage hydration
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VEHICLES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load vehicles from localStorage:', e);
    }
    return INITIAL_VEHICLES;
  });

  const [leads, setLeads] = useState<LeadProposal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEADS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load leads from localStorage:', e);
    }
    return INITIAL_LEADS;
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VEHICLES, JSON.stringify(vehicles));
    } catch (e) {
      console.error('Failed to save vehicles to localStorage:', e);
    }
  }, [vehicles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LEADS, JSON.stringify(leads));
    } catch (e) {
      console.error('Failed to save leads to localStorage:', e);
    }
  }, [leads]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Vehicle Management Handlers (CRUD & Real-time State)
  const handleAddVehicle = (newVehicle: Vehicle) => {
    setVehicles((prev) => [newVehicle, ...prev]);
    addToast(
      'success',
      'Veículo adicionado ao estoque!',
      `${newVehicle.brand} ${newVehicle.model} já está visível na vitrine pública e no estoque ativo.`
    );
  };

  const handleUpdateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === updatedVehicle.id ? updatedVehicle : v))
    );
    addToast(
      'success',
      'Veículo atualizado!',
      `As alterações de ${updatedVehicle.brand} ${updatedVehicle.model} foram salvas.`
    );
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    const car = vehicles.find((v) => v.id === vehicleId);
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    addToast(
      'info',
      'Veículo removido',
      car ? `${car.brand} ${car.model} foi excluído do sistema.` : undefined
    );
  };

  const handleToggleOpportunity = (vehicleId: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          const nextState = !v.isOpportunity;
          addToast(
            nextState ? 'success' : 'info',
            nextState ? 'Oportunidade ativada!' : 'Destaque removido',
            `${v.brand} ${v.model} ${
              nextState
                ? 'agora aparece no topo da Vitrine como Oportunidade da Semana.'
                : 'não está mais marcado como oportunidade.'
            }`
          );
          return { ...v, isOpportunity: nextState };
        }
        return v;
      })
    );
  };

  const handleMarkVehicleSold = (data: {
    vehicleId: string;
    salePrice: number;
    soldDate: string;
    buyerName: string;
    saleChannel: 'Instagram @_dmotors' | 'Loja Física' | 'Webmotors' | 'Indicação' | 'WhatsApp Direto';
  }) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === data.vehicleId) {
          return {
            ...v,
            status: 'sold',
            salePrice: data.salePrice,
            soldDate: data.soldDate,
            buyerName: data.buyerName,
            saleChannel: data.saleChannel,
            isOpportunity: false,
          };
        }
        return v;
      })
    );

    const car = vehicles.find((v) => v.id === data.vehicleId);
    addToast(
      'success',
      'Venda confirmada com sucesso! 🏁',
      car
        ? `${car.brand} ${car.model} foi movido para o histórico de vendas. O faturamento e margens do BI foram recalculados instantaneamente.`
        : 'Estoque e BI atualizados.'
    );
  };

  // Lead / Proposal Handlers
  const handleAddLead = (leadData: Omit<LeadProposal, 'id' | 'createdAt' | 'status'>) => {
    const newLead: LeadProposal = {
      ...leadData,
      id: `lead-${Date.now()}`,
      status: 'novo',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    setLeads((prev) => [newLead, ...prev]);

    addToast(
      'success',
      'Proposta enviada à Dmotors! 📩',
      'Nossa equipe de consultores recebeu sua simulação/solicitação e entrará em contato via WhatsApp.'
    );
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead))
    );
    addToast('info', 'Status do lead atualizado no CRM');
  };

  // Derived counts for header
  const availableCount = vehicles.filter((v) => v.status === 'available').length;
  const opportunityCount = vehicles.filter((v) => v.status === 'available' && v.isOpportunity).length;
  const newLeadsCount = leads.filter((l) => l.status === 'novo').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans antialiased selection:bg-red-600 selection:text-white">
      {/* 1. Golden Rule: Sticky Header with Mode Switcher */}
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        availableCount={availableCount}
        opportunityCount={opportunityCount}
        newLeadsCount={newLeadsCount}
        onOpenSellModal={() => setIsSellModalOpen(true)}
      />

      {/* 2. Active View: Client (Public Showcase) vs Owner (Admin & BI) */}
      {currentView === 'client' ? (
        <ShowcaseView
          vehicles={vehicles}
          onAddLead={handleAddLead}
          isSellModalOpen={isSellModalOpen}
          setIsSellModalOpen={setIsSellModalOpen}
        />
      ) : (
        <AdminView
          vehicles={vehicles}
          leads={leads}
          onAddVehicle={handleAddVehicle}
          onUpdateVehicle={handleUpdateVehicle}
          onDeleteVehicle={handleDeleteVehicle}
          onToggleOpportunity={handleToggleOpportunity}
          onMarkVehicleSold={handleMarkVehicleSold}
          onUpdateLeadStatus={handleUpdateLeadStatus}
        />
      )}

      {/* 3. Global Toast Notifications Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
