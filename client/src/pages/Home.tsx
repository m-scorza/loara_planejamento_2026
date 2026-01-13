import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, TrendingDown, Users, Target, DollarSign, 
  AlertTriangle, CheckCircle, Calendar, FileText, BarChart3,
  ArrowRight, ChevronRight, Building2, Briefcase, Shield
} from "lucide-react";

interface Data {
  metadata: any;
  sumario_executivo: any;
  cenarios: any;
  acompanhamento_mensal: any[];
  metas_mensais: any[];
  metas_trimestrais: any[];
  gerentes: any;
  roadmap: any[];
  challenges_2025: any[];
  opportunities_2026: any[];
  risks: any[];
  kpis: any[];
  processos: any;
  governanca: any;
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(2)}M`;
  }
  return `R$ ${(value / 1000).toFixed(0)}K`;
};

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [data, setData] = useState<Data | null>(null);
  const [activeTab, setActiveTab] = useState("sumario");

  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((d) => setData(d))
      .catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando planejamento...</p>
        </div>
      </div>
    );
  }

  const { sumario_executivo, cenarios, metas_mensais, metas_trimestrais, gerentes, roadmap, challenges_2025, opportunities_2026, risks, kpis, processos, governanca } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-8 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Cartilha de Planejamento Estratégico</h1>
              <p className="text-blue-200 mt-1">Área de Parcerias - LOARA 2026</p>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <Link href="/files">
                <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  📁 Gestão de Ficheiros
                </Button>
              </Link>
              <Badge variant="outline" className="bg-green-500/20 text-green-200 border-green-400 text-sm px-3 py-1">
                Cenário Recomendado: MODERADO
              </Badge>
              <p className="text-blue-200 text-sm">Versão 4.0 | 13/01/2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-11 gap-1 h-auto p-1 bg-white shadow-sm rounded-lg">
            <TabsTrigger value="sumario" className="text-xs px-2 py-2">Sumário</TabsTrigger>
            <TabsTrigger value="cenarios" className="text-xs px-2 py-2">Cenários</TabsTrigger>
            <TabsTrigger value="acompanhamento" className="text-xs px-2 py-2">Acompanhamento</TabsTrigger>
            <TabsTrigger value="metas" className="text-xs px-2 py-2">Metas</TabsTrigger>
            <TabsTrigger value="roadmap" className="text-xs px-2 py-2">Roadmap</TabsTrigger>
            <TabsTrigger value="compensacao" className="text-xs px-2 py-2">Compensação</TabsTrigger>
            <TabsTrigger value="processos" className="text-xs px-2 py-2">Processos</TabsTrigger>
            <TabsTrigger value="riscos" className="text-xs px-2 py-2">Riscos</TabsTrigger>
            <TabsTrigger value="kpis" className="text-xs px-2 py-2">KPIs</TabsTrigger>
            <TabsTrigger value="governanca" className="text-xs px-2 py-2">Governança</TabsTrigger>
            <TabsTrigger value="graficos" className="text-xs px-2 py-2">Gráficos</TabsTrigger>
          </TabsList>

          {/* SUMÁRIO EXECUTIVO */}
          <TabsContent value="sumario" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Objetivo */}
              <Card className="lg:col-span-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Objetivo Estratégico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-100 text-lg">{sumario_executivo.objetivo}</p>
                </CardContent>
              </Card>

              {/* Baseline 2025 */}
              <Card className="lg:col-span-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-slate-500" />
                    Baseline 2025
                  </CardTitle>
                  <CardDescription>Resultados realizados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-slate-600">Carteira Ativa</span>
                    <span className="font-bold text-lg">{sumario_executivo.baseline_2025.carteira_ativa}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-slate-600">Churn Anual</span>
                    <span className="font-bold text-lg text-red-600">{formatPercent(sumario_executivo.baseline_2025.churn_anual)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-slate-600">Indicações</span>
                    <span className="font-bold text-lg">{sumario_executivo.baseline_2025.indicacoes_unicas}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-slate-600">Contratos</span>
                    <span className="font-bold text-lg">{sumario_executivo.baseline_2025.contratos_assinados}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-slate-600">Captação</span>
                    <span className="font-bold text-lg">{formatCurrency(sumario_executivo.baseline_2025.captacao_total)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Receita</span>
                    <span className="font-bold text-lg text-green-600">{formatCurrency(sumario_executivo.baseline_2025.receita_gerada)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Meta 2026 */}
              <Card className="lg:col-span-1 border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Meta 2026 (Moderado)
                  </CardTitle>
                  <CardDescription>Projeção aprovada</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-slate-600">Carteira Ativa</span>
                    <span className="font-bold text-lg text-blue-700">{sumario_executivo.meta_2026.carteira_ativa}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-slate-600">Churn Anual</span>
                    <span className="font-bold text-lg text-green-600">{formatPercent(sumario_executivo.meta_2026.churn_anual)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-slate-600">Indicações</span>
                    <span className="font-bold text-lg text-blue-700">{sumario_executivo.meta_2026.indicacoes_unicas}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-slate-600">Contratos</span>
                    <span className="font-bold text-lg text-blue-700">{sumario_executivo.meta_2026.contratos_assinados}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-slate-600">Captação</span>
                    <span className="font-bold text-lg text-blue-700">{formatCurrency(sumario_executivo.meta_2026.captacao_total)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Receita</span>
                    <span className="font-bold text-lg text-green-600">{formatCurrency(sumario_executivo.meta_2026.receita_gerada)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Crescimento */}
              <Card className="lg:col-span-1 border-green-200 bg-green-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Crescimento Projetado
                  </CardTitle>
                  <CardDescription>Variação 2025 → 2026</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-slate-600">Carteira</span>
                    <Badge className="bg-green-100 text-green-700">+100%</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-slate-600">Churn</span>
                    <Badge className="bg-green-100 text-green-700">-30%</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-slate-600">Indicações</span>
                    <Badge className="bg-green-100 text-green-700">+233%</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-slate-600">Contratos</span>
                    <Badge className="bg-green-100 text-green-700">+177%</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-green-200">
                    <span className="text-slate-600">Captação</span>
                    <Badge className="bg-green-100 text-green-700">+148%</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Receita</span>
                    <Badge className="bg-green-600 text-white text-base">+158%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Desafios e Oportunidades */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Desafios Identificados em 2025
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {challenges_2025.map((challenge: any) => (
                    <div key={challenge.id} className="p-4 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-red-800">{challenge.title}</h4>
                        <Badge variant="outline" className="text-red-600 border-red-300">{challenge.impact}</Badge>
                      </div>
                      <p className="text-sm text-red-700 mb-2">{challenge.description}</p>
                      <p className="text-xs text-red-600 font-medium">{challenge.quantified_impact}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Oportunidades para 2026
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {opportunities_2026.map((opp: any) => (
                    <div key={opp.id} className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-green-800">{opp.title}</h4>
                        <Badge className="bg-green-100 text-green-700">{opp.timeline}</Badge>
                      </div>
                      <p className="text-sm text-green-700">{opp.potential_impact}</p>
                      <p className="text-xs text-green-600 mt-1">
                        Investimento: {typeof opp.investment === 'number' ? formatCurrency(opp.investment) : opp.investment}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CENÁRIOS */}
          <TabsContent value="cenarios" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.entries(cenarios).map(([key, scenario]: [string, any]) => (
                <Card 
                  key={key} 
                  className={`${key === 'moderado' ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                >
                  <CardHeader className={`${key === 'moderado' ? 'bg-blue-50' : key === 'conservador' ? 'bg-slate-50' : 'bg-amber-50'}`}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{scenario.nome}</CardTitle>
                      <Badge 
                        className={`${
                          scenario.risco === 'Baixo' ? 'bg-green-100 text-green-700' : 
                          scenario.risco === 'Médio' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'
                        }`}
                      >
                        Risco {scenario.risco}
                      </Badge>
                    </div>
                    <CardDescription className="mt-2">{scenario.descricao}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500">Carteira Final</p>
                        <p className="text-2xl font-bold text-slate-800">{scenario.carteira_final}</p>
                      </div>
                      <div className="text-center p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs text-slate-500">Novos Parceiros</p>
                        <p className="text-2xl font-bold text-slate-800">{scenario.novos_parceiros}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Taxa de Churn</span>
                        <span className="font-medium">{formatPercent(scenario.taxa_churn)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Indicações</span>
                        <span className="font-medium">{scenario.indicacoes}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Contratos</span>
                        <span className="font-medium">{scenario.contratos}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600">Operações</span>
                        <span className="font-medium">{scenario.operacoes}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Captação</span>
                        <span className="font-bold text-blue-700">{formatCurrency(scenario.captacao)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Receita</span>
                        <span className="font-bold text-green-600">{formatCurrency(scenario.receita)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Investimento</span>
                        <span className="font-medium">{formatCurrency(scenario.investimento)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Prob. Sucesso</span>
                        <span className="font-medium">{scenario.probabilidade_sucesso}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Tabela Comparativa */}
            <Card>
              <CardHeader>
                <CardTitle>Comparativo Detalhado dos Cenários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left p-3 font-semibold">Métrica</th>
                        <th className="text-center p-3 font-semibold">Conservador</th>
                        <th className="text-center p-3 font-semibold bg-blue-100">Moderado</th>
                        <th className="text-center p-3 font-semibold">Agressivo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Carteira Final</td>
                        <td className="p-3 text-center">{cenarios.conservador.carteira_final}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{cenarios.moderado.carteira_final}</td>
                        <td className="p-3 text-center">{cenarios.agressivo.carteira_final}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Novos Parceiros</td>
                        <td className="p-3 text-center">{cenarios.conservador.novos_parceiros}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{cenarios.moderado.novos_parceiros}</td>
                        <td className="p-3 text-center">{cenarios.agressivo.novos_parceiros}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Taxa de Churn</td>
                        <td className="p-3 text-center">{formatPercent(cenarios.conservador.taxa_churn)}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{formatPercent(cenarios.moderado.taxa_churn)}</td>
                        <td className="p-3 text-center">{formatPercent(cenarios.agressivo.taxa_churn)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Indicações</td>
                        <td className="p-3 text-center">{cenarios.conservador.indicacoes}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{cenarios.moderado.indicacoes}</td>
                        <td className="p-3 text-center">{cenarios.agressivo.indicacoes}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Contratos</td>
                        <td className="p-3 text-center">{cenarios.conservador.contratos}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{cenarios.moderado.contratos}</td>
                        <td className="p-3 text-center">{cenarios.agressivo.contratos}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Operações</td>
                        <td className="p-3 text-center">{cenarios.conservador.operacoes}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{cenarios.moderado.operacoes}</td>
                        <td className="p-3 text-center">{cenarios.agressivo.operacoes}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Captação</td>
                        <td className="p-3 text-center">{formatCurrency(cenarios.conservador.captacao)}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{formatCurrency(cenarios.moderado.captacao)}</td>
                        <td className="p-3 text-center">{formatCurrency(cenarios.agressivo.captacao)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Receita</td>
                        <td className="p-3 text-center text-green-600">{formatCurrency(cenarios.conservador.receita)}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold text-green-600">{formatCurrency(cenarios.moderado.receita)}</td>
                        <td className="p-3 text-center text-green-600">{formatCurrency(cenarios.agressivo.receita)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Investimento</td>
                        <td className="p-3 text-center">{formatCurrency(cenarios.conservador.investimento)}</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{formatCurrency(cenarios.moderado.investimento)}</td>
                        <td className="p-3 text-center">{formatCurrency(cenarios.agressivo.investimento)}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Probabilidade de Sucesso</td>
                        <td className="p-3 text-center">{cenarios.conservador.probabilidade_sucesso}%</td>
                        <td className="p-3 text-center bg-blue-50 font-bold">{cenarios.moderado.probabilidade_sucesso}%</td>
                        <td className="p-3 text-center">{cenarios.agressivo.probabilidade_sucesso}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACOMPANHAMENTO MENSAL */}
          <TabsContent value="acompanhamento" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Acompanhamento Mensal 2026
                </CardTitle>
                <CardDescription>Evolução real vs planejado - Cenário Moderado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left p-2 font-semibold">Mês</th>
                        <th className="text-center p-2 font-semibold">Métrica</th>
                        <th className="text-center p-2 font-semibold">Planejado</th>
                        <th className="text-center p-2 font-semibold">Realizado</th>
                        <th className="text-center p-2 font-semibold">Variação</th>
                        <th className="text-center p-2 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.acompanhamento_mensal.map((acomp: any, idx: number) => {
                        const planejado = data.metas_mensais[idx];
                        const metricas = [
                          { nome: 'Carteira', key: 'carteira', formato: 'numero' },
                          { nome: 'Novos', key: 'novos', formato: 'numero' },
                          { nome: 'Indicações', key: 'indicacoes', formato: 'numero' },
                          { nome: 'Contratos', key: 'contratos', formato: 'numero' },
                          { nome: 'Receita', key: 'receita', formato: 'moeda' }
                        ];
                        
                        return metricas.map((m: any, midx: number) => {
                          const real = acomp.realizado[m.key];
                          const plan = planejado[m.key];
                          const variacao = ((real - plan) / plan * 100).toFixed(1);
                          const variacaoNum = parseFloat(variacao);
                          const statusColor = variacaoNum >= -5 && variacaoNum <= 5 ? 'green' : variacaoNum < -5 ? 'red' : 'amber';
                          const statusText = variacaoNum >= -5 && variacaoNum <= 5 ? '✓ OK' : variacaoNum < -5 ? '✗ Abaixo' : '⚠ Acima';
                          
                          return (
                            <tr key={`${acomp.mes}-${m.key}`} className={midx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} style={{borderBottom: midx === metricas.length - 1 ? '2px solid #e2e8f0' : '1px solid #f1f5f9'}}>
                              <td className="p-2 font-medium">{midx === 0 ? acomp.mes : ''}</td>
                              <td className="p-2 text-center text-slate-600">{m.nome}</td>
                              <td className="p-2 text-center font-medium">{m.formato === 'moeda' ? formatCurrency(plan) : plan}</td>
                              <td className="p-2 text-center font-bold text-blue-700">{m.formato === 'moeda' ? formatCurrency(real) : real}</td>
                              <td className={`p-2 text-center font-bold ${statusColor === 'green' ? 'text-green-600' : statusColor === 'red' ? 'text-red-600' : 'text-amber-600'}`}>
                                {variacao}%
                              </td>
                              <td className="p-2 text-center">
                                <Badge className={`${statusColor === 'green' ? 'bg-green-100 text-green-700' : statusColor === 'red' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                  {statusText}
                                </Badge>
                              </td>
                            </tr>
                          );
                        });
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Resumo por Mês */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo de Performance por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.acompanhamento_mensal.map((acomp: any, idx: number) => {
                    const planejado = data.metas_mensais[idx];
                    const variacaoReceita = ((acomp.realizado.receita - planejado.receita) / planejado.receita * 100).toFixed(1);
                    const variacaoNum = parseFloat(variacaoReceita);
                    const statusColor = variacaoNum >= -5 && variacaoNum <= 5 ? 'green' : variacaoNum < -5 ? 'red' : 'amber';
                    
                    return (
                      <div key={acomp.mes} className={`p-4 rounded-lg border-2 ${statusColor === 'green' ? 'bg-green-50 border-green-200' : statusColor === 'red' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-lg">{acomp.mes}</h4>
                          <Badge className={`${statusColor === 'green' ? 'bg-green-600' : statusColor === 'red' ? 'bg-red-600' : 'bg-amber-600'}`}>
                            {variacaoNum >= 0 ? '+' : ''}{variacaoReceita}%
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Carteira</span>
                            <span className="font-bold">{acomp.realizado.carteira}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Novos</span>
                            <span className="font-bold text-green-600">+{acomp.realizado.novos}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Indicações</span>
                            <span className="font-bold">{acomp.realizado.indicacoes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Contratos</span>
                            <span className="font-bold">{acomp.realizado.contratos}</span>
                          </div>
                          <div className="flex justify-between pt-2 border-t">
                            <span className="text-slate-600">Receita</span>
                            <span className="font-bold text-green-600">{formatCurrency(acomp.realizado.receita)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* METAS */}
          <TabsContent value="metas" className="space-y-6">
            {/* Metas Trimestrais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Metas Trimestrais 2026
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {metas_trimestrais.map((q: any) => (
                    <div key={q.trimestre} className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-blue-800">{q.trimestre}</h4>
                        <Badge variant="outline" className="text-xs">{q.foco}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mb-3">{q.periodo}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Novos Parceiros</span>
                          <span className="font-bold">{q.novos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Churn Máximo</span>
                          <span className="font-bold text-red-600">{q.churn_max}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Indicações</span>
                          <span className="font-bold">{q.indicacoes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contratos</span>
                          <span className="font-bold">{q.contratos}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span>Receita</span>
                          <span className="font-bold text-green-600">{formatCurrency(q.receita)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Metas Mensais */}
            <Card>
              <CardHeader>
                <CardTitle>Projeção Mensal - Cenário Moderado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left p-2 font-semibold">Mês</th>
                        <th className="text-center p-2 font-semibold">Carteira</th>
                        <th className="text-center p-2 font-semibold">Novos</th>
                        <th className="text-center p-2 font-semibold">Churn</th>
                        <th className="text-center p-2 font-semibold">Indicações</th>
                        <th className="text-center p-2 font-semibold">Contratos</th>
                        <th className="text-center p-2 font-semibold">Operações</th>
                        <th className="text-center p-2 font-semibold">Captação</th>
                        <th className="text-center p-2 font-semibold">Receita</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metas_mensais.map((m: any, idx: number) => (
                        <tr key={m.mes} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-2 font-medium">{m.mes}</td>
                          <td className="p-2 text-center font-bold text-blue-700">{m.carteira}</td>
                          <td className="p-2 text-center text-green-600">+{m.novos}</td>
                          <td className="p-2 text-center text-red-600">-{m.churn}</td>
                          <td className="p-2 text-center">{m.indicacoes}</td>
                          <td className="p-2 text-center">{m.contratos}</td>
                          <td className="p-2 text-center">{m.operacoes}</td>
                          <td className="p-2 text-center">{formatCurrency(m.captacao)}</td>
                          <td className="p-2 text-center font-medium text-green-600">{formatCurrency(m.receita)}</td>
                        </tr>
                      ))}
                      <tr className="bg-blue-100 font-bold">
                        <td className="p-2">TOTAL</td>
                        <td className="p-2 text-center">80</td>
                        <td className="p-2 text-center text-green-600">+50</td>
                        <td className="p-2 text-center text-red-600">-10</td>
                        <td className="p-2 text-center">520</td>
                        <td className="p-2 text-center">130</td>
                        <td className="p-2 text-center">95</td>
                        <td className="p-2 text-center">{formatCurrency(72500000)}</td>
                        <td className="p-2 text-center text-green-600">{formatCurrency(3700000)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ROADMAP */}
          <TabsContent value="roadmap" className="space-y-6">
            {roadmap.map((q: any) => (
              <Card key={q.quarter}>
                <CardHeader className={`${
                  q.quarter === 'Q1' ? 'bg-blue-50' : 
                  q.quarter === 'Q2' ? 'bg-green-50' : 
                  q.quarter === 'Q3' ? 'bg-amber-50' : 
                  'bg-purple-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{q.quarter} - {q.foco}</CardTitle>
                      <CardDescription className="mt-1">{q.periodo}</CardDescription>
                    </div>
                    <Badge className="text-lg px-4 py-1">{q.meta_novos} novos parceiros</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="text-left p-3 font-semibold w-24">Semana</th>
                          <th className="text-left p-3 font-semibold">Atividade</th>
                          <th className="text-left p-3 font-semibold w-40">Responsável</th>
                          <th className="text-left p-3 font-semibold w-48">Entregável</th>
                        </tr>
                      </thead>
                      <tbody>
                        {q.atividades.map((a: any, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="p-3 font-medium text-blue-700">{a.semana}</td>
                            <td className="p-3">{a.atividade}</td>
                            <td className="p-3 text-slate-600">{a.responsavel}</td>
                            <td className="p-3">
                              <Badge variant="outline" className="text-xs">{a.entregavel}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* COMPENSAÇÃO */}
          <TabsContent value="compensacao" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(gerentes).map(([key, g]: [string, any]) => (
                <Card key={key} className="overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle>{g.nome}</CardTitle>
                        <CardDescription className="text-blue-200">{g.cargo}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-4">
                    {/* Metas */}
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <Target className="h-4 w-4" /> Metas 2026
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-slate-50 rounded">
                          <span className="text-slate-500">Carteira</span>
                          <p className="font-bold">{g.carteira_2026_meta} parceiros</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded">
                          <span className="text-slate-500">Novos</span>
                          <p className="font-bold">{g.metas_2026.novos_parceiros}</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded">
                          <span className="text-slate-500">Indicações</span>
                          <p className="font-bold">{g.metas_2026.indicacoes}</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded">
                          <span className="text-slate-500">Contratos</span>
                          <p className="font-bold">{g.metas_2026.contratos}</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded col-span-2">
                          <span className="text-slate-500">Receita Corporativa</span>
                          <p className="font-bold text-green-600">{formatCurrency(g.metas_2026.receita_corporativa)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Compensação */}
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" /> Estrutura de Compensação
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between p-2 bg-blue-50 rounded">
                          <span>Salário Base</span>
                          <span className="font-bold">{formatCurrency(g.compensacao.salario_base_anual)}/ano</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                          <span>Comissão Recorrente</span>
                          <span className="font-bold">{formatCurrency(g.compensacao.comissao_recorrente_anual)}/ano</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                          <span>Comissão Aquisição</span>
                          <span className="font-bold">{formatCurrency(g.compensacao.comissao_aquisicao_anual)}/ano</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 rounded">
                          <span>Bônus Trimestral</span>
                          <span className="font-bold">{formatCurrency(g.compensacao.bonus_anual)}/ano</span>
                        </div>
                        <div className="flex justify-between p-3 bg-green-100 rounded-lg border border-green-200">
                          <span className="font-semibold">TOTAL ANUAL</span>
                          <span className="font-bold text-green-700 text-lg">{formatCurrency(g.compensacao.renda_total_anual)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Modelo de Compensação */}
            <Card>
              <CardHeader>
                <CardTitle>Modelo Híbrido de Compensação - Detalhamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-bold text-blue-800 mb-2">1. Salário Base</h4>
                    <p className="text-sm text-blue-700">Segurança e previsibilidade</p>
                    <ul className="text-xs text-blue-600 mt-2 space-y-1">
                      <li>• Matheus: R$ 8.000/mês</li>
                      <li>• Viviane: R$ 6.500/mês</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-bold text-green-800 mb-2">2. Comissão Aquisição</h4>
                    <p className="text-sm text-green-700">Incentivo para novos parceiros</p>
                    <ul className="text-xs text-green-600 mt-2 space-y-1">
                      <li>• Parceiro Qualificado: R$ 500</li>
                      <li>• Primeiro Contrato: R$ 1.000</li>
                      <li>• Primeiro Crédito: R$ 500</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-bold text-amber-800 mb-2">3. Comissão Recorrente</h4>
                    <p className="text-sm text-amber-700">Incentivo para retenção</p>
                    <ul className="text-xs text-amber-600 mt-2 space-y-1">
                      <li>• OURO: R$ 200/parceiro/mês</li>
                      <li>• PRATA: R$ 100/parceiro/mês</li>
                      <li>• BRONZE: R$ 50/parceiro/mês</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-bold text-purple-800 mb-2">4. Bônus Trimestral</h4>
                    <p className="text-sm text-purple-700">Incentivo para metas</p>
                    <ul className="text-xs text-purple-600 mt-2 space-y-1">
                      <li>• 80-89%: R$ 1.500</li>
                      <li>• 90-99%: R$ 2.500</li>
                      <li>• 100-109%: R$ 4.000</li>
                      <li>• ≥110%: R$ 5.000</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PROCESSOS */}
          <TabsContent value="processos" className="space-y-6">
            {/* Prospecção */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Processo de Prospecção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-center p-3 font-semibold w-16">Passo</th>
                        <th className="text-left p-3 font-semibold">Ação</th>
                        <th className="text-left p-3 font-semibold">Ferramenta</th>
                        <th className="text-center p-3 font-semibold">Tempo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processos.prospeccao.map((p: any) => (
                        <tr key={p.passo} className="border-b">
                          <td className="p-3 text-center">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold">
                              {p.passo}
                            </span>
                          </td>
                          <td className="p-3 font-medium">{p.acao}</td>
                          <td className="p-3 text-slate-600">{p.ferramenta}</td>
                          <td className="p-3 text-center">
                            <Badge variant="outline">{p.tempo}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Processo de Onboarding (30 dias)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {processos.onboarding.map((o: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gradient-to-br from-blue-50 to-white rounded-lg border text-center">
                      <Badge className="bg-blue-600 mb-2">{o.dia}</Badge>
                      <p className="text-sm font-medium">{o.atividade}</p>
                      <p className="text-xs text-slate-500 mt-1">{o.responsavel}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Framework de Qualificação (Scoring)
                </CardTitle>
                <CardDescription>Score mínimo para aprovação: 60 pontos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left p-3 font-semibold">Critério</th>
                        <th className="text-center p-3 font-semibold">Peso</th>
                        <th className="text-left p-3 font-semibold">0 Pontos</th>
                        <th className="text-left p-3 font-semibold">10 Pontos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {processos.scoring.map((s: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-3 font-medium">{s.criterio}</td>
                          <td className="p-3 text-center">
                            <Badge className="bg-blue-100 text-blue-700">{s.peso}%</Badge>
                          </td>
                          <td className="p-3 text-red-600">{s.pontos_0}</td>
                          <td className="p-3 text-green-600">{s.pontos_10}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* RISCOS */}
          <TabsContent value="riscos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Matriz de Riscos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-center p-3 font-semibold w-12">ID</th>
                        <th className="text-left p-3 font-semibold">Risco</th>
                        <th className="text-center p-3 font-semibold">Prob.</th>
                        <th className="text-center p-3 font-semibold">Impacto</th>
                        <th className="text-left p-3 font-semibold">Mitigação</th>
                        <th className="text-left p-3 font-semibold">Contingência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risks.map((r: any) => {
                        const score = (r.probability * r.impact) / 100;
                        const riskLevel = score >= 3 ? 'Alto' : score >= 2 ? 'Médio' : 'Baixo';
                        return (
                          <tr key={r.id} className="border-b">
                            <td className="p-3 text-center">
                              <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white ${
                                riskLevel === 'Alto' ? 'bg-red-500' : 
                                riskLevel === 'Médio' ? 'bg-amber-500' : 
                                'bg-green-500'
                              }`}>
                                {r.id}
                              </span>
                            </td>
                            <td className="p-3 font-medium">{r.title}</td>
                            <td className="p-3 text-center">{r.probability}%</td>
                            <td className="p-3 text-center">{r.impact}/10</td>
                            <td className="p-3 text-slate-600 text-xs">{r.mitigation}</td>
                            <td className="p-3 text-slate-600 text-xs">{r.contingency}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Cards de Risco */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {risks.slice(0, 4).map((r: any) => {
                const score = (r.probability * r.impact) / 100;
                const riskLevel = score >= 3 ? 'Alto' : score >= 2 ? 'Médio' : 'Baixo';
                return (
                  <Card key={r.id} className={`${
                    riskLevel === 'Alto' ? 'border-red-200 bg-red-50' : 
                    riskLevel === 'Médio' ? 'border-amber-200 bg-amber-50' : 
                    'border-green-200 bg-green-50'
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <Badge className={`${
                          riskLevel === 'Alto' ? 'bg-red-500' : 
                          riskLevel === 'Médio' ? 'bg-amber-500' : 
                          'bg-green-500'
                        }`}>
                          {r.id}
                        </Badge>
                        <Badge variant="outline">{riskLevel}</Badge>
                      </div>
                      <CardTitle className="text-sm mt-2">{r.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span>Probabilidade</span>
                          <span className="font-bold">{r.probability}%</span>
                        </div>
                        <Progress value={r.probability} className="h-2" />
                        <div className="flex justify-between">
                          <span>Impacto</span>
                          <span className="font-bold">{r.impact}/10</span>
                        </div>
                        <Progress value={r.impact * 10} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* KPIs */}
          <TabsContent value="kpis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Indicadores de Performance (KPIs)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left p-3 font-semibold">Indicador</th>
                        <th className="text-left p-3 font-semibold">Fórmula</th>
                        <th className="text-center p-3 font-semibold">Meta</th>
                        <th className="text-center p-3 font-semibold">Frequência</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpis.map((k: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-3 font-medium">{k.nome}</td>
                          <td className="p-3 text-slate-600 font-mono text-xs">{k.formula}</td>
                          <td className="p-3 text-center">
                            <Badge className="bg-green-100 text-green-700">{k.meta}</Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant="outline">{k.frequencia}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* GOVERNANÇA */}
          <TabsContent value="governanca" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Fóruns */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Fóruns de Governança
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {governanca.foruns.map((f: any, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{f.nome}</h4>
                          <Badge>{f.frequencia}</Badge>
                        </div>
                        <div className="text-sm text-slate-600 space-y-1">
                          <p><strong>Participantes:</strong> {f.participantes}</p>
                          <p><strong>Duração:</strong> {f.duracao}</p>
                          <p><strong>Objetivo:</strong> {f.objetivo}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Calendário Mensal */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Calendário Mensal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {governanca.calendario_mensal.map((c: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <Badge className="bg-blue-600 min-w-[50px] justify-center">{c.dia}</Badge>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{c.atividade}</p>
                          <p className="text-xs text-slate-500">{c.responsavel}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* GRÁFICOS */}
          <TabsContent value="graficos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo 2025 vs 2026</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/01_comparativo_2025_2026.png" alt="Comparativo" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Receita e Captação</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/02_receita_captacao.png" alt="Receita" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Comparativo dos Cenários</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/03_cenarios_comparativo.png" alt="Cenários" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Evolução da Carteira</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/04_evolucao_carteira.png" alt="Evolução" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Funil de Conversão</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/05_funil_conversao.png" alt="Funil" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição da Carteira</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/06_distribuicao_carteira.png" alt="Distribuição" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Metas Trimestrais</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/07_metas_trimestrais.png" alt="Metas" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Estrutura de Compensação</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/08_compensacao.png" alt="Compensação" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Análise de Churn</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/09_analise_churn.png" alt="Churn" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Roadmap de Implementação</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/10_roadmap.png" alt="Roadmap" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Matriz de Riscos</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/11_matriz_riscos.png" alt="Riscos" className="w-full rounded-lg" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Performance por Gerente</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src="/images/12_performance_gerente.png" alt="Performance" className="w-full rounded-lg" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-slate-400 text-sm">
            Cartilha de Planejamento Estratégico - Área de Parcerias LOARA 2026
          </p>
          <p className="text-slate-500 text-xs mt-1">
            Versão 4.0 | Documento Confidencial - Uso Interno
          </p>
        </div>
      </footer>
    </div>
  );
}
