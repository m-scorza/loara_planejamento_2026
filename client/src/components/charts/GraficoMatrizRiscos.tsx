import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis, Label, ReferenceLine } from 'recharts';

export function GraficoMatrizRiscos() {
  const riscos = [
    { id: 'R1', nome: 'Churn Elevado', prob: 40, imp: 80, z: 100 },
    { id: 'R2', nome: 'Qualidade Dados', prob: 60, imp: 50, z: 100 },
    { id: 'R3', nome: 'Aquisição Abaixo', prob: 35, imp: 60, z: 100 },
    { id: 'R4', nome: 'Capacidade Operacional', prob: 40, imp: 80, z: 100 },
    { id: 'R5', nome: 'Mudanças Regulatórias', prob: 15, imp: 90, z: 100 },
    { id: 'R6', nome: 'Concorrência', prob: 45, imp: 50, z: 100 },
    { id: 'R7', nome: 'Dependência Parceiros-Chave', prob: 50, imp: 80, z: 100 },
    { id: 'R8', nome: 'Rotatividade Equipe', prob: 20, imp: 90, z: 100 },
  ];

  const getCorRisco = (prob: number, imp: number) => {
    const score = prob * imp;
    if (score >= 4000) return '#dc2626'; // Alto - Vermelho
    if (score >= 2000) return '#d97706'; // Médio - Laranja
    return '#059669'; // Baixo - Verde
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const score = data.prob * data.imp;
      const nivel = score >= 4000 ? 'ALTO' : score >= 2000 ? 'MÉDIO' : 'BAIXO';
      const corNivel = score >= 4000 ? 'text-red-600' : score >= 2000 ? 'text-orange-600' : 'text-green-600';
      
      return (
        <div className="bg-white p-4 border-2 border-slate-300 rounded-xl shadow-2xl max-w-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-800">{data.id}</span>
            <span className={`font-bold text-sm px-2 py-1 rounded ${corNivel} bg-opacity-10`}>
              {nivel}
            </span>
          </div>
          <p className="font-semibold text-slate-700 mb-3">{data.nome}</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Probabilidade:</span>
              <span className="font-bold">{data.prob}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Impacto:</span>
              <span className="font-bold">{data.imp}/100</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-slate-600">Score:</span>
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = (props: any) => {
    const { cx, cy, payload } = props;
    return (
      <text
        x={cx}
        y={cy}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={12}
        fontWeight={900}
      >
        {payload.id}
      </text>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-800">Matriz de Riscos - Planejamento 2026</h3>
        <p className="text-sm text-slate-600">Análise de probabilidade vs impacto dos principais riscos</p>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          {/* Zonas de fundo */}
          <defs>
            <pattern id="baixo" patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill="#059669" opacity="0.15"/>
            </pattern>
            <pattern id="medio" patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill="#d97706" opacity="0.15"/>
            </pattern>
            <pattern id="alto" patternUnits="userSpaceOnUse" width="10" height="10">
              <rect width="10" height="10" fill="#dc2626" opacity="0.15"/>
            </pattern>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
          
          <XAxis 
            type="number" 
            dataKey="prob" 
            name="Probabilidade"
            domain={[0, 100]}
            stroke="#64748b"
            strokeWidth={2}
            tick={{ fontSize: 13, fontWeight: 700, fill: '#475569' }}
          >
            <Label 
              value="Probabilidade (%)" 
              position="insideBottom" 
              offset={-15}
              style={{ fontSize: 15, fontWeight: 800, fill: '#475569' }}
            />
          </XAxis>
          
          <YAxis 
            type="number" 
            dataKey="imp" 
            name="Impacto"
            domain={[0, 100]}
            stroke="#64748b"
            strokeWidth={2}
            tick={{ fontSize: 13, fontWeight: 700, fill: '#475569' }}
          >
            <Label 
              value="Impacto (1-100)" 
              angle={-90} 
              position="insideLeft"
              style={{ fontSize: 15, fontWeight: 800, fill: '#475569' }}
            />
          </YAxis>
          
          <ZAxis type="number" dataKey="z" range={[1200, 1200]} />
          
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          
          {/* Linhas de referência para zonas */}
          <ReferenceLine x={40} stroke="#64748b" strokeDasharray="5 5" />
          <ReferenceLine x={60} stroke="#64748b" strokeDasharray="5 5" />
          <ReferenceLine y={40} stroke="#64748b" strokeDasharray="5 5" />
          <ReferenceLine y={60} stroke="#64748b" strokeDasharray="5 5" />
          
          <Scatter 
            data={riscos} 
            fill="#1e40af"
            shape="circle"
            label={renderCustomLabel}
          >
            {riscos.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getCorRisco(entry.prob, entry.imp)}
                stroke="white"
                strokeWidth={3}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
      
      <div className="mt-6 space-y-3">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-green-50 p-3 rounded border-2 border-green-300">
            <p className="font-bold text-green-700 mb-1">🟢 RISCO BAIXO</p>
            <p className="text-xs text-green-600">Score &lt; 2000</p>
          </div>
          <div className="bg-orange-50 p-3 rounded border-2 border-orange-300">
            <p className="font-bold text-orange-700 mb-1">🟠 RISCO MÉDIO</p>
            <p className="text-xs text-orange-600">Score 2000-4000</p>
          </div>
          <div className="bg-red-50 p-3 rounded border-2 border-red-300">
            <p className="font-bold text-red-700 mb-1">🔴 RISCO ALTO</p>
            <p className="text-xs text-red-600">Score &gt; 4000</p>
          </div>
        </div>
        
        <div className="bg-slate-50 p-3 rounded border border-slate-200">
          <p className="text-xs text-slate-600">
            <strong>Legenda:</strong> R1: Churn Elevado | R2: Qualidade Dados | R3: Aquisição Abaixo | R4: Capacidade Operacional | 
            R5: Mudanças Regulatórias | R6: Concorrência | R7: Dependência Parceiros-Chave | R8: Rotatividade Equipe
          </p>
        </div>
      </div>
    </div>
  );
}
