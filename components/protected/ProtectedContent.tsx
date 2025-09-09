"use client";

import { useNavigation } from "@/providers/NavigationContext";
export default function ProtectedContent() {
  const { currentPage } = useNavigation();
  return currentPage.component;
}
