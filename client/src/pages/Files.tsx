import { useAuth } from "@/_core/hooks/useAuth";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Files() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-700 mx-auto mb-4" />
          <p className="text-slate-600">A carregar...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Autenticação Necessária</h2>
          <p className="text-slate-600 mb-6">
            Por favor, faça login para aceder à gestão de ficheiros.
          </p>
          <Button onClick={() => (window.location.href = getLoginUrl())}>
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-6 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Gestão de Ficheiros</h1>
              <p className="text-blue-200 mt-1">Upload e gestão de documentos do planejamento</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <FileUpload />
      </div>
    </div>
  );
}
