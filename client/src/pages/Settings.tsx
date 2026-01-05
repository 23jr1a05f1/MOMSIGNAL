import { Sidebar } from "@/components/Sidebar";
import { User, Bell, Smartphone, Shield, LogOut } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 p-4 md:p-8 lg:p-10 max-w-3xl mx-auto">
        <h2 className="text-3xl font-display font-bold text-foreground mb-8">Settings</h2>
        
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-4 border-white shadow-lg shadow-primary/10">
              SM
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">Sarah Miller</h3>
              <p className="text-muted-foreground">Patient ID: #88492 • 32 Weeks Pregnant</p>
              <button className="mt-2 text-sm font-semibold text-primary hover:underline">
                Edit Profile
              </button>
            </div>
          </div>

          {/* Settings Sections */}
          <div className="bg-white rounded-2xl border border-border shadow-sm divide-y divide-border">
            <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-secondary/10 text-secondary-foreground rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Manage alert preferences and sounds</p>
                </div>
              </div>
              <div className="text-sm font-medium text-muted-foreground">Configured</div>
            </div>

            <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Device Connection</h4>
                  <p className="text-sm text-muted-foreground">Pair new belt or calibrate sensors</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            </div>

            <div className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 text-gray-600 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Privacy & Security</h4>
                  <p className="text-sm text-muted-foreground">Data sharing permissions</p>
                </div>
              </div>
            </div>
          </div>

          <button className="w-full p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
