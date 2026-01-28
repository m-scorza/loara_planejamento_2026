/**
 * Componente de Gerenciamento de Excel
 *
 * Permite importar e exportar dados do planejamento via planilha Excel.
 */

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  FileSpreadsheet,
  Download,
  Upload,
  FileDown,
  CheckCircle,
  AlertTriangle,
  Info,
  Trash2,
} from 'lucide-react';
import {
  exportarParaExcel,
  importarDeExcel,
  gerarPlanilhaModelo,
  salvarValoresLocal,
  limparValoresLocal,
  DadosCompletos,
  ResultadoImportacao,
} from '@/lib/excelUtils';
import { ValoresBase } from '@/lib/planejamentoModel';

interface ExcelManagerProps {
  valoresBase: ValoresBase;
  dadosCompletos?: DadosCompletos;
  onImport: (valores: ValoresBase) => void;
  onAcompanhamentoImport?: (acompanhamento: any[]) => void;
}

export default function ExcelManager({
  valoresBase,
  dadosCompletos,
  onImport,
  onAcompanhamentoImport,
}: ExcelManagerProps) {
  const [resultado, setResultado] = useState<ResultadoImportacao | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportar = () => {
    const dados: DadosCompletos = dadosCompletos || { valoresBase };
    exportarParaExcel(dados);
  };

  const handleGerarModelo = () => {
    gerarPlanilhaModelo();
  };

  const handleImportarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setResultado(null);

    try {
      const res = await importarDeExcel(file);
      setResultado(res);

      if (res.sucesso && res.valoresBase) {
        // Salvar localmente e notificar componente pai
        salvarValoresLocal(res.valoresBase);
        onImport(res.valoresBase);

        // Se tiver acompanhamento mensal, notificar também
        if (res.acompanhamento_mensal && onAcompanhamentoImport) {
          onAcompanhamentoImport(res.acompanhamento_mensal);
        }
      }
    } catch (error) {
      setResultado({
        sucesso: false,
        erros: [`Erro ao processar arquivo: ${error}`],
        avisos: [],
      });
    } finally {
      setIsProcessing(false);
      // Limpar input para permitir reimportação do mesmo arquivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLimparDados = () => {
    if (confirm('Tem certeza que deseja restaurar os valores padrão? Todos os dados salvos localmente serão perdidos.')) {
      limparValoresLocal();
      window.location.reload();
    }
  };

  return (
    <Card className="border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <FileSpreadsheet className="h-5 w-5" />
          Gerenciador de Dados Excel
        </CardTitle>
        <CardDescription>
          Importe ou exporte os dados do planejamento via planilha Excel para edição simples
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botões de Ação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            onClick={handleGerarModelo}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3"
          >
            <FileDown className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">Baixar Modelo</div>
              <div className="text-xs text-muted-foreground">Planilha com dados exemplo</div>
            </div>
          </Button>

          <Button
            onClick={handleExportar}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3 border-green-300 hover:bg-green-50"
          >
            <Download className="h-4 w-4 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-green-700">Exportar Dados</div>
              <div className="text-xs text-muted-foreground">Baixar dados atuais</div>
            </div>
          </Button>

          <Button
            onClick={handleImportarClick}
            disabled={isProcessing}
            className="flex items-center gap-2 h-auto py-3 bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            <div className="text-left">
              <div className="font-medium">{isProcessing ? 'Processando...' : 'Importar Excel'}</div>
              <div className="text-xs opacity-80">Carregar planilha editada</div>
            </div>
          </Button>

          <Button
            onClick={handleLimparDados}
            variant="outline"
            className="flex items-center gap-2 h-auto py-3 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
            <div className="text-left">
              <div className="font-medium text-red-700">Restaurar Padrão</div>
              <div className="text-xs text-muted-foreground">Limpar dados salvos</div>
            </div>
          </Button>
        </div>

        {/* Input de arquivo oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Resultado da Importação */}
        {resultado && (
          <div className="space-y-3 mt-4">
            {resultado.sucesso ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Importação Concluída</AlertTitle>
                <AlertDescription className="text-green-700">
                  Os dados foram importados e salvos com sucesso. A página foi atualizada automaticamente.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Erro na Importação</AlertTitle>
                <AlertDescription className="text-red-700">
                  {resultado.erros.map((erro, i) => (
                    <div key={i}>{erro}</div>
                  ))}
                </AlertDescription>
              </Alert>
            )}

            {resultado.avisos.length > 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800">Detalhes da Importação</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <ul className="list-disc list-inside">
                    {resultado.avisos.map((aviso, i) => (
                      <li key={i}>{aviso}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        {/* Informações sobre os dados atuais */}
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <Badge variant="outline" className="text-xs">
            Carteira 2025: {valoresBase.baseline_2025.carteira_ativa}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Meta Carteira 2026: {valoresBase.meta_2026.carteira_final}
          </Badge>
          <Badge variant="outline" className="text-xs text-green-700 border-green-300">
            Receita Meta: R$ {(valoresBase.meta_2026.receita_gerada / 1000000).toFixed(2)}M
          </Badge>
        </div>

        {/* Instruções Rápidas */}
        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
          <p><strong>Como usar:</strong></p>
          <ol className="list-decimal list-inside space-y-1 pl-2">
            <li>Clique em "Baixar Modelo" para obter uma planilha com a estrutura correta</li>
            <li>Edite os valores na planilha Excel (aba "Valores Base")</li>
            <li>Salve o arquivo Excel</li>
            <li>Clique em "Importar Excel" e selecione o arquivo editado</li>
            <li>Os dados serão atualizados automaticamente e salvos no navegador</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
