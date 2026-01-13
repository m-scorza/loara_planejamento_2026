import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Loader2, FileText, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState<"documento" | "relatorio" | "dados" | "outro">("documento");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const utils = trpc.useUtils();
  const { data: files, isLoading } = trpc.files.list.useQuery();
  const uploadMutation = trpc.files.upload.useMutation({
    onSuccess: () => {
      toast.success("Ficheiro enviado com sucesso!");
      setSelectedFile(null);
      setDescription("");
      utils.files.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao enviar ficheiro: ${error.message}`);
    },
  });

  const deleteMutation = trpc.files.delete.useMutation({
    onSuccess: () => {
      toast.success("Ficheiro eliminado com sucesso!");
      utils.files.list.invalidate();
    },
    onError: (error) => {
      toast.error(`Erro ao eliminar ficheiro: ${error.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Por favor, selecione um ficheiro");
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result?.toString().split(",")[1];
        if (!base64) {
          toast.error("Erro ao ler ficheiro");
          setUploading(false);
          return;
        }

        await uploadMutation.mutateAsync({
          fileName: selectedFile.name,
          fileData: base64,
          mimeType: selectedFile.type,
          category,
          description: description || undefined,
        });
        setUploading(false);
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      setUploading(false);
      toast.error("Erro ao processar ficheiro");
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      documento: "Documento",
      relatorio: "Relatório",
      dados: "Dados",
      outro: "Outro",
    };
    return labels[cat] || cat;
  };

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      documento: "bg-blue-100 text-blue-700",
      relatorio: "bg-green-100 text-green-700",
      dados: "bg-amber-100 text-amber-700",
      outro: "bg-slate-100 text-slate-700",
    };
    return colors[cat] || colors.outro;
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Enviar Ficheiro
          </CardTitle>
          <CardDescription>
            Faça upload de documentos, relatórios e dados relacionados ao planejamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Ficheiro</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {selectedFile && (
              <p className="text-sm text-slate-600">
                Selecionado: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={(v: any) => setCategory(v)}>
              <SelectTrigger id="category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="documento">Documento</SelectItem>
                <SelectItem value="relatorio">Relatório</SelectItem>
                <SelectItem value="dados">Dados</SelectItem>
                <SelectItem value="outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Adicione uma descrição para o ficheiro..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
            />
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                A enviar...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Enviar Ficheiro
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Files List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Ficheiros Enviados
          </CardTitle>
          <CardDescription>
            {files?.length || 0} ficheiro(s) no total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : files && files.length > 0 ? (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      <p className="font-medium text-sm truncate">{file.fileName}</p>
                      <Badge className={getCategoryColor(file.category)}>
                        {getCategoryLabel(file.category)}
                      </Badge>
                    </div>
                    {file.description && (
                      <p className="text-xs text-slate-500 truncate">{file.description}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {formatFileSize(file.fileSize)} • {new Date(file.createdAt).toLocaleDateString("pt-PT")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(file.fileUrl, "_blank")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm("Tem certeza que deseja eliminar este ficheiro?")) {
                          deleteMutation.mutate({ fileId: file.id });
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-slate-300" />
              <p>Nenhum ficheiro enviado ainda</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
