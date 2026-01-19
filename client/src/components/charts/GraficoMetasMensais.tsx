import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface MetaMensal {
  mes: number;
  mes_nome: string;
  carteira_acumulada: number;
  indicacoes: number;
  contratos: number;
  receita: number;
}

interface Props {
  metas_mensais: MetaMensal[];
}

export function GraficoMetasMensais({ metas_mensais }: Props) {
  const data = metas_mensais.map((meta, index) => {
    const anterior = index > 0 ? metas_mensais[index - 1].carteira_acumulada : 40;
    const novos = meta.carteira_acumulada - anterior;
    
    return {
      mes: meta.mes_nome,
      'Novos Parceiros': novos,
      'Indicações (÷10)': Math.round(meta.indicacoes / 10),
      'Contratos': meta.contratos,
      'Receita (R$ 100K)': Number((meta.receita / 100000).toFixed(1)),
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-blue-300 rounded-xl shadow-2xl">
          <p className="font-bold text-slate-700 mb-3 border-b pb-2 text-base">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => {
              let displayValue = entry.value;
              let displayName = entry.name;
              
              if (entry.name === 'Indicações (÷10)') {
                displayValue = entry.value * 10;
                displayName = 'Indicações';
              } else if (entry.name === 'Receita (R$ 100K)') {
                displayValue = `R$ ${(entry.value * 100).toFixed(0)}K`;
                displayName = 'Receita';
              }
              
              return (
                <div key={index} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm font-medium text-slate-700">{displayName}:</span>
                  </div>
                  <span className="text-base font-bold" style={{ color: entry.color }}>
                    {displayValue}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Metas Mensais 2026 - Cenário Moderado</h3>
        <p className="text-sm text-slate-600">Distribuição mensal de novos parceiros, indicações, contratos e receita</p>
      </div>
      
      <ResponsiveContainer width="100%" height={480}>
        <ComposedChart data={data} margin={{ top: 40, right: 50, left: 20, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.6} />
          <XAxis dataKey="mes" stroke="#64748b" strokeWidth={2} tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }} tickLine={{ stroke: '#94a3b8', strokeWidth: 2 }} height={70} />
          <YAxis stroke="#64748b" strokeWidth={2} tick={{ fontSize: 13, fontWeight: 700, fill: '#475569' }} label={{ value: 'Quantidade / Valor', angle: -90, position: 'insideLeft', style: { fontSize: 15, fontWeight: 800, fill: '#475569' } }} domain={[0, 'dataMax + 5']} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '30px', fontSize: '13px', fontWeight: 700 }} iconType="rect" iconSize={16} />
          <Bar dataKey="Novos Parceiros" fill="#1e40af" radius={[8, 8, 0, 0]} opacity={0.95} />
          <Bar dataKey="Indicações (÷10)" fill="#3b82f6" radius={[8, 8, 0, 0]} opacity={0.9} />
          <Bar dataKey="Contratos" fill="#60a5fa" radius={[8, 8, 0, 0]} opacity={0.9} />
          <Bar dataKey="Receita (R$ 100K)" fill="#059669" radius={[8, 8, 0, 0]} opacity={0.95} />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 space-y-2">
        <p className="text-xs text-slate-500 text-center">* Indicações divididas por 10 | Receita em unidades de R$ 100K</p>
      </div>
    </div>
  );
}
