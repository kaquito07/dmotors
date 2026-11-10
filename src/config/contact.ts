export const CONTACT_INFO = {
  brandName: "D'MOTORS",
  brandHandle: "@_dmotors",
  instagramHandle: "@_dmotors",
  slogan: "Veículos Premium e Populares · Compra / Vende / Financia",
  whatsappRaw: "5511993673869",
  whatsappFormatted: "(11) 99367-3869",
  instagramUrl: "https://www.instagram.com/_dmotors/",
  youtubeUrl: "https://www.youtube.com/@_dmotors",
  email: "contato@dmotors.com.br",
  city: "Guarulhos / SP",
  cityFull: "Guarulhos - SP",
  cityState: "Guarulhos / SP",
  googleReviewsUrl: "https://www.google.com/search?q=D%27MOTORS+Guarulhos+avaliacoes",
};

export function getWhatsAppUrl(customMessage?: string): string {
  const text = customMessage || `Olá, ${CONTACT_INFO.brandName}! Gostaria de falar com um consultor.`;
  return `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(text)}`;
}

export function getVehicleInterestWhatsAppUrl(vehicle: {
  brand: string;
  model: string;
  yearModel: number;
  price: number;
}): string {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(vehicle.price);

  const message = `Olá ${CONTACT_INFO.brandName}! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.yearModel} de ${formattedPrice}. Ainda está disponível?`;
  return `https://wa.me/${CONTACT_INFO.whatsappRaw}?text=${encodeURIComponent(message)}`;
}
