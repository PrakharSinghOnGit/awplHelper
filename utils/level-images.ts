import { LevelProp } from "./awpl.helper";

// Mapping of levels to available images
export const levelImageMap: Record<string, string> = {
  Bronze: "/Bronze.png",
  Silver: "/Silver.png",
  Gold: "/Gold.png",
  Diamond: "/Diamond.png",
  "Royal Diamond": "/Royal.png",
  "Crown Diamond": "/Royal0.png",
  // Add more mappings as you get more images
  // For levels without specific images, we'll use a fallback
};

// Get image for a level with fallback logic
export function getLevelImage(level: LevelProp): string {
  // Direct mapping
  if (levelImageMap[level]) {
    return levelImageMap[level];
  }

  // Fallback logic based on level hierarchy
  const levelIndex = [
    "Fresher",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Emerald",
    "Topaz",
    "Ruby Star",
    "Sapphire",
    "Star Sapphire",
    "Diamond",
    "Blue Diamond",
    "Black Diamond",
    "Royal Diamond",
    "Crown Diamond",
    "Ambassador",
    "Royal Ambassador",
    "Crown Ambassador",
    "Brand Ambassador",
  ].indexOf(level);

  // Use closest available image based on hierarchy
  if (levelIndex >= 14) return "/Royal0.png"; // Crown Diamond and above
  if (levelIndex >= 13) return "/Royal.png"; // Royal Diamond
  if (levelIndex >= 10) return "/Diamond.png"; // Diamond levels
  if (levelIndex >= 2) return "/Gold.png"; // Gold and above
  if (levelIndex >= 1) return "/Silver.png"; // Silver and Bronze

  return "/Bronze.png"; // Default fallback
}

// Get rarity/tier for visual effects
export function getLevelTier(
  level: LevelProp
): "common" | "rare" | "epic" | "legendary" | "mythic" {
  const levelIndex = [
    "Fresher",
    "Bronze",
    "Silver",
    "Gold",
    "Platinum",
    "Emerald",
    "Topaz",
    "Ruby Star",
    "Sapphire",
    "Star Sapphire",
    "Diamond",
    "Blue Diamond",
    "Black Diamond",
    "Royal Diamond",
    "Crown Diamond",
    "Ambassador",
    "Royal Ambassador",
    "Crown Ambassador",
    "Brand Ambassador",
  ].indexOf(level);

  if (levelIndex >= 16) return "mythic"; // Ambassador levels
  if (levelIndex >= 13) return "legendary"; // Royal Diamond and above
  if (levelIndex >= 10) return "epic"; // Diamond levels
  if (levelIndex >= 5) return "rare"; // Emerald and above
  return "common"; // Bronze, Silver, Gold, Platinum
}

// Get level colors for theming
export function getLevelColors(tier: ReturnType<typeof getLevelTier>) {
  switch (tier) {
    case "mythic":
      return {
        primary: "from-purple-500 via-pink-500 to-red-500",
        secondary: "from-purple-200 to-pink-200",
        glow: "shadow-purple-500/50",
        text: "text-purple-100",
        border: "border-purple-400",
      };
    case "legendary":
      return {
        primary: "from-yellow-400 via-orange-500 to-red-500",
        secondary: "from-yellow-200 to-orange-200",
        glow: "shadow-orange-500/50",
        text: "text-orange-100",
        border: "border-orange-400",
      };
    case "epic":
      return {
        primary: "from-blue-500 via-purple-500 to-indigo-600",
        secondary: "from-blue-200 to-purple-200",
        glow: "shadow-blue-500/50",
        text: "text-blue-100",
        border: "border-blue-400",
      };
    case "rare":
      return {
        primary: "from-green-400 via-emerald-500 to-teal-600",
        secondary: "from-green-200 to-emerald-200",
        glow: "shadow-green-500/50",
        text: "text-green-100",
        border: "border-green-400",
      };
    default: // common
      return {
        primary: "from-gray-400 via-gray-500 to-gray-600",
        secondary: "from-gray-200 to-gray-300",
        glow: "shadow-gray-500/50",
        text: "text-gray-100",
        border: "border-gray-400",
      };
  }
}
