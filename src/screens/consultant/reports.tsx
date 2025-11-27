import { BarChart3 } from 'lucide-react';

export function ConsultantReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-[14px] border border-neutral-200 bg-white p-8 dark:border-neutral-800 dark:bg-neutral-900">
        <BarChart3 className="h-12 w-12 text-neutral-400" />
        <div>
          <h3 className="text-lg font-medium">Relatórios (Consultor)</h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Filtros por conta/período/módulo
          </p>
        </div>
      </div>
    </div>
  );
}
