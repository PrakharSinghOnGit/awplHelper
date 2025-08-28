"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import Dashboard from "@/components/dashboard/Dashboard";
import EditTeam from "@/components/dashboard/EditTeam";
import LevelData from "@/components/dashboard/LevelData";
import TargetData from "@/components/dashboard/TargetData";
import ChequeData from "@/components/dashboard/ChequeData";
import Payment from "@/components/dashboard/Payment";
import Help from "@/components/dashboard/Help";

type NavigationContextType = {
  currentPage: pageProp;
  setCurrentPage: (page: string) => void;
  pages: pageProp[];
};

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

type pageProp = {
  name: string;
  component: ReactNode;
};

const pages: pageProp[] = [
  { name: "Dashboard", component: <Dashboard /> },
  { name: "Team", component: <EditTeam /> },
  { name: "Level Data", component: <LevelData /> },
  { name: "Target Data", component: <TargetData /> },
  { name: "Cheque Data", component: <ChequeData /> },
  { name: "Billing", component: <Payment /> },
  { name: "Help", component: <Help /> },
];

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCPage] = useState<pageProp>({
    name: "Dashboard",
    component: <Dashboard />,
  });

  const setCurrentPage = (page: string) => {
    const foundPage = pages.find((p) => p.name === page);
    if (foundPage) {
      setCPage(foundPage);
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPage, setCurrentPage, pages }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within NavigationProvider");
  }
  return context;
}
