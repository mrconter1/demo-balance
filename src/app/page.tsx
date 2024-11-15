"use client";

import { useState, useEffect } from "react";
import BalanceBar from "@/components/BalanceBar";
import { motion } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [values, setValues] = useState({
    impression: 33,
    speed: 33,
    learning: 33
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleChange = (changedKey: keyof typeof values) => (newValue: number) => {
    setValues(prev => {
      // Calculate the total change
      const valueDifference = newValue - prev[changedKey];
      
      // Get the other two keys
      const otherKeys = Object.keys(prev).filter(k => k !== changedKey) as Array<keyof typeof values>;
      
      // Calculate the change per other column (exactly half of the difference)
      const changePerColumn = -valueDifference / 2;
      
      // Create the new state with even distribution
      const newValues = {
        ...prev,
        [changedKey]: newValue,
        [otherKeys[0]]: Math.max(0, prev[otherKeys[0]] + changePerColumn),
        [otherKeys[1]]: Math.max(0, prev[otherKeys[1]] + changePerColumn)
      };

      return newValues;
    });
  };

  // Calculate total for display
  const total = values.impression + values.speed + values.learning;

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
            totalValue={99}
            otherValues={[values.speed, values.learning]}
          />
          <BalanceBar
            label="Hastigheten som demot görs på"
            value={values.speed}
            onChange={handleChange("speed")}
            totalValue={99}
            otherValues={[values.impression, values.learning]}
          />
          <BalanceBar
            label="Meningsfullt utlärande av processen"
            value={values.learning}
            onChange={handleChange("learning")}
            totalValue={99}
            otherValues={[values.impression, values.speed]}
          />
        </motion.div>
        
        <motion.div 
          className="mt-12 text-xl text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Total: <span className="text-white">{total}</span>
        </motion.div>

        {/* Debug info */}
        <div className="fixed top-4 right-4 text-white text-sm opacity-50 space-y-1">
          <div>Impression: {values.impression}</div>
          <div>Speed: {values.speed}</div>
          <div>Learning: {values.learning}</div>
          <div>Total: {total}</div>
        </div>
      </main>
    </div>
  );
}