import React from "react";
import Image from "next/image";

type Props = {
  countdown?: string;
  className?: string;
  alt?: string;
};

const ArkForgePanel: React.FC<Props> = ({ countdown = "00:00:00", className = "", alt = "Ark" }) => {
  return (
    <div className={`w-44 rounded-xl p-3 bg-[rgba(6,7,20,0.92)] border border-[rgba(255,255,255,0.04)] shadow-lg ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[rgba(255,255,255,0.02)] rounded-md flex items-center justify-center overflow-hidden">
          <Image
            src="/images/ark/star-forge-ark.png"
            alt={alt}
            width={48}
            height={48}
            className="object-contain rounded-md"
            draggable={false}
            unoptimized
          />
        </div>

        <div className="flex-1">
          <div className="text-xs text-gray-300">Ark Forge</div>
          <div className="font-mono font-semibold text-yellow-300 text-sm">{countdown}</div>
        </div>
      </div>
    </div>
  );
};

export default ArkForgePanel;
