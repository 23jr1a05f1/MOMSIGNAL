import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-10 h-10 text-amber-500" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground text-lg">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link href="/">
          <button className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Return Home
          </button>
        </Link>
      </div>
    </div>
  );
}
