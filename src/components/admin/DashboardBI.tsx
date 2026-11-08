import React, { useMemo } from 'react';
import { Vehicle } from '../../types/vehicle';
import { formatBRL, calculateDaysInStock } from '../../utils/formatters';
import {
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  Flame,
  Award,
  ArrowUpRight,
  PieChart,
  BarChart3,
  Calendar
} from 'lucide-react';

interface DashboardBIProps {
  vehicles: Vehicle[];
}

export const DashboardBI: React.FC<DashboardBIProps> = ({ vehicles }) => {
  // Sold vehicles for performance analysis
  const soldVehicles = useMemo(() => {
    return vehicles.filter((v) => v.status === 'sold' && v.soldDate);
  }, [vehicles]);

  // Available vehicles
  const availableVehicles = useMemo(() => {
    return vehicles.filter((v) => v.status === 'available');
  }, [vehicles]);

  // Overall Financial KPIs
  const kpis = useMemo(() => {
    const totalSoldRevenue = soldVehicles.reduce(
      (acc, v) => acc + (v.salePrice || v.price),
      0
    );

    const totalSoldCost = soldVehicles.reduce(
      (acc, v) => acc + v.purchasePrice,
      0
    );

    const totalGrossProfit = totalSoldRevenue - totalSoldCost;
    const avgProfitMargin =
      totalSoldRevenue > 0 ? (totalGrossProfit / totalSoldRevenue) * 100 : 0;

    const activeStockCost = availableVehicles.reduce(
      (acc, v) => acc + v.purchasePrice,
      0
    );

    const activeStockProjectedRevenue = availableVehicles.reduce(
      (acc, v) => acc + v.price,
      0
    );

    const activeStockProjectedProfit = activeStockProjectedRevenue - activeStockCost;

    // Average Days in Stock (Giro de Estoque)
    const totalDays = soldVehicles.reduce((acc, v) => {
      return acc + calculateDaysInStock(v.entryDate, v.soldDate);
    }, 0);
    const avgDaysInStock = soldVehicles.length > 0 ? Math.round(totalDays / soldVehicles.length) : 0;

    const avgTicket =
      soldVehicles.length > 0 ? Math.round(totalSoldRevenue / soldVehicles.length) : 0;

    return {
      totalSoldRevenue,
      totalSoldCost,
      totalGrossProfit,
      avgProfitMargin,
      activeStockCost,
      activeStockProjectedRevenue,
      activeStockProjectedProfit,
      avgDaysInStock,
      avgTicket,
    };
  }, [soldVehicles, availableVehicles]);

  // Monthly 2026 performance aggregation (Jan - Out)
  const monthlyData = useMemo(() => {
    const months = [
      { key: '01', name: 'Jan' },
      { key: '02', name: 'Fev' },
      { key: '03', name: 'Mar' },
      { key: '04', name: 'Abr' },
      { key: '05', name: 'Mai' },
      { key: '06', name: 'Jun' },
      { key: '07', name: 'Jul' },
      { key: '08', name: 'Ago' },
      { key: '09', name: 'Set' },
      { key: '10', name: 'Out' },
    ];

    return months.map((m) => {
      const monthVehicles = soldVehicles.filter((v) => {
        if (!v.soldDate) return false;
        const [year, month] = v.soldDate.split('-');
        return year === '2026' && month === m.key;
      });

      const revenue = monthVehicles.reduce((acc, v) => acc + (v.salePrice || v.price), 0);
      const cost = monthVehicles.reduce((acc, v) => acc + v.purchasePrice, 0);
      const profit = revenue - cost;

      return {
        ...m,
        count: monthVehicles.length,
        revenue,
        profit,
      };
    });
  }, [soldVehicles]);

  const maxMonthlyRevenue = useMemo(() => {
    const max = Math.max(...monthlyData.map((d) => d.revenue), 100000);
    return max * 1.15; // 15% headroom for charts
  }, [monthlyData]);

  // Sales Channel distribution
  const channelData = useMemo(() => {
    const channels: Record<string, { count: number; revenue: number; profit: number }> = {};

    soldVehicles.forEach((v) => {
      const ch = v.saleChannel || 'Loja Física';
      if (!channels[ch]) {
        channels[ch] = { count: 0, revenue: 0, profit: 0 };
      }
      const rev = v.salePrice || v.price;
      channels[ch].count += 1;
      channels[ch].revenue += rev;
      channels[ch].profit += rev - v.purchasePrice;
    });

    return Object.entries(channels).map(([name, data]) => ({
      name,
      ...data,
      pct: soldVehicles.length > 0 ? Math.round((data.count / soldVehicles.length) * 100) : 0,
    }));
  }, [soldVehicles]);

  // Brand Distribution in Stock
  const brandDistribution = useMemo(() => {
    const counts: Record<string, number> = {};
    availableVehicles.forEach((v) => {
      counts[v.brand] = (counts[v.brand] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([brand, count]) => ({ brand, count }))
      .sort((a, b) => b.count - a.count);
  }, [availableVehicles]);

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* 1. Header Banner & Quick Period Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-400 mb-1">
            <BarChart3 className="w-4 h-4" />
            Business Intelligence Dmotors · Exercício 2026
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Dashboard Executivo e Rentabilidade
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Métricas em tempo real sincronizadas com o estoque e histórico de vendas de @_dmotors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-zinc-950 px-3 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-zinc-500" />
            <span>Ano Base: <strong>2026</strong></span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/60 px-3 py-2 rounded-xl text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Dados em Tempo Real</span>
          </div>
        </div>
      </div>

      {/* 2. Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Faturamento Realizado */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Faturamento Realizado
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {formatBRL(kpis.totalSoldRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{soldVehicles.length} carros vendidos em 2026</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
            Custo total de aquisição: {formatBRL(kpis.totalSoldCost)}
          </div>
        </div>

        {/* KPI 2: Lucro Bruto & Margem */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Lucro Bruto Realizado
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight font-mono">
              {formatBRL(kpis.totalGrossProfit)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 mt-1 font-semibold">
              <span className="text-amber-400 font-bold">{kpis.avgProfitMargin.toFixed(1)}%</span>
              <span className="text-zinc-500 font-normal">margem média sobre vendas</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
            Ticket médio de venda: {formatBRL(kpis.avgTicket)}
          </div>
        </div>

        {/* KPI 3: Giro de Estoque */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Giro Médio de Estoque
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {kpis.avgDaysInStock}{' '}
              <span className="text-base text-zinc-400 font-sans font-normal">dias</span>
            </div>
            <div className="text-xs text-blue-400 mt-1 font-medium">
              Excelente liquidez no segmento premium
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
            Venda mais rápida: 14 dias (Onix Premier)
          </div>
        </div>

        {/* KPI 4: Estoque Ativo */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-400">
              Estoque Ativo (Showroom)
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Package className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {formatBRL(kpis.activeStockProjectedRevenue)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-1 font-medium">
              <span>{availableVehicles.length} veículos em pátio</span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80">
            Lucro projetado em estoque: {formatBRL(kpis.activeStockProjectedProfit)}
          </div>
        </div>
      </div>

      {/* 3. Main Chart: Monthly Sales & Profit Evolution (Custom Interactive SVG) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              Evolução Mensal de Faturamento & Lucro Líquido (2026)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Comparativo mês a mês de receita gerada e margem bruta obtida nas vendas da Dmotors.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-3 h-3 rounded bg-red-600 inline-block" />
              <span>Faturamento (R$)</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
              <span>Lucro Bruto (R$)</span>
            </div>
          </div>
        </div>

        {/* SVG Chart */}
        <div className="w-full overflow-x-auto pt-2">
          <div className="min-w-[620px] h-64 flex flex-col justify-end">
            <div className="h-52 w-full flex items-end gap-4 border-b border-zinc-800 pb-2 relative">
              {/* Background horizontal guideline lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="border-b border-zinc-700 w-full" />
                <div className="border-b border-zinc-700 w-full" />
                <div className="border-b border-zinc-700 w-full" />
              </div>

              {monthlyData.map((d, index) => {
                const revenueHeightPct = maxMonthlyRevenue > 0 ? (d.revenue / maxMonthlyRevenue) * 100 : 0;
                const profitHeightPct = maxMonthlyRevenue > 0 ? (d.profit / maxMonthlyRevenue) * 100 : 0;

                return (
                  <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 bg-zinc-950 border border-zinc-700 text-xs rounded-lg p-2 shadow-xl whitespace-nowrap">
                      <strong className="text-white block font-sans">{d.name} 2026 ({d.count} vendas)</strong>
                      <span className="text-red-400 block font-mono text-[11px]">Receita: {formatBRL(d.revenue)}</span>
                      <span className="text-emerald-400 block font-mono text-[11px]">Lucro: {formatBRL(d.profit)}</span>
                    </div>

                    {/* Dual Bars */}
                    <div className="w-full flex items-end justify-center gap-1.5 h-full">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${Math.max(revenueHeightPct, 4)}%` }}
                        className={`w-4 sm:w-6 rounded-t-md transition-all duration-300 ${
                          d.revenue > 0 ? 'bg-red-600/90 group-hover:bg-red-500' : 'bg-zinc-800/40'
                        }`}
                      />

                      {/* Profit Bar */}
                      <div
                        style={{ height: `${Math.max(profitHeightPct, 4)}%` }}
                        className={`w-4 sm:w-6 rounded-t-md transition-all duration-300 ${
                          d.profit > 0 ? 'bg-emerald-500/90 group-hover:bg-emerald-400' : 'bg-zinc-800/40'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="w-full flex items-center justify-between gap-4 pt-2">
              {monthlyData.map((d, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className="text-xs font-semibold text-zinc-400 block">{d.name}</span>
                  <span className="text-[10px] text-zinc-500 font-mono block">
                    {d.count > 0 ? `${d.count}v` : '-'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Secondary Analytics Grid: Sales Channels & Individual Vehicle Margin Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales by Channel (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-pink-400" />
              Origem das Vendas
            </h3>
            <span className="text-xs text-zinc-400">{soldVehicles.length} fechamentos</span>
          </div>

          <div className="space-y-3 pt-2">
            {channelData.map((ch, idx) => (
              <div key={idx} className="space-y-1.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/60">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-200">{ch.name}</span>
                  <span className="font-mono text-zinc-400">{ch.count} carros ({ch.pct}%)</span>
                </div>

                <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${ch.pct}%` }}
                    className={`h-full rounded-full ${
                      ch.name.includes('Instagram')
                        ? 'bg-pink-500'
                        : ch.name.includes('Loja')
                        ? 'bg-blue-500'
                        : ch.name.includes('Webmotors')
                        ? 'bg-red-500'
                        : 'bg-amber-500'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                  <span>Receita: {formatBRL(ch.revenue)}</span>
                  <span className="text-emerald-400 font-semibold font-mono">Lucro: +{formatBRL(ch.profit)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-zinc-400 bg-pink-950/30 border border-pink-800/40 p-3 rounded-xl">
            🔥 <strong>Destaque Comercial:</strong> O canal <strong>Instagram @_dmotors</strong> respondeu por mais de 30% das vendas diretas com a maior margem de lucro por unidade.
          </div>
        </div>

        {/* Historic Profit Table per Sold Vehicle (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Demonstrativo de Veículos Vendidos em 2026
            </h3>
            <span className="text-xs text-zinc-400">Auditoria Financeira</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 font-semibold uppercase text-[10px]">
                  <th className="pb-2.5">Veículo / Comprador</th>
                  <th className="pb-2.5">Compra</th>
                  <th className="pb-2.5">Venda</th>
                  <th className="pb-2.5">Lucro Bruto</th>
                  <th className="pb-2.5 text-right">Giro (Dias)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {soldVehicles.map((car) => {
                  const saleP = car.salePrice || car.price;
                  const profit = saleP - car.purchasePrice;
                  const marginPct = ((profit / saleP) * 100).toFixed(1);
                  const days = calculateDaysInStock(car.entryDate, car.soldDate);

                  return (
                    <tr key={car.id} className="hover:bg-zinc-800/40 transition-colors">
                      <td className="py-2.5 pr-2">
                        <strong className="text-white block font-medium">
                          {car.brand} {car.model}
                        </strong>
                        <span className="text-[11px] text-zinc-400 truncate max-w-[180px] block">
                          {car.buyerName || 'Cliente Particular'} · {car.saleChannel}
                        </span>
                      </td>

                      <td className="py-2.5 text-zinc-400 font-mono">
                        {formatBRL(car.purchasePrice)}
                      </td>

                      <td className="py-2.5 text-zinc-200 font-mono font-semibold">
                        {formatBRL(saleP)}
                      </td>

                      <td className="py-2.5 text-emerald-400 font-mono font-bold">
                        +{formatBRL(profit)}
                        <span className="text-[10px] text-zinc-500 font-normal ml-1">({marginPct}%)</span>
                      </td>

                      <td className="py-2.5 text-right font-mono text-zinc-300">
                        {days} dias
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
