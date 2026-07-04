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
  rightOffset?: string;
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
  bottomButtons,
  rightButtons,
  className = "",
  rightOffset = "1.5rem",
  leftPanel,
  rightPanel,
  handLeftX = -0.3,
  handRightX = 1.3,
  handY = 0.62,
  auraRef,
}, ref) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [leftPos, setLeftPos] = useState<{ top: number; left: number } | null>(null);
  const [rightPos, setRightPos] = useState<{ top: number; left: number } | null>(null);

  const imgSrc = fullBodyUrl ?? avatarUrl ?? "/images/global/commander-man-full.png";

  const computeHandPositions = useCallback(() => {
    const wrapper = wrapperRef.current;
    const img = imgRef.current;
    if (!wrapper || !img) return;
    const wrapRect = wrapper.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();
    const imgLeft = imgRect.left - wrapRect.left;
    const imgTop = imgRect.top - wrapRect.top;
    const leftX = imgLeft + imgRect.width * handLeftX;
    const rightX = imgLeft + imgRect.width * handRightX;
    const y = imgTop + imgRect.height * handY;
    setLeftPos({ left: leftX, top: y });
    setRightPos({ left: rightX, top: y });
  }, [handLeftX, handRightX, handY]);

  useLayoutEffect(() => {
    computeHandPositions();
    const onResize = () => computeHandPositions();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [computeHandPositions]);

  const handleTap = async (ev?: React.MouseEvent | React.TouchEvent) => {
    await Promise.resolve(onTap?.(ev));
  };

  return (
    <div ref={wrapperRef} className={cn("commander-center relative z-20 w-full flex-grow flex items-center justify-center", className)}>
      {/* Dynamic Aura controlled by parent */}
      <div 
        ref={auraRef} 
        aria-hidden 
        className="absolute w-[450px] h-[450px] md:w-[600px] md:h-[600px] rounded-full bg-white/5 blur-[40px] pointer-events-none opacity-50" 
        style={{ transform: "translateY(5%)" }} 
      />

      <div ref={ref} className="relative flex flex-col items-center">
        <div className="commander-img-container relative transition-transform duration-150">
          <img
            ref={imgRef}
            src={imgSrc}
            alt="Commander full body"
            className="w-auto max-h-[65vh] object-contain object-bottom pointer-events-none drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]"
            draggable={false}
            onLoad={() => computeHandPositions()}
          />

          <button
            type="button"
            aria-label="Tap commander"
            onClick={handleTap}
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
            transform: "translate(-100%, -50%)",
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
            transform: "translate(0%, -50%)",
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
