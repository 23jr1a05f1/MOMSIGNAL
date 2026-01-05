import { useDashboardStats, useReadingsHistory } from "@/hooks/use-readings";
import { Sidebar } from "@/components/Sidebar";
import { StatCard } from "@/components/StatCard";
import { VitalsChart } from "@/components/VitalsChart";
import { 
  Heart, 
  Thermometer, 
  Activity, 
  Baby, 
  BrainCircuit, 
  Droplets 
} from "lucide-react";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: history, isLoading: historyLoading } = useReadingsHistory(20);

  if (statsLoading || historyLoading) {
    return (
      <div className="flex min-h-screen bg-background items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium animate-pulse">Connecting to Smart Belt...</p>
        </div>
      </div>
    );
  }

  const reading = stats?.latestReading;
  const isContraction = (reading?.contractionLevel ?? 0) > 20;

  // Reverse history for charts (chronological order)
  const chartData = history ? [...history].reverse() : [];

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Vitals Overview
            </h2>
            <p className="text-muted-foreground mt-1">
              Real-time monitoring for Sarah • 32 Weeks
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${
               (stats?.activeAlerts?.length ?? 0) > 0 
                 ? "bg-red-50 border-red-200 text-red-700" 
                 : "bg-green-50 border-green-200 text-green-700"
             }`}>
               <div className={`w-2.5 h-2.5 rounded-full ${
                 (stats?.activeAlerts?.length ?? 0) > 0 ? "bg-red-500 animate-pulse" : "bg-green-500"
               }`} />
               <span className="text-sm font-semibold">
                 {(stats?.activeAlerts?.length ?? 0) > 0 ? "Action Required" : "Stable Condition"}
               </span>
             </div>
          </div>
        </header>

        {/* Vitals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Maternal HR"
            value={reading?.maternalHeartRate ?? "--"}
            unit="bpm"
            icon={<Heart className="w-5 h-5" />}
            status={reading?.maternalHeartRate && (reading.maternalHeartRate > 100 || reading.maternalHeartRate < 60) ? "warning" : "normal"}
            subtitle="Avg 72 bpm today"
          />
          <StatCard
            title="Oxygen Saturation"
            value={reading?.maternalSpo2 ?? "--"}
            unit="%"
            icon={<Droplets className="w-5 h-5" />}
            status={reading?.maternalSpo2 && reading.maternalSpo2 < 95 ? "warning" : "normal"}
            subtitle="Target > 95%"
          />
          <StatCard
            title="Temperature"
            value={reading?.maternalTemperature?.toFixed(1) ?? "--"}
            unit="°C"
            icon={<Thermometer className="w-5 h-5" />}
            status={reading?.maternalTemperature && reading.maternalTemperature > 37.5 ? "warning" : "normal"}
          />
          <StatCard
            title="Stress Level"
            value={reading?.stressLevel ?? "--"}
            unit="/ 100"
            icon={<BrainCircuit className="w-5 h-5" />}
            className="stat-card-gradient"
          />
        </div>

        {/* Pregnancy Specifics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pregnancy Monitor Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-primary/5 to-white rounded-2xl border border-primary/10 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-white rounded-xl shadow-sm border border-primary/10 text-primary">
                <Baby className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg">Pregnancy Monitor</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Contraction Status</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${
                    isContraction ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {reading?.contractionStatus || "NORMAL"}
                  </span>
                </div>
                <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${isContraction ? "bg-red-400" : "bg-secondary"}`}
                    style={{ width: `${Math.min(reading?.contractionLevel || 0, 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border/60">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fetal Movements</p>
                  <p className="text-2xl font-bold text-foreground mt-1">
                    {reading?.fetalMovementCount ?? 0}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground">
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              {reading?.fetalHeartRate && (
                 <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-border/60">
                   <div>
                     <p className="text-sm font-medium text-muted-foreground">Fetal Heart Rate</p>
                     <p className="text-2xl font-bold text-foreground mt-1">
                       {reading.fetalHeartRate} <span className="text-sm font-normal text-muted-foreground">bpm</span>
                     </p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                     <Heart className="w-5 h-5" />
                   </div>
                 </div>
              )}
            </div>
          </div>

          {/* Charts Area */}
          <div className="lg:col-span-2 space-y-6">
            <VitalsChart 
              data={chartData} 
              dataKey="maternalHeartRate" 
              color="#ec4899" // Pink-500
              title="Maternal Heart Rate Trend"
              unit=""
            />
            <VitalsChart 
              data={chartData} 
              dataKey="contractionLevel" 
              color="#06b6d4" // Cyan-500
              title="Contraction Activity"
              unit=""
            />
          </div>
        </div>

      </main>
    </div>
  );
}
