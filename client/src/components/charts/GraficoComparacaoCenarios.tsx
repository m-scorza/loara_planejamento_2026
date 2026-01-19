import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

interface Cenario {
  carteira: number;
  indicacoes: number;
  contratos: number;
  captacao: number;
  receita: number;
  churn: number;
}

interface Props {
  cenarios: {
    conservador: Cenario;
    moderado: Cenario;
    agressivo: Cenario;
  };
}

export function GraficoComparacaoCenarios({ cenarios }: Props) {
  // Preparar dados com todas as métricas relevantes
  const data = [
    {
      metrica: 'Carteira\nFinal',
      Conservador: cenarios.conservador.carteira,
      Moderado: cenarios.moderado.carteira,
      Agressivo: cenarios.agressivo.carteira,
    },
    {
      metrica: 'Novos\nParceiros',
      Conservador: cenarios.conservador.carteira - 40,
      Moderado: cenarios.moderado.carteira - 40,
      Agressivo: cenarios.agressivo.carteira - 40,
    },
    {
      metrica: 'Indicações\n(÷10)',
      Conservador: Math.round(cenarios.conservador.indicacoes / 10),
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
      metrica: 'Operações',
      Conservador: Math.round(cenarios.conservador.contratos * 0.73),
      Moderado: Math.round(cenarios.moderado.contratos * 0.73),
      Agressivo: Math.round(cenarios.agressivo.contratos * 0.73),
    },
    {
      metrica: 'Captação\n(R$ M)',
      Conservador: Math.round(cenarios.conservador.captacao / 1000000),
      Moderado: Math.round(cenarios.moderado.captacao / 1000000),
      Agressivo: Math.round(cenarios.agressivo.captacao / 1000000),
    },
    {
      metrica: 'Receita\n(R$ M)',
      Conservador: Number((cenarios.conservador.receita / 1000000).toFixed(1)),
      Moderado: Number((cenarios.moderado.receita / 1000000).toFixed(1)),
      Agressivo: Number((cenarios.agressivo.receita / 1000000).toFixed(1)),
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-blue-300 rounded-xl shadow-2xl">
          <p className="font-bold text-slate-700 mb-3 border-b pb-2">{label.replace('\n', ' ')}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm font-medium text-slate-700">{entry.name}:</span>
                </div>
                <span className="text-base font-bold" style={{ color: entry.color }}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y - 5}
        fill="#1e293b"
        textAnchor="middle"
        fontSize={12}
        fontWeight={700}
      >
        {value}
      </text>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Comparação de Cenários 2026</h3>
        <p className="text-sm text-slate-600">Análise comparativa de todas as métricas-chave por cenário</p>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <BarChart 
          data={data} 
          margin={{ top: 40, right: 50, left: 20, bottom: 50 }}
          barGap={3}
          barCategoryGap="18%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.6} />
          
          <XAxis 
            dataKey="metrica" 
            stroke="#64748b"
            strokeWidth={2}
            tick={{ fontSize: 12, fontWeight: 700, fill: '#475569' }}
            tickLine={{ stroke: '#94a3b8', strokeWidth: 2 }}
            height={70}
          />
          
          <YAxis 
            stroke="#64748b"
            strokeWidth={2}
            tick={{ fontSize: 13, fontWeight: 700, fill: '#475569' }}
            label={{ 
              value: 'Valor', 
              angle: -90, 
              position: 'insideLeft', 
              style: { fontSize: 15, fontWeight: 800, fill: '#475569' } 
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '30px', 
              fontSize: '14px', 
              fontWeight: 700 
            }}
            iconType="rect"
            iconSize={18}
          />
          
          <Bar 
            dataKey="Conservador" 
            fill="#6b7280" 
            radius={[8, 8, 0, 0]}
            opacity={0.9}
          >
            <LabelList content={renderCustomLabel} />
          </Bar>
          
          <Bar 
            dataKey="Moderado" 
            fill="#1e40af" 
            radius={[8, 8, 0, 0]}
            opacity={0.95}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill="#1e40af" 
                stroke="#1e3a8a" 
                strokeWidth={3} 
              />
            ))}
            <LabelList content={renderCustomLabel} />
          </Bar>
          
          <Bar 
            dataKey="Agressivo" 
            fill="#d97706" 
            radius={[8, 8, 0, 0]}
            opacity={0.9}
          >
            <LabelList content={renderCustomLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span className="text-slate-600"><span className="font-bold">Conservador:</span> Crescimento cauteloso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-700 rounded border-2 border-blue-900"></div>
            <span className="text-slate-600"><span className="font-bold text-blue-700">Moderado:</span> Recomendado (equilibrado)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-amber-600 rounded"></div>
            <span className="text-slate-600"><span className="font-bold">Agressivo:</span> Crescimento acelerado</span>
          </div>
        </div>
        <p className="text-xs text-slate-500 text-center">
          * Indicações divididas por 10 para melhor visualização | Operações calculadas com taxa de conversão de 73%
        </p>
      </div>
    </div>
  );
}
