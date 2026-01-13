import { useEffect, useState } from "react";
import ExecutiveLayout from "@/components/ExecutiveLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, DollarSign, Target } from "lucide-react";

interface PlanningData {
  executive_summary: {
    vision: string;
    recommended_scenario: string;
    key_metrics_2025: {
      carteira_ativa: number;
      churn_anual: number;
      indicacoes_unicas: number;
      contratos_assinados: number;
      operacoes_credito: number;
      captacao_total: number;
      receita_gerada: number;
      margem: number;
    };
  };
  scenarios: {
    moderado: {
      name: string;
      description: string;
      metrics: {
        carteira_final: number;
        novos_parceiros: number;
        contratos_assinados: number;
        operacoes_credito: number;
        captacao_projetada: number;
        receita_projetada: number;
        crescimento_receita: number;
      };
    };
  };
}

export default function Executive() {
  const [data, setData] = useState<PlanningData | null>(null);

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) {
    return (
      <ExecutiveLayout currentPage="executive">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Carregando dados...</p>
        </div>
      </ExecutiveLayout>
    );
  }

  const metrics2025 = data.executive_summary.key_metrics_2025;
  const moderado = data.scenarios.moderado.metrics;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "percent",
      minimumFractionDigits: 1,
    }).format(value / 100);
  };

  return (
    <ExecutiveLayout currentPage="executive">
      {/* Vision Section */}
      <div className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Visão Estratégica 2026</h2>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">
            {data.executive_summary.vision}
          </p>
          <div className="mt-6 flex items-center gap-2">
            <Badge className="bg-blue-500 text-white">
              Cenário Recomendado: Moderado
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              Crescimento 148%
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics 2025 */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Baseline 2025 - Números Principais
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Carteira Ativa",
              value: metrics2025.carteira_ativa,
              icon: Users,
              unit: "parceiros",
            },
            {
              label: "Churn Anual",
              value: metrics2025.churn_anual,
              icon: TrendingUp,
              unit: "%",
            },
            {
              label: "Contratos Assinados",
              value: metrics2025.contratos_assinados,
              icon: Target,
              unit: "contratos",
            },
            {
              label: "Receita Gerada",
              value: metrics2025.receita_gerada,
              icon: DollarSign,
              unit: "R$",
              format: "currency",
            },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            const displayValue =
              metric.format === "currency"
                ? formatCurrency(metric.value as number)
                : metric.value;
            return (
              <Card key={idx} className="p-6 border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-blue-100 rounded-lg p-3">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-slate-600 text-sm font-medium mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {displayValue}
                </p>
                <p className="text-xs text-slate-500 mt-2">{metric.unit}</p>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Cenário Moderado Projeção */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Cenário Moderado 2026 - Projeção
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-8 border-slate-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-6">
              Crescimento de Carteira
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Carteira Final</p>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {moderado.carteira_final}
                    </p>
                    <p className="text-xs text-slate-500">parceiros</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">vs 40 em 2025</p>
                    <p className="text-lg font-bold text-green-600">+100%</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600 mb-2">
                  Novos Parceiros Adquiridos
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {moderado.novos_parceiros}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8 border-slate-200">
            <h4 className="text-lg font-semibold text-slate-900 mb-6">
              Receita Projetada
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-2">Receita 2026</p>
                <div className="flex items-end gap-4">
                  <div>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(moderado.receita_projetada)}
                    </p>
                    <p className="text-xs text-slate-500">anual</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600">
                      vs {formatCurrency(metrics2025.receita_gerada)}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      +{moderado.crescimento_receita.toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <p className="text-sm text-slate-600 mb-2">
                  Captação Projetada
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatCurrency(moderado.captacao_projetada)}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Operações Detalhadas */}
      <div className="mb-12">
        <h3 className="text-2xl font-bold text-slate-900 mb-6">
          Métricas Operacionais - Cenário Moderado
        </h3>
        <Card className="p-8 border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Indicações",
                value2025: metrics2025.indicacoes_unicas,
                value2026: 520,
              },
              {
                label: "Negócios Criados",
                value2025: 135,
                value2026: 310,
              },
              {
                label: "Contratos Assinados",
                value2025: metrics2025.contratos_assinados,
                value2026: moderado.contratos_assinados,
              },
              {
                label: "Operações de Crédito",
                value2025: metrics2025.operacoes_credito,
                value2026: moderado.operacoes_credito,
              },
            ].map((metric, idx) => {
              const growth = (
                ((metric.value2026 - metric.value2025) / metric.value2025) *
                100
              ).toFixed(0);
              return (
                <div key={idx} className="text-center">
                  <p className="text-sm text-slate-600 mb-3">{metric.label}</p>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-lg text-slate-500">
                      {metric.value2025}
                    </span>
                    <span className="text-slate-300">→</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {metric.value2026}
                    </span>
                  </div>
                  <Badge className="bg-green-100 text-green-700">
                    +{growth}%
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recomendação */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
        <h3 className="text-xl font-bold text-blue-900 mb-4">
          Recomendação Estratégica
        </h3>
        <p className="text-blue-800 leading-relaxed mb-4">
          O <strong>Cenário Moderado</strong> é recomendado como meta corporativa
          para 2026 porque oferece crescimento significativo (148% em receita) sem
          ser agressivo demais, permite absorção operacional adequada, e alinha com
          a capacidade de mercado. Este cenário requer investimento em estrutura
          operacional, mas é alcançável com as devidas implementações.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            { label: "Crescimento Receita", value: "+148%" },
            { label: "Carteira Final", value: "80 parceiros" },
            { label: "Investimento", value: "Moderado" },
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-600 font-medium mb-1">
                {item.label}
              </p>
              <p className="text-lg font-bold text-blue-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </ExecutiveLayout>
  );
}
