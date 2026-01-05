import { useAlerts, useResolveAlert } from "@/hooks/use-alerts";
import { Sidebar } from "@/components/Sidebar";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  Clock,
  Filter
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Alerts() {
  const { data: alerts, isLoading } = useAlerts();
  const { mutate: resolveAlert, isPending: isResolving } = useResolveAlert();

  const sortedAlerts = alerts ? [...alerts].sort((a, b) => 
    new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
  ) : [];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-10 max-w-5xl mx-auto">
        
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-3xl font-display font-bold text-foreground">Alert History</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <p className="text-muted-foreground">
            Track and manage health alerts detected by the Smart Belt.
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sortedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-border">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">All Clear</h3>
            <p className="text-muted-foreground mt-2">No alerts have been recorded recently.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={cn(
                  "flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border transition-all duration-300",
                  !alert.isResolved 
                    ? "bg-white border-l-4 shadow-sm"
                    : "bg-gray-50/50 opacity-75 border-gray-200"
                )}
                style={{
                  borderLeftColor: !alert.isResolved 
                    ? alert.severity === 'critical' ? '#ef4444' : '#f59e0b'
                    : undefined
                }}
              >
                <div className="flex items-start gap-4 mb-4 md:mb-0">
                  <div className={cn(
                    "p-3 rounded-full shrink-0",
                    alert.severity === 'critical' ? "bg-red-100 text-red-600" :
                    alert.severity === 'warning' ? "bg-amber-100 text-amber-600" :
                    "bg-blue-100 text-blue-600"
                  )}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-foreground">{alert.message}</h4>
                      {!alert.isResolved && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-700">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {alert.createdAt && format(new Date(alert.createdAt), "MMM d, h:mm a")}
                      </span>
                      <span className="font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs uppercase">
                        {alert.type}
                      </span>
                    </div>
                  </div>
                </div>

                {!alert.isResolved ? (
                  <button 
                    onClick={() => resolveAlert(alert.id)}
                    disabled={isResolving}
                    className="px-5 py-2.5 rounded-lg font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium px-4 py-2 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Resolved
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
