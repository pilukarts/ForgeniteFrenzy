import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { assetPath } from '@/lib/assetPath';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CommanderPortraitProps {
  onTap: () => void;
  onLogoTap: () => void;
}

const CommanderPortrait: React.FC<CommanderPortraitProps> = ({ onTap, onLogoTap }) => {
  const { playerProfile } = useGame();

  if (!playerProfile) {
    return null; // Or a loading skeleton
  }

  const commanderImage = playerProfile.commanderSex === 'male' 
    ? assetPath('/images/global/commander-man-full.png')
    : assetPath('/images/global/commander-woman-full.png');

  const dataAiHint = playerProfile.commanderSex === 'male' ? "male commander" : "female commander";

  const currentTierColor = playerProfile.currentTierColor || '45 100% 50%';

  const dynamicGlowStyle = {
    '--dynamic-commander-glow': currentTierColor,
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicGlowStyle}
      className="relative w-full h-full cursor-pointer group"
      onClick={onTap}
    >
      <motion.div 
        className="absolute inset-0 commander-aura-glow"
        style={{
            borderRadius: '50%',
        }}
      />

      <motion.div 
        className="relative w-full h-full rounded-full overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Image
          src={commanderImage}
          alt="Commander Portrait"
          data-ai-hint={dataAiHint}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-110 transition-transform duration-300"
          priority
        />
      </motion.div>
    </div>
  );
};

export default CommanderPortrait;
