"use client";
import Link from 'next/link';
import { Home, ChevronsUp, Trophy, RadioTower, Users, ShoppingCart, MessagesSquare, ListChecks, Swords, Map, Gamepad2, FileText, UserCircle, LifeBuoy, Info, Globe, Send, Bot } from 'lucide-react';
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
  { href: '/tournaments', label: 'Tournaments', icon: RadioTower },
  { href: '/marketplace', label: 'Shop', icon: ShoppingCart },
  { href: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { href: '/alliance-chat', label: 'Vanguard', icon: MessagesSquare },
];

const secondaryNavItems = [
  { href: '/community', label: 'Community', icon: Users },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/legal/terms-of-service', label: 'Legal', icon: FileText },
];

const socialLinks = [
    { href: 'https://pilukarts.github.io/', label: 'Pilukarts', icon: Globe },
    { href: 'https://t.me/FrenzyForge_bot', label: 'Telegram Game', icon: Bot },
];

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();
  const allItems = [...navItems, ...secondaryNavItems, ...socialLinks];

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
                <Icon className={cn("h-5 w-5 mb-0.5", finalIsActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground", label === 'Discord' || label === 'X (Twitter)' ? 'fill-current h-4 w-4' : '')} />
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
