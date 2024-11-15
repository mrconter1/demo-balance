"use client";

import { useState } from "react";
import BalanceBar from "@/components/BalanceBar";

export default function Home() {
  const [values, setValues] = useState({
    impression: 33,
    speed: 33,
    learning: 33
  });

  const handleChange = (key: keyof typeof values) => (newValue: number) => {
    const otherKeys = Object.keys(values).filter(k => k !== key) as Array<keyof typeof values>;
    const otherSum = otherKeys.reduce((sum, k) => sum + values[k], 0);
    
    // Ensure total is 99
    const remaining = 99 - newValue;
    const ratio = remaining / otherSum;
    
    setValues(prev => ({
      ...prev,
      [key]: newValue,
      [otherKeys[0]]: Math.round(prev[otherKeys[0]] * ratio),
      [otherKeys[1]]: Math.round(prev[otherKeys[1]] * ratio)
    }));
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-white dark:bg-neutral-900">
      <h1 className="text-4xl font-bold mb-12">Demo Quality Balance</h1>
      
      <div className="flex gap-12 items-end">
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
      </div>
      
      <div className="mt-8 text-lg">
        Total: {values.impression + values.speed + values.learning}
      </div>
    </main>
  );
}