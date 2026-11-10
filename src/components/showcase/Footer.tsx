import React from 'react';
import { Instagram, Youtube, PhoneCall, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { GoldShield } from '../common/GoldShield';
import { CONTACT_INFO, getWhatsAppUrl } from '../../config/contact';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <GoldShield size={28} />
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-wider uppercase leading-none">
                  D<span className="text-amber-400">'MOTORS</span>
                </span>
                <span className="text-[9px] uppercase tracking-widest text-amber-400/80 font-medium">
                  {CONTACT_INFO.cityState}
                </span>
              </div>
            </div>
            <p className="text-zinc-500 leading-relaxed text-[11px]">
              {CONTACT_INFO.slogan} Atendimento presencial e online com as melhores condições e taxas do mercado.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href={CONTACT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-pink-400 flex items-center justify-center transition-colors border border-zinc-800"
                title="Instagram @_dmotors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={CONTACT_INFO.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-red-400 flex items-center justify-center transition-colors border border-zinc-800"
                title="YouTube @_dmotors"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={getWhatsAppUrl('Olá D\'MOTORS! Gostaria de mais informações sobre o estoque.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 flex items-center justify-center transition-colors border border-emerald-800/40"
                title="WhatsApp D'MOTORS"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Showroom & Location */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Localização</h4>
            <div className="flex items-start gap-2 text-[11px] text-zinc-400">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{CONTACT_INFO.cityState} · Atendimento com agendamento</span>
            </div>
            <div className="flex items-start gap-2 text-[11px] text-zinc-400">
              <Clock className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <p>Segunda a Sexta: 09h às 19h</p>
                <p>Sábados: 09h às 16h</p>
              </div>
            </div>
          </div>

          {/* Contacts */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Canais Oficiais</h4>
            <div className="flex items-center gap-2 text-[11px]">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-300 transition-colors"
              >
                {CONTACT_INFO.whatsappFormatted} (WhatsApp)
              </a>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-3.5 h-3.5 text-zinc-400" />
              <span>{CONTACT_INFO.email}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Instagram className="w-3.5 h-3.5 text-pink-400" />
              <a
                href={CONTACT_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-zinc-200 transition-colors"
              >
                {CONTACT_INFO.instagramHandle} (Instagram Oficial)
              </a>
            </div>
          </div>

          {/* Quality & Transparency */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2">Procedência</h4>
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Veículos com Histórico Verificado</span>
              </div>
              <p className="text-zinc-500 text-[10px]">
                Transparência completa em cada negociação, quilometragem real e suporte durante todo o processo.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-600">
          <p>© {new Date().getFullYear()} D'MOTORS · {CONTACT_INFO.cityState}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-zinc-400 cursor-pointer">Termos de Uso</span>
            <span>·</span>
            <span className="hover:text-zinc-400 cursor-pointer">Privacidade</span>
            <span>·</span>
            <a
              href={CONTACT_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-zinc-400 cursor-pointer"
            >
              Instagram @_dmotors
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
