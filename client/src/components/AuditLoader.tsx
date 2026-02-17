import { useEffect, useRef, useState, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import type { LoadingStep } from "@/lib/icons3d";

interface AuditLoaderProps {
  /** Array of loading steps with labels, descriptions, icons, and durations */
  steps: LoadingStep[];
  /** Whether the actual operation is complete (overrides timer) */
  isComplete?: boolean;
  /** Title shown above the loader */
  title?: string;
  /** Subtitle shown below the title */
  subtitle?: string;
  /** Optional callback when the visual animation completes */
  onAnimationComplete?: () => void;
}

/**
 * Premium loading component with:
 * - Circular SVG progress ring
 * - Accurate percentage counter (0-100%)
 * - Countdown timer based on step durations
 * - 3D icon animation cycling through steps
 * - Step-by-step progress indicators
 */
export default function AuditLoader({
  steps,
  isComplete = false,
  title = "Processing...",
  subtitle = "Please wait while we work on this",
  onAnimationComplete,
}: AuditLoaderProps) {
  const totalDuration = steps.reduce((sum, s) => sum + s.durationMs, 0);
  const startTimeRef = useRef(Date.now());
  const rafRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(Math.ceil(totalDuration / 1000));
  const hasCalledComplete = useRef(false);

  // Calculate which step we're on based on elapsed time
  const getStepForProgress = useCallback((pct: number) => {
    const elapsed = (pct / 100) * totalDuration;
    let cumulative = 0;
    for (let i = 0; i < steps.length; i++) {
      cumulative += steps[i].durationMs;
      if (elapsed < cumulative) return i;
    }
    return steps.length - 1;
  }, [steps, totalDuration]);

  // Animation loop using requestAnimationFrame for smooth progress
  useEffect(() => {
    if (isComplete && progress >= 100) return;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      let pct: number;

      if (isComplete) {
        // If the actual operation is done, fast-forward to 100%
        pct = Math.min(100, progress + 2);
      } else {
        // Natural progress based on estimated time, cap at 95% until isComplete
        pct = Math.min(95, (elapsed / totalDuration) * 100);
      }

      setProgress(pct);

      // Update current step
      const stepIdx = getStepForProgress(pct);
      setCurrentStepIndex(stepIdx);

      // Mark completed steps
      const newCompleted = new Set<number>();
      for (let i = 0; i < stepIdx; i++) {
        newCompleted.add(i);
      }
      setCompletedSteps(newCompleted);

      // Update countdown timer
      const remaining = Math.max(0, totalDuration - elapsed);
      setTimeRemaining(Math.ceil(remaining / 1000));

      if (pct >= 100 && !hasCalledComplete.current) {
        hasCalledComplete.current = true;
        onAnimationComplete?.();
        return;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isComplete, progress, totalDuration, getStepForProgress, onAnimationComplete]);

  // SVG circle parameters
  const size = 180;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const currentStep = steps[currentStepIndex] || steps[0];
  const displayPercent = Math.round(progress);

  // Format time remaining
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "Almost done...";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `~${mins}m ${secs}s remaining`;
    return `~${secs}s remaining`;
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-display font-bold text-gradient-gold mb-1">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Circular Progress with 3D Icon */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Background circle */}
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="oklch(0.22 0.02 270)"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="url(#goldGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-[stroke-dashoffset] duration-300 ease-out"
          />
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.85 0.14 80)" />
              <stop offset="50%" stopColor="oklch(0.78 0.14 80)" />
              <stop offset="100%" stopColor="oklch(0.7 0.12 55)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Outer glow ring */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            boxShadow: `0 0 ${20 + progress * 0.3}px oklch(0.78 0.14 80 / ${0.1 + progress * 0.003})`,
          }}
        />

        {/* 3D Icon in center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <img
            src={currentStep.icon}
            alt=""
            className="w-14 h-14 object-contain animate-bounce-slow drop-shadow-lg"
            style={{ animationDuration: "2s" }}
          />
          <div className="mt-1">
            <span className="text-2xl font-bold text-lux-gold tabular-nums">{displayPercent}</span>
            <span className="text-sm text-lux-gold/70">%</span>
          </div>
        </div>
      </div>

      {/* Current Step Info */}
      <div className="text-center max-w-sm">
        <p className="text-sm font-semibold text-foreground mb-0.5">{currentStep.label}</p>
        <p className="text-xs text-muted-foreground">{currentStep.description}</p>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 w-1.5 rounded-full bg-lux-gold animate-pulse" />
        <span className="text-xs text-muted-foreground tabular-nums">
          {isComplete ? "Finalizing..." : formatTime(timeRemaining)}
        </span>
      </div>

      {/* Step Progress Indicators */}
      <div className="w-full max-w-md space-y-2">
        {steps.map((step, i) => {
          const isActive = i === currentStepIndex;
          const isDone = completedSteps.has(i) || (isComplete && progress >= 100);
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-lux-gold/10 border border-lux-gold/20"
                  : isDone
                  ? "bg-lux-green/5 border border-lux-green/10"
                  : "bg-card/50 border border-transparent"
              }`}
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shrink-0">
                {isDone ? (
                  <div className="w-8 h-8 rounded-lg bg-lux-green/20 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-lux-green" />
                  </div>
                ) : (
                  <img
                    src={step.icon}
                    alt=""
                    className={`w-7 h-7 object-contain ${isActive ? "animate-pulse" : "opacity-40"}`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate ${
                  isActive ? "text-lux-gold" : isDone ? "text-lux-green" : "text-muted-foreground"
                }`}>
                  {step.label}
                </p>
              </div>
              {isActive && (
                <Badge variant="secondary" className="text-[10px] bg-lux-gold/10 text-lux-gold border-lux-gold/20 shrink-0">
                  In Progress
                </Badge>
              )}
              {isDone && (
                <Badge variant="secondary" className="text-[10px] bg-lux-green/10 text-lux-green border-lux-green/20 shrink-0">
                  Done
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
