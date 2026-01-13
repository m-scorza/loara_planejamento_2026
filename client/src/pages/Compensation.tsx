import { useEffect, useState } from "react";
import ExecutiveLayout from "@/components/ExecutiveLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Gerente {
  id: string;
  name: string;
  role: string;
  carteira_2025: number;
  carteira_2026_moderado: number;
  proporcao: number;
  compensacao: {
    salario_base_mensal: number;
    comissao_aquisicao: {
      parceiro_qualificado: number;
      primeiro_contrato: number;
      primeiro_credito: number;
      total_por_parceiro: number;
    };
    comissao_recorrente: {
      ouro: number;
      prata: number;
      bronze: number;
    };
    bonus_trimestral: {
      abaixo_80: number;
      "80_90": number;
      "90_100": number;
      "100_110": number;
      acima_110: number;
    };
  };
  metas_2026: {
    novos_parceiros: number;
    parceiros_retidos: number;
    indicacoes: number;
    negocios_criados: number;
    contratos_assinados: number;
    operacoes_credito: number;
    receita_corporativa: number;
  };
  projecao_renda_anual: {
    salario_base: number;
    comissao_recorrente: number;
    comissao_aquisicao: number;
    bonus: number;
    total: number;
  };
}

interface PlanningData {
  gerentes: Gerente[];
}

