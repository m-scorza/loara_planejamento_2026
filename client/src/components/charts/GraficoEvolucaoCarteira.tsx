import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ReferenceLine } from 'recharts';

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

export function GraficoEvolucaoCarteira({ metas_mensais }: Props) {
  // Enriquecer dados com cálculos de novos parceiros e churn
  const dadosEnriquecidos = metas_mensais.map((meta, index) => {
    const anterior = index > 0 ? metas_mensais[index - 1].carteira_acumulada : 40;
    const crescimento = meta.carteira_acumulada - anterior;
    
    // Estimar novos parceiros e churn baseado no crescimento
    const novos = index === 0 ? 2 : Math.max(Math.ceil(crescimento * 1.3), crescimento + 1);
    const churn = novos - crescimento;
    
    return {
      mes: meta.mes_nome,
      'Carteira Ativa': meta.carteira_acumulada,
      'Novos Parceiros': novos,
      'Churn': churn,
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border-2 border-blue-300 rounded-xl shadow-2xl">
          <p className="font-bold text-blue-900 mb-3 text-base border-b pb-2">{label}</p>
          <div className="space-y-2">
            {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
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

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Evolução da Carteira de Parceiros 2026</h3>
        <p className="text-sm text-slate-600">Crescimento acumulado com entrada e saída de parceiros</p>
      </div>
      
      <ResponsiveContainer width="100%" height={450}>
        <ComposedChart 
          data={dadosEnriquecidos} 
          margin={{ top: 20, right: 50, left: 20, bottom: 40 }}
        >
          <defs>
            <linearGradient id="colorCarteira" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#1e40af" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.6} />
          
          <XAxis 
            dataKey="mes" 
            tick={{ fontSize: 13, fontWeight: 600, fill: '#475569' }}
            stroke="#94a3b8"
            strokeWidth={2}
            tickLine={{ stroke: '#94a3b8', strokeWidth: 2 }}
            height={60}
          />
          
          {/* Eixo esquerdo - Carteira */}
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 13, fontWeight: 700, fill: '#1e40af' }}
            stroke="#1e40af"
            strokeWidth={2}
            domain={[35, 'dataMax + 10']}
            label={{ 
              value: 'Carteira Ativa (Parceiros)', 
              angle: -90, 
              position: 'insideLeft', 
              style: { fontSize: 15, fontWeight: 800, fill: '#1e40af' } 
            }}
          />
          
          {/* Eixo direito - Novos/Churn */}
          <YAxis 
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 13, fontWeight: 700, fill: '#64748b' }}
            stroke="#64748b"
            strokeWidth={2}
            domain={[0, 'dataMax + 2']}
            label={{ 
              value: 'Novos / Churn (Parceiros)', 
              angle: 90, 
              position: 'insideRight', 
              style: { fontSize: 15, fontWeight: 800, fill: '#64748b' } 
            }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '30px', 
              fontSize: '14px', 
              fontWeight: 700 
            }}
            iconType="line"
            iconSize={20}
          />
          
          {/* Linha de referência baseline */}
          <ReferenceLine 
            yAxisId="left" 
            y={40} 
            stroke="#94a3b8" 
            strokeDasharray="5 5"
            label={{ 
              value: 'Baseline 2025', 
              position: 'insideTopRight',
              fill: '#64748b',
              fontSize: 12,
              fontWeight: 600
            }}
          />
          
          {/* Área de fundo da carteira */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="Carteira Ativa"
            fill="url(#colorCarteira)"
            stroke="none"
          />
          
          {/* Linha principal da carteira */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="Carteira Ativa"
            stroke="#1e40af"
            strokeWidth={5}
            dot={{ 
              fill: '#1e40af', 
              r: 7, 
              strokeWidth: 3, 
              stroke: '#ffffff' 
            }}
            activeDot={{ 
              r: 10, 
              strokeWidth: 4,
              stroke: '#ffffff'
            }}
          />
          
          {/* Barras de novos parceiros */}
          <Bar
            yAxisId="right"
            dataKey="Novos Parceiros"
            fill="#059669"
            opacity={0.85}
            radius={[8, 8, 0, 0]}
          />
          
          {/* Barras de churn */}
          <Bar
            yAxisId="right"
            dataKey="Churn"
            fill="#dc2626"
            opacity={0.85}
            radius={[8, 8, 0, 0]}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
          <span className="text-slate-600">Carteira cresce de <span className="font-bold">40</span> para <span className="font-bold text-blue-700">100 parceiros</span></span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-600 rounded"></div>
          <span className="text-slate-600">Entrada de novos parceiros</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-600 rounded"></div>
          <span className="text-slate-600">Saída (churn)</span>
        </div>
      </div>
    </div>
  );
}
