
"use client";
import React, { ReactNode, useEffect, useRef } from 'react';
import BottomNavBar from '@/components/navigation/BottomNavBar';
import PlayerProfileHeader from '@/components/player/PlayerProfileHeader';
import ResourceDisplay from '@/components/game/ResourceDisplay';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Wallet, CreditCard, Landmark } from 'lucide-react'; 
import CoreDisplay from '@/components/core/CoreDisplay';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { playerProfile, connectWallet } = useGame();
  const audioRef = useRef<HTMLAudioElement>(null);
  // --- IMPORTANTE ---
  // Reemplaza esta URL con el ENLACE DIRECTO a tu archivo de música (ej. .mp3)
  const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; 

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      // Intentar reproducir. Los navegadores pueden bloquear el autoplay sin interacción del usuario.
      audioElement.play().catch(error => {
        console.warn("La reproducción automática del audio fue prevenida por el navegador:", error);
        // Aquí podrías, por ejemplo, mostrar un botón para que el usuario inicie la música manualmente.
      });
    }
    // Silenciar la música cuando el componente se desmonte (útil para HMR en desarrollo)
    return () => {
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
    };
  }, [musicUrl]); // Se vuelve a ejecutar si musicUrl cambia, aunque aquí es constante.

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Elemento de audio para la música de fondo */}
      <audio 
        ref={audioRef} 
        src={musicUrl} 
        loop 
        autoPlay 
        playsInline // Importante para la reproducción en línea en algunos navegadores móviles
        style={{ display: 'none' }} // El control de audio no necesita ser visible
      />

      <header className="sticky top-0 z-50 p-2 sm:p-3 bg-background/80 backdrop-blur-md shadow-md">
        <div className="container mx-auto flex items-center justify-between gap-2">
          {playerProfile && (
            <>
              <PlayerProfileHeader profile={playerProfile} />
              <div className="flex items-start gap-2"> {/* Changed to items-start for alignment */}
                <ResourceDisplay 
                  seasonResourceName={playerProfile ? playerProfile.seasonProgress[playerProfile.currentSeasonId]?.toString() ?? '0' : '0'} 
                  auronCount={playerProfile?.auron ?? 0} 
                />
                {!playerProfile.isWalletConnected && (
                  <div className="flex flex-col items-start gap-1 ml-2 pl-2 border-l border-border">
                    <p className="text-xs text-muted-foreground mb-0.5 font-semibold">Get Auron:</p>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-primary/20 border-primary text-primary-foreground hover:bg-primary/30 whitespace-nowrap text-xs sm:text-sm px-2 h-7 w-full justify-start"
                        onClick={connectWallet}
                      >
                      <Wallet className="mr-1.5 h-3.5 w-3.5 text-bright-gold" /> Connect Wallet
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled 
                        className="whitespace-nowrap text-xs sm:text-sm px-2 h-7 w-full justify-start text-muted-foreground/70"
                      >
                      <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Visa/Mastercard
                    </Button>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled 
                        className="whitespace-nowrap text-xs sm:text-sm px-2 h-7 w-full justify-start text-muted-foreground/70"
                      >
                      <Landmark className="mr-1.5 h-3.5 w-3.5" /> Bank Transfer
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-0 pb-[56px] sm:pb-[60px] pt-1"> {/* Adjusted padding for mobile */}
        {children}
      </main>
      
      {playerProfile && <CoreDisplay />}
      
      <BottomNavBar />
    </div>
  );
};

export default AppLayout;
