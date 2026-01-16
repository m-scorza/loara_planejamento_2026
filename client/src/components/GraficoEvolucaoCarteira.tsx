import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

export function GraficoEvolucaoCarteira({ metas_mensais }: Props) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={metas_mensais} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="mes_nome" 
            stroke="#64748b"
            style={{ fontSize: '14px', fontWeight: 500 }}
          />
          <YAxis 
            stroke="#64748b"
            style={{ fontSize: '14px', fontWeight: 500 }}
            label={{ value: 'Parceiros', angle: -90, position: 'insideLeft', style: { fontSize: '14px' } }}
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
            iconType="line"
          />
          <Line 
            type="monotone" 
            dataKey="carteira_acumulada" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Carteira Acumulada"
            dot={{ fill: '#3b82f6', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
