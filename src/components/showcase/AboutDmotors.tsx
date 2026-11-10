import React from 'react';
import { Star, MessageCircle, ArrowUpRight, ShieldCheck, CreditCard, Repeat, CalendarCheck } from 'lucide-react';
import { CONTACT_INFO, getWhatsAppUrl } from '../../config/contact';

export const AboutDmotors: React.FC = () => {
  return (
    <section className="py-16 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <span>Sobre a {CONTACT_INFO.brandName}</span>
              <span>·</span>
              <span className="text-zinc-400">{CONTACT_INFO.brandHandle}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Veículos Premium e Populares em {CONTACT_INFO.city}.
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed">
              Na <strong>{CONTACT_INFO.brandName}</strong> você encontra carros populares e veículos premium selecionados com procedência rigorosa. Compra, venda, intermediação e financiamento facilitado para você sair de carro novo ou moto sem complicação.
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Trabalhamos com entrada parcelada no cartão em até 21x, financiamento bancário em até 60x com as melhores taxas do mercado e avaliação justa do seu veículo na troca.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CalendarCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Financiamento até 60x</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cartão em até 21x</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <Repeat className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Aceitamos seu Usado</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Procedência Garantida</span>
              </div>
            </div>
          </div>

          {/* Social Presence Card */}
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-zinc-900 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Acompanhe Nosso Estoque Diário
              </span>
              <h3 className="text-2xl font-black text-white">
                Novidades direto no Instagram
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Fotos reais, vídeos de entrega, chegadas de estoque e veículos vendidos quase todos os dias no nosso perfil oficial.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={CONTACT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all cursor-pointer"
              >
                <span>Seguir {CONTACT_INFO.brandHandle}</span>
                <ArrowUpRight className="w-4 h-4 text-black" />
              </a>

              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center gap-2 border border-zinc-700 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Falar com Consultor</span>
              </a>
            </div>
          </div>
        </div>

        {/* Avaliações de clientes (Prompt #8: sem depoimentos inventados, botão para Google) */}
        <div className="pt-8 border-t border-zinc-900">
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-bold text-zinc-300 ml-2">5.0 de avaliação</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Avaliações de clientes
              </h3>
              <p className="text-xs text-zinc-400 max-w-xl">
                Transparência e respeito em cada negociação. Veja o que nossos clientes dizem sobre o atendimento da {CONTACT_INFO.brandName}.
              </p>
            </div>

            <a
              href={CONTACT_INFO.googleReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-xs bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all flex items-center gap-2 shadow-lg shadow-black/60 cursor-pointer"
            >
              <span>Ver avaliações no Google</span>
              <ArrowUpRight className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
