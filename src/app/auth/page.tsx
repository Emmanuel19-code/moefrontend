"use client"
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
//import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Building2, Mail, Lock, User, Phone, CreditCard, Shield, Zap } from "lucide-react";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "signup" | "subscribe">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    companyName: "",
    contactNumber: "",
    subscriptionType: "yearly",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (mode === "login") {
        toast({
          title: "Login Successful",
          description: "Welcome back to ECG Transformer Monitoring",
        });
      } else if (mode === "signup") {
        setMode("subscribe");
        toast({
          title: "Account Created",
          description: "Please complete your subscription to access the system",
        });
        return;
      } else {
        toast({
          title: "Subscription Activated",
          description: "Your yearly subscription is now active. Redirecting to dashboard...",
        });
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        //variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const subscriptionPlans = [
    {
      id: "yearly",
      name: "Yearly Professional",
      price: "$1,200",
      period: "per year",
      features: [
        "Full transformer monitoring dashboard",
        "Real-time ArcGIS data synchronization",
        "Professional reporting suite",
        "Alert management system",
        "Mobile and desktop access",
        "Priority technical support",
        "Export capabilities",
        "Advanced analytics",
      ],
      recommended: true,
    },
    {
      id: "monthly",
      name: "Monthly Professional",
      price: "$120",
      period: "per month",
      features: [
        "Full transformer monitoring dashboard",
        "Real-time ArcGIS data synchronization",
        "Professional reporting suite",
        "Alert management system",
        "Mobile and desktop access",
        "Standard technical support",
      ],
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="bg-ecg-blue p-3 rounded-full mr-3">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ECG Transformer Monitoring</h1>
              <p className="text-gray-600">Professional M&E System for Electrical Infrastructure</p>
            </div>
          </div>
        </div>

        {mode === "subscribe" ? (
          // Subscription Selection
          <div className="space-y-6">
            <Card className="border-2 border-ecg-blue">
              <CardHeader>
                <CardTitle className="text-center text-xl">Choose Your Subscription Plan</CardTitle>
                <p className="text-center text-gray-600">Select a plan to access the ECG Transformer Monitoring System</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <Card 
                      key={plan.id} 
                      className={`relative border-2 cursor-pointer transition-all ${
                        formData.subscriptionType === plan.id 
                          ? 'border-ecg-blue bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleInputChange('subscriptionType', plan.id)}
                    >
                      {plan.recommended && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-ecg-green text-white">Recommended</Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <div className="text-3xl font-bold text-ecg-blue">
                          {plan.price}
                          <span className="text-sm font-normal text-gray-600 ml-1">{plan.period}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <div className="w-1.5 h-1.5 bg-ecg-green rounded-full mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="mt-8">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4 flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Payment Information (Demo)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingName">Billing Name</Label>
                        <Input
                          id="billingName"
                          placeholder="John Doe"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setMode("signup")}
                    >
                      Back to Account Setup
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="bg-ecg-blue hover:bg-blue-700"
                    >
                      {isLoading ? (
                        <>
                          <div className="spinner mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Subscribe Now
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Login/Signup Form
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                {mode === "login" ? "Welcome Back" : "Create Account"}
              </CardTitle>
              <p className="text-center text-gray-600">
                {mode === "login" 
                  ? "Sign in to access your monitoring dashboard" 
                  : "Join ECG Transformer Monitoring System"
                }
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <>
                    <div>
                      <Label htmlFor="username">Full Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="companyName">Company/Organization</Label>
                      <div className="relative mt-1">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="ECG Regional Office"
                          value={formData.companyName}
                          onChange={(e) => handleInputChange("companyName", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="contactNumber">Contact Number</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="contactNumber"
                          type="tel"
                          placeholder="+233 XX XXX XXXX"
                          value={formData.contactNumber}
                          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="manager@ecg.com.gh"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-ecg-blue hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <div className="spinner mr-2" />
                      {mode === "login" ? "Signing In..." : "Creating Account..."}
                    </>
                  ) : (
                    <>
                      {mode === "login" ? "Sign In" : "Create Account"}
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                  <button
                    type="button"
                    onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="text-ecg-blue hover:underline font-medium"
                  >
                    {mode === "login" ? "Sign up" : "Sign in"}
                  </button>
                </p>
              </div>

              {mode === "login" && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Admin Access</p>
                      <p className="text-xs text-blue-600">
                        Admin users can oversee all ECG manager accounts and subscriptions
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 ECG Transformer Monitoring System. Professional M&E Solution.</p>
          <p>For technical support, contact your system administrator.</p>
        </div>
      </div>
    </div>
  );
}