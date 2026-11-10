export type VehicleType = 'carro' | 'moto';

export interface Vehicle {
  id: string;
  type: VehicleType; // 'carro' | 'moto'
  brand: string;
  model: string;
  version: string;
  yearFabrication: number;
  yearModel: number;
  price: number; // Current sale price
  fipePrice: number; // Reference FIPE price
  purchasePrice: number; // Cost / Buy-in price for BI margin calculations
  salePrice?: number; // Final realized sale price if sold
  status: 'available' | 'sold' | 'reserved';
  ownershipType: 'proprio' | 'consignado';
  isOpportunity: boolean;
  opportunityDiscount?: number;
  isIllustrativePrice?: boolean; // Selo "Preço ilustrativo"
  mileage: number; // in km - SEMPRE em destaque
  color: string;
  transmission: 'Automático' | 'Manual' | 'CVT' | 'Dupla Embreagem';
  fuel: 'Gasolina' | 'Flex' | 'Híbrido' | 'Diesel' | 'Elétrico';
  bodyType: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Pickup' | 'Moto';
  plateEnd: string;
  doors?: number; // Only for cars
  trunkCapacityLiters?: number; // Only for cars
  engine: string;
  powerCv: number;
  torqueKgfm?: number;
  cityConsumption?: number; // km/l
  roadConsumption?: number; // km/l
  features: string[];
  entryDate: string; // YYYY-MM-DD
  soldDate?: string; // YYYY-MM-DD
  buyerName?: string;
  saleChannel?: 'Instagram @_dmotors' | 'Loja Física' | 'Webmotors' | 'Indicação' | 'WhatsApp Direto';
  images: string[];
  inspectionApproved?: boolean;
  warrantyMonths?: number;
  location: string;
  description?: string;
}

export type LeadType = 'financiamento' | 'test_drive' | 'troca' | 'compra_imediata' | 'avaliacao_venda';
export type LeadStatus = 'novo' | 'em_atendimento' | 'visita_agendada' | 'proposta_aceita' | 'perdido';

export interface LeadProposal {
  id: string;
  vehicleId?: string;
  vehicleName?: string;
  customerName: string;
  phone: string;
  email: string;
  type: LeadType;
  downPayment?: number;
  installments?: number;
  monthlyPayment?: number;
  hasTradeIn: boolean;
  tradeInDetails?: string;
  preferredDate?: string;
  status: LeadStatus;
  createdAt: string;
  notes?: string;
}

export interface BrandModelOption {
  brand: string;
  type: VehicleType;
  models: {
    name: string;
    bodyType: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Pickup' | 'Moto';
    defaultEngine: string;
    defaultPower: number;
    defaultTransmission: 'Automático' | 'Manual' | 'CVT' | 'Dupla Embreagem';
    defaultFuel: 'Gasolina' | 'Flex' | 'Híbrido' | 'Diesel' | 'Elétrico';
    sampleImage: string;
  }[];
}
