"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  CreditCard, 
  Shield, 
  Search, 
  Download, 
  Eye, 
  Edit3, 
  UserCheck,
  UserX,
  BarChart3,
  TrendingUp,
  DollarSign,
  Calendar,
  Building2,
  Phone,
  Mail
} from "lucide-react";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "subscriptions">("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const { toast } = useToast();

  // Mock data - in real app this would come from API
  const users = [
    {
      id: 1,
      username: "John Mensah",
      email: "j.mensah@ecg.com.gh",
      companyName: "ECG Accra Regional Office",
      contactNumber: "+233 24 567 8901",
      role: "manager",
      isActive: true,
      createdAt: "2024-12-01",
      lastLoginAt: "2025-01-01",
      subscription: {
        status: "active",
        type: "yearly",
        endDate: "2025-12-01",
        lastPayment: "$1,200",
      }
    },
    {
      id: 2,
      username: "Sarah Asante",
      email: "s.asante@ecg.com.gh",
      companyName: "ECG Tema Operations",
      contactNumber: "+233 20 123 4567",
      role: "manager",
      isActive: true,
      createdAt: "2024-11-15",
      lastLoginAt: "2024-12-30",
      subscription: {
        status: "active",
        type: "monthly",
        endDate: "2025-02-15",
        lastPayment: "$120",
      }
    },
    {
      id: 3,
      username: "Michael Osei",
      email: "m.osei@ecg.com.gh",
      companyName: "ECG Kumasi District",
      contactNumber: "+233 54 987 6543",
      role: "manager",
      isActive: false,
      createdAt: "2024-10-10",
      lastLoginAt: "2024-12-20",
      subscription: {
        status: "expired",
        type: "yearly",
        endDate: "2024-12-20",
        lastPayment: "$1,200",
      }
    },
  ];

  const subscriptionStats = {
    totalRevenue: 15600,
    activeSubscriptions: 12,
    expiredSubscriptions: 3,
    monthlyRecurring: 8640,
    yearlySubscriptions: 8,
    monthlySubscriptions: 4,
  };

  const handleUserAction = (action: string, userId: number) => {
    toast({
      title: `User ${action}`,
      description: `Action performed successfully for user ID: ${userId}`,
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "active" && user.isActive) ||
                         (filterStatus === "inactive" && !user.isActive) ||
                         (filterStatus === "expired" && user.subscription.status === "expired");
    
    return matchesSearch && matchesFilter;
  });

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${subscriptionStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{subscriptionStats.activeSubscriptions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Monthly Recurring</p>
                <p className="text-2xl font-bold text-gray-900">${subscriptionStats.monthlyRecurring.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Yearly Subscriptions</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{subscriptionStats.yearlySubscriptions}</Badge>
                  <span className="text-sm font-medium">${(subscriptionStats.yearlySubscriptions * 1200).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Subscriptions</span>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">{subscriptionStats.monthlySubscriptions}</Badge>
                  <span className="text-sm font-medium">${(subscriptionStats.monthlySubscriptions * 120).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">New subscription: Sarah Asante</span>
                <span className="text-xs text-gray-500">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Payment received: John Mensah</span>
                <span className="text-xs text-gray-500">1 day ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm">Subscription expired: Michael Osei</span>
                <span className="text-xs text-gray-500">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Users
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>ECG Manager Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">{user.username}</h3>
                          <Badge variant={user.isActive ? "default" : "secondary"}>
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <Badge 
                            variant={user.subscription.status === "active" ? "default" : "destructive"}
                          >
                            {user.subscription.status}
                          </Badge>
                        </div>
                        <div className="mt-1 space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="mr-1 h-3 w-3" />
                            {user.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Building2 className="mr-1 h-3 w-3" />
                            {user.companyName}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="mr-1 h-3 w-3" />
                            {user.contactNumber}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{user.subscription.type} subscription</p>
                        <p className="text-sm text-gray-600">Ends: {user.subscription.endDate}</p>
                        <p className="text-sm text-gray-600">Last payment: {user.subscription.lastPayment}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 lg:ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUserAction("viewed", user.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUserAction("edited", user.id)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={user.isActive ? "outline" : "default"}
                      onClick={() => handleUserAction(user.isActive ? "deactivated" : "activated", user.id)}
                    >
                      {user.isActive ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSubscriptions = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id} className="border-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{user.username}</h3>
                      <p className="text-sm text-gray-600">{user.companyName}</p>
                    </div>
                    <Badge 
                      variant={user.subscription.status === "active" ? "default" : "destructive"}
                    >
                      {user.subscription.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Plan:</span>
                      <span className="text-sm font-medium">{user.subscription.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">End Date:</span>
                      <span className="text-sm font-medium">{user.subscription.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Last Payment:</span>
                      <span className="text-sm font-medium">{user.subscription.lastPayment}</span>
                    </div>
                    <div className="pt-3 border-t">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <CreditCard className="mr-1 h-3 w-3" />
                          Billing
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="mr-1 h-3 w-3" />
                          Extend
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Shield className="mr-3 h-8 w-8 text-ecg-blue" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Manage ECG manager accounts and subscription oversight
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-ecg-blue text-white">Admin Access</Badge>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export All Data
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "users", label: "User Management", icon: Users },
                { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-ecg-blue text-ecg-blue"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "overview" && renderOverview()}
        {activeTab === "users" && renderUsers()}
        {activeTab === "subscriptions" && renderSubscriptions()}
      </div>
    </div>
  );
}