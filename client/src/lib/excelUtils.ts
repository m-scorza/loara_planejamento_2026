/**
 * Utilitários para Importação/Exportação de dados via Excel
 *
 * Permite edição simples dos dados do planejamento através de planilha Excel.
 */

import * as XLSX from 'xlsx';
import { ValoresBase, VALORES_BASE_PADRAO } from './planejamentoModel';

// Chave para localStorage
export const STORAGE_KEY = 'loara_planejamento_valores';

// ============================================================================
// PERSISTÊNCIA LOCAL (localStorage)
// ============================================================================

export function salvarValoresLocal(valores: ValoresBase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(valores));
  } catch (error) {
    console.error('Erro ao salvar valores localmente:', error);
  }
}

export function carregarValoresLocal(): ValoresBase {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Erro ao carregar valores locais:', error);
  }
  return VALORES_BASE_PADRAO;
}

export function limparValoresLocal(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ============================================================================
// EXPORTAÇÃO PARA EXCEL
// ============================================================================

export interface DadosCompletos {
  valoresBase: ValoresBase;
  acompanhamento_mensal?: any[];
  gerentes?: any;
  roadmap?: any[];
  risks?: any[];
}

export function exportarParaExcel(dados: DadosCompletos): void {
  const workbook = XLSX.utils.book_new();

  // ===== ABA 1: VALORES BASE =====
  const valoresBaseData = [
    ['PLANEJAMENTO LOARA 2026 - VALORES BASE'],
    [''],
    ['Esta planilha permite editar todos os valores do planejamento.'],
    ['Após editar, salve o arquivo e importe novamente no sistema.'],
    [''],
    ['=== BASELINE 2025 (Resultados Realizados) ==='],
    ['Campo', 'Valor', 'Descrição'],
    ['carteira_ativa', dados.valoresBase.baseline_2025.carteira_ativa, 'Número de parceiros ativos em 2025'],
    ['churn_anual_percent', dados.valoresBase.baseline_2025.churn_anual_percent, 'Percentual de churn anual'],
    ['indicacoes', dados.valoresBase.baseline_2025.indicacoes, 'Número de indicações recebidas'],
    ['contratos', dados.valoresBase.baseline_2025.contratos, 'Número de contratos assinados'],
    ['captacao_total', dados.valoresBase.baseline_2025.captacao_total, 'Captação total em R$'],
    ['receita_gerada', dados.valoresBase.baseline_2025.receita_gerada, 'Receita gerada em R$'],
    [''],
    ['=== META 2026 (Projeção) ==='],
    ['Campo', 'Valor', 'Descrição'],
    ['carteira_final', dados.valoresBase.meta_2026.carteira_final, 'Meta de parceiros ativos ao fim de 2026'],
    ['churn_anual_percent', dados.valoresBase.meta_2026.churn_anual_percent, 'Meta de percentual de churn anual'],
    ['indicacoes', dados.valoresBase.meta_2026.indicacoes, 'Meta de indicações'],
    ['contratos', dados.valoresBase.meta_2026.contratos, 'Meta de contratos'],
    ['captacao_total', dados.valoresBase.meta_2026.captacao_total, 'Meta de captação total em R$'],
    ['receita_gerada', dados.valoresBase.meta_2026.receita_gerada, 'Meta de receita em R$'],
  ];

  const wsValores = XLSX.utils.aoa_to_sheet(valoresBaseData);

  // Configurar largura das colunas
  wsValores['!cols'] = [
    { wch: 25 },  // Campo
    { wch: 20 },  // Valor
    { wch: 50 },  // Descrição
  ];

  XLSX.utils.book_append_sheet(workbook, wsValores, 'Valores Base');

  // ===== ABA 2: ACOMPANHAMENTO MENSAL =====
  if (dados.acompanhamento_mensal && dados.acompanhamento_mensal.length > 0) {
    const acompanhamentoData = [
      ['ACOMPANHAMENTO MENSAL 2026'],
      [''],
      ['Edite os valores realizados de cada mês'],
      [''],
      ['Mês', 'Carteira', 'Novos', 'Churn', 'Indicações', 'Contratos', 'Operações', 'Captação', 'Receita', 'Status'],
    ];

    dados.acompanhamento_mensal.forEach((mes: any) => {
      acompanhamentoData.push([
        mes.mes,
        mes.realizado?.carteira || 0,
        mes.realizado?.novos || 0,
        mes.realizado?.churn || 0,
        mes.realizado?.indicacoes || 0,
        mes.realizado?.contratos || 0,
        mes.realizado?.operacoes || 0,
        mes.realizado?.captacao || 0,
        mes.realizado?.receita || 0,
        mes.status || 'Pendente',
      ]);
    });

    const wsAcompanhamento = XLSX.utils.aoa_to_sheet(acompanhamentoData);
    wsAcompanhamento['!cols'] = [
      { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 12 },
      { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(workbook, wsAcompanhamento, 'Acompanhamento Mensal');
  }

  // ===== ABA 3: GERENTES =====
  if (dados.gerentes) {
    const gerentesData = [
      ['DADOS DOS GERENTES'],
      [''],
      ['=== MATHEUS SCORZA ==='],
      ['Campo', 'Valor'],
      ['nome', dados.gerentes.matheus_scorza?.nome || 'Matheus Scorza'],
      ['cargo', dados.gerentes.matheus_scorza?.cargo || 'Gerente Sênior'],
      ['carteira_2025', dados.gerentes.matheus_scorza?.carteira_2025 || 35],
      ['carteira_2026_meta', dados.gerentes.matheus_scorza?.carteira_2026_meta || 89],
      ['salario_base_mensal', dados.gerentes.matheus_scorza?.compensacao?.salario_base_mensal || 8000],
      [''],
      ['=== VIVIANE ANDRADE ==='],
      ['Campo', 'Valor'],
      ['nome', dados.gerentes.viviane_andrade?.nome || 'Viviane Andrade'],
      ['cargo', dados.gerentes.viviane_andrade?.cargo || 'Gerente'],
      ['carteira_2025', dados.gerentes.viviane_andrade?.carteira_2025 || 5],
      ['carteira_2026_meta', dados.gerentes.viviane_andrade?.carteira_2026_meta || 11],
      ['salario_base_mensal', dados.gerentes.viviane_andrade?.compensacao?.salario_base_mensal || 6500],
    ];

    const wsGerentes = XLSX.utils.aoa_to_sheet(gerentesData);
    wsGerentes['!cols'] = [{ wch: 25 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, wsGerentes, 'Gerentes');
  }

  // ===== ABA 4: RISCOS =====
  if (dados.risks && dados.risks.length > 0) {
    const riscosData = [
      ['MATRIZ DE RISCOS'],
      [''],
      ['ID', 'Título', 'Probabilidade (%)', 'Impacto (1-10)', 'Mitigação', 'Contingência'],
    ];

    dados.risks.forEach((risk: any) => {
      riscosData.push([
        risk.id,
        risk.title,
        risk.probability,
        risk.impact,
        risk.mitigation,
        risk.contingency,
      ]);
    });

    const wsRiscos = XLSX.utils.aoa_to_sheet(riscosData);
    wsRiscos['!cols'] = [
      { wch: 8 }, { wch: 35 }, { wch: 18 }, { wch: 15 }, { wch: 40 }, { wch: 40 },
    ];
    XLSX.utils.book_append_sheet(workbook, wsRiscos, 'Riscos');
  }

  // ===== ABA 5: INSTRUÇÕES =====
  const instrucoesData = [
    ['INSTRUÇÕES DE USO'],
    [''],
    ['1. EDIÇÃO DE VALORES BASE (Aba "Valores Base")'],
    ['   - Edite apenas a coluna "Valor" (coluna B)'],
    ['   - Os valores são usados para calcular automaticamente todas as métricas'],
    ['   - Valores monetários devem ser números inteiros (sem R$, pontos ou vírgulas)'],
    [''],
    ['2. ACOMPANHAMENTO MENSAL (Aba "Acompanhamento Mensal")'],
    ['   - Registre os resultados realizados de cada mês'],
    ['   - O sistema calculará automaticamente a variação vs planejado'],
    [''],
    ['3. DADOS DOS GERENTES (Aba "Gerentes")'],
    ['   - Edite informações dos gerentes e salários'],
    ['   - A compensação é calculada automaticamente'],
    [''],
    ['4. RISCOS (Aba "Riscos")'],
    ['   - Atualize probabilidade e impacto dos riscos'],
    ['   - Adicione novas linhas para novos riscos'],
    [''],
    ['5. IMPORTAÇÃO'],
    ['   - Após editar, salve o arquivo Excel'],
    ['   - No sistema, clique em "Importar Excel"'],
    ['   - Selecione o arquivo modificado'],
    ['   - Os dados serão atualizados automaticamente'],
    [''],
    ['DICAS:'],
    ['   - Faça backup do arquivo antes de grandes alterações'],
    ['   - Não altere os nomes dos campos (coluna A)'],
    ['   - Valores monetários: use números sem formatação'],
    ['   - Exemplo: 1000000 (não R$ 1.000.000,00)'],
  ];

  const wsInstrucoes = XLSX.utils.aoa_to_sheet(instrucoesData);
  wsInstrucoes['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(workbook, wsInstrucoes, 'Instruções');

  // Gerar arquivo e fazer download
  const dataAtual = new Date().toISOString().split('T')[0];
  const nomeArquivo = `LOARA_Planejamento_2026_${dataAtual}.xlsx`;

  XLSX.writeFile(workbook, nomeArquivo);
}

// ============================================================================
// IMPORTAÇÃO DE EXCEL
// ============================================================================

export interface ResultadoImportacao {
  sucesso: boolean;
  valoresBase?: ValoresBase;
  acompanhamento_mensal?: any[];
  gerentes?: any;
  risks?: any[];
  erros: string[];
  avisos: string[];
}

export async function importarDeExcel(file: File): Promise<ResultadoImportacao> {
  const resultado: ResultadoImportacao = {
    sucesso: false,
    erros: [],
    avisos: [],
  };

  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });

    // ===== IMPORTAR VALORES BASE =====
    if (workbook.SheetNames.includes('Valores Base')) {
      const wsValores = workbook.Sheets['Valores Base'];
      const jsonData = XLSX.utils.sheet_to_json(wsValores, { header: 1 }) as any[][];

      const valoresBase: ValoresBase = {
        baseline_2025: {
          carteira_ativa: 40,
          churn_anual_percent: 21.57,
          indicacoes: 243,
          contratos: 47,
          captacao_total: 28900000,
          receita_gerada: 1430000,
        },
        meta_2026: {
          carteira_final: 100,
          churn_anual_percent: 15.0,
          indicacoes: 870,
          contratos: 168,
          captacao_total: 112000000,
          receita_gerada: 6720000,
        },
      };

      // Procurar e extrair valores
      let secao = '';
      for (const row of jsonData) {
        if (!row || row.length < 2) continue;

        const campo = String(row[0] || '').toLowerCase().trim();
        const valor = row[1];

        if (campo.includes('baseline 2025')) {
          secao = 'baseline';
          continue;
        }
        if (campo.includes('meta 2026')) {
          secao = 'meta';
          continue;
        }

        if (secao === 'baseline') {
          if (campo === 'carteira_ativa') valoresBase.baseline_2025.carteira_ativa = Number(valor) || 40;
          if (campo === 'churn_anual_percent') valoresBase.baseline_2025.churn_anual_percent = Number(valor) || 21.57;
          if (campo === 'indicacoes') valoresBase.baseline_2025.indicacoes = Number(valor) || 243;
          if (campo === 'contratos') valoresBase.baseline_2025.contratos = Number(valor) || 47;
          if (campo === 'captacao_total') valoresBase.baseline_2025.captacao_total = Number(valor) || 28900000;
          if (campo === 'receita_gerada') valoresBase.baseline_2025.receita_gerada = Number(valor) || 1430000;
        }

        if (secao === 'meta') {
          if (campo === 'carteira_final') valoresBase.meta_2026.carteira_final = Number(valor) || 100;
          if (campo === 'churn_anual_percent') valoresBase.meta_2026.churn_anual_percent = Number(valor) || 15.0;
          if (campo === 'indicacoes') valoresBase.meta_2026.indicacoes = Number(valor) || 870;
          if (campo === 'contratos') valoresBase.meta_2026.contratos = Number(valor) || 168;
          if (campo === 'captacao_total') valoresBase.meta_2026.captacao_total = Number(valor) || 112000000;
          if (campo === 'receita_gerada') valoresBase.meta_2026.receita_gerada = Number(valor) || 6720000;
        }
      }

      resultado.valoresBase = valoresBase;
      resultado.avisos.push('Valores base importados com sucesso');
    } else {
      resultado.avisos.push('Aba "Valores Base" não encontrada');
    }

    // ===== IMPORTAR ACOMPANHAMENTO MENSAL =====
    if (workbook.SheetNames.includes('Acompanhamento Mensal')) {
      const wsAcomp = workbook.Sheets['Acompanhamento Mensal'];
      const jsonData = XLSX.utils.sheet_to_json(wsAcomp, { header: 1 }) as any[][];

      const acompanhamento: any[] = [];
      let headerIndex = -1;

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row[0] === 'Mês') {
          headerIndex = i;
          continue;
        }

        if (headerIndex > -1 && row && row[0] && typeof row[0] === 'string' && row[0].length <= 3) {
          acompanhamento.push({
            mes: row[0],
            realizado: {
              carteira: Number(row[1]) || 0,
              novos: Number(row[2]) || 0,
              churn: Number(row[3]) || 0,
              indicacoes: Number(row[4]) || 0,
              contratos: Number(row[5]) || 0,
              operacoes: Number(row[6]) || 0,
              captacao: Number(row[7]) || 0,
              receita: Number(row[8]) || 0,
            },
            status: row[9] || 'OK',
          });
        }
      }

      if (acompanhamento.length > 0) {
        resultado.acompanhamento_mensal = acompanhamento;
        resultado.avisos.push(`Acompanhamento mensal importado: ${acompanhamento.length} meses`);
      }
    }

    // ===== IMPORTAR RISCOS =====
    if (workbook.SheetNames.includes('Riscos')) {
      const wsRiscos = workbook.Sheets['Riscos'];
      const jsonData = XLSX.utils.sheet_to_json(wsRiscos, { header: 1 }) as any[][];

      const risks: any[] = [];
      let headerIndex = -1;

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        if (row && row[0] === 'ID') {
          headerIndex = i;
          continue;
        }

        if (headerIndex > -1 && row && row[0] && String(row[0]).startsWith('R')) {
          risks.push({
            id: row[0],
            title: row[1] || '',
            probability: Number(row[2]) || 0,
            impact: Number(row[3]) || 0,
            mitigation: row[4] || '',
            contingency: row[5] || '',
          });
        }
      }

      if (risks.length > 0) {
        resultado.risks = risks;
        resultado.avisos.push(`Riscos importados: ${risks.length} riscos`);
      }
    }

    resultado.sucesso = resultado.valoresBase !== undefined;

  } catch (error) {
    resultado.erros.push(`Erro ao processar arquivo: ${error}`);
  }

  return resultado;
}

