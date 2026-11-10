import React, { useState } from 'react';
import { Vehicle, LeadProposal, LeadStatus } from '../../types/vehicle';
import { DashboardBI } from './DashboardBI';
import { StockManagement } from './StockManagement';
import { LeadsCRM } from './LeadsCRM';
import { AddEditVehicleModal } from './AddEditVehicleModal';
import { MarkSoldModal } from './MarkSoldModal';
import { BarChart3, Package, Users, Plus, Info } from 'lucide-react';

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
      {/* Discreet Demo Mode Banner */}
      <div className="bg-amber-950/40 border-b border-amber-600/30 px-4 py-1.5 text-center text-[11px] text-amber-300 flex items-center justify-center gap-2">
        <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          <strong>Modo demonstração:</strong> os dados e alterações ficam salvos apenas neste navegador (armazenamento local).
        </span>
      </div>

      {/* Admin Subheader & Navigation Tabs */}
      <div className="border-b border-zinc-800 bg-zinc-900/80 sticky top-18 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-3">
            {/* Nav Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto">
              {/* 1. Gestão de Estoque (Default / First) */}
              <button
                onClick={() => setActiveTab('stock')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'stock'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-950/60 font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Gestão de Estoque</span>
                <span className={`font-mono px-1.5 py-0.2 rounded text-[11px] ${activeTab === 'stock' ? 'bg-black/20 text-black' : 'bg-zinc-950/60 text-zinc-300'}`}>
                  {availableCount}
                </span>
              </button>

              {/* 2. BI & Performance 2026 */}
              <button
                onClick={() => setActiveTab('bi')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'bi'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-950/60 font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>BI & Performance 2026</span>
              </button>

              {/* 3. Leads & CRM */}
              <button
                onClick={() => setActiveTab('crm')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === 'crm'
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-950/60 font-black'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Leads & CRM</span>
                {newLeadsCount > 0 && (
                  <span className="bg-amber-400 text-black px-1.5 py-0.2 rounded-full font-bold text-[10px]">
                    {newLeadsCount} novos
                  </span>
                )}
              </button>
            </div>

            {/* Quick action: Add Vehicle */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAdd}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border border-amber-400/50 transition-colors flex items-center gap-1.5 shadow-md shadow-amber-950/40 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                Cadastrar Veículo
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
