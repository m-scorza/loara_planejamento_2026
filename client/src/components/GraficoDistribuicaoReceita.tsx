import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  compensacao_gerentes: {
    matheus: {
      meta_carteira: number;
      meta_contratos: number;
      receita_esperada: number;
    };
    viviane: {
      meta_carteira: number;
      meta_contratos: number;
      receita_esperada: number;
    };
  };
}

const COLORS = ['#3b82f6', '#8b5cf6'];

export function GraficoDistribuicaoReceita({ compensacao_gerentes }: Props) {
  const data = [
    { 
      name: 'Matheus', 
      value: compensacao_gerentes.matheus.receita_esperada,
      percent: 70
    },
    { 
      name: 'Viviane', 
      value: compensacao_gerentes.viviane.receita_esperada,
      percent: 30
    },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(2)}M`;
    }
    return `R$ ${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${percent}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value, entry: any) => `${value}: ${formatCurrency(entry.payload.value)}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