// ============================================================================
// GERADOR DE PLANILHA MODELO
// ============================================================================

export function gerarPlanilhaModelo(): void {
  const dadosModelo: DadosCompletos = {
    valoresBase: VALORES_BASE_PADRAO,
    acompanhamento_mensal: [
      { mes: 'Jan', realizado: { carteira: 41, novos: 2, churn: 1, indicacoes: 28, contratos: 7, operacoes: 5, captacao: 4200000, receita: 214000 }, status: 'OK' },
      { mes: 'Fev', realizado: { carteira: 42, novos: 2, churn: 1, indicacoes: 30, contratos: 8, operacoes: 6, captacao: 4500000, receita: 229000 }, status: 'OK' },
      { mes: 'Mar', realizado: { carteira: 44, novos: 3, churn: 1, indicacoes: 32, contratos: 9, operacoes: 6, captacao: 4800000, receita: 244000 }, status: 'OK' },
      { mes: 'Abr', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
      { mes: 'Mai', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
      { mes: 'Jun', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
      { mes: 'Jul', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
      { mes: 'Ago', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
      { mes: 'Set', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
      { mes: 'Out', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
      { mes: 'Nov', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
      { mes: 'Dez', realizado: { carteira: 0, novos: 0, churn: 0, indicacoes: 0, contratos: 0, operacoes: 0, captacao: 0, receita: 0 }, status: 'Pendente' },
    ],
    gerentes: {
      matheus_scorza: {
        nome: 'Matheus Scorza',
        cargo: 'Gerente Sênior',
        carteira_2025: 35,
        carteira_2026_meta: 89,
        compensacao: { salario_base_mensal: 8000 },
      },
      viviane_andrade: {
        nome: 'Viviane Andrade',
        cargo: 'Gerente',
        carteira_2025: 5,
        carteira_2026_meta: 11,
        compensacao: { salario_base_mensal: 6500 },
      },
    },
    risks: [
      { id: 'R1', title: 'Churn Elevado de Novos Parceiros', probability: 40, impact: 8, mitigation: 'Onboarding estruturado de 30 dias', contingency: 'Programa de retenção emergencial se churn > 5%/trimestre' },
      { id: 'R2', title: 'Qualidade de Dados Inadequada', probability: 60, impact: 5, mitigation: 'Auditoria completa em Q1', contingency: 'Força-tarefa se > 20% inconsistentes' },
      { id: 'R3', title: 'Aquisição Abaixo da Meta', probability: 35, impact: 6, mitigation: 'Diversificação de canais', contingency: 'Campanha intensiva se < 80% meta' },
      { id: 'R4', title: 'Capacidade Operacional Insuficiente', probability: 40, impact: 8, mitigation: 'Contratação de assessores em Q2', contingency: 'Contratação emergencial se backlog > 50' },
      { id: 'R5', title: 'Mudanças Regulatórias', probability: 15, impact: 9, mitigation: 'Monitoramento contínuo', contingency: 'Análise de impacto em 60 dias' },
      { id: 'R6', title: 'Concorrência Aumentada', probability: 45, impact: 5, mitigation: 'Diferenciação via qualidade', contingency: 'Programa de fidelização se perder 3+ parceiros' },
      { id: 'R7', title: 'Dependência de Parceiros-Chave', probability: 50, impact: 8, mitigation: 'Diversificação de carteira', contingency: 'Reunião executiva se top parceiro anunciar saída' },
      { id: 'R8', title: 'Rotatividade de Equipe', probability: 20, impact: 9, mitigation: 'Programa de retenção e documentação', contingency: 'Plano de transição em 30 dias' },
    ],
  };

  exportarParaExcel(dadosModelo);
}
