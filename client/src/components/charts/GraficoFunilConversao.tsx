import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

export function GraficoFunilConversao() {
  const data = [
    {
      etapa: 'Indicações\nÚnicas',
      '2025': 243,
      '2026 (Meta)': 870,
      conversao: null,
    },
    {
      etapa: 'Negócios\nCriados',
      '2025': 210,
      '2026 (Meta)': 520,
      conversao: '59.8%',
    },
    {
      etapa: 'Contratos\nAssinados',
      '2025': 65,
      '2026 (Meta)': 168,
      conversao: '32.3%',
    },
    {
      etapa: 'Operações\nde Crédito',
      '2025': 45,
      '2026 (Meta)': 123,
      conversao: '73.2%',
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const item = data.find(d => d.etapa === label);
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
            {item?.conversao && (
              <div className="mt-2 pt-2 border-t">
                <span className="text-xs font-bold text-green-600">
                  Taxa de Conversão: {item.conversao}
                </span>
              </div>
            )}
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
        x={x + width + 8}
        y={y + height / 2}
        fill="#1e293b"
        textAnchor="start"
        dominantBaseline="middle"
        fontSize={13}
        fontWeight={700}
      >
        {value}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Funil de Conversão: 2025 vs 2026</h3>
        <p className="text-sm text-slate-600">Evolução das etapas do processo comercial</p>
      </div>
      
      <ResponsiveContainer width="100%" height={450}>
        <BarChart 
          data={data} 
          layout="vertical"
          margin={{ top: 20, right: 80, left: 20, bottom: 20 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" opacity={0.6} />
          
          <XAxis 
            type="number"
            stroke="#64748b"
            strokeWidth={2}
            tick={{ fontSize: 13, fontWeight: 700, fill: '#475569' }}
            label={{ 
              value: 'Quantidade', 
              position: 'insideBottom', 
              offset: -10,
              style: { fontSize: 14, fontWeight: 800, fill: '#475569' } 
            }}
          />
          
          <YAxis 
            type="category"
            dataKey="etapa"
            stroke="#64748b"
            strokeWidth={2}
            tick={{ fontSize: 13, fontWeight: 700, fill: '#475569' }}
            width={120}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            wrapperStyle={{ 
              paddingTop: '20px', 
              fontSize: '14px', 
              fontWeight: 700 
            }}
            iconType="rect"
            iconSize={18}
          />
          
          <Bar 
            dataKey="2025" 
            fill="#6b7280" 
            radius={[0, 8, 8, 0]}
            opacity={0.85}
          >
            <LabelList content={renderCustomLabel} />
          </Bar>
          
          <Bar 
            dataKey="2026 (Meta)" 
            fill="#1e40af" 
            radius={[0, 8, 8, 0]}
            opacity={0.95}
          >
            <LabelList content={renderCustomLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div className="bg-green-50 p-3 rounded border border-green-200">
          <p className="font-bold text-green-700">Indicações → Negócios</p>
          <p className="text-green-600">59.8% de conversão</p>
        </div>
        <div className="bg-blue-50 p-3 rounded border border-blue-200">
          <p className="font-bold text-blue-700">Negócios → Contratos</p>
          <p className="text-blue-600">32.3% de conversão</p>
        </div>
        <div className="bg-purple-50 p-3 rounded border border-purple-200">
          <p className="font-bold text-purple-700">Contratos → Operações</p>
          <p className="text-purple-600">73.2% de conversão</p>
        </div>
      </div>
    </div>
  );
}
