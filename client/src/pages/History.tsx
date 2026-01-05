import { Sidebar } from "@/components/Sidebar";
import { useReadingsHistory } from "@/hooks/use-readings";
import { format } from "date-fns";
import { 
  Table,
  CalendarDays, 
  Download
} from "lucide-react";

export default function History() {
  const { data: readings, isLoading } = useReadingsHistory(50);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-display font-bold text-foreground">Reading History</h2>
            <p className="text-muted-foreground mt-1">Detailed log of all recorded vital signs.</p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </header>

        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Time</th>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Maternal HR</th>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">SpO2</th>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Temp</th>
                  <th className="px-6 py-4 font-semibold text-sm text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Loading history data...
                    </td>
                  </tr>
                ) : readings?.map((reading) => (
                  <tr key={reading.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {reading.timestamp && format(new Date(reading.timestamp), "MMM d, HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${reading.maternalHeartRate > 100 ? "text-red-600" : "text-foreground"}`}>
                        {reading.maternalHeartRate} bpm
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`font-medium ${reading.maternalSpo2 < 95 ? "text-amber-600" : "text-foreground"}`}>
                        {reading.maternalSpo2}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {reading.maternalTemperature?.toFixed(1)}°C
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${
                        (reading.contractionLevel || 0) > 20 
                          ? "bg-red-100 text-red-700" 
                          : "bg-green-100 text-green-700"
                      }`}>
                        {reading.contractionStatus || "NORMAL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
