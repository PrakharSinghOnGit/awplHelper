import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { levels } from "@/types";
import React from "react";
import { cn } from "@/lib/utils";
import {
  Shield,
  ShieldCheck,
  Award,
  Gem,
  Diamond,
  Star,
  Sparkles,
  Crown,
  UserPlus,
} from "lucide-react";

const levelStyles: Record<
  levels,
  {
    card: string;
    title: string;
    icon: React.ReactNode;
  }
> = {
  Fresher: { card: "", title: "", icon: <UserPlus size={28} /> },
  Bronze: {
    card: "bg-yellow-800/20 border-yellow-700/40",
    title: "text-yellow-600",
    icon: <Shield size={28} />,
  },
  Silver: {
    card: "bg-slate-500/20 border-slate-400/40",
    title: "text-slate-400",
    icon: <ShieldCheck size={28} />,
  },
  Gold: {
    card: "bg-amber-500/20 border-amber-400/40",
    title: "text-amber-400 text-glow",
    icon: <Award size={28} />,
  },
  Platinum: {
    card: "bg-teal-500/20 border-teal-400/40",
    title: "text-teal-400 text-glow",
    icon: <Gem size={28} />,
  },
  Emerald: {
    card: "bg-emerald-500/20 border-emerald-400/40",
    title: "text-emerald-400 text-glow-md",
    icon: <Gem size={28} />,
  },
  Topaz: {
    card: "bg-orange-500/20 border-orange-400/40",
    title: "text-orange-400 text-glow-md",
    icon: <Gem size={28} />,
  },
  "Ruby Star": {
    card: "bg-rose-500/20 border-rose-400/40",
    title: "text-rose-400 text-glow-lg",
    icon: <Star size={28} />,
  },
  Sapphire: {
    card: "bg-blue-500/20 border-blue-400/40",
    title: "text-blue-400 text-glow-lg",
    icon: <Sparkles size={28} />,
  },
  "Star Sapphire": {
    card: "bg-indigo-500/20 border-indigo-400/40",
    title: "text-indigo-400 text-glow-lg",
    icon: <Sparkles size={28} />,
  },
  Diamond: {
    card: "bg-cyan-400/20 border-cyan-300/40",
    title: "text-cyan-300 text-glow-lg",
    icon: <Diamond size={28} />,
  },
  "Blue Diamond": {
    card: "bg-sky-400/20 border-sky-300/40",
    title: "text-sky-300 text-glow-lg",
    icon: <Diamond size={28} />,
  },
  "Black Diamond": {
    card: "bg-gray-400/20 border-gray-300/40",
    title: "text-gray-300 text-glow-lg",
    icon: <Diamond size={28} />,
  },
  "Royal Diamond": {
    card: "bg-purple-500/20 border-purple-400/40",
    title: "text-purple-400 text-glow-lg",
    icon: <Crown size={28} />,
  },
  "Crown Diamond": {
    card: "bg-fuchsia-500/20 border-fuchsia-400/40",
    title: "text-fuchsia-400 text-glow-lg",
    icon: <Crown size={28} />,
  },
  Ambassador: {
    card: "bg-gradient-to-r from-yellow-400 to-amber-600 animated-gradient border-yellow-400",
    title: "text-white text-glow-lg",
    icon: <Crown size={28} />,
  },
  "Royal Ambassador": {
    card: "bg-gradient-to-r from-rose-400 to-red-600 animated-gradient border-rose-400",
    title: "text-white text-glow-lg",
    icon: <Crown size={28} />,
  },
  "Crown Ambassador": {
    card: "bg-gradient-to-r from-indigo-400 to-purple-600 animated-gradient border-indigo-400",
    title: "text-white text-glow-lg",
    icon: <Crown size={28} />,
  },
  "Brand Ambassador": {
    card: "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animated-gradient border-cyan-400",
    title: "text-white text-glow-lg",
    icon: <Crown size={28} />,
  },
};

const LevelCard = ({ level }: { level: levels }) => {
  const styles = levelStyles[level] || levelStyles.Bronze;

  return (
    <Card className={cn("max-h-fit transition-all duration-300", styles.card)}>
      <CardHeader>
        <CardDescription>Current Rank</CardDescription>
        <CardTitle
          className={cn(
            "font-black text-3xl transition-all duration-300",
            styles.title
          )}
        >
          <div className="flex items-center gap-x-2">
            {styles.icon}
            <span>{level}</span>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default LevelCard;
