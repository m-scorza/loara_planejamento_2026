import { useEffect, useState } from "react";
import ExecutiveLayout from "@/components/ExecutiveLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Challenge {
  id: string;
  title: string;
  description: string;
  impact: string;
  solutions: string[];
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  timeline: string;
}

interface RoadmapItem {
  quarter: string;
  period: string;
  focus: string;
  activities: string[];
}

interface Risk {
  id: string;
  title: string;
  probability: string;
  impact: string;
  mitigation: string;
}

interface PlanningData {
  challenges_2025: Challenge[];
  opportunities_2026: Opportunity[];
  roadmap: RoadmapItem[];
  risks: Risk[];
}

export default function DataDrill() {
  const [data, setData] = useState<PlanningData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) {
    return (
      <ExecutiveLayout currentPage="data">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Carregando dados...</p>
        </div>
      </ExecutiveLayout>
    );
  }

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "alto":
        return "bg-red-100 text-red-700";
      case "médio":
        return "bg-yellow-100 text-yellow-700";
      case "baixo":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getProbabilityColor = (prob: string) => {
    switch (prob.toLowerCase()) {
      case "alta":
        return "bg-red-100 text-red-700";
      case "média":
        return "bg-yellow-100 text-yellow-700";
      case "baixa":
        return "bg-green-100 text-green-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <ExecutiveLayout currentPage="data">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Análise Detalhada de Dados
        </h2>
        <p className="text-slate-600">
          Desafios, oportunidades, roadmap de implementação e análise de riscos
        </p>
      </div>

      <Tabs defaultValue="challenges" className="mb-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges">Desafios 2025</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="risks">Riscos</TabsTrigger>
        </TabsList>

        {/* Desafios */}
        <TabsContent value="challenges" className="space-y-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Desafios Identificados em 2025
            </h3>
            <p className="text-slate-600 mb-6">
              Cinco desafios estruturais que precisam ser endereçados em 2026 para
              viabilizar o crescimento
            </p>
          </div>

          {data.challenges_2025.map((challenge) => (
            <Card key={challenge.id} className="p-6 border-slate-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-bold text-slate-900">
                    {challenge.title}
                  </h4>
                  <p className="text-slate-600 mt-2">{challenge.description}</p>
                </div>
                <Badge className={getImpactColor(challenge.impact)}>
                  Impacto: {challenge.impact}
                </Badge>
              </div>

              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-900 mb-3">
                  Soluções Recomendadas:
                </p>
                <ul className="space-y-2">
                  {challenge.solutions.map((solution, idx) => (
                    <li key={idx} className="flex gap-2 text-slate-700">
                      <span className="text-blue-600">→</span> {solution}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </TabsContent>

        {/* Oportunidades */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Oportunidades para 2026
            </h3>
            <p className="text-slate-600 mb-6">
              Seis iniciativas estratégicas para impulsionar o crescimento e
              consolidar a liderança no segmento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.opportunities_2026.map((opportunity) => (
              <Card key={opportunity.id} className="p-6 border-green-200 bg-green-50">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-bold text-green-900">
                    {opportunity.title}
                  </h4>
                  <Badge className="bg-green-600 text-white">
                    {opportunity.timeline}
                  </Badge>
                </div>
                <p className="text-green-800">{opportunity.description}</p>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Roadmap */}
        <TabsContent value="roadmap" className="space-y-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Roadmap de Implementação 2026
            </h3>
            <p className="text-slate-600 mb-6">
              Plano trimestral com foco e atividades principais para cada período
            </p>
          </div>

          <div className="space-y-4">
            {data.roadmap.map((item, idx) => (
              <Card key={idx} className="p-6 border-slate-200">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-600 text-white font-bold text-lg">
                      {item.quarter}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-slate-600 font-medium">
                          {item.period}
                        </p>
                        <h4 className="text-lg font-bold text-slate-900">
                          {item.focus}
                        </h4>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {item.activities.map((activity, i) => (
                        <li key={i} className="flex gap-2 text-slate-700">
                          <span className="text-blue-600">✓</span> {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Riscos */}
        <TabsContent value="risks" className="space-y-4">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">
              Análise de Riscos
            </h3>
            <p className="text-slate-600 mb-6">
              Seis riscos identificados com estratégias de mitigação
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-300 bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">
                    Risco
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-900">
                    Probabilidade
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-900">
                    Impacto
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-900">
                    Mitigação
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.risks.map((risk, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-900">{risk.title}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge className={getProbabilityColor(risk.probability)}>
                        {risk.probability}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Badge className={getImpactColor(risk.impact)}>
                        {risk.impact}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-700">{risk.mitigation}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Risk Matrix */}
          <Card className="p-6 border-slate-200 mt-8">
            <h4 className="text-lg font-bold text-slate-900 mb-4">
              Matriz de Risco
            </h4>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 mb-3">
                Riscos de maior preocupação (Probabilidade × Impacto):
              </p>
              <ul className="space-y-2">
                {[
                  "Churn elevado de novos parceiros (Média × Alto)",
                  "Capacidade operacional insuficiente (Média × Alto)",
                  "Qualidade de dados inadequada (Alta × Médio)",
                ].map((risk, idx) => (
                  <li key={idx} className="flex gap-2 text-slate-700">
                    <span className="text-red-600">⚠</span> {risk}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Métricas de Validação */}
      <Card className="p-8 bg-blue-50 border-blue-200">
        <h3 className="text-xl font-bold text-blue-900 mb-6">
          Validação de Métricas Técnicas
        </h3>
        <div className="space-y-4">
          {[
            {
              title: "Churn Anual",
              value: "21,57%",
              note: "Não usar 'taxa mensal' - é matematicamente inválida",
            },
            {
              title: "Carteira Baseline",
              value: "51 parceiros",
              note: "40 ativos + 11 distratos (denominador correto)",
            },
            {
              title: "Indicações",
              value: "156 únicas",
              note: "Usar indicações únicas para evitar dupla contagem",
            },
            {
              title: "Conversão Negócio",
              value: "42%",
              note: "Contratos/Negócios - validado como realista",
            },
            {
              title: "Conversão Crédito",
              value: "73%",
              note: "Operações/Contratos - validado como realista",
            },
            {
              title: "Margem 2026",
              value: "5,1%",
              note: "Melhoria modesta de 0,21pp vs 2025",
            },
          ].map((metric, idx) => (
            <div key={idx} className="flex justify-between items-start p-4 bg-white rounded-lg border border-blue-200">
              <div>
                <p className="font-semibold text-blue-900">{metric.title}</p>
                <p className="text-xs text-blue-600 mt-1">{metric.note}</p>
              </div>
              <p className="text-lg font-bold text-blue-900">{metric.value}</p>
            </div>
          ))}
        </div>
      </Card>
    </ExecutiveLayout>
  );
}
