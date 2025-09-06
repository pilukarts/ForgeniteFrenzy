
"use client";
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, UserCircle, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ALL_AVATARS } from '@/lib/gameData';
import { useToast } from '@/hooks/use-toast';


const ProfilePage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone, updatePlayerProfile } = useGame();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (playerProfile) {
      setName(playerProfile.name);
      setSelectedAvatar(playerProfile.avatarUrl || ALL_AVATARS.find(a => a.url.includes('Wq9PqxG') || a.url.includes('BOKoTIM'))!.url);
    }
  }, [playerProfile]);

  const handleSave = () => {
    if (playerProfile && name.trim()) {
      // Find the selected avatar object to determine the sex
      const avatarData = ALL_AVATARS.find(a => a.url === selectedAvatar);
      if (avatarData) {
        updatePlayerProfile(name.trim(), selectedAvatar, avatarData.sex);
      } else {
         toast({
            title: "Avatar Error",
            description: "Could not find selected avatar data. Please try again.",
            variant: "destructive",
        });
      }
    } else {
        toast({
            title: "Invalid Name",
            description: "Please enter a valid callsign.",
            variant: "destructive",
        });
    }
  };

  const handleUploadClick = () => {
    toast({
        title: "Feature Not Available",
        description: "Custom avatar uploads will be enabled in a future update.",
    });
  }

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return <IntroScreen />;

  const displayAvatars = ALL_AVATARS.filter(a => a.url.includes('Wq9PqxG') || a.url.includes('BOKoTIM'));


  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center">
            <UserCircle className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Commander Profile
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Customize your callsign and appearance.
          </p>
        </header>

        <div className="max-w-xl mx-auto space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Edit Callsign</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">Callsign</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-base h-11"
                />
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Select Avatar</CardTitle>
                <CardDescription>Choose an avatar that matches your style.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {displayAvatars.map((avatar) => (
                    <button
                        key={avatar.url}
                        onClick={() => setSelectedAvatar(avatar.url)}
                        className={cn(
                        "rounded-lg overflow-hidden border-2 transition-all",
                        selectedAvatar === avatar.url ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'
                        )}
                    >
                        <Image src={avatar.url} alt="Avatar" width={100} height={100} className="object-cover w-full h-auto aspect-square" data-ai-hint={avatar.hint}/>
                    </button>
                  ))}
                   <button
                    onClick={handleUploadClick}
                    className={cn(
                        "rounded-lg overflow-hidden border-2 transition-all bg-muted/30 hover:bg-muted/50 border-dashed border-muted-foreground/50",
                        "flex flex-col items-center justify-center aspect-square text-muted-foreground"
                        )}
                    aria-label="Upload custom avatar"
                    >
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8" />
                    <span className="text-xs mt-1">Upload</span>
                  </button>
              </div>
            </CardContent>
          </Card>
          
          <Button onClick={handleSave} className="w-full text-lg h-12" disabled={!name}>
              <Check className="mr-2 h-5 w-5"/>
              Save All Changes
          </Button>

        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
