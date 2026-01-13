import { useEffect, useState } from "react";
import ExecutiveLayout from "@/components/ExecutiveLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Scenario {
  name: string;
  description: string;
  risk_level: string;
  metrics: {
    carteira_inicial: number;
    carteira_final: number;
    novos_parceiros: number;
    churn_esperado: number;
    indicacoes: number;
    negocios_criados: number;
    contratos_assinados: number;
    operacoes_credito: number;
    captacao_projetada: number;
    receita_projetada: number;
    crescimento_receita: number;
  };
}

interface PlanningData {
  scenarios: {
    conservador: Scenario;
    moderado: Scenario;
    agressivo: Scenario;
  };
}

export default function Scenarios() {
  const [data, setData] = useState<PlanningData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) {
    return (
      <ExecutiveLayout currentPage="scenarios">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Carregando dados...</p>
        </div>
      </ExecutiveLayout>
    );
  }

  const scenarios = [
    {
      key: "conservador",
      data: data.scenarios.conservador,
      color: "blue",
      recommended: false,
    },
    {
      key: "moderado",
      data: data.scenarios.moderado,
      color: "green",
      recommended: true,
    },
    {
      key: "agressivo",
      data: data.scenarios.agressivo,
      color: "orange",
      recommended: false,
    },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "baixo":
        return "bg-green-100 text-green-700";
      case "médio":
        return "bg-yellow-100 text-yellow-700";
      case "alto":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <ExecutiveLayout currentPage="scenarios">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Três Cenários de Crescimento 2026
        </h2>
        <p className="text-slate-600">
          Análise comparativa de três estratégias com diferentes níveis de risco
          e potencial de retorno
        </p>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {scenarios.map((scenario) => (
          <Card
            key={scenario.key}
            className={`p-6 border-2 transition-all ${
              scenario.recommended
                ? "border-green-500 bg-green-50 shadow-lg"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {scenario.data.name}
                </h3>
                {scenario.recommended && (
                  <Badge className="mt-2 bg-green-600 text-white">
                    ✓ Recomendado
                  </Badge>
                )}
              </div>
              <Badge className={getRiskColor(scenario.data.risk_level)}>
                {scenario.data.risk_level}
              </Badge>
            </div>

            <p className="text-sm text-slate-600 mb-6">
              {scenario.data.description}
            </p>

            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Carteira Final</p>
                <p className="text-2xl font-bold text-slate-900">
                  {scenario.data.metrics.carteira_final}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  +{scenario.data.metrics.novos_parceiros} novos parceiros
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Receita Projetada</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(scenario.data.metrics.receita_projetada)}
                </p>
                <p className="text-sm font-semibold text-green-600 mt-1">
                  +{scenario.data.metrics.crescimento_receita.toFixed(0)}%
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-xs text-slate-500 mb-1">Captação</p>
                <p className="text-lg font-bold text-slate-900">
                  {formatCurrency(scenario.data.metrics.captacao_projetada)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Comparison Table */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Comparação Detalhada de Métricas
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-900">
                  Métrica
                </th>
                {scenarios.map((scenario) => (
                  <th
                    key={scenario.key}
                    className="text-center px-4 py-3 font-semibold text-slate-900"
                  >
                    {scenario.data.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Carteira Final",
                  key: "carteira_final",
                  format: "number",
                },
                { label: "Novos Parceiros", key: "novos_parceiros", format: "number" },
                { label: "Churn Esperado", key: "churn_esperado", format: "number" },
                { label: "Indicações", key: "indicacoes", format: "number" },
                { label: "Negócios Criados", key: "negocios_criados", format: "number" },
                {
                  label: "Contratos Assinados",
                  key: "contratos_assinados",
                  format: "number",
                },
                {
                  label: "Operações de Crédito",
                  key: "operacoes_credito",
                  format: "number",
                },
                {
                  label: "Captação Projetada",
                  key: "captacao_projetada",
                  format: "currency",
                },
                {
                  label: "Receita Projetada",
                  key: "receita_projetada",
                  format: "currency",
                },
                {
                  label: "Crescimento Receita",
                  key: "crescimento_receita",
                  format: "percent",
                },
              ].map((metric, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {metric.label}
                  </td>
                  {scenarios.map((scenario) => {
                    const value = (scenario.data.metrics as any)[metric.key];
                    let displayValue = value;

                    if (metric.format === "currency") {
                      displayValue = formatCurrency(value);
                    } else if (metric.format === "percent") {
                      displayValue = `+${value.toFixed(0)}%`;
                    }

                    return (
                      <td
                        key={scenario.key}
                        className="text-center px-4 py-3 text-slate-900 font-medium"
                      >
                        {displayValue}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Cenário Conservador",
            pros: [
              "Risco operacional baixo",
              "Investimento mínimo necessário",
              "Fácil absorção operacional",
            ],
            cons: [
              "Crescimento modesto (31%)",
              "Menor impacto no mercado",
              "Pode perder oportunidades",
            ],
          },
          {
            title: "Cenário Moderado",
            pros: [
              "Crescimento significativo (148%)",
              "Equilíbrio qualidade/volume",
              "Realista e alcançável",
              "Margem de segurança adequada",
            ],
            cons: [
              "Requer investimento moderado",
              "Demanda operacional média",
            ],
            recommended: true,
          },
          {
            title: "Cenário Agressivo",
            pros: [
              "Crescimento exponencial (414%)",
              "Maior market share",
              "Potencial de liderança",
            ],
            cons: [
              "Risco operacional alto",
              "Investimento significativo",
              "Pode comprometer qualidade",
              "Churn pode ser elevado",
            ],
          },
        ].map((analysis, idx) => (
          <Card
            key={idx}
            className={`p-6 ${
              analysis.recommended ? "border-2 border-green-500 bg-green-50" : ""
            }`}
          >
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              {analysis.title}
            </h4>
            <div className="mb-4">
              <p className="text-sm font-semibold text-green-700 mb-2">Vantagens</p>
              <ul className="space-y-1">
                {analysis.pros.map((pro, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-green-600">✓</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-red-700 mb-2">Desafios</p>
              <ul className="space-y-1">
                {analysis.cons.map((con, i) => (
                  <li key={i} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-red-600">✗</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>
    </ExecutiveLayout>
  );
}
