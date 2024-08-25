"use client";

import { calculateLevelAndMaxXp } from "@/lib/utils";
import { motion } from "framer-motion";

export default function XpBar({ xp }: { xp: string }) {
  const { level, currentXp, maxXp } = calculateLevelAndMaxXp(Number(xp));
  const progress = (currentXp / maxXp) * 100;

  return (
    <div className="w-28 h-8 relative">
      <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-800 rounded-full overflow-hidden flex items-center">
        {/* Level indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">{level}</span>
          </div>
        </div>

        {/* XP Bar */}
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-blue-300"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />

        {/* XP Text */}
        <div className="absolute inset-0 flex items-center justify-end pr-4">
          <span className="text-white font-semibold text-xs">
            {maxXp - currentXp} XP
          </span>
        </div>
      </div>
    </div>
  );
}
