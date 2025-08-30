import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import { LevelProp } from "@/utils/awpl.helper";
import {
  getLevelImage,
  getLevelTier,
  getLevelColors,
} from "@/utils/level-images";
import { motion, Variants } from "framer-motion";

const UserLevel = ({ rank }: { rank: LevelProp }) => {
  const tier = getLevelTier(rank);
  const colors = getLevelColors(tier);
  const imageSource = getLevelImage(rank);

  // Animation variants for different tiers
  const getAnimationVariants = (): Variants => {
    switch (tier) {
      case "mythic":
        return {
          initial: { scale: 0.8, opacity: 0, rotateY: -180 },
          animate: {
            scale: 1,
            opacity: 1,
            rotateY: 0,
            transition: {
              duration: 1.2,
              ease: "easeOut",
              scale: { type: "spring", stiffness: 100 },
            },
          },
          hover: {
            scale: 1.05,
            rotateY: 360,
            transition: { duration: 0.8 },
          },
        };
      case "legendary":
        return {
          initial: { scale: 0.8, opacity: 0, y: 50 },
          animate: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
              duration: 1,
              ease: "easeOut",
              scale: { type: "spring", stiffness: 120 },
            },
          },
          hover: {
            scale: 1.08,
            y: -10,
            transition: { duration: 0.3 },
          },
        };
      case "epic":
        return {
          initial: { scale: 0.9, opacity: 0 },
          animate: {
            scale: 1,
            opacity: 1,
            transition: {
              duration: 0.8,
              ease: "easeOut",
              scale: { type: "spring", stiffness: 140 },
            },
          },
          hover: {
            scale: 1.06,
            transition: { duration: 0.3 },
          },
        };
      case "rare":
        return {
          initial: { scale: 0.95, opacity: 0 },
          animate: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.6, ease: "easeOut" },
          },
          hover: {
            scale: 1.04,
            transition: { duration: 0.3 },
          },
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: { duration: 0.5 },
          },
          hover: {
            scale: 1.02,
            transition: { duration: 0.3 },
          },
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={variants}
      className="w-full max-w-sm mx-auto"
    >
      <Card
        className={`
        relative overflow-hidden 
        ${colors.border} border-2
        bg-gradient-to-br ${colors.primary}
        ${colors.glow} shadow-2xl
        transform transition-all duration-300
      `}
      >
        {/* Animated background effect for higher tiers */}
        {(tier === "mythic" || tier === "legendary") && (
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                `linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)`,
                `linear-gradient(225deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)`,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        )}

        <CardHeader className="text-center pb-2">
          <CardTitle
            className={`${colors.text} text-lg font-bold tracking-wide`}
          >
            Your Current Level
          </CardTitle>
          {tier !== "common" && (
            <motion.div
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                bg-gradient-to-r ${colors.secondary} text-gray-800 shadow-md`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {tier}
            </motion.div>
          )}
        </CardHeader>

        <CardContent className="flex flex-col items-center space-y-4 pb-6">
          {/* Image container with tier-specific effects */}
          <motion.div
            className="relative"
            whileHover={tier === "mythic" ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {/* Glow effect for higher tiers */}
            {tier !== "common" && (
              <motion.div
                className={`absolute inset-0 rounded-full ${colors.glow} blur-xl opacity-60`}
                animate={
                  tier === "mythic"
                    ? { scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }
                    : tier === "legendary"
                    ? { scale: [1, 1.1, 1] }
                    : {}
                }
                transition={{
                  duration: tier === "mythic" ? 2 : 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            )}

            <motion.div
              className="relative z-10 rounded-full p-2 bg-white/10 backdrop-blur-sm"
              initial={{ rotateY: 0 }}
              animate={tier === "mythic" ? { rotateY: [0, 360] } : {}}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Image
                width={200}
                height={200}
                src={imageSource}
                alt={rank}
                className="rounded-full object-cover shadow-2xl"
                priority
              />
            </motion.div>
          </motion.div>

          {/* Rank title with enhanced typography */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1
              className={`
              ${colors.text} text-2xl md:text-3xl font-bold tracking-wide
              drop-shadow-lg
              ${tier === "mythic" ? "animate-pulse" : ""}
            `}
            >
              {rank}
            </h1>

            {/* Subtitle with level index */}
            <motion.p
              className={`${colors.text} text-sm opacity-80 mt-1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.6 }}
            >
              Level{" "}
              {[
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
              ].indexOf(rank) + 1}
            </motion.p>
          </motion.div>

          {/* Special effects for top tiers */}
          {tier === "mythic" && (
            <motion.div
              className="flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-yellow-300 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserLevel;
