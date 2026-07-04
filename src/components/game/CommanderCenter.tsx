
"use client";
import React, { useRef, useEffect, useCallback, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  fullBodyUrl?: string;
  onTap?: (ev?: React.MouseEvent | React.TouchEvent) => void | Promise<void>;
  className?: string;
  leftPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  handLeftX?: number;
  handRightX?: number;
  handY?: number;
  auraRef?: React.RefObject<HTMLDivElement>;
};

const CommanderCenter = forwardRef<HTMLDivElement, Props>(({
  fullBodyUrl,
  onTap,
  className = "",
  leftPanel,
  rightPanel,
  handLeftX = -0.6,
  handRightX = 1.6,
  handY = 0.45, 
  auraRef,
}, ref) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [leftPos, setLeftPos] = useState<{ top: number; left: number } | null>(null);
  const [rightPos, setRightPos] = useState<{ top: number; left: number } | null>(null);

  const imgSrc = fullBodyUrl || "https://picsum.photos/seed/cmdr_fallback/600/1000";

  const computePositions = useCallback(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;
    const wrapRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    
    if (imgRect.width === 0) return;

    const imgLeft = imgRect.left - wrapRect.left;
    const imgTop = imgRect.top - wrapRect.top;
    
    setLeftPos({ 
      left: imgLeft + imgRect.width * handLeftX, 
      top: imgTop + imgRect.height * handY 
    });
    setRightPos({ 
      left: imgLeft + imgRect.width * handRightX, 
      top: imgTop + imgRect.height * handY 
    });
  }, [handLeftX, handRightX, handY]);

  useEffect(() => {
    computePositions();
    window.addEventListener("resize", computePositions);
    return () => window.removeEventListener("resize", computePositions);
  }, [computePositions]);

  return (
    <div ref={wrapperRef} className={cn("commander-center relative z-20 w-full flex-grow flex items-center justify-center overflow-visible", className)}>
      {/* Aura de resplandor dinámico */}
      <div 
        ref={auraRef} 
        aria-hidden 
        className="absolute w-[550px] h-[550px] md:w-[850px] md:h-[850px] rounded-full bg-primary/20 blur-[100px] pointer-events-none opacity-60" 
        style={{ transform: "translateY(5%)" }} 
      />

      <div ref={ref} className="relative flex flex-col items-center">
        <div className="commander-img-container relative transition-all duration-300">
          <img
            ref={imgRef}
            src={imgSrc}
            alt="Commander"
            className="w-auto max-h-[68vh] min-h-[400px] object-contain object-bottom pointer-events-none drop-shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            draggable={false}
            onLoad={computePositions}
            onError={() => console.error("Error loading commander image")}
          />
          <button
            type="button"
            aria-label="Tap commander"
            onClick={() => onTap?.()}
            className="absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer z-30"
          />
        </div>
      </div>

      {leftPanel && (
        <div
          className="absolute z-40 pointer-events-auto transition-all duration-700 ease-out"
          style={leftPos ? {
            left: leftPos.left,
            top: leftPos.top,
            transform: "translate(-50%, -50%)",
          } : { left: '10%', top: '40%', transform: "translate(-50%, -50%)" }}
        >
          {leftPanel}
        </div>
      )}

      {rightPanel && (
        <div
          className="absolute z-40 pointer-events-auto transition-all duration-700 ease-out"
          style={rightPos ? {
            left: rightPos.left,
            top: rightPos.top,
            transform: "translate(-50%, -50%)",
          } : { right: '10%', top: '40%', transform: "translate(50%, -50%)" }}
        >
          {rightPanel}
        </div>
      )}
    </div>
  );
});

CommanderCenter.displayName = "CommanderCenter";
export default CommanderCenter;
