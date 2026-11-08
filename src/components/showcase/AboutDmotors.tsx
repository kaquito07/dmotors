import React from 'react';
import { ShieldCheck, Award, ThumbsUp, Users, MapPin, Instagram, PhoneCall } from 'lucide-react';

export const AboutDmotors: React.FC = () => {
  return (
    <section className="py-16 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-500">
              <span>Sobre a Dmotors</span>
              <span>·</span>
              <span className="text-zinc-400">@_dmotors</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Mais do que vender carros, realizamos conquistas com transparência inegociável.
            </h2>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Fundada em Guarulhos - SP, a <strong>Dmotors</strong> nasceu da paixão automobilística e da constatação de que o mercado de seminovos precisava de um novo padrão: transparência absoluta, peritagem independente e atendimento consultivo personalizado.
            </p>

            <p className="text-sm text-zinc-400 leading-relaxed">
              Todos os nossos veículos passam por uma criteriosa checagem estrutural, mecânica e documental. Recusamos mais de 70% dos carros avaliados para garantir que você leve para casa apenas o que há de melhor no mercado nacional.
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-zinc-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Laudo Cautelar 100% Aprovado</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Garantia de Motor e Câmbio</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                <span>+1.200 Clientes Satisfeitos</span>
              </div>
            </div>
          </div>

          {/* Showroom visual card */}
          <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80"
              alt="Showroom Dmotors"
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent flex flex-col justify-end p-6">
              <span className="text-xs uppercase font-bold text-red-500 tracking-wider">Showroom Principal</span>
              <h3 className="text-xl font-bold text-white mt-1">Dmotors Experience Guarulhos</h3>
              <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                Av. Paulo Faccini, 32 · Macedo · Guarulhos - SP, 07111-000
              </p>
            </div>
          </div>
        </div>

        {/* Client Reviews / Depoimentos */}
        <div className="pt-8 border-t border-zinc-900">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-red-500">Depoimentos Reais</span>
            <h3 className="text-2xl font-black text-white tracking-tight mt-1">O que nossos clientes dizem</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/80 space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "Comprei meu Audi A3 na Dmotors 100% online, direto pelo Instagram @_dmotors. O carro foi entregue no Rio de Janeiro exatamente como nas fotos e no laudo. Atendimento impecável!"
              </p>
              <div className="pt-2 border-t border-zinc-800 text-xs">
                <strong className="text-white block">Rodrigo Alcantara</strong>
                <span className="text-zinc-500">Audi A3 Sedan · Rio de Janeiro - RJ</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/80 space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "Dei meu Polo na troca e peguei um Golf GTI. A avaliação do meu usado foi a mais justa de todas as lojas que pesquisei na Zona Sul de SP. Recomendo de olhos fechados."
              </p>
              <div className="pt-2 border-t border-zinc-800 text-xs">
                <strong className="text-white block">Fabio Mantovani</strong>
                <span className="text-zinc-500">Golf GTI · São Paulo - SP</span>
              </div>
            </div>

            <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800/80 space-y-3">
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                {'★'.repeat(5)}
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed italic">
                "A transparência do laudo cautelar me passou muita segurança. Mostram cada detalhe, pintura original, histórico na concessionária. Nota 10!"
              </p>
              <div className="pt-2 border-t border-zinc-800 text-xs">
                <strong className="text-white block">Camila Rezende</strong>
                <span className="text-zinc-500">Jeep Compass · Campinas - SP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
