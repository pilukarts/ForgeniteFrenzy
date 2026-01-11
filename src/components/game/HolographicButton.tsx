import React from "react";

type Props = {
  label: string;
  onClick?: () => void;
  active?: boolean;
  className?: string;
  ariaLabel?: string;
};

const HolographicButton: React.FC<Props> = ({ label, onClick, active = false, className = "", ariaLabel }) => {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      onClick={onClick}
      className={
        `w-40 md:w-48 px-3 py-2 rounded-lg text-base font-semibold text-white/95 transition-all duration-300 transform 
         hover:scale-105 focus:scale-105 focus:outline-none 
         bg-gradient-to-b from-white/5 via-white/3 to-transparent backdrop-blur-md
         border border-white/40 hover:border-white/80 focus:border-white/80
         shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:shadow-primary/20
         ${active ? "ring-2 ring-primary/60 border-primary/50" : ""} ${className}`
      }
    >
      <span className="relative z-10 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">{label}</span>
      {/* subtle holographic shine */}
      <span
        aria-hidden
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          boxShadow: active ? "0 8px 30px rgba(255,215,0,0.08)" : undefined,
          background: "linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.06) 40%, rgba(255,255,255,0.02) 70%)",
          mixBlendMode: "overlay",
        }}
      />
    </button>
  );
};

export default HolographicButton;
