import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  metas_mensais: Array<{
    mes: number;
    mes_nome: string;
    carteira_acumulada: number;
    indicacoes: number;
    contratos: number;
    receita: number;
  }>;
}

export function GraficoMetasMensais({ metas_mensais }: Props) {
  const data = metas_mensais.map(meta => ({
    mes: meta.mes_nome,
    Indicações: meta.indicacoes,
    Contratos: meta.contratos,
    'Receita (K)': Math.round(meta.receita / 1000),
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="mes" 
            stroke="#64748b"
            style={{ fontSize: '14px', fontWeight: 500 }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '14px', fontWeight: 500 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              padding: '12px'
            }}
            labelStyle={{ fontWeight: 600, marginBottom: '8px' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
          />
          <Bar dataKey="Indicações" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Contratos" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Line 
            type="monotone" 
            dataKey="Receita (K)" 
            stroke="#10b981" 
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
