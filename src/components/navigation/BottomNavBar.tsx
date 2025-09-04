"use client";
import Link from 'next/link';
import { Home, ChevronsUp, Trophy, Users, ShoppingCart, MessagesSquare, ListChecks, ShieldQuestion, LifeBuoy, Swords, Map, Gamepad2, FileText, UserCircle } from 'lucide-react';
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
  { href: '/alliance-chat', label: 'Chat', icon: MessagesSquare },
  { href: '/marketplace', label: 'Shop', icon: ShoppingCart },
  { href: '/arcade', label: 'Arcade', icon: Gamepad2 },
  { href: '/profile', label: 'Profile', icon: UserCircle },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/legal/smart-contracts', label: 'Contracts', icon: FileText },
];

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/50 shadow-lg z-50 h-14 flex items-center">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max justify-around items-center px-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            // Check for exact match on '/', otherwise check for startsWith
            const isActive = href === '/' ? pathname === href : pathname.startsWith(href);
            // Special case for arcade to highlight it for minigame pages
            const isArcadeActive = (href === '/arcade' && (pathname.startsWith('/arcade') || pathname.startsWith('/minigame')));
            
            const finalIsActive = isArcadeActive || (!isArcadeActive && isActive);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center text-xs p-1 rounded-md transition-colors flex-shrink-0 mx-1 w-16 h-12",
                  finalIsActive ? "text-primary font-semibold bg-primary/10" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 mb-0.5", finalIsActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {label}
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
