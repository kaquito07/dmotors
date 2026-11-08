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
  // Handles YYYY-MM-DD or YYYY-MM-DD HH:mm
  const parts = dateString.split(' ')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

/**
 * French Amortization (Tabela Price) monthly installment calculation
 * PV: Present Value (total - downPayment)
 * i: monthly interest rate (e.g., 0.0139 for 1.39% a.m.)
 * n: number of installments
 */
export function calculateInstallment(
  totalPrice: number,
  downPayment: number,
  installments: number,
  monthlyRate: number = 0.0139
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

  // PMT formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
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

export function calculateDaysInStock(entryDate: string, soldDate?: string): number {
  const start = new Date(entryDate).getTime();
  const end = soldDate ? new Date(soldDate).getTime() : new Date('2026-10-26').getTime();
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
}): string {
  const { vehicleName, vehicleYear, vehiclePrice, intent, downPayment, installments, monthlyPayment } = params;

  let msg = `Olá, Dmotors! 👋 Vi o anúncio no site oficial @_dmotors.\n\n`;
  msg += `🚗 *Veículo:* ${vehicleName} (${vehicleYear})\n`;
  msg += `💰 *Valor:* ${formatBRL(vehiclePrice)}\n\n`;

  if (intent === 'financiamento' && downPayment && installments && monthlyPayment) {
    msg += `📊 *Simulação de Financiamento:*\n`;
    msg += `• Entrada: ${formatBRL(downPayment)}\n`;
    msg += `• Parcelas: ${installments}x de ${formatBRL(monthlyPayment)}\n\n`;
  } else if (intent === 'test_drive') {
    msg += `📅 *Gostaria de agendar um Test Drive / Visita ao Showroom.*\n\n`;
  } else if (intent === 'troca') {
    msg += `🔄 *Tenho um veículo para dar na troca.*\n\n`;
  } else {
    msg += `📌 Gostaria de mais fotos e informações sobre a procedência.\n\n`;
  }

  msg += `Qual o melhor horário para conversarmos?`;
  return encodeURIComponent(msg);
}
