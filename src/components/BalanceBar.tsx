import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BalanceBarProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  totalValue: number;
  otherValues: number[];
};

const BalanceBar = ({ label, value, onChange, totalValue, otherValues }: BalanceBarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = (value / totalValue) * 100;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handleMouseMove(e);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const container = document.getElementById("bar-container");
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const height = rect.height;
    const y = e.clientY - rect.top;
    const percentage = Math.max(0, Math.min(100, (1 - y / height) * 100));
    const newValue = Math.round((percentage / 100) * totalValue);
    
    // Ensure total doesn't exceed 99
    const otherSum = otherValues.reduce((a, b) => a + b, 0);
    const maxAllowed = totalValue - otherSum;
    const finalValue = Math.min(newValue, maxAllowed);
    
    onChange(finalValue);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-lg font-medium">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
      <motion.div
        className={cn(
          "w-24 bg-neutral-200 dark:bg-neutral-800 rounded-t-lg cursor-pointer relative",
          isDragging && "cursor-grabbing"
        )}
        style={{ height: "400px" }}
        onMouseDown={handleMouseDown}
        id="bar-container"
      >
        <motion.div
          className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg"
          animate={{ height: `${percentage}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </motion.div>
    </div>
  );
};

export default BalanceBar;