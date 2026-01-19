import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';

interface Props {
  compensacao_gerentes: {
    matheus: { meta_carteira: number; meta_contratos: number; receita_esperada: number; };
    viviane: { meta_carteira: number; meta_contratos: number; receita_esperada: number; };
  };
}

const COLORS = { matheus: '#1e40af', viviane: '#8b5cf6' };

export function GraficoDistribuicaoReceita({ compensacao_gerentes }: Props) {
  const totalReceita = compensacao_gerentes.matheus.receita_esperada + compensacao_gerentes.viviane.receita_esperada;
  
  const data = [
    { name: 'Matheus Scorza', value: compensacao_gerentes.matheus.receita_esperada, percent: ((compensacao_gerentes.matheus.receita_esperada / totalReceita) * 100).toFixed(0), carteira: compensacao_gerentes.matheus.meta_carteira, contratos: compensacao_gerentes.matheus.meta_contratos, color: COLORS.matheus },
    { name: 'Viviane Andrade', value: compensacao_gerentes.viviane.receita_esperada, percent: ((compensacao_gerentes.viviane.receita_esperada / totalReceita) * 100).toFixed(0), carteira: compensacao_gerentes.viviane.meta_carteira, contratos: compensacao_gerentes.viviane.meta_contratos, color: COLORS.viviane },
  ];

  const formatCurrency = (value: number) => value >= 1000000 ? `R$ ${(value / 1000000).toFixed(2)}M` : `R$ ${(value / 1000).toFixed(0)}K`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border-2 border-blue-300 rounded-xl shadow-2xl">
          <p className="font-bold text-slate-700 mb-3 text-base border-b pb-2">{data.name}</p>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Receita: <span className="text-green-600 font-bold text-base">{formatCurrency(data.value)}</span></p>
            <p className="text-slate-600">Participação: <span className="font-bold">{data.percent}%</span></p>
            <p className="text-slate-600">Meta Carteira: <span className="font-bold">{data.carteira} parceiros</span></p>
            <p className="text-slate-600">Meta Contratos: <span className="font-bold">{data.contratos}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="font-bold text-base">{`${(percent * 100).toFixed(0)}%`}</text>;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Distribuição de Receita por Gerente 2026</h3>
        <p className="text-sm text-slate-600">Participação de cada gerente na receita total anual</p>
      </div>
      <ResponsiveContainer width="100%" height={450}>
        <PieChart>
          <Pie data={data} cx="50%" cy="45%" labelLine={{ stroke: '#64748b', strokeWidth: 2 }} label={renderCustomLabel} outerRadius={140} innerRadius={60} fill="#8884d8" dataKey="value" paddingAngle={3}>
            {data.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={3} />))}
            <Label value={formatCurrency(totalReceita)} position="center" style={{ fontSize: '18px', fontWeight: 'bold', fill: '#1e293b' }} />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '14px', fontWeight: 600 }} formatter={(value, entry: any) => `${value}: ${formatCurrency(entry.payload.value)} (${entry.payload.percent}%)`} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      <div className="text-center mt-2">
        <p className="text-sm font-semibold text-slate-600">Receita Total Anual: <span className="text-green-600 text-base font-bold">{formatCurrency(totalReceita)}</span></p>
      </div>
    </div>
  );
}
