import React, { useState, useRef } from 'react';
import { Vehicle } from '../../types/vehicle';
import { BRAND_MODELS_CATALOG } from '../../data/mockVehicles';
import { formatBRL } from '../../utils/formatters';
import { compressImageFile } from '../../utils/imageCompressor';
import {
  X,
  Save,
  Car,
  Flame,
  Building2,
  UserCheck,
  Upload,
  Link,
  Trash2,
  Star,
  Plus,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AddEditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVehicle: (vehicle: Vehicle) => void;
  vehicleToEdit: Vehicle | null;
}

export const AddEditVehicleModal: React.FC<AddEditVehicleModalProps> = ({
  isOpen,
  onClose,
  onSaveVehicle,
  vehicleToEdit,
}) => {
  if (!isOpen) return null;

  const isEditing = Boolean(vehicleToEdit);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [ownershipType, setOwnershipType] = useState<Vehicle['ownershipType']>(
    vehicleToEdit?.ownershipType || 'proprio'
  );
  const [brand, setBrand] = useState(vehicleToEdit?.brand || 'Audi');
  const [model, setModel] = useState(vehicleToEdit?.model || 'A3 Sedan');
  const [version, setVersion] = useState(vehicleToEdit?.version || 'Prestige Plus 2.0 TFSI S-tronic');
  const [yearFabrication, setYearFabrication] = useState<number>(vehicleToEdit?.yearFabrication || 2023);
  const [yearModel, setYearModel] = useState<number>(vehicleToEdit?.yearModel || 2023);
  const [price, setPrice] = useState<number>(vehicleToEdit?.price || 229900);
  const [purchasePrice, setPurchasePrice] = useState<number>(vehicleToEdit?.purchasePrice || 198000);
  const [fipePrice, setFipePrice] = useState<number>(vehicleToEdit?.fipePrice || 242000);
  const [mileage, setMileage] = useState<number>(vehicleToEdit?.mileage || 25000);
  const [color, setColor] = useState(vehicleToEdit?.color || 'Cinza Daytona');
  const [transmission, setTransmission] = useState<Vehicle['transmission']>(
    vehicleToEdit?.transmission || 'Dupla Embreagem'
  );
  const [fuel, setFuel] = useState<Vehicle['fuel']>(vehicleToEdit?.fuel || 'Gasolina');
  const [bodyType, setBodyType] = useState<Vehicle['bodyType']>(vehicleToEdit?.bodyType || 'Sedan');
  const [engine, setEngine] = useState(vehicleToEdit?.engine || '2.0 TFSI 190cv');
  const [powerCv, setPowerCv] = useState<number>(vehicleToEdit?.powerCv || 190);
  const [plateEnd, setPlateEnd] = useState(vehicleToEdit?.plateEnd || '7');
  const [isOpportunity, setIsOpportunity] = useState(vehicleToEdit?.isOpportunity || false);

  // Images state (Array of strings)
  const [images, setImages] = useState<string[]>(
    vehicleToEdit?.images && vehicleToEdit.images.length > 0
      ? vehicleToEdit.images
      : ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80']
  );
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [description, setDescription] = useState(
    vehicleToEdit?.description ||
      'Veículo selecionado Dmotors. Laudo pericial cautelar 100% aprovado, revisões em dia e garantia de fábrica ou loja.'
  );

  // Synchronize state when vehicleToEdit or modal open state changes
  React.useEffect(() => {
    if (vehicleToEdit) {
      setOwnershipType(vehicleToEdit.ownershipType || 'proprio');
      setBrand(vehicleToEdit.brand);
      setModel(vehicleToEdit.model);
      setVersion(vehicleToEdit.version);
      setYearFabrication(vehicleToEdit.yearFabrication);
      setYearModel(vehicleToEdit.yearModel);
      setPrice(vehicleToEdit.price);
      setPurchasePrice(vehicleToEdit.purchasePrice);
      setFipePrice(vehicleToEdit.fipePrice);
      setMileage(vehicleToEdit.mileage);
      setColor(vehicleToEdit.color);
      setTransmission(vehicleToEdit.transmission);
      setFuel(vehicleToEdit.fuel);
      setBodyType(vehicleToEdit.bodyType);
      setEngine(vehicleToEdit.engine);
      setPowerCv(vehicleToEdit.powerCv);
      setPlateEnd(vehicleToEdit.plateEnd);
      setIsOpportunity(vehicleToEdit.isOpportunity || false);
      setImages(
        vehicleToEdit.images && vehicleToEdit.images.length > 0
          ? vehicleToEdit.images
          : ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80']
      );
      setDescription(
        vehicleToEdit.description ||
          'Veículo selecionado Dmotors. Laudo pericial cautelar 100% aprovado, revisões em dia e garantia de fábrica ou loja.'
      );
    } else {
      // Default initial values for new vehicle
      setOwnershipType('proprio');
      setBrand('Audi');
      setModel('A3 Sedan');
      setVersion('Prestige Plus 2.0 TFSI S-tronic');
      setYearFabrication(2023);
      setYearModel(2023);
      setPrice(229900);
      setPurchasePrice(198000);
      setFipePrice(242000);
      setMileage(25000);
      setColor('Cinza Daytona');
      setTransmission('Dupla Embreagem');
      setFuel('Gasolina');
      setBodyType('Sedan');
      setEngine('2.0 TFSI 190cv');
      setPowerCv(190);
      setPlateEnd('7');
      setIsOpportunity(false);
      setImages(['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80']);
      setDescription(
        'Veículo selecionado Dmotors. Laudo pericial cautelar 100% aprovado, revisões em dia e garantia de fábrica ou loja.'
      );
    }
    setUrlInput('');
    setUploadError(null);
  }, [vehicleToEdit, isOpen]);

  // Chained Models based on Brand
  const currentBrandCatalog = BRAND_MODELS_CATALOG.find((b) => b.brand === brand);
  const availableModels = currentBrandCatalog ? currentBrandCatalog.models : [];

  // When Brand changes in ADD mode, automatically sync Model and preset specs
  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    const catalog = BRAND_MODELS_CATALOG.find((b) => b.brand === newBrand);
    if (catalog && catalog.models.length > 0) {
      const firstModel = catalog.models[0];
      setModel(firstModel.name);
      setBodyType(firstModel.bodyType);
      setEngine(firstModel.defaultEngine);
      setPowerCv(firstModel.defaultPower);
      setTransmission(firstModel.defaultTransmission);
      setFuel(firstModel.defaultFuel);
      if (!isEditing && images.length <= 1) {
        setImages([firstModel.sampleImage]);
      }
    }
  };

  const handleModelChange = (newModelName: string) => {
    setModel(newModelName);
    const modelData = availableModels.find((m) => m.name === newModelName);
    if (modelData) {
      setBodyType(modelData.bodyType);
      setEngine(modelData.defaultEngine);
      setPowerCv(modelData.defaultPower);
      setTransmission(modelData.defaultTransmission);
      setFuel(modelData.defaultFuel);
      if (!isEditing && images.length <= 1) {
        setImages([modelData.sampleImage]);
      }
    }
  };

  // Multiple File Upload Handler with Canvas Compression
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const compressed = await compressImageFile(file, 1200, 900, 0.8);
        compressedList.push(compressed);
      }

      if (compressedList.length > 0) {
        setImages((prev) => [...compressedList, ...prev]);
      }
    } catch {
      setUploadError('Erro ao processar as fotos selecionadas. Tente novamente.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Add Image via URL
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setImages((prev) => [...prev, urlInput.trim()]);
    setUrlInput('');
  };

  // Set as Primary (Index 0)
  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const filtered = prev.filter((_, idx) => idx !== index);
      return filtered.length > 0
        ? filtered
        : ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80'];
    });
  };

  // Move image forward/back
  const handleMoveImage = (index: number, direction: 'prev' | 'next') => {
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  // Projected Margin
  const projectedProfit = price - purchasePrice;
  const projectedMarginPct = price > 0 ? ((projectedProfit / price) * 100).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleData: Vehicle = {
      id: vehicleToEdit?.id || `dm-${Date.now().toString().slice(-4)}`,
      brand,
      model,
      version,
      yearFabrication: Number(yearFabrication),
      yearModel: Number(yearModel),
      price: Number(price),
      fipePrice: Number(fipePrice),
      purchasePrice: Number(purchasePrice),
      status: vehicleToEdit?.status || 'available',
      ownershipType,
      isOpportunity,
      opportunityDiscount: isOpportunity ? Math.max(0, fipePrice - price) : 0,
      mileage: Number(mileage),
      color,
      transmission,
      fuel,
      bodyType,
      plateEnd,
      doors: 4,
      engine,
      powerCv: Number(powerCv),
      torqueKgfm: 28.5,
      cityConsumption: 11.5,
      roadConsumption: 14.2,
      features: vehicleToEdit?.features || [
        'Teto Solar',
        'Faróis Full LED',
        'Câmera de Ré com Sensores',
        'Bancos em Couro',
        'Central Multimídia com Apple CarPlay',
        'Piloto Automático',
      ],
      entryDate: vehicleToEdit?.entryDate || '2026-10-26',
      images: images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80'
      ],
      inspectionApproved: true,
      warrantyMonths: 12,
      location: 'Guarulhos - SP (Av. Paulo Faccini, 32 - Macedo)',
      description,
    };

    onSaveVehicle(vehicleData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950 sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Editar Veículo do Estoque' : 'Cadastrar Novo Veículo no Estoque'}
              </h3>
              <p className="text-xs text-zinc-400">
                Sincronizado automaticamente com a Vitrine Pública e o BI Dmotors
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-5">
          {/* 1. Modalidade de Estoque: Próprio vs Consignado */}
          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-2 uppercase tracking-wider">
              Modalidade de Estoque
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOwnershipType('proprio')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  ownershipType === 'proprio'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  ownershipType === 'proprio' ? 'bg-emerald-500 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold">Estoque Próprio</strong>
                  <span className="text-[10px] text-zinc-400">Veículo adquirido pela Dmotors</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOwnershipType('consignado')}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  ownershipType === 'consignado'
                    ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-950/40'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  ownershipType === 'consignado' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-xs font-bold">Consignado</strong>
                  <span className="text-[10px] text-zinc-400">Veículo de cliente / parceiro</span>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Brand & Model (Chained) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="modalBrandInput" className="text-xs font-semibold text-zinc-300 block mb-1">
                Marca do Veículo *
              </label>
              <select
                id="modalBrandInput"
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                {BRAND_MODELS_CATALOG.map((b) => (
                  <option key={b.brand} value={b.brand}>
                    {b.brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="modalModelInput" className="text-xs font-semibold text-zinc-300 block mb-1">
                Modelo (Nome do Carro) *
              </label>
              <select
                id="modalModelInput"
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                {availableModels.map((m) => (
                  <option key={m.name} value={m.name}>
                    {m.name} ({m.bodyType})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Version */}
          <div>
            <label htmlFor="modalVersionInput" className="text-xs font-semibold text-zinc-300 block mb-1">
              Versão Completa & Motorização *
            </label>
            <input
              id="modalVersionInput"
              type="text"
              required
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Years & Mileage */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="modalYearFabInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Ano Fab.</label>
              <input
                id="modalYearFabInput"
                type="number"
                value={yearFabrication}
                onChange={(e) => setYearFabrication(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="modalYearModInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Ano Mod.</label>
              <input
                id="modalYearModInput"
                type="number"
                value={yearModel}
                onChange={(e) => setYearModel(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="modalMileageInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">KM Rodados</label>
              <input
                id="modalMileageInput"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Financials & Margins */}
          <div className="p-4 bg-zinc-950/80 border border-zinc-800/90 rounded-xl space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400 block">
              Parâmetros Financeiros & Margem de Lucro
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="purchasePriceInput" className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  {ownershipType === 'consignado' ? 'Valor de Repasse (Dono)' : 'Preço de Compra (Custo)'}
                </label>
                <input
                  id="purchasePriceInput"
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="salePriceInput" className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Preço de Venda Anunciado *
                </label>
                <input
                  id="salePriceInput"
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label htmlFor="fipePriceInput" className="text-[11px] font-semibold text-zinc-400 block mb-1">
                  Tabela FIPE de Referência
                </label>
                <input
                  id="fipePriceInput"
                  type="number"
                  value={fipePrice}
                  onChange={(e) => setFipePrice(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Real-time Margin Preview */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
              <span className="text-zinc-400">
                {ownershipType === 'consignado' ? 'Comissão Estimada da Loja:' : 'Lucro Bruto Projetado:'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white">{formatBRL(projectedProfit)}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  Number(projectedMarginPct) >= 10 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950 text-amber-400 border border-amber-800/60'
                }`}>
                  {projectedMarginPct}% margem
                </span>
              </div>
            </div>
          </div>

          {/* Engine & Body Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="engineInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Motor</label>
              <input
                id="engineInput"
                type="text"
                value={engine}
                onChange={(e) => setEngine(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="powerInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Potência (cv)</label>
              <input
                id="powerInput"
                type="number"
                value={powerCv}
                onChange={(e) => setPowerCv(Number(e.target.value))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="bodyTypeInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Carroceria</label>
              <select
                id="bodyTypeInput"
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Pickup">Pickup</option>
              </select>
            </div>
            <div>
              <label htmlFor="plateEndInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Final Placa</label>
              <input
                id="plateEndInput"
                type="text"
                maxLength={2}
                value={plateEnd}
                onChange={(e) => setPlateEnd(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white text-center font-mono focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="colorInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Cor</label>
              <input
                id="colorInput"
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="transmissionInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Câmbio</label>
              <select
                id="transmissionInput"
                value={transmission}
                onChange={(e) => setTransmission(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Automático">Automático</option>
                <option value="Dupla Embreagem">Dupla Embreagem (DSG/S-tronic)</option>
                <option value="CVT">CVT</option>
                <option value="Manual">Manual</option>
              </select>
            </div>
            <div>
              <label htmlFor="fuelInput" className="text-[11px] font-semibold text-zinc-300 block mb-1">Combustível</label>
              <select
                id="fuelInput"
                value={fuel}
                onChange={(e) => setFuel(e.target.value as any)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
              >
                <option value="Gasolina">Gasolina</option>
                <option value="Flex">Flex (Álcool/Gasolina)</option>
                <option value="Híbrido">Híbrido</option>
                <option value="Diesel">Diesel</option>
                <option value="Elétrico">Elétrico</option>
              </select>
            </div>
          </div>

          {/* Toggle Opportunity */}
          <div className="p-3.5 bg-red-950/20 border border-red-800/40 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-red-500" />
              <div>
                <strong className="text-xs text-white block">Marcar como Oportunidade Dmotors</strong>
                <span className="text-[11px] text-zinc-400">
                  Destaque no topo da vitrine com selo de oferta da semana
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isOpportunity}
              onChange={(e) => setIsOpportunity(e.target.checked)}
              className="w-5 h-5 accent-red-600 rounded cursor-pointer"
            />
          </div>

          {/* 3. COMPLETE PHOTO GALLERY MANAGEMENT & UPLOAD */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-xs font-bold text-white block">
                  Galeria de Fotos do Veículo ({images.length} fotos)
                </span>
                <span className="text-[11px] text-zinc-400">
                  Faça upload do seu computador, print do Instagram ou cole links da internet
                </span>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFilesSelected}
                className="hidden"
              />

              {/* Upload trigger button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-red-950 cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Otimizando fotos...
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    Upload de Fotos do Computador
                  </>
                )}
              </button>
            </div>

            {/* Add by URL input */}
            <div className="flex items-center gap-2 pt-1">
              <div className="relative flex-1">
                <Link className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="Ou cole a URL direta de uma imagem na web..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddUrl();
                    }
                  }}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Adicionar
              </button>
            </div>

            {uploadError && (
              <p className="text-xs text-red-400 bg-red-950/40 p-2 rounded-lg border border-red-900">
                {uploadError}
              </p>
            )}

            {/* Gallery Thumbnails List */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
              {images.map((imgUrl, idx) => {
                const isPrimary = idx === 0;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border bg-zinc-900 group aspect-[16/11] flex flex-col justify-between ${
                      isPrimary ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-zinc-800'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Foto ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80';
                      }}
                    />

                    {/* Badge */}
                    <div className="absolute top-1.5 left-1.5 z-10">
                      {isPrimary ? (
                        <span className="flex items-center gap-1 bg-emerald-600 text-white text-[9px] font-bold uppercase px-1.5 py-0.5 rounded shadow">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          Capa
                        </span>
                      ) : (
                        <span className="bg-black/70 text-zinc-300 text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm">
                          Foto {idx + 1}
                        </span>
                      )}
                    </div>

                    {/* Actions overlay on hover / touch */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2 z-10">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(idx)}
                          title="Definir como Foto Principal de Capa"
                          className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1 shadow cursor-pointer"
                        >
                          <Star className="w-3 h-3 fill-white" />
                          <span className="text-[10px]">Capa</span>
                        </button>
                      )}

                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'prev')}
                          title="Mover para trás"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {idx < images.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveImage(idx, 'next')}
                          title="Mover para frente"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        title="Remover foto"
                        className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="vehicleDescriptionInput" className="text-xs font-semibold text-zinc-300 block mb-1">
              Descrição para a Vitrine
            </label>
            <textarea
              id="vehicleDescriptionInput"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-red-600 hover:bg-red-500 text-white flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Salvar Alterações no Veículo' : 'Adicionar ao Estoque da Dmotors'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
