import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  History, 
  BellRing, 
  Settings, 
  HeartPulse, 
  Activity
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/history", label: "History", icon: History },
    { href: "/alerts", label: "Alerts", icon: BellRing },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-border hidden md:flex flex-col fixed left-0 top-0 z-20 shadow-lg shadow-primary/5">
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 text-primary mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight leading-none text-foreground">MamaCare</h1>
            <p className="text-xs text-muted-foreground font-medium mt-1">Smart Belt</p>
          </div>
        </div>

        <div className="bg-secondary/30 rounded-xl p-4 border border-secondary/50 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-4 h-4 text-secondary-foreground" />
            <span className="text-sm font-semibold text-secondary-foreground">Device Status</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-medium text-muted-foreground">Monitoring Active</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`nav-link cursor-pointer ${location === item.href ? 'active' : ''}`}>
              <item.icon className={`w-5 h-5 ${location === item.href ? 'text-primary' : 'text-muted-foreground'}`} />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/10">
        <p className="text-xs text-muted-foreground mb-2 font-medium">Dr. Smith's Clinic</p>
        <p className="text-sm font-semibold text-foreground">Next Appt: Oct 24</p>
        <button className="mt-3 w-full text-xs font-semibold text-primary bg-white py-2 rounded-lg shadow-sm border border-primary/20 hover:bg-primary/5 transition-colors">
          Contact Doctor
        </button>
      </div>
    </div>
  );
}
