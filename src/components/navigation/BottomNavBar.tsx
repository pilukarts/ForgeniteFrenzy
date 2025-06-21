
"use client";
import Link from 'next/link';
import { Home, ChevronsUp, Trophy, Users, ShoppingCart, MessagesSquare, ListChecks, ShieldQuestion, LifeBuoy, Swords } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/upgrades', label: 'Upgrades', icon: ChevronsUp },
  { href: '/quests', label: 'Quests', icon: ListChecks },
  { href: '/battle-pass', label: 'Pass', icon: Swords },
  { href: '/leaderboard', label: 'Leaders', icon: Trophy },
  { href: '/alliance-chat', label: 'Chat', icon: MessagesSquare },
  { href: '/marketplace', label: 'Shop', icon: ShoppingCart },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/support', label: 'Support', icon: LifeBuoy },
  { href: '/legal/transparency-statement', label: 'Legal', icon: ShieldQuestion },
];

const BottomNavBar: React.FC = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50">
      <div className="container mx-auto flex justify-around items-center h-14 overflow-x-auto"> {/* Reduced height and added scroll */}
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center text-xs p-1 rounded-md transition-colors flex-shrink-0 mx-1", // Added flex-shrink and margin
                isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5 mb-0.5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} /> {/* Reduced icon size */}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
    
