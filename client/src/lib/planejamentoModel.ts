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
  
  return {
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
  };
}
