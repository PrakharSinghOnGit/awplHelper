"use Client";

import React from "react";
import { useNavigation } from "../providers/NavigationContext";

export const Title = () => {
  const { currentPage } = useNavigation();
  return (
    <div>
      <h1>{currentPage.name}</h1>
    </div>
  );
};
