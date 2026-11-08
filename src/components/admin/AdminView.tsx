import React, { useState } from 'react';
import { Vehicle, LeadProposal, LeadStatus } from '../../types/vehicle';
import { DashboardBI } from './DashboardBI';
import { StockManagement } from './StockManagement';
import { LeadsCRM } from './LeadsCRM';
import { AddEditVehicleModal } from './AddEditVehicleModal';
import { MarkSoldModal } from './MarkSoldModal';
import { BarChart3, Package, Users, Plus, ShieldCheck, Flame } from 'lucide-react';

interface AdminViewProps {
  vehicles: Vehicle[];
  leads: LeadProposal[];
  onAddVehicle: (vehicle: Vehicle) => void;
  onUpdateVehicle: (vehicle: Vehicle) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onToggleOpportunity: (vehicleId: string) => void;
  onMarkVehicleSold: (data: {
    vehicleId: string;
    salePrice: number;
    soldDate: string;
    buyerName: string;
    saleChannel: 'Instagram @_dmotors' | 'Loja Física' | 'Webmotors' | 'Indicação' | 'WhatsApp Direto';
  }) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  vehicles,
  leads,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onToggleOpportunity,
  onMarkVehicleSold,
  onUpdateLeadStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'bi' | 'crm'>('stock');
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState<Vehicle | null>(null);
  const [isMarkSoldModalOpen, setIsMarkSoldModalOpen] = useState(false);
  const [vehicleToSell, setVehicleToSell] = useState<Vehicle | null>(null);

  const newLeadsCount = leads.filter((l) => l.status === 'novo').length;
  const availableCount = vehicles.filter((v) => v.status === 'available').length;
  const soldCount = vehicles.filter((v) => v.status === 'sold').length;

  const handleOpenAdd = () => {
    setVehicleToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEdit = (vehicle: Vehicle) => {
    setVehicleToEdit(vehicle);
    setIsAddEditModalOpen(true);
  };

  const handleOpenSold = (vehicle: Vehicle) => {
    setVehicleToSell(vehicle);
    setIsMarkSoldModalOpen(true);
  };

  const handleSaveVehicle = (vehicle: Vehicle) => {
    if (vehicleToEdit) {
      onUpdateVehicle(vehicle);
    } else {
      onAddVehicle(vehicle);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Admin Subheader & Navigation Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-900/60 sticky top-18 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            {/* Nav Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {/* 1. Gestão de Estoque (Default / First) */}
              <button
                onClick={() => setActiveTab('stock')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'stock'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Gestão de Estoque</span>
                <span className="font-mono bg-zinc-950/60 px-1.5 py-0.2 rounded text-[11px]">
                  {availableCount}
                </span>
              </button>

              {/* 2. BI & Performance 2026 */}
              <button
                onClick={() => setActiveTab('bi')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'bi'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>BI & Performance 2026</span>
              </button>

              {/* 3. Leads & CRM */}
              <button
                onClick={() => setActiveTab('crm')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === 'crm'
                    ? 'bg-red-600 text-white shadow-md shadow-red-950/60'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Leads & CRM</span>
                {newLeadsCount > 0 && (
                  <span className="bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold text-[10px] animate-pulse">
                    {newLeadsCount} novos
                  </span>
                )}
              </button>
            </div>

            {/* Quick action: Add Vehicle */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                Adicionar Carro
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'bi' && <DashboardBI vehicles={vehicles} />}

        {activeTab === 'stock' && (
          <StockManagement
            vehicles={vehicles}
            onOpenAddModal={handleOpenAdd}
            onOpenEditModal={handleOpenEdit}
            onOpenSoldModal={handleOpenSold}
            onToggleOpportunity={onToggleOpportunity}
            onDeleteVehicle={onDeleteVehicle}
            onUpdateVehicle={onUpdateVehicle}
          />
        )}

        {activeTab === 'crm' && (
          <LeadsCRM leads={leads} onUpdateLeadStatus={onUpdateLeadStatus} />
        )}
      </main>

      {/* Modals */}
      <AddEditVehicleModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        onSaveVehicle={handleSaveVehicle}
        vehicleToEdit={vehicleToEdit}
      />

      <MarkSoldModal
        isOpen={isMarkSoldModalOpen}
        onClose={() => setIsMarkSoldModalOpen(false)}
        onConfirmSold={onMarkVehicleSold}
        vehicle={vehicleToSell}
      />
    </div>
  );
};
