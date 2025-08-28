"use client";

import { useNavigation } from "@/components/providers/NavigationContext";
export default function ProtectedContent() {
  const { currentPage } = useNavigation();
  return currentPage.component;
}
