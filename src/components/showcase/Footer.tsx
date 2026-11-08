import React from 'react';
import { Car, Instagram, PhoneCall, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white tracking-wider uppercase">
                D<span className="text-red-500">MOTORS</span>
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              Especialistas na intermediação e venda de veículos seminovos de procedência inquestionável. Atendimento exclusivo com hora marcada.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://instagram.com/_dmotors"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-pink-400 flex items-center justify-center transition-colors"
                title="Instagram @_dmotors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/5511999998888`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-emerald-400 flex items-center justify-center transition-colors"
                title="WhatsApp Dmotors"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Showroom & Hours */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Showroom Guarulhos</h4>
            <div className="flex items-start gap-2 text-[11px] text-zinc-400">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>Av. Paulo Faccini, 32 - Macedo, Guarulhos - SP, 07111-000</span>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-zinc-400">
              <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <p>Segunda a Sexta: 09h às 19h</p>
                <p>Sábados: 09h às 17h</p>
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Atendimento Direto</h4>
            <div className="flex items-center gap-2 text-[11px]">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>(11) 99999-8888 (WhatsApp Showroom)</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>contato@dmotors.com.br</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <a
                href="https://instagram.com/_dmotors"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-200 transition-colors"
              >
                @_dmotors (Instagram Oficial)
              </a>
            </div>
          </div>

          {/* Seals and Security */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Garantia e Procedência</h4>
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Laudo Cautelar Dekra</span>
              </div>
              <p className="text-zinc-500 text-[10px]">
                Nenhum veículo comercializado possui histórico de leilão, sinistro ou alteração de hodômetro.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <p>© {new Date().getFullYear()} Dmotors Veículos Premium. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Termos de Uso</span>
            <span>·</span>
            <span className="hover:text-zinc-400 cursor-pointer">Privacidade</span>
            <span>·</span>
            <span className="hover:text-zinc-400 cursor-pointer">Certificado Cautelar</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
