import { CONTACT_INFO } from '../config/contact';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatKM(value: number): string {
  return `${new Intl.NumberFormat('pt-BR').format(value)} km`;
}

export function formatDateBR(dateString?: string): string {
  if (!dateString) return '-';
  const parts = dateString.split(' ')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

/**
 * Financing installment calculation using Price table
 * PV: Present Value (total - downPayment)
 * monthlyRate: configurable monthly interest rate (e.g. 0.0145 for 1.45% a.m.)
 * installments: up to 60x
 */
export function calculateInstallment(
  totalPrice: number,
  downPayment: number,
  installments: number,
  monthlyRate: number = 0.0145
): {
  financedAmount: number;
  monthlyInstallment: number;
  totalWithInterest: number;
} {
  const financedAmount = Math.max(0, totalPrice - downPayment);
  if (financedAmount <= 0) {
    return {
      financedAmount: 0,
      monthlyInstallment: 0,
      totalWithInterest: 0,
    };
  }

  const factor = Math.pow(1 + monthlyRate, installments);
  const monthlyInstallment = Math.round(
    (financedAmount * (monthlyRate * factor)) / (factor - 1)
  );

  const totalWithInterest = monthlyInstallment * installments;

  return {
    financedAmount,
    monthlyInstallment,
    totalWithInterest,
  };
}

/**
 * Credit card down payment split in up to 21x
 */
export function calculateCardDownPayment(
  downPaymentAmount: number,
  installments: number = 12
): {
  installmentAmount: number;
  installments: number;
} {
  const safeInstallments = Math.max(1, Math.min(21, installments));
  return {
    installmentAmount: Math.round(downPaymentAmount / safeInstallments),
    installments: safeInstallments,
  };
}

export function calculateDaysInStock(entryDate: string, soldDate?: string): number {
  const start = new Date(entryDate).getTime();
  const end = soldDate ? new Date(soldDate).getTime() : Date.now();
  const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  return diffDays;
}

export function createWhatsAppLeadMessage(params: {
  vehicleName: string;
  vehicleYear: number;
  vehiclePrice: number;
  intent: 'interesse' | 'financiamento' | 'test_drive' | 'troca';
  downPayment?: number;
  installments?: number;
  monthlyPayment?: number;
  cardDownPaymentInstallments?: number;
}): string {
  const {
    vehicleName,
    vehicleYear,
    vehiclePrice,
    intent,
    downPayment,
    installments,
    monthlyPayment,
    cardDownPaymentInstallments,
  } = params;

  let msg = `Olá ${CONTACT_INFO.brandName}! Tenho interesse no ${vehicleName} (${vehicleYear}) de ${formatBRL(vehiclePrice)}. Ainda está disponível?\n\n`;

  if (intent === 'financiamento' && downPayment && installments && monthlyPayment) {
    msg += `📊 *Simulação de Financiamento:*\n`;
    msg += `• Entrada: ${formatBRL(downPayment)}`;
    if (cardDownPaymentInstallments && cardDownPaymentInstallments > 1) {
      msg += ` (parcelada no cartão em até ${cardDownPaymentInstallments}x)`;
    }
    msg += `\n• Financiamento: ${installments}x de ${formatBRL(monthlyPayment)}\n\n`;
  } else if (intent === 'troca') {
    msg += `🔄 *Tenho um veículo para dar na troca.*\n\n`;
  } else if (intent === 'test_drive') {
    msg += `📅 *Gostaria de agendar uma visita.*\n\n`;
  }

  msg += `Qual o melhor horário para conversarmos?`;
  return encodeURIComponent(msg);
}
