import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Search, Zap, User, Shield } from "lucide-react";
//import { useAlerts } from "@/hooks/use-transformers";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  //const { data: alerts = [] } = useAlerts();
  //
  //const unresolvedAlerts = alerts.filter(alert => !alert.isResolved);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-ecg-blue rounded-lg flex items-center justify-center">
                <Zap className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  ECG Transformer M&E
                </h1>
                <p className="text-xs text-gray-500">
                  Monitoring & Evaluation System
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <Search className="text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search transformers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-64 p-0 focus-visible:ring-0"
              />
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-400" />

              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                1
              </Badge>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => (window.location.href = "/admin")}
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Admin</span>
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Admin User
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
