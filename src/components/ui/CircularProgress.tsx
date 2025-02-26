'use client';

interface CircularProgressProps {
  value?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  strokeWidth?: number;
  showValue?: boolean;
  label?: string;
}

export function CircularProgress({
  value = 0,
  size = 'md',
  strokeWidth = 4,
  showValue = false,
  label
}: CircularProgressProps) {
  const sizes = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  };

  const diameter = sizes[size];
  const radius = (diameter - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        className="transform -rotate-90"
        width={diameter}
        height={diameter}
      >
        {/* Background circle */}
        <circle
          className="text-gray-700"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={diameter / 2}
          cy={diameter / 2}
        />
        {/* Progress circle */}
        <circle
          className="text-blue-500 transition-all duration-300 ease-in-out"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={diameter / 2}
          cy={diameter / 2}
        />
      </svg>
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-medium">
            {label || `${Math.round(value)}%`}
          </span>
        </div>
      )}
    </div>
  );
}
