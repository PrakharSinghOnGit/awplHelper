"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import Dashboard from "@/components/protected/dashboard/Dashboard";
import EditTeam from "@/components/protected/Team/EditTeam";
import LevelData from "@/components/protected/LevelData";
import TargetData from "@/components/protected/TargetData";
import ChequeData from "@/components/protected/ChequeData";
import Payment from "@/components/protected/Payment";
import Help from "@/components/protected/Help";

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

  useEffect(() => {
    const lastPage = localStorage.getItem("lastPage");
    if (lastPage) {
      const foundPage = pages.find((p) => p.name === lastPage);
      if (foundPage) {
        setCPage(foundPage);
      }
    }
  }, []);

  const setCurrentPage = (page: string) => {
    const foundPage = pages.find((p) => p.name === page);
    if (foundPage) {
      localStorage.setItem("lastPage", foundPage.name);
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
