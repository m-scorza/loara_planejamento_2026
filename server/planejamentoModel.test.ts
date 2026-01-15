import { describe, expect, it } from "vitest";
import { calcularPlanejamento, VALORES_BASE_PADRAO } from "../client/src/lib/planejamentoModel";

describe("Modelo de Planejamento Inteligente", () => {
  it("calcula crescimento percentual corretamente", () => {
    const resultado = calcularPlanejamento(VALORES_BASE_PADRAO);

    // Carteira: 40 → 100 = +150%
    expect(resultado.crescimento.carteira).toBe(150);

    // Indicações: 243 → 870 = +258%
    expect(resultado.crescimento.indicacoes).toBe(258);

    // Contratos: 47 → 168 = +257%
    expect(resultado.crescimento.contratos).toBe(257);

    // Captação: 28.9M → 112M = +288%
    expect(resultado.crescimento.captacao).toBe(288);

    // Receita: 1.43M → 6.72M = +370%
    expect(resultado.crescimento.receita).toBe(370);

    // Churn: 21.57% → 15% = -30%
    expect(resultado.crescimento.churn).toBe(-30);
  });

  it("calcula novos parceiros necessários", () => {
    const resultado = calcularPlanejamento(VALORES_BASE_PADRAO);

    // Carteira final: 100
    // Carteira inicial: 40
    // Churn: 15% de 40 = 6
    // Novos necessários: 100 - 40 + 6 = 66
    expect(resultado.novos_parceiros_necessarios).toBe(66);
  });

  it("recalcula quando valores base mudam", () => {
    const valoresCustom = {
      baseline_2025: {
        carteira_ativa: 50,
        churn_anual_percent: 20,
        indicacoes: 300,
        contratos: 60,
        captacao_total: 40000000,
        receita_gerada: 2000000,
      },
      meta_2026: {
        carteira_final: 120,
        churn_anual_percent: 12,
        indicacoes: 1000,
        contratos: 200,
        captacao_total: 150000000,
        receita_gerada: 9000000,
      },
    };

    const resultado = calcularPlanejamento(valoresCustom);

    // Carteira: 50 → 120 = +140%
    expect(resultado.crescimento.carteira).toBe(140);

    // Indicações: 300 → 1000 = +233%
    expect(resultado.crescimento.indicacoes).toBe(233);

    // Novos necessários: 120 - 50 + (50 * 0.12) = 76
    expect(resultado.novos_parceiros_necessarios).toBe(76);
  });

  it("calcula taxa de conversão indicação → contrato", () => {
    const resultado = calcularPlanejamento(VALORES_BASE_PADRAO);

    // Contratos / Indicações = 168 / 870 = 19.3%
    expect(resultado.taxa_conversao_indicacao_contrato).toBeCloseTo(19.3, 1);
  });

  it("calcula receita média por parceiro", () => {
    const resultado = calcularPlanejamento(VALORES_BASE_PADRAO);

    // Receita / Carteira = 6.72M / 100 = 67.200
    expect(resultado.receita_media_por_parceiro).toBe(67200);
  });

  it("calcula captação média por contrato", () => {
    const resultado = calcularPlanejamento(VALORES_BASE_PADRAO);

    // Captação / Contratos = 112M / 168 = 666.667
    expect(resultado.captacao_media_por_contrato).toBeCloseTo(666667, 0);
  });

  it("mantém valores base inalterados", () => {
    const valoresOriginais = { ...VALORES_BASE_PADRAO };
    calcularPlanejamento(VALORES_BASE_PADRAO);

    // Garantir que a função não modifica os valores de entrada
    expect(VALORES_BASE_PADRAO).toEqual(valoresOriginais);
  });
});
