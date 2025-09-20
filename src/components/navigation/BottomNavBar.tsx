"use client";
import Link from 'next/link';
import { Home, ChevronsUp, Trophy, Users, ShoppingCart, MessagesSquare, ListChecks, Swords, Map, Gamepad2, FileText, UserCircle, GalleryHorizontal, LifeBuoy, Info, Replace, Music, Music2, RefreshCw, Globe, Share2, Send, Bot } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upgrades', label: 'Upgrades', icon: ChevronsUp },
  { href: '/quests', label: 'Quests', icon: ListChecks },
  { href: '/battle-pass', label: 'Pass', icon: Swords },
  { href: '/level-map', label: 'Map', icon: Map },
  { href: '/leaderboard', label: 'Leaders', icon: Trophy },
  { href: '/marketplace', label: 'Shop', icon: ShoppingCart },
  { href: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { href: '/alliance-chat', label: 'Chat', icon: MessagesSquare },
  { href: '/nfts', label: 'NFTs', icon: GalleryHorizontal },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/legal/smart-contracts', label: 'Contracts', icon: FileText },
];

const socialLinks = [
    { href: 'https://allianceforge.online', label: 'Website', icon: Globe },
    { href: 'https://t.me/AllianceForgeHQ', label: 'Telegram', icon: Send },
    { href: 'https://t.me/ForgeiteFrenzyGame_bot', label: 'TG Mini App', icon: Bot },
    { href: 'https://x.com/AllianceForgeHQ', label: 'X (Twitter)', icon: (props: any) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>X</title><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg> },
    { href: 'https://discord.gg/xnWDwGBC', label: 'Discord', icon: (props: any) => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}><title>Discord</title><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.446.825-.667 1.284-1.39-1.29-3.91-1.516-3.91-1.516l-.044-.02-3.91 1.516c-.22-.46-.456-.909-.667-1.284a.074.074 0 0 0-.078-.037A19.791 19.791 0 0 0 3.682 4.37a.069.069 0 0 0-.032.023C.543 9.046-.32 13.58.1 18.058a.08.08 0 0 0 .041.058c1.837.775 3.652 1.165 5.447 1.165a12.602 12.602 0 0 0 2.378-.221.074.074 0 0 0 .063-.056c.208-1.01.43-2.06.435-2.22a.074.074_0_0_0-.045-.083c-.933-.424-1.782-1.026-2.52-1.844a.074.074 0 0 1 .018-.11c0-.009.012-.018.036-.027a10.872 10.872 0 0 1 2.982-1.108.074.074 0 0 1 .084.026c.462.632 1.053 1.253 1.725 1.799a.074.074 0 0 0 .084.026c1.13-.39 2.1-1.107 2.982-1.107.012 0 .024.009.036.027a.074.074 0 0 1 .018.11c-.738.818-1.587 1.42-2.52 1.844a.074.074_0_0_0-.045-.083c.005.16.227 1.21.435 2.22a.074.074 0 0 0 .063.056c.792.264 1.582.424 2.378.221 1.795 0 3.61-.39 5.447-1.165a.08.08 0 0 0 .041-.058c.418-4.478-1.242-9.012-4.015-13.664a.069.069 0 0 0-.032-.023zM8.02 15.33c-.94 0-1.7-.76-1.7-1.7s.76-1.7 1.7-1.7 1.7.76 1.7 1.7-.76 1.7-1.7 1.7zm7.96 0c-.94 0-1.7-.76-1.7-1.7s.76-1.7 1.7-1.7 1.7.76 1.7 1.7-.76 1.7-1.7 1.7z" /></svg> },
];

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();
  const allItems = [...navItems, ...socialLinks];

  return (
    <nav className="md:hidden absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 shadow-lg z-50 h-14 flex items-center">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max justify-around items-center px-1">
          {allItems.map(({ href, label, icon: Icon }) => {
            const isExternal = href.startsWith('http');
            const isActive = !isExternal && (href === '/' ? pathname === href : pathname.startsWith(href));
            const isArcadeActive = (href === '/arcade' && (pathname.startsWith('/arcade') || pathname.startsWith('/minigame')));
            
            const finalIsActive = isArcadeActive || (!isArcadeActive && isActive);

            const linkContent = (
               <div
                className={cn(
                  "flex flex-col items-center justify-center text-xs p-1 rounded-md transition-colors flex-shrink-0 mx-1 w-16 h-12",
                  finalIsActive ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 mb-0.5", finalIsActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground", label === 'Discord' || label === 'X (Twitter)' ? 'fill-current' : '')} />
                {label}
              </div>
            );
            
            if (isExternal) {
                return (
                    <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="group">
                        {linkContent}
                    </a>
                )
            }

            return (
              <Link
                key={href}
                href={href}
                className="group"
              >
                {linkContent}
              </Link>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </nav>
  );
};

export default BottomNavBar;
