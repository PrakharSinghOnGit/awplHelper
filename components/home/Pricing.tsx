"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Users, Calculator, Gift } from "lucide-react";

interface TeamPricingProps {
  pricePerMember?: number;
  freeWeeks?: number;
  currency?: string;
}

export function Pricing({
  pricePerMember = 5,
  freeWeeks = 1,
  currency = "₹",
}: TeamPricingProps) {
  const [teamSize, setTeamSize] = useState(30);

  const weeklyPrice = teamSize * pricePerMember;
  const monthlyPrice = weeklyPrice * 4;
  const yearlyPrice = weeklyPrice * 52;
  const freeTrialValue = weeklyPrice * freeWeeks;

  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTeamSize(Math.max(1, value));
  };

  return (
    <section id="pricing" className="container py-20 max-w-4xl mx-auto px-3">
      <div className="text-center space-y-4 mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-tight sm:text-5xl"
        >
          Simple Team Pricing
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-muted-foreground text-md"
        >
          Pay only for what you use. {currency}
          {pricePerMember} per team member per week.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="grid gap-8 md:grid-cols-2"
      >
        {/* Calculator Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="relative overflow-hidden h-full flex gap-2 flex-col justify-around">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                <CardTitle>Calculate Your Price</CardTitle>
              </div>
              <CardDescription>
                Adjust your team size to see pricing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="team-size" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team Members
                </Label>
                <Input
                  id="team-size"
                  type="number"
                  value={teamSize}
                  onChange={handleTeamSizeChange}
                  min="1"
                  className="text-lg font-semibold"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Per Week
                  </span>
                  <span className="text-lg font-bold">
                    {currency}
                    {weeklyPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Per Month
                  </span>
                  <span className="text-lg font-bold">
                    {currency}
                    {monthlyPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Per Year
                  </span>
                  <span className="text-lg font-bold">
                    {currency}
                    {yearlyPrice}
                  </span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Formula: {teamSize} members × {currency}
                {pricePerMember}/week = {currency}
                {weeklyPrice}/week
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pricing Details Card */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="relative overflow-hidden border-primary/20">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg">
              <div className="flex items-center gap-1">
                <Gift className="h-3 w-3" />
                <span className="text-xs font-semibold">Free Trial</span>
              </div>
            </div>

            <CardHeader className="pb-4 pt-8">
              <CardTitle className="text-2xl">Get Started Today</CardTitle>
              <CardDescription>
                Start with {freeWeeks} week free for {teamSize} team members
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {currency}
                  {freeTrialValue}
                </div>
                <Badge variant="secondary" className="mb-4">
                  FREE for {freeWeeks} week{freeWeeks > 1 ? "s" : ""}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  No credit card required
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Pay only for active team members</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Scale up or down anytime</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Cancel anytime, no commitments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>24/7 customer support</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                Start Free Trial
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                After free trial: {currency}
                {weeklyPrice}/week for {teamSize} members
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full text-sm text-muted-foreground">
          <Calculator className="h-4 w-4" />
          <span>Need a custom plan? Contact our sales team</span>
        </div>
      </motion.div>
    </section>
  );
}
