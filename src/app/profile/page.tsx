
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
import { Check, UserCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const ALL_AVATARS = [
  // Female
  "https://i.imgur.com/J3tG1e4.png",
  "https://i.imgur.com/N39gTto.png",
  "https://i.imgur.com/jAcb5Uv.png",
  "https://i.imgur.com/HiT9E0O.png",
  // Male
  "https://i.imgur.com/gB3i4OQ.png",
  "https://i.imgur.com/aCZy34s.png",
  "https://i.imgur.com/9lV8iJ4.png",
  "https://i.imgur.com/dZkYqRk.png",
];


const ProfilePage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone, updatePlayerProfile } = useGame();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    if (playerProfile) {
      setName(playerProfile.name);
      setSelectedAvatar(playerProfile.avatarUrl || ALL_AVATARS[0]);
    }
  }, [playerProfile]);

  const handleSave = () => {
    if (playerProfile) {
      // Determine sex based on the selected avatar's URL to simplify things.
      const avatarSex = ALL_AVATARS.indexOf(selectedAvatar) >= 4 ? 'male' : 'female';
      updatePlayerProfile(name, selectedAvatar, avatarSex);
    }
  };

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return null;

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
                  {ALL_AVATARS.map((url) => (
                  <button
                      key={url}
                      onClick={() => setSelectedAvatar(url)}
                      className={cn(
                      "rounded-lg overflow-hidden border-2 transition-all",
                      selectedAvatar === url ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'
                      )}
                  >
                      <Image src={url} alt="Avatar" width={100} height={100} className="object-cover w-full h-auto aspect-square" data-ai-hint="commander portrait"/>
                  </button>
                  ))}
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
