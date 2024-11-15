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
      const changePerColumn = -valueDifference / 2;
      
      const newValues = {
        ...prev,
        [changedKey]: newValue,
      };

      newValues[otherKeys[0]] = Math.max(0, Math.min(100, prev[otherKeys[0]] + changePerColumn));
      newValues[otherKeys[1]] = Math.max(0, Math.min(100, prev[otherKeys[1]] + changePerColumn));

      const total = newValues[changedKey] + newValues[otherKeys[0]] + newValues[otherKeys[1]];
      if (total > 200) {
        newValues[changedKey] = 200 - (newValues[otherKeys[0]] + newValues[otherKeys[1]]);
      }

      return newValues;
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto flex flex-col items-center px-4 py-12">
        <motion.h1 
          className="text-5xl font-bold text-white mb-24"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Demo Quality Balance
        </motion.h1>
        
        <motion.div 
          className="flex gap-24 items-center justify-center w-full"
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