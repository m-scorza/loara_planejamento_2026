import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  cenarios: {
    conservador: {
      carteira: number;
      indicacoes: number;
      contratos: number;
      captacao: number;
      receita: number;
      churn: number;
    };
    moderado: {
      carteira: number;
      indicacoes: number;
      contratos: number;
      captacao: number;
      receita: number;
      churn: number;
    };
    agressivo: {
      carteira: number;
      indicacoes: number;
      contratos: number;
      captacao: number;
      receita: number;
      churn: number;
    };
  };
}

export function GraficoComparacaoCenarios({ cenarios }: Props) {
  const data = [
    {
      metrica: 'Carteira',
      Conservador: cenarios.conservador.carteira,
      Moderado: cenarios.moderado.carteira,
      Agressivo: cenarios.agressivo.carteira,
    },
    {
      metrica: 'Indicações',
      Conservador: Math.round(cenarios.conservador.indicacoes / 10), // Escala para visualização
      Moderado: Math.round(cenarios.moderado.indicacoes / 10),
      Agressivo: Math.round(cenarios.agressivo.indicacoes / 10),
    },
    {
      metrica: 'Contratos',
      Conservador: cenarios.conservador.contratos,
      Moderado: cenarios.moderado.contratos,
      Agressivo: cenarios.agressivo.contratos,
    },
    {
      metrica: 'Receita (M)',
      Conservador: Math.round(cenarios.conservador.receita / 1000000),
      Moderado: Math.round(cenarios.moderado.receita / 1000000),
      Agressivo: Math.round(cenarios.agressivo.receita / 1000000),
    },
  ];

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            dataKey="metrica" 
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
          <Bar dataKey="Conservador" fill="#ef4444" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Moderado" fill="#3b82f6" radius={[8, 8, 0, 0]} />
          <Bar dataKey="Agressivo" fill="#10b981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
