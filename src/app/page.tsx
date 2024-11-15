"use client";

import { useState, useEffect } from "react";
import BalanceBar from "@/components/BalanceBar";
import { motion } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState({
    impression: 90,
    speed: 90,
    learning: 20
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (changedKey: keyof typeof values) => (newValue: number) => {
    setValues(prev => {
      const valueDifference = newValue - prev[changedKey];
      const otherKeys = Object.keys(prev).filter(k => k !== changedKey) as Array<keyof typeof values>;
      
      const newValues = {
        ...prev,
        [changedKey]: newValue,
      };

      // If one of the other columns is at 0 or 100, distribute changes only to the remaining column
      const otherCol1 = prev[otherKeys[0]];
      const otherCol2 = prev[otherKeys[1]];

      if (otherCol1 === 0 || otherCol1 === 100) {
        // Distribute all change to otherCol2
        newValues[otherKeys[1]] = Math.max(0, Math.min(100, otherCol2 - valueDifference));
        newValues[otherKeys[0]] = otherCol1; // Keep at 0 or 100
      } else if (otherCol2 === 0 || otherCol2 === 100) {
        // Distribute all change to otherCol1
        newValues[otherKeys[0]] = Math.max(0, Math.min(100, otherCol1 - valueDifference));
        newValues[otherKeys[1]] = otherCol2; // Keep at 0 or 100
      } else {
        // Normal case: distribute evenly
        const changePerColumn = -valueDifference / 2;
        newValues[otherKeys[0]] = Math.max(0, Math.min(100, otherCol1 + changePerColumn));
        newValues[otherKeys[1]] = Math.max(0, Math.min(100, otherCol2 + changePerColumn));
      }

      // Ensure total doesn't exceed 200
      const total = newValues[changedKey] + newValues[otherKeys[0]] + newValues[otherKeys[1]];
      if (total > 200) {
        // If we're over 200, reduce the changed column to make it exactly 200
        newValues[changedKey] = 200 - (newValues[otherKeys[0]] + newValues[otherKeys[1]]);
      }

      return newValues;
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto flex flex-col items-center px-4 py-12 max-w-7xl">
        <motion.h1 
          className="text-5xl font-bold text-white mb-24"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Demo Quality Balance
        </motion.h1>
        
        <motion.div 
          className="grid grid-cols-3 gap-4 w-full max-w-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <BalanceBar
            label="Demots imponeringsnivå"
            value={values.impression}
            onChange={handleChange("impression")}
          />
          <BalanceBar
            label="Hastigheten som demot görs på"
            value={values.speed}
            onChange={handleChange("speed")}
          />
          <BalanceBar
            label="Meningsfullt utlärande av processen"
            value={values.learning}
            onChange={handleChange("learning")}
          />
        </motion.div>
      </main>
    </div>
  );
}