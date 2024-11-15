import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BalanceBarProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
};

const BalanceBar = ({ label, value, onChange }: BalanceBarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const percentage = value;
  const displayValue = value.toFixed(1);

  const calculateNewValue = (clientY: number, rect: DOMRect) => {
    const height = rect.height;
    const relativeY = Math.max(0, Math.min(height, clientY - rect.top));
    const invertedPercentage = (1 - relativeY / height) * 100;
    return Math.round(invertedPercentage);
  };

  const handleDrag = (clientY: number) => {
    const container = document.getElementById(`bar-container-${label}`);
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const newValue = calculateNewValue(clientY, rect);
    
    const finalValue = Math.min(Math.max(0, newValue), 100);
    
    if (finalValue !== value) {
      onChange(finalValue);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleDrag(e.clientY);

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleDrag(e.clientY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="flex flex-col items-center justify-end h-[600px] w-full">
      <motion.div
        className="text-4xl font-bold text-white mb-4"
        animate={{ scale: isDragging ? 1.1 : 1 }}
      >
        {displayValue}
      </motion.div>
      
      <div 
        className={cn(
          "relative w-32 h-[400px] rounded-xl overflow-hidden mb-6",
          "bg-neutral-800/50 backdrop-blur-sm border border-neutral-800",
          isDragging && "ring-2 ring-blue-500"
        )}
        id={`bar-container-${label}`}
        onMouseDown={handleMouseDown}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <motion.div
          className="absolute bottom-0 w-full bg-blue-500"
          initial={{ height: '0%' }}
          animate={{ 
            height: `${percentage}%`,
            backgroundColor: value < 0 ? '#ef4444' : '#3b82f6'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/20" />
        </motion.div>
      </div>

      <h2 className="text-lg font-medium text-neutral-200 text-center h-12">
        {label}
      </h2>
    </div>
  );
};

export default BalanceBar;