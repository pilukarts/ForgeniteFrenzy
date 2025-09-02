
"use client";
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Edit, UserCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const MALE_AVATARS = [
  "https://i.imgur.com/gB3i4OQ.png",
  "https://i.imgur.com/83pL36g.png",
  "https://i.imgur.com/tQ4zJ2a.png",
  "https://i.imgur.com/iR322b2.png",
];

const FEMALE_AVATARS = [
  "https://i.imgur.com/J3tG1e4.png",
  "https://i.imgur.com/7L48yPE.png",
  "https://i.imgur.com/26Xn9A8.png",
  "https://i.imgur.com/K3tB9gH.png",
];


const ProfilePage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone, updatePlayerProfile, switchCommanderSex } = useGame();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    if (playerProfile) {
      setName(playerProfile.name);
      setSelectedAvatar(playerProfile.avatarUrl || (playerProfile.commanderSex === 'male' ? MALE_AVATARS[0] : FEMALE_AVATARS[0]));
    }
  }, [playerProfile]);

  const handleSave = () => {
    if (playerProfile) {
      updatePlayerProfile(name, selectedAvatar);
    }
  };

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return null;

  const currentAvatars = playerProfile.commanderSex === 'male' ? MALE_AVATARS : FEMALE_AVATARS;

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

        <Card className="max-w-xl mx-auto">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg">Callsign</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-base h-11"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-lg">Select Avatar</Label>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {currentAvatars.map((url) => (
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
            </div>
             <Button onClick={switchCommanderSex} variant="outline" size="sm" className="w-full justify-center">
                <Users className="mr-2 h-4 w-4" />
                Switch Commander Gender
            </Button>
          </CardContent>
          <CardContent className="p-4 sm:p-6 pt-0">
             <Button onClick={handleSave} className="w-full text-lg h-12" disabled={!name}>
                <Check className="mr-2 h-5 w-5"/>
                Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