export default function Compensation() {
  const [data, setData] = useState<PlanningData | null>(null);
  const [selectedGerente, setSelectedGerente] = useState<string>("matheus_scorza");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) {
    return (
      <ExecutiveLayout currentPage="compensation">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500">Carregando dados...</p>
        </div>
      </ExecutiveLayout>
    );
  }

  const gerente = data.gerentes.find((g) => g.id === selectedGerente);
  if (!gerente) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ExecutiveLayout currentPage="compensation">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">
          Estrutura de Compensação Individual 2026
        </h2>
        <p className="text-slate-600">
          Modelo híbrido com salário base, comissões e bônus de desempenho
        </p>
      </div>

      {/* Gerente Selector */}
      <div className="mb-8 flex gap-4">
        {data.gerentes.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGerente(g.id)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedGerente === g.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Gerente Overview */}
      <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-blue-600 font-medium mb-2">Posição</p>
            <p className="text-2xl font-bold text-blue-900">{gerente.role}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium mb-2">Carteira</p>
            <p className="text-2xl font-bold text-blue-900">
              {gerente.carteira_2025} → {gerente.carteira_2026_moderado}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              +{((gerente.carteira_2026_moderado / gerente.carteira_2025 - 1) * 100).toFixed(0)}%
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 font-medium mb-2">Proporção</p>
            <p className="text-2xl font-bold text-blue-900">
              {(gerente.proporcao * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-blue-600 mt-1">da carteira total</p>
          </div>
        </div>
      </Card>

      {/* Compensation Structure */}
      <Tabs defaultValue="structure" className="mb-12">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="structure">Estrutura</TabsTrigger>
          <TabsTrigger value="metas">Metas 2026</TabsTrigger>
          <TabsTrigger value="projecao">Projeção de Renda</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-6">
          {/* Salário Base */}
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              1. Salário Base Mensal
            </h3>
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <p className="text-sm text-blue-600 mb-2">Valor Mensal</p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(gerente.compensacao.salario_base_mensal)}
              </p>
              <p className="text-sm text-blue-600 mt-3">
                Anual: {formatCurrency(gerente.compensacao.salario_base_mensal * 12)}
              </p>
            </div>
          </Card>

          {/* Comissão por Aquisição */}
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              2. Comissão por Aquisição (Novos Parceiros 2026)
            </h3>
            <div className="space-y-3">
              {[
                {
                  label: "Parceiro Qualificado e Ativo",
                  value: gerente.compensacao.comissao_aquisicao.parceiro_qualificado,
                  desc: "Após 30 dias de atividade",
                },
                {
                  label: "Primeiro Contrato Assinado",
                  value: gerente.compensacao.comissao_aquisicao.primeiro_contrato,
                  desc: "Parceiro gera primeiro negócio",
                },
                {
                  label: "Primeiro Crédito Liberado",
                  value: gerente.compensacao.comissao_aquisicao.primeiro_credito,
                  desc: "Primeira operação de crédito",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-start p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(item.value)}
                  </p>
                </div>
              ))}
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 font-semibold">
                  Total por Parceiro Produtivo: {formatCurrency(
                    gerente.compensacao.comissao_aquisicao.total_por_parceiro
                  )}
                </p>
              </div>
            </div>
          </Card>

          {/* Comissão Recorrente */}
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              3. Comissão Recorrente Mensal (Todos os Parceiros Ativos)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Ouro",
                  value: gerente.compensacao.comissao_recorrente.ouro,
                  desc: "Volume &gt; R$ 1M/mês",
                  color: "yellow",
                },
                {
                  label: "Prata",
                  value: gerente.compensacao.comissao_recorrente.prata,
                  desc: "Volume R$ 500K-1M/mês",
                  color: "slate",
                },
                {
                  label: "Bronze",
                  value: gerente.compensacao.comissao_recorrente.bronze,
                  desc: "Volume &lt; R$ 500K/mês",
                  color: "orange",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border-2 ${
                    item.color === "yellow"
                      ? "bg-yellow-50 border-yellow-200"
                      : item.color === "slate"
                      ? "bg-slate-50 border-slate-200"
                      : "bg-orange-50 border-orange-200"
                  }`}
                >
                  <p className="font-semibold text-slate-900">{item.label}</p>
                  <p className="text-2xl font-bold text-slate-900 my-2">
                    {formatCurrency(item.value)}
                  </p>
                  <p className="text-xs text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Comissão recorrente mensal enquanto parceiro permanecer ativo
            </p>
          </Card>

          {/* Bônus Trimestral */}
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              4. Bônus de Desempenho Trimestral
            </h3>
            <div className="space-y-3">
              {[
                { range: "Abaixo de 80%", bonus: 0, color: "red" },
                { range: "80-90% da meta", bonus: 1500, color: "orange" },
                { range: "90-100% da meta", bonus: 2500, color: "yellow" },
                { range: "100-110% da meta", bonus: 4000, color: "green" },
                { range: "Acima de 110%", bonus: 5000, color: "blue" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center p-4 rounded-lg border-2 ${
                    item.color === "red"
                      ? "bg-red-50 border-red-200"
                      : item.color === "orange"
                      ? "bg-orange-50 border-orange-200"
                      : item.color === "yellow"
                      ? "bg-yellow-50 border-yellow-200"
                      : item.color === "green"
                      ? "bg-green-50 border-green-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <p className="font-medium text-slate-900">{item.range}</p>
                  <p className="text-lg font-bold text-slate-900">
                    {formatCurrency(item.bonus)}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 mt-4">
              Baseado na média de atingimento de 4 métricas: indicações, contratos, operações e novos parceiros
            </p>
          </Card>
        </TabsContent>

        <TabsContent value="metas" className="space-y-6">
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Metas Individuais 2026 - {gerente.name}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  label: "Novos Parceiros",
                  value: gerente.metas_2026.novos_parceiros,
                  icon: "👥",
                },
                {
                  label: "Parceiros Retidos",
                  value: gerente.metas_2026.parceiros_retidos,
                  icon: "✓",
                },
                {
                  label: "Indicações",
                  value: gerente.metas_2026.indicacoes,
                  icon: "📊",
                },
                {
                  label: "Negócios Criados",
                  value: gerente.metas_2026.negocios_criados,
                  icon: "💼",
                },
                {
                  label: "Contratos Assinados",
                  value: gerente.metas_2026.contratos_assinados,
                  icon: "📝",
                },
                {
                  label: "Operações de Crédito",
                  value: gerente.metas_2026.operacoes_credito,
                  icon: "💰",
                },
              ].map((meta, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-sm text-slate-600 mb-2">{meta.label}</p>
                  <p className="text-3xl font-bold text-slate-900">{meta.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 font-medium mb-2">
                Receita Corporativa Esperada
              </p>
              <p className="text-3xl font-bold text-blue-900">
                {formatCurrency(gerente.metas_2026.receita_corporativa)}
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="projecao" className="space-y-6">
          <Card className="p-8 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <h3 className="text-lg font-bold text-green-900 mb-6">
              Projeção de Renda Anual - {gerente.name}
            </h3>
            <div className="space-y-4">
              {[
                {
                  label: "Salário Base",
                  value: gerente.projecao_renda_anual.salario_base,
                },
                {
                  label: "Comissão Recorrente",
                  value: gerente.projecao_renda_anual.comissao_recorrente,
                },
                {
                  label: "Comissão Aquisição",
                  value: gerente.projecao_renda_anual.comissao_aquisicao,
                },
                {
                  label: "Bônus (4 trimestres)",
                  value: gerente.projecao_renda_anual.bonus,
                },
              ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-lg">
                  <p className="font-medium text-slate-900">{item.label}</p>
                  <p className="text-lg font-bold text-green-700">
                    {formatCurrency(item.value)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t-2 border-green-300 flex justify-between items-center">
              <p className="text-lg font-bold text-green-900">TOTAL ANUAL</p>
              <p className="text-3xl font-bold text-green-900">
                {formatCurrency(gerente.projecao_renda_anual.total)}
              </p>
            </div>
          </Card>

          {/* Comparativo */}
          <Card className="p-6 border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Comparativo: Modelo Atual vs Proposto
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="text-left px-4 py-3 font-semibold">Componente</th>
                    <th className="text-center px-4 py-3 font-semibold">Atual</th>
                    <th className="text-center px-4 py-3 font-semibold">Proposto</th>
                    <th className="text-center px-4 py-3 font-semibold">Variação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="px-4 py-3 font-medium">Renda Anual</td>
                    <td className="text-center px-4 py-3">
                      {gerente.id === "matheus_scorza"
                        ? formatCurrency(90000)
                        : formatCurrency(10000)}
                    </td>
                    <td className="text-center px-4 py-3 font-bold text-green-600">
                      {formatCurrency(gerente.projecao_renda_anual.total)}
                    </td>
                    <td className="text-center px-4 py-3 font-bold text-green-600">
                      +{(
                        ((gerente.projecao_renda_anual.total -
                          (gerente.id === "matheus_scorza" ? 90000 : 10000)) /
                          (gerente.id === "matheus_scorza" ? 90000 : 10000)) *
                        100
                      ).toFixed(0)}
                      %
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Key Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-green-200 bg-green-50">
          <h4 className="text-lg font-bold text-green-900 mb-4">Benefícios do Modelo</h4>
          <ul className="space-y-2">
            {[
              "Segurança com salário base",
              "Crescimento de renda significativo",
              "Incentivos alinhados com qualidade",
              "Retenção de parceiros recompensada",
              "Produtividade incentivada",
              "Equidade entre gerentes",
            ].map((benefit, idx) => (
              <li key={idx} className="flex gap-2 text-green-800">
                <span className="text-green-600">✓</span> {benefit}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 border-blue-200 bg-blue-50">
          <h4 className="text-lg font-bold text-blue-900 mb-4">Alinhamento Estratégico</h4>
          <ul className="space-y-2">
            {[
              "Foco em qualidade, não apenas volume",
              "Retenção de parceiros valorizada",
              "Receita recorrente incentivada",
              "Relacionamento de longo prazo",
              "Risco de churn reduzido",
              "Sustentabilidade do negócio",
            ].map((item, idx) => (
              <li key={idx} className="flex gap-2 text-blue-800">
                <span className="text-blue-600">✓</span> {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </ExecutiveLayout>
  );
}
