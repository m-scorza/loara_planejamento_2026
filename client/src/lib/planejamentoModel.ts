/**
 * Modelo de Cálculo Inteligente do Planejamento LOARA 2026
 * 
 * Este arquivo define os valores base e todas as fórmulas de cálculo.
 * Ao alterar um valor base, todos os valores dependentes são recalculados automaticamente.
 */

// ============================================================================
// VALORES BASE (Editáveis)
// ============================================================================

export interface ValoresBase {
  // Baseline 2025 (Realizado)
  baseline_2025: {
    carteira_ativa: number;
    churn_anual_percent: number;
    indicacoes: number;
    contratos: number;
    captacao_total: number;
    receita_gerada: number;
  };
  
  // Metas 2026 (Projeção)
  meta_2026: {
    carteira_final: number;
    churn_anual_percent: number;
    indicacoes: number;
    contratos: number;
    captacao_total: number;
    receita_gerada: number;
  };
}

// Valores base padrão
export const VALORES_BASE_PADRAO: ValoresBase = {
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

// ============================================================================
// FUNÇÕES DE CÁLCULO (Automáticas)
// ============================================================================

export function calcularPlanejamento(valores: ValoresBase) {
  const { baseline_2025, meta_2026 } = valores;
  
  // Calcular crescimento percentual
  const crescimento = {
    carteira: ((meta_2026.carteira_final - baseline_2025.carteira_ativa) / baseline_2025.carteira_ativa * 100).toFixed(0),
    churn: ((meta_2026.churn_anual_percent - baseline_2025.churn_anual_percent) / baseline_2025.churn_anual_percent * 100).toFixed(0),
    indicacoes: ((meta_2026.indicacoes - baseline_2025.indicacoes) / baseline_2025.indicacoes * 100).toFixed(0),
    contratos: ((meta_2026.contratos - baseline_2025.contratos) / baseline_2025.contratos * 100).toFixed(0),
    captacao: ((meta_2026.captacao_total - baseline_2025.captacao_total) / baseline_2025.captacao_total * 100).toFixed(0),
    receita: ((meta_2026.receita_gerada - baseline_2025.receita_gerada) / baseline_2025.receita_gerada * 100).toFixed(0),
  };
  
  // Calcular operações
  const operacoes_2026 = Math.round(meta_2026.contratos * 0.73);
  
  // Calcular novos parceiros
  const churn_2026 = Math.round(baseline_2025.carteira_ativa * (meta_2026.churn_anual_percent / 100));
  const novos_parceiros_2026 = (meta_2026.carteira_final - baseline_2025.carteira_ativa) + churn_2026;
  
  // Cálculos adicionais
  const taxa_conversao_indicacao_contrato = (meta_2026.contratos / meta_2026.indicacoes * 100);
  const receita_media_por_parceiro = meta_2026.receita_gerada / meta_2026.carteira_final;
  const captacao_media_por_contrato = meta_2026.captacao_total / meta_2026.contratos;
  
  // Calcular cenários (Conservador: -20%, Moderado: base, Agressivo: +30%)
  const cenarios = {
    conservador: {
      carteira: Math.round(meta_2026.carteira_final * 0.8),
      indicacoes: Math.round(meta_2026.indicacoes * 0.8),
      contratos: Math.round(meta_2026.contratos * 0.8),
      captacao: Math.round(meta_2026.captacao_total * 0.8),
      receita: Math.round(meta_2026.receita_gerada * 0.8),
      churn: meta_2026.churn_anual_percent + 3, // Churn pior
    },
    moderado: {
      carteira: meta_2026.carteira_final,
      indicacoes: meta_2026.indicacoes,
      contratos: meta_2026.contratos,
      captacao: meta_2026.captacao_total,
      receita: meta_2026.receita_gerada,
      churn: meta_2026.churn_anual_percent,
    },
    agressivo: {
      carteira: Math.round(meta_2026.carteira_final * 1.3),
      indicacoes: Math.round(meta_2026.indicacoes * 1.3),
      contratos: Math.round(meta_2026.contratos * 1.3),
      captacao: Math.round(meta_2026.captacao_total * 1.3),
      receita: Math.round(meta_2026.receita_gerada * 1.3),
      churn: meta_2026.churn_anual_percent - 3, // Churn melhor
    },
  };

  // Calcular metas mensais (distribuição proporcional)
  const metas_mensais = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1;
    const fator_progressivo = (mes / 12); // Crescimento progressivo ao longo do ano
    
    return {
      mes,
      mes_nome: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i],
      carteira_acumulada: Math.round(baseline_2025.carteira_ativa + (novos_parceiros_2026 * fator_progressivo)),
      indicacoes: Math.round(meta_2026.indicacoes / 12),
      contratos: Math.round(meta_2026.contratos / 12),
      receita: Math.round(meta_2026.receita_gerada / 12),
    };
  });

  // Calcular compensação dos gerentes (70% Matheus, 30% Viviane)
  const compensacao_gerentes = {
    matheus: {
      meta_carteira: Math.round(meta_2026.carteira_final * 0.7),
      meta_contratos: Math.round(meta_2026.contratos * 0.7),
      receita_esperada: Math.round(meta_2026.receita_gerada * 0.7),
    },
    viviane: {
      meta_carteira: Math.round(meta_2026.carteira_final * 0.3),
      meta_contratos: Math.round(meta_2026.contratos * 0.3),
      receita_esperada: Math.round(meta_2026.receita_gerada * 0.3),
    },
  };

  return {
    baseline_2025,
    meta_2026,
    crescimento: {
      carteira: Number(crescimento.carteira),
      churn: Number(crescimento.churn),
      indicacoes: Number(crescimento.indicacoes),
      contratos: Number(crescimento.contratos),
      captacao: Number(crescimento.captacao),
      receita: Number(crescimento.receita),
    },
    operacoes_2026,
    churn_2026,
    novos_parceiros_necessarios: novos_parceiros_2026,
    taxa_conversao_indicacao_contrato,
    receita_media_por_parceiro,
    captacao_media_por_contrato,
    cenarios,
    metas_mensais,
    compensacao_gerentes,
  };
}
