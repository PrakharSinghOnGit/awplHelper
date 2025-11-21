"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Crown,
  Zap,
  Shield,
  CreditCard,
  Calendar,
  TrendingUp,
  Users,
  Target,
  Download,
} from "lucide-react";
import { toast } from "sonner";

type PricingTier = {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "outline" | "secondary";
};

export default function Payment() {
  // Mock current subscription - in production this would come from your database
  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );

  const pricingTiers: PricingTier[] = [
    {
      name: "Free",
      price: 0,
      period: "forever",
      description: "Perfect for getting started with basic team management",
      features: [
        "Up to 5 team members",
        "Basic level tracking",
        "Email support",
        "7-day data retention",
        "Mobile responsive",
      ],
      icon: <Users className="h-6 w-6" />,
      buttonText: currentPlan === "free" ? "Current Plan" : "Downgrade",
      buttonVariant: currentPlan === "free" ? "outline" : "secondary",
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? 19 : 190,
      period: billingCycle === "monthly" ? "per month" : "per year",
      description: "For growing teams that need advanced features",
      features: [
        "Up to 50 team members",
        "Advanced analytics",
        "Priority email support",
        "Unlimited data retention",
        "Payment tracking",
        "Target management",
        "Export data (CSV/PDF)",
        "Custom reports",
      ],
      icon: <Zap className="h-6 w-6" />,
      popular: true,
      buttonText: currentPlan === "pro" ? "Current Plan" : "Upgrade to Pro",
      buttonVariant: currentPlan === "pro" ? "outline" : "default",
    },
    {
      name: "Enterprise",
      price: billingCycle === "monthly" ? 49 : 490,
      period: billingCycle === "monthly" ? "per month" : "per year",
      description: "For large organizations with custom needs",
      features: [
        "Unlimited team members",
        "Advanced analytics & AI insights",
        "24/7 priority support",
        "Custom integrations",
        "API access",
        "Dedicated account manager",
        "Custom training sessions",
        "SLA guarantee",
        "Advanced security features",
        "White-label options",
      ],
      icon: <Crown className="h-6 w-6" />,
      buttonText:
        currentPlan === "enterprise" ? "Current Plan" : "Contact Sales",
      buttonVariant: currentPlan === "enterprise" ? "outline" : "default",
    },
  ];

  const handleUpgrade = (planName: string) => {
    if (planName.toLowerCase() === currentPlan) {
      toast.info("You're already on this plan");
      return;
    }

    if (planName === "Enterprise") {
      toast.info("Please contact sales@awplhelper.com for Enterprise plan");
      return;
    }

    // Mock upgrade - in production this would integrate with Stripe/payment processor
    toast.success(`Upgrading to ${planName} plan...`);
    setTimeout(() => {
      setCurrentPlan(planName.toLowerCase());
      toast.success(`Successfully upgraded to ${planName}!`);
    }, 1500);
  };

  const getCurrentPlanDetails = () => {
    const plan = pricingTiers.find(
      (tier) => tier.name.toLowerCase() === currentPlan
    );
    return plan || pricingTiers[0];
  };

  const currentPlanDetails = getCurrentPlanDetails();

  return (
    <div className="h-full overflow-auto">
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Billing & Subscription
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your subscription and billing information
          </p>
        </div>

        {/* Current Subscription Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-2">
                  Current Subscription
                  <Badge variant="default" className="ml-2">
                    {currentPlanDetails.name}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Your active plan and billing information
                </CardDescription>
              </div>
              <div className="text-primary">{currentPlanDetails.icon}</div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Current Plan</span>
                </div>
                <p className="text-2xl font-bold">
                  ${currentPlanDetails.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{currentPlanDetails.period}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Next Billing Date</span>
                </div>
                <p className="text-lg font-semibold">
                  {currentPlan === "free" ? "N/A" : "December 21, 2025"}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
                >
                  Active
                </Badge>
              </div>
            </div>

            {currentPlan !== "free" && (
              <div className="pt-4 border-t flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Invoice
                </Button>
                <Button variant="ghost" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Update Payment Method
                </Button>
                <Button
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  Cancel Subscription
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-lg">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "annual" ? "default" : "ghost"}
              size="sm"
              onClick={() => setBillingCycle("annual")}
            >
              Annual
              <Badge
                variant="secondary"
                className="ml-2 bg-green-500/20 text-green-700 dark:text-green-400"
              >
                Save 17%
              </Badge>
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {pricingTiers.map((tier) => (
            <Card
              key={tier.name}
              className={`relative ${
                tier.popular
                  ? "border-2 border-primary shadow-lg scale-105"
                  : "border"
              } ${
                tier.name.toLowerCase() === currentPlan
                  ? "ring-2 ring-primary"
                  : ""
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="px-4 py-1 bg-primary">Most Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-6">
                <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="min-h-12">
                  {tier.description}
                </CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">
                    /{tier.period.split(" ")[1] || tier.period}
                  </span>
                  {billingCycle === "annual" && tier.price > 0 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      ${(tier.price / 12).toFixed(2)}/month billed annually
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.buttonVariant}
                  size="lg"
                  disabled={tier.name.toLowerCase() === currentPlan}
                  onClick={() => handleUpgrade(tier.name)}
                >
                  {tier.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" />
                Secure Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                All transactions are secured with 256-bit SSL encryption. Your
                payment information is never stored on our servers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Flexible Billing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cancel anytime, no questions asked. Get a prorated refund for
                unused time on annual plans.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Money-Back Guarantee
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Not satisfied? Get a full refund within 30 days of your
                purchase, no questions asked.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">
                Can I change plans anytime?
              </h4>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately and you&apos;ll be charged or credited
                the prorated difference.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">
                What payment methods do you accept?
              </h4>
              <p className="text-sm text-muted-foreground">
                We accept all major credit cards (Visa, Mastercard, American
                Express), PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a setup fee?</h4>
              <p className="text-sm text-muted-foreground">
                No! There are no hidden fees or setup charges. You only pay the
                subscription price for your chosen plan.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
