import React from "react";
import { motion } from "motion/react";

/**
 * Gauge Visualization Options for Site Detail View
 * 
 * This file contains 4 different gauge designs for you to choose from.
 * Pick the one you like best and replace the current gauge in SiteDetailViewNew.tsx
 */

interface GaugeProps {
  value: number; // 0-100
  label?: string;
  siteId: string;
}

// ============================================================================
// OPTION 1: Circular Progress Ring (Modern & Clean)
// ============================================================================
export function CircularProgressGauge({ value, label = "Overall Site Fit", siteId }: GaugeProps) {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const offset = circumference - (value / 100) * circumference;
  
  // Dynamic color based on value
  const getColor = () => {
    if (value >= 85) return "#22c55e"; // green
    if (value >= 70) return "#84cc16"; // lime
    if (value >= 50) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <defs>
          <linearGradient id={`circleGradient-${siteId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: getColor(), stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: getColor(), stopOpacity: 1 }} />
          </linearGradient>
          <filter id={`circleShadow-${siteId}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15"/>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle
          cx="72"
          cy="72"
          r="45"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx="72"
          cy="72"
          r="45"
          fill="none"
          stroke={`url(#circleGradient-${siteId})`}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          filter={`url(#circleShadow-${siteId})`}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          className="text-3xl font-bold"
          style={{ color: getColor() }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          {value}%
        </motion.div>
        <div className="text-[10px] text-gray-500 font-medium text-center px-2 mt-1">
          {label}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// OPTION 2: Radial Gauge with Tick Marks (Professional Dashboard Style)
// ============================================================================
export function RadialTickGauge({ value, label = "Overall Site Fit", siteId }: GaugeProps) {
  const angle = -135 + (value / 100) * 270; // -135° to 135° range
  
  return (
    <div className="relative w-40 h-28">
      <svg className="w-full h-full" viewBox="0 0 140 100">
        <defs>
          <linearGradient id={`radialGradient-${siteId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
            <stop offset="25%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
            <stop offset="75%" style={{ stopColor: '#84cc16', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Tick marks */}
        {[0, 25, 50, 75, 100].map((tick) => {
          const tickAngle = -135 + (tick / 100) * 270;
          const radians = (tickAngle * Math.PI) / 180;
          const innerRadius = 48;
          const outerRadius = tick % 50 === 0 ? 58 : 55;
          const x1 = 70 + innerRadius * Math.cos(radians);
          const y1 = 70 + innerRadius * Math.sin(radians);
          const x2 = 70 + outerRadius * Math.cos(radians);
          const y2 = 70 + outerRadius * Math.sin(radians);
          
          return (
            <g key={tick}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#94a3b8"
                strokeWidth={tick % 50 === 0 ? 2.5 : 1.5}
                strokeLinecap="round"
              />
              {tick % 50 === 0 && (
                <text
                  x={70 + 65 * Math.cos(radians)}
                  y={70 + 65 * Math.sin(radians)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[8px] fill-gray-500 font-semibold"
                >
                  {tick}
                </text>
              )}
            </g>
          );
        })}
        
        {/* Background arc */}
        <path
          d="M 20 70 A 50 50 0 1 1 120 70"
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="14"
          strokeLinecap="round"
        />
        
        {/* Colored arc */}
        <motion.path
          d="M 20 70 A 50 50 0 1 1 120 70"
          fill="none"
          stroke={`url(#radialGradient-${siteId})`}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="157"
          strokeDashoffset={157 - (value / 100) * 157}
          initial={{ strokeDashoffset: 157 }}
          animate={{ strokeDashoffset: 157 - (value / 100) * 157 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />
        
        {/* Needle */}
        <motion.g
          initial={{ rotate: -135 }}
          animate={{ rotate: angle }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          style={{ transformOrigin: "70px 70px" }}
        >
          <circle cx="70" cy="70" r="5" fill="#284497" />
          <path
            d="M 70 70 L 68 35 L 70 32 L 72 35 Z"
            fill="#284497"
            stroke="#1e3a8a"
            strokeWidth="0.5"
          />
        </motion.g>
      </svg>
      
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center">
        <motion.div
          className="text-2xl font-bold text-emerald-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          {value}%
        </motion.div>
        <div className="text-[9px] text-gray-500 font-medium whitespace-nowrap">
          {label}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// OPTION 3: Speedometer Style (Automotive/Dashboard Feel)
// ============================================================================
export function SpeedometerGauge({ value, label = "Overall Site Fit", siteId }: GaugeProps) {
  const angle = -120 + (value / 100) * 240;
  
  return (
    <div className="relative w-44 h-32">
      <svg className="w-full h-full" viewBox="0 0 160 120">
        <defs>
          <linearGradient id={`speedGradient-${siteId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
            <stop offset="20%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
            <stop offset="40%" style={{ stopColor: '#ca8a04', stopOpacity: 1 }} />
            <stop offset="60%" style={{ stopColor: '#65a30d', stopOpacity: 1 }} />
            <stop offset="80%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
          </linearGradient>
          <filter id={`speedShadow-${siteId}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25"/>
          </filter>
        </defs>
        
        {/* Outer ring */}
        <circle cx="80" cy="80" r="70" fill="none" stroke="#f1f5f9" strokeWidth="2" />
        
        {/* Speed segments */}
        {[...Array(24)].map((_, i) => {
          const segmentAngle = -120 + (i / 23) * 240;
          const radians = (segmentAngle * Math.PI) / 180;
          const innerR = 58;
          const outerR = i % 6 === 0 ? 68 : 65;
          
          return (
            <line
              key={i}
              x1={80 + innerR * Math.cos(radians)}
              y1={80 + innerR * Math.sin(radians)}
              x2={80 + outerR * Math.cos(radians)}
              y2={80 + outerR * Math.sin(radians)}
              stroke={i / 23 <= value / 100 ? `url(#speedGradient-${siteId})` : '#cbd5e1'}
              strokeWidth={i % 6 === 0 ? 3 : 2}
              strokeLinecap="round"
            />
          );
        })}
        
        {/* Value labels */}
        {[0, 50, 100].map((val) => {
          const labelAngle = -120 + (val / 100) * 240;
          const radians = (labelAngle * Math.PI) / 180;
          
          return (
            <text
              key={val}
              x={80 + 75 * Math.cos(radians)}
              y={80 + 75 * Math.sin(radians)}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[11px] fill-gray-600 font-bold"
            >
              {val}
            </text>
          );
        })}
        
        {/* Center hub */}
        <circle cx="80" cy="80" r="8" fill="#1e3a8a" filter={`url(#speedShadow-${siteId})`} />
        
        {/* Needle */}
        <motion.g
          initial={{ rotate: -120 }}
          animate={{ rotate: angle }}
          transition={{ duration: 2.5, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ transformOrigin: "80px 80px" }}
        >
          <path
            d="M 80 80 L 78 45 L 80 38 L 82 45 Z"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="1"
            filter={`url(#speedShadow-${siteId})`}
          />
          <circle cx="80" cy="80" r="5" fill="#991b1b" />
        </motion.g>
      </svg>
      
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
        <motion.div
          className="text-3xl font-bold text-emerald-600"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          {value}%
        </motion.div>
        <div className="text-[9px] text-gray-500 font-semibold uppercase tracking-wide">
          {label}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// OPTION 4: Minimalist Score Badge (Clean & Simple)
// ============================================================================
export function MinimalistScoreBadge({ value, label = "Overall Site Fit", siteId }: GaugeProps) {
  const getColor = () => {
    if (value >= 85) return { bg: "#dcfce7", border: "#22c55e", text: "#166534" };
    if (value >= 70) return { bg: "#fef9c3", border: "#eab308", text: "#854d0e" };
    if (value >= 50) return { bg: "#fed7aa", border: "#f59e0b", text: "#9a3412" };
    return { bg: "#fee2e2", border: "#ef4444", text: "#991b1b" };
  };
  
  const colors = getColor();
  const circumference = 2 * Math.PI * 28;
  
  return (
    <motion.div
      className="relative flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative">
        <svg width="80" height="80" className="transform -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="28"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="28"
            fill="none"
            stroke={colors.border}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (value / 100) * circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - (value / 100) * circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-3xl font-bold"
            style={{ color: colors.text }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
          >
            {value}
          </motion.div>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-[10px] text-gray-500 font-medium">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// Demo Component - View all options side by side
// ============================================================================
export function GaugeOptionsDemo() {
  const testValue = 87;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gauge Visualization Options</h1>
          <p className="text-gray-600">Choose your preferred design for the Site Detail View</p>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          {/* Option 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 border-2 border-transparent hover:border-blue-300 transition-colors">
            <div className="bg-blue-50 px-4 py-2 rounded-full">
              <h3 className="text-sm font-bold text-blue-900">Option 1: Circular Progress</h3>
            </div>
            <CircularProgressGauge value={testValue} siteId="demo-1" />
            <div className="text-xs text-gray-600 text-center max-w-xs">
              Modern, clean design. Perfect for dashboards. Easy to read at a glance.
            </div>
          </div>
          
          {/* Option 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 border-2 border-transparent hover:border-blue-300 transition-colors">
            <div className="bg-purple-50 px-4 py-2 rounded-full">
              <h3 className="text-sm font-bold text-purple-900">Option 2: Radial with Ticks</h3>
            </div>
            <RadialTickGauge value={testValue} siteId="demo-2" />
            <div className="text-xs text-gray-600 text-center max-w-xs">
              Professional dashboard style with precise tick marks. Great for data accuracy.
            </div>
          </div>
          
          {/* Option 3 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 border-2 border-transparent hover:border-blue-300 transition-colors">
            <div className="bg-green-50 px-4 py-2 rounded-full">
              <h3 className="text-sm font-bold text-green-900">Option 3: Speedometer</h3>
            </div>
            <SpeedometerGauge value={testValue} siteId="demo-3" />
            <div className="text-xs text-gray-600 text-center max-w-xs">
              Automotive-inspired design. Dynamic and engaging with segment indicators.
            </div>
          </div>
          
          {/* Option 4 */}
          <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-4 border-2 border-transparent hover:border-blue-300 transition-colors">
            <div className="bg-amber-50 px-4 py-2 rounded-full">
              <h3 className="text-sm font-bold text-amber-900">Option 4: Minimalist Badge</h3>
            </div>
            <MinimalistScoreBadge value={testValue} siteId="demo-4" />
            <div className="text-xs text-gray-600 text-center max-w-xs">
              Simple and elegant. Focuses on the score with minimal distraction.
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-sm text-gray-700">
          <h4 className="font-bold text-blue-900 mb-2">How to Use:</h4>
          <ol className="list-decimal list-inside space-y-1">
            <li>Pick your favorite gauge design from the options above</li>
            <li>Copy the corresponding component code</li>
            <li>Replace the current gauge in SiteDetailViewNew.tsx (around line 457)</li>
            <li>Import the chosen component at the top of the file</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
