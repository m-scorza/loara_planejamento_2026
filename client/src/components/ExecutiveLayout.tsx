import { Link } from "wouter";
import { BarChart3, Users, DollarSign, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExecutiveLayoutProps {
  children: React.ReactNode;
  currentPage: "executive" | "scenarios" | "compensation" | "data";
}

export default function ExecutiveLayout({
  children,
  currentPage,
}: ExecutiveLayoutProps) {
  const navItems = [
    {
      id: "executive",
      label: "Sumário Executivo",
      icon: BarChart3,
      href: "/",
    },
    {
      id: "scenarios",
      label: "Cenários 2026",
      icon: BarChart3,
      href: "/cenarios",
    },
    {
      id: "compensation",
      label: "Compensação Individual",
      icon: Users,
      href: "/compensacao",
    },
    {
      id: "data",
      label: "Análise de Dados",
      icon: Database,
      href: "/dados",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">LOARA</h1>
                <p className="text-xs text-slate-500">Planejamento Estratégico 2026</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                Parcerias
              </p>
              <p className="text-xs text-slate-500">v3.0 - Confidencial</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Link key={item.id} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`gap-2 rounded-none border-b-2 px-4 py-3 ${
                      isActive
                        ? "border-b-blue-600 bg-blue-50 text-blue-700"
                        : "border-b-transparent text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Documentos</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>Planejamento Corporativo</li>
                <li>Estrutura de Compensação</li>
                <li>Validação de Métricas</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Período</h3>
              <p className="text-sm text-slate-600">
                Planejamento 2026<br />
                Data: 13 de janeiro de 2026<br />
                Versão: 3.0
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Classificação</h3>
              <p className="text-sm text-slate-600">
                Estratégico - Confidencial<br />
                Uso restrito a gestores autorizados
              </p>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
            <p>© 2026 LOARA Parcerias. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
