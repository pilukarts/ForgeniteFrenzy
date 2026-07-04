
"use client";
import React, { ReactNode, useRef, useLayoutEffect, useCallback, useState, forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonItem = { id: string; label: string; onClick?: () => void; icon?: React.ReactNode; };

type Props = {
  fullBodyUrl?: string;
  avatarUrl?: string;
  onAvatarClick?: () => void;
  onTap?: (ev?: React.MouseEvent | React.TouchEvent) => void | Promise<void>;
  bottomButtons?: ButtonItem[];
  rightButtons?: ButtonItem[];
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
  avatarUrl,
  onTap,
  className = "",
  leftPanel,
  rightPanel,
  handLeftX = -0.6,
  handRightX = 1.6,
  handY = 0.5,
  auraRef,
}, ref) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [leftPos, setLeftPos] = useState<{ top: number; left: number } | null>(null);
  const [rightPos, setRightPos] = useState<{ top: number; left: number } | null>(null);

  const imgSrc = fullBodyUrl || avatarUrl || "https://picsum.photos/seed/cmdr_fallback/600/1000";

  const computePositions = useCallback(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;
    const wrapRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
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

  useLayoutEffect(() => {
    computePositions();
    window.addEventListener("resize", computePositions);
    return () => window.removeEventListener("resize", computePositions);
  }, [computePositions]);

  return (
    <div ref={wrapperRef} className={cn("commander-center relative z-20 w-full flex-grow flex items-center justify-center", className)}>
      <div 
        ref={auraRef} 
        aria-hidden 
        className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full bg-white/5 blur-[50px] pointer-events-none opacity-40" 
        style={{ transform: "translateY(5%)" }} 
      />

      <div ref={ref} className="relative flex flex-col items-center">
        <div className="commander-img-container relative transition-transform duration-150">
          <img
            ref={imgRef}
            src={imgSrc}
            alt="Commander"
            className="w-auto max-h-[70vh] object-contain object-bottom pointer-events-none drop-shadow-[0_0_30px_rgba(0,0,0,0.9)]"
            draggable={false}
            onLoad={computePositions}
          />
          <button
            type="button"
            aria-label="Tap commander"
            onClick={() => onTap?.()}
            className="absolute inset-0 w-full h-full bg-transparent border-0 cursor-pointer z-30"
          />
        </div>
      </div>

      {leftPanel && leftPos && (
        <div
          className="absolute z-40 pointer-events-auto transition-all duration-500"
          style={{
            left: leftPos.left,
            top: leftPos.top,
            transform: "translate(-50%, -50%)",
          }}
        >
          {leftPanel}
        </div>
      )}

      {rightPanel && rightPos && (
        <div
          className="absolute z-40 pointer-events-auto transition-all duration-500"
          style={{
            left: rightPos.left,
            top: rightPos.top,
            transform: "translate(-50%, -50%)",
          }}
        >
          {rightPanel}
        </div>
      )}
    </div>
  );
});

CommanderCenter.displayName = "CommanderCenter";
export default CommanderCenter;
