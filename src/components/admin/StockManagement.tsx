import React, { useState, useMemo, useRef } from 'react';
import { Vehicle } from '../../types/vehicle';
import { formatBRL, formatKM, calculateDaysInStock } from '../../utils/formatters';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  Plus,
  Search,
  Flame,
  CheckCircle2,
  Edit2,
  Trash2,
  Check,
  Building2,
  UserCheck,
  Camera,
  Upload,
  Link,
  X,
  Loader2,
} from 'lucide-react';
import { CONTACT_INFO } from '../../config/contact';

interface StockManagementProps {
  vehicles: Vehicle[];
  onOpenAddModal: () => void;
  onOpenEditModal: (vehicle: Vehicle) => void;
  onOpenSoldModal: (vehicle: Vehicle) => void;
  onToggleOpportunity: (vehicleId: string) => void;
  onDeleteVehicle: (vehicleId: string) => void;
  onUpdateVehicle?: (vehicle: Vehicle) => void;
}

export const StockManagement: React.FC<StockManagementProps> = ({
  vehicles,
  onOpenAddModal,
  onOpenEditModal,
  onOpenSoldModal,
  onToggleOpportunity,
  onDeleteVehicle,
  onUpdateVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'sold' | 'opportunity'>('all');
  const [ownershipFilter, setOwnershipFilter] = useState<'all' | 'proprio' | 'consignado'>('all');

  // Quick Photo Replacement State
  const [quickTargetCar, setQuickTargetCar] = useState<Vehicle | null>(null);
  const [isQuickModalOpen, setIsQuickModalOpen] = useState(false);
  const [quickUrlInput, setQuickUrlInput] = useState('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const quickFileInputRef = useRef<HTMLInputElement>(null);

  // Show auto-dismissing toast
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Direct 1-click file trigger for table thumbnail
  const handleTriggerQuickUpload = (car: Vehicle) => {
    setQuickTargetCar(car);
    if (quickFileInputRef.current) {
      quickFileInputRef.current.value = '';
      quickFileInputRef.current.click();
    }
  };

  // Process chosen file from computer / camera
  const handleQuickFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !quickTargetCar) return;

    const file = files[0];
    if (!file.type.startsWith('image/')) return;

    setIsProcessingPhoto(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 900, 0.8);
      const remainingImages = quickTargetCar.images.length > 1 ? quickTargetCar.images.slice(1) : [];
      const updatedImages = [compressedDataUrl, ...remainingImages];

      if (onUpdateVehicle) {
        onUpdateVehicle({
          ...quickTargetCar,
          images: updatedImages,
        });
      }

      showToast(`Foto de capa do ${quickTargetCar.brand} ${quickTargetCar.model} atualizada com sucesso!`);
      setIsQuickModalOpen(false);
      setQuickTargetCar(null);
    } catch {
      showToast('Erro ao processar imagem. Tente novamente.');
    } finally {
      setIsProcessingPhoto(false);
      if (quickFileInputRef.current) {
        quickFileInputRef.current.value = '';
      }
    }
  };

  // Quick URL save
  const handleSaveQuickUrl = () => {
    if (!quickUrlInput.trim() || !quickTargetCar) return;
    const remainingImages = quickTargetCar.images.length > 1 ? quickTargetCar.images.slice(1) : [];
    const updatedImages = [quickUrlInput.trim(), ...remainingImages];

    if (onUpdateVehicle) {
      onUpdateVehicle({
        ...quickTargetCar,
        images: updatedImages,
      });
    }

    showToast(`Foto de capa do ${quickTargetCar.brand} ${quickTargetCar.model} atualizada!`);
    setIsQuickModalOpen(false);
    setQuickUrlInput('');
    setQuickTargetCar(null);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((car) => {
      // Search text
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = `${car.brand} ${car.model} ${car.version}`.toLowerCase().includes(term);
        const matchPlate = car.plateEnd.includes(term);
        if (!matchName && !matchPlate) return false;
      }

      // Status filter
      if (statusFilter === 'available' && car.status !== 'available') return false;
      if (statusFilter === 'sold' && car.status !== 'sold') return false;
      if (statusFilter === 'opportunity' && (!car.isOpportunity || car.status !== 'available')) return false;

      // Ownership filter
      if (ownershipFilter !== 'all' && car.ownershipType !== ownershipFilter) return false;

      return true;
    });
  }, [vehicles, searchTerm, statusFilter, ownershipFilter]);

  // Counts for pills
  const availableCount = vehicles.filter((v) => v.status === 'available').length;
  const soldCount = vehicles.filter((v) => v.status === 'sold').length;
  const opportunityCount = vehicles.filter((v) => v.isOpportunity && v.status === 'available').length;
  const proprioCount = vehicles.filter((v) => v.ownershipType === 'proprio').length;
  const consignadoCount = vehicles.filter((v) => v.ownershipType === 'consignado').length;

  return (
    <div className="space-y-6">
      {/* Hidden file input for instant 1-click table replacement */}
      <input
        ref={quickFileInputRef}
        type="file"
        accept="image/*"
        onChange={handleQuickFileSelected}
        className="hidden"
      />

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-950 border border-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Quick Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Gestão de Estoque {CONTACT_INFO.brandName}
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Gerencie carros e motos (próprios e consignados), precificação, margens e fotos.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center gap-2 shadow-lg shadow-amber-950/60 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-black" />
          Cadastrar Novo Veículo
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 space-y-3">
        {/* Row 1: Ownership Modalidade Filters (Proprio vs Consignado) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800/80 pb-3">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
            Modalidade:
          </span>

          <button
            onClick={() => setOwnershipFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              ownershipFilter === 'all'
                ? 'bg-amber-500 text-black font-bold'
                : 'text-zinc-400 hover:text-white bg-zinc-950'
            }`}
          >
            Todos ({vehicles.length})
          </button>

          <button
            onClick={() => setOwnershipFilter('proprio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              ownershipFilter === 'proprio'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-sm'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-emerald-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Estoque Próprio ({proprioCount})</span>
          </button>

          <button
            onClick={() => setOwnershipFilter('consignado')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              ownershipFilter === 'consignado'
                ? 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-sm'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-amber-400'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Consignados ({consignadoCount})</span>
          </button>
        </div>

        {/* Row 2: Status Pills and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white bg-zinc-950'
              }`}
            >
              Todos Status
            </button>
            <button
              onClick={() => setStatusFilter('available')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'available'
                  ? 'bg-emerald-950/80 border border-emerald-600 text-emerald-300'
                  : 'text-zinc-400 hover:text-white bg-zinc-950'
              }`}
            >
              Disponíveis ({availableCount})
            </button>
            <button
              onClick={() => setStatusFilter('opportunity')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'opportunity'
                  ? 'bg-amber-500 text-black font-bold'
                  : 'text-zinc-400 hover:text-white bg-zinc-950'
              }`}
            >
              <Flame className="w-3 h-3 text-amber-400 fill-current" />
              Destaques ({opportunityCount})
            </button>
            <button
              onClick={() => setStatusFilter('sold')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === 'sold'
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-400 hover:text-white bg-zinc-950'
              }`}
            >
              Vendidos ({soldCount})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar modelo ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-800/60 pt-2.5">
          <span>Exibindo <strong>{filteredVehicles.length}</strong> de {vehicles.length} veículos cadastrados</span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            💡 Dica: Clique na foto do veículo para trocá-la instantaneamente
          </span>
        </div>
      </div>

      {/* Stock Table - Optimized to fit 1440px cleanly */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1020px]">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-950/60 text-zinc-400 font-semibold uppercase text-[10px]">
                <th className="py-3 px-3">Veículo</th>
                <th className="py-3 px-2">Tipo</th>
                <th className="py-3 px-2">Modalidade</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Custo / Repasse</th>
                <th className="py-3 px-2">Preço Venda</th>
                <th className="py-3 px-2">Margem / Comissão</th>
                <th className="py-3 px-2">Giro</th>
                <th className="py-3 px-2 text-center">Destaque</th>
                <th className="py-3 px-3 text-right whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filteredVehicles.map((car) => {
                const isSold = car.status === 'sold';
                const currentPrice = isSold && car.salePrice ? car.salePrice : car.price;
                const profit = currentPrice - car.purchasePrice;
                const marginPct = ((profit / currentPrice) * 100).toFixed(1);
                const days = calculateDaysInStock(car.entryDate, car.soldDate);
                const isConsignado = car.ownershipType === 'consignado';
                const isMoto = car.type === 'moto';

                return (
                  <tr
                    key={car.id}
                    className="hover:bg-zinc-850/50 transition-colors group"
                  >
                    {/* Car info with photo */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          onClick={() => handleTriggerQuickUpload(car)}
                          title="Clique para trocar a foto de capa"
                          className="relative w-12 h-9 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800 shrink-0 cursor-pointer group/thumb hover:border-amber-400 hover:ring-2 hover:ring-amber-400/30 transition-all shadow-sm"
                        >
                          <img
                            src={car.images[0]}
                            alt={car.model}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                            onError={(e) => {
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/thumb:opacity-100 flex flex-col items-center justify-center transition-opacity text-white">
                            <Camera className="w-3 h-3 text-amber-400" />
                            <span className="text-[7px] font-bold uppercase tracking-tight">Trocar</span>
                          </div>
                        </div>

                        <div className="min-w-0 max-w-[210px]">
                          <strong className="text-white block font-medium tracking-tight truncate">
                            {car.brand} {car.model}
                          </strong>
                          <span className="text-[10px] text-zinc-400 block truncate">
                            {car.version} · {car.yearFabrication}/{car.yearModel} · Final {car.plateEnd}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Tipo (Carro vs Moto) */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isMoto ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60' : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                      }`}>
                        {isMoto ? 'Moto' : 'Carro'}
                      </span>
                    </td>

                    {/* Modalidade Badge (Proprio vs Consignado) */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      {isConsignado ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-800/60 shadow-sm">
                          <UserCheck className="w-3 h-3 text-amber-400" />
                          Consignado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-sm">
                          <Building2 className="w-3 h-3 text-emerald-400" />
                          Próprio
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      {isSold ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Vendido
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                          <CheckCircle2 className="w-3 h-3" />
                          Disponível
                        </span>
                      )}
                    </td>

                    {/* Purchase Price (Custo / Repasse) */}
                    <td className="py-2.5 px-2 font-mono text-zinc-300 whitespace-nowrap">
                      <div>
                        <span>{formatBRL(car.purchasePrice)}</span>
                        {isConsignado && (
                          <span className="block text-[8px] text-amber-400/80">Repasse</span>
                        )}
                      </div>
                    </td>

                    {/* Sale Price */}
                    <td className="py-2.5 px-2 font-mono font-bold text-white whitespace-nowrap">
                      {formatBRL(currentPrice)}
                      {car.isIllustrativePrice && (
                        <span className="block text-[8px] text-zinc-500 font-sans">Ilustrativo</span>
                      )}
                    </td>

                    {/* Margin or Commission */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <div className="flex flex-col font-mono">
                        <span className={`font-semibold ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {formatBRL(profit)}
                        </span>
                        <span className="text-[9px] text-zinc-400">
                          {marginPct}% {isConsignado ? 'comissão' : 'margem'}
                        </span>
                      </div>
                    </td>

                    {/* Days in Stock / Turnover */}
                    <td className="py-2.5 px-2 whitespace-nowrap">
                      <span className={`font-mono text-xs ${days > 45 ? 'text-amber-400 font-bold' : 'text-zinc-300'}`}>
                        {days} dias
                      </span>
                    </td>

                    {/* Opportunity Toggle Button */}
                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                      {!isSold ? (
                        <button
                          onClick={() => onToggleOpportunity(car.id)}
                          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                            car.isOpportunity
                              ? 'bg-amber-500/20 border-amber-500 text-amber-400 hover:bg-amber-500/30'
                              : 'bg-zinc-950 border-zinc-800 text-zinc-600 hover:text-zinc-400'
                          }`}
                          title={car.isOpportunity ? 'Remover dos destaques' : 'Destacar na Vitrine'}
                        >
                          <Flame className={`w-3.5 h-3.5 ${car.isOpportunity ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      ) : (
                        <span className="text-zinc-600">-</span>
                      )}
                    </td>

                    {/* Action Buttons - Always visible and clean */}
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setQuickTargetCar(car);
                            setIsQuickModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer shrink-0"
                          title="Trocar Foto de Capa"
                        >
                          <Camera className="w-3.5 h-3.5 text-zinc-400" />
                        </button>

                        {!isSold && (
                          <button
                            onClick={() => onOpenSoldModal(car)}
                            className="px-2 py-1 rounded-lg text-[11px] font-bold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/40 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                            title="Registrar Venda do Veículo"
                          >
                            <Check className="w-3 h-3" />
                            <span>Vender</span>
                          </button>
                        )}

                        <button
                          onClick={() => onOpenEditModal(car)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer shrink-0"
                          title="Editar Veículo"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Tem certeza que deseja excluir ${car.brand} ${car.model} do estoque?`)) {
                              onDeleteVehicle(car.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 bg-zinc-950 border border-zinc-800 hover:border-rose-900 transition-colors cursor-pointer shrink-0"
                          title="Excluir Veículo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK PHOTO MODAL */}
      {isQuickModalOpen && quickTargetCar && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Trocar Foto de Capa
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsQuickModalOpen(false);
                  setQuickTargetCar(null);
                }}
                className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Car preview */}
            <div className="flex items-center gap-3 bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
              <div className="w-16 h-12 rounded-lg overflow-hidden bg-zinc-900 shrink-0">
                <img
                  src={quickTargetCar.images[0]}
                  alt={quickTargetCar.model}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <strong className="text-xs text-white block truncate">
                  {quickTargetCar.brand} {quickTargetCar.model}
                </strong>
                <span className="text-[11px] text-zinc-400 truncate block">
                  {quickTargetCar.version} · Ano {quickTargetCar.yearModel}
                </span>
              </div>
            </div>

            {/* Option 1: Upload from Computer */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block">
                Opção 1: Selecionar do Computador ou Celular
              </label>
              <button
                type="button"
                onClick={() => quickFileInputRef.current?.click()}
                disabled={isProcessingPhoto}
                className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center gap-2 shadow-md shadow-amber-950 transition-all cursor-pointer disabled:opacity-50"
              >
                {isProcessingPhoto ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Otimizando imagem...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Escolher Foto no Meu Computador
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-zinc-600 text-xs my-1">
              <div className="flex-1 h-px bg-zinc-800" />
              <span>ou cole uma URL</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Option 2: Paste URL */}
            <div className="space-y-2">
              <div className="relative">
                <Link className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto-do-carro.jpg"
                  value={quickUrlInput}
                  onChange={(e) => setQuickUrlInput(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveQuickUrl}
                disabled={!quickUrlInput.trim()}
                className="w-full py-2 px-3 rounded-xl font-semibold text-xs bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 disabled:opacity-40 transition-colors cursor-pointer"
              >
                Salvar URL como Foto Principal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
