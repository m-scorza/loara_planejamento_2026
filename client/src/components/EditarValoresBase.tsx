import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ValoresBase, VALORES_BASE_PADRAO } from "@/lib/planejamentoModel";
import { Save, RotateCcw } from "lucide-react";

interface EditarValoresBaseProps {
  valores: ValoresBase;
  onSave: (valores: ValoresBase) => void;
}

export default function EditarValoresBase({ valores, onSave }: EditarValoresBaseProps) {
  const [editedValues, setEditedValues] = useState<ValoresBase>(valores);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseCurrency = (value: string): number => {
    return Number(value.replace(/[^0-9]/g, ''));
  };

  const handleReset = () => {
    setEditedValues(VALORES_BASE_PADRAO);
  };

  const handleSave = () => {
    onSave(editedValues);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Editar Valores Base</CardTitle>
        <CardDescription>
          Altere os valores base e todos os cálculos serão atualizados automaticamente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="baseline">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="baseline">Baseline 2025</TabsTrigger>
            <TabsTrigger value="meta">Meta 2026</TabsTrigger>
          </TabsList>

          <TabsContent value="baseline" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="baseline_carteira">Carteira Ativa</Label>
                <Input
                  id="baseline_carteira"
                  type="number"
                  value={editedValues.baseline_2025.carteira_ativa}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    baseline_2025: {
                      ...editedValues.baseline_2025,
                      carteira_ativa: Number(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="baseline_churn">Churn Anual (%)</Label>
                <Input
                  id="baseline_churn"
                  type="number"
                  step="0.01"
                  value={editedValues.baseline_2025.churn_anual_percent}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    baseline_2025: {
                      ...editedValues.baseline_2025,
                      churn_anual_percent: Number(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="baseline_indicacoes">Indicações</Label>
                <Input
                  id="baseline_indicacoes"
                  type="number"
                  value={editedValues.baseline_2025.indicacoes}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    baseline_2025: {
                      ...editedValues.baseline_2025,
                      indicacoes: Number(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="baseline_contratos">Contratos</Label>
                <Input
                  id="baseline_contratos"
                  type="number"
                  value={editedValues.baseline_2025.contratos}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    baseline_2025: {
                      ...editedValues.baseline_2025,
                      contratos: Number(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="baseline_captacao">Captação Total (R$)</Label>
                <Input
                  id="baseline_captacao"
                  type="text"
                  value={formatCurrency(editedValues.baseline_2025.captacao_total)}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    baseline_2025: {
                      ...editedValues.baseline_2025,
                      captacao_total: parseCurrency(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="baseline_receita">Receita Gerada (R$)</Label>
                <Input
                  id="baseline_receita"
                  type="text"
                  value={formatCurrency(editedValues.baseline_2025.receita_gerada)}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    baseline_2025: {
                      ...editedValues.baseline_2025,
                      receita_gerada: parseCurrency(e.target.value),
                    },
                  })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="meta" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="meta_carteira">Carteira Final</Label>
                <Input
                  id="meta_carteira"
                  type="number"
                  value={editedValues.meta_2026.carteira_final}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    meta_2026: {
                      ...editedValues.meta_2026,
                      carteira_final: Number(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="meta_churn">Churn Anual (%)</Label>
                <Input
                  id="meta_churn"
                  type="number"
                  step="0.01"
                  value={editedValues.meta_2026.churn_anual_percent}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    meta_2026: {
                      ...editedValues.meta_2026,
                      churn_anual_percent: Number(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="meta_indicacoes">Indicações</Label>
                <Input
                  id="meta_indicacoes"
                  type="number"
                  value={editedValues.meta_2026.indicacoes}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    meta_2026: {
                      ...editedValues.meta_2026,
                      indicacoes: Number(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="meta_contratos">Contratos</Label>
                <Input
                  id="meta_contratos"
                  type="number"
                  value={editedValues.meta_2026.contratos}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    meta_2026: {
                      ...editedValues.meta_2026,
                      contratos: Number(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="meta_captacao">Captação Total (R$)</Label>
                <Input
                  id="meta_captacao"
                  type="text"
                  value={formatCurrency(editedValues.meta_2026.captacao_total)}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    meta_2026: {
                      ...editedValues.meta_2026,
                      captacao_total: parseCurrency(e.target.value),
                    },
                  })}
                />
              </div>

              <div>
                <Label htmlFor="meta_receita">Receita Gerada (R$)</Label>
                <Input
                  id="meta_receita"
                  type="text"
                  value={formatCurrency(editedValues.meta_2026.receita_gerada)}
                  onChange={(e) => setEditedValues({
                    ...editedValues,
                    meta_2026: {
                      ...editedValues.meta_2026,
                      receita_gerada: parseCurrency(e.target.value),
                    },
                  })}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-3 mt-6">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Salvar e Recalcular
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
