
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft, ArrowRight, ArrowUp, Bomb, Sparkles } from 'lucide-react';

// --- Game Constants & Types ---
const BUBBLE_RADIUS = 16;
const ROWS = 14;
const COLS = 11;
const BOARD_WIDTH = COLS * BUBBLE_RADIUS * 2;
const BOARD_HEIGHT = ROWS * BUBBLE_RADIUS * 1.732;
const SHOOTER_Y = BOARD_HEIGHT + BUBBLE_RADIUS * 2;
const PROJECTILE_SPEED = 18;
const SHOTS_BEFORE_ADVANCE = 6; // Board moves down every 6 shots

const COLORS = ['#FF5A5A', '#FFD700', '#5AFF5A', '#5A5AFF', '#FF5AE4', '#5AFFFF'];
const SPECIAL_COLORS = {
  BOMB: 'black',
  RAINBOW: 'white',
};

type BubbleColor = string;
type SpecialType = 'bomb' | 'rainbow' | null;

type Bubble = {
  id: number;
  x: number;
  y: number;
  row: number;
  col: number;
  color: BubbleColor;
  isStatic: boolean;
  special: SpecialType;
};

type Projectile = Omit<Bubble, 'row' | 'col'> & {
  vx: number;
  vy: number;
};

const GemstoneBurst: React.FC = () => {
  const { addPoints } = useGame();
  const { toast } = useToast();
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [projectile, setProjectile] = useState<Projectile | null>(null);
  const [nextBubble, setNextBubble] = useState<{ color: BubbleColor; special: SpecialType }>({ color: COLORS[0], special: null });
  const [shooterAngle, setShooterAngle] = useState(0);
  const [score, setScore] = useState(0);
  const [shotsFired, setShotsFired] = useState(0);
  const [gameOver, setGameOver] = useState<false | 'WIN' | 'LOSE'>(false);
  const bubbleIdCounter = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getNextBubble = useCallback((): { color: BubbleColor; special: SpecialType } => {
    if (bubbles.length === 0) {
      return { color: COLORS[Math.floor(Math.random() * COLORS.length)], special: null };
    }
    // 10% chance for a special bubble
    if (Math.random() < 0.1) {
      // 50/50 chance for bomb or rainbow
      return Math.random() < 0.5 
        ? { color: SPECIAL_COLORS.BOMB, special: 'bomb' }
        : { color: SPECIAL_COLORS.RAINBOW, special: 'rainbow' };
    }
    const availableColors = [...new Set(bubbles.map(b => b.color))];
    if (availableColors.length > 0) {
      return { color: availableColors[Math.floor(Math.random() * availableColors.length)], special: null };
    }
    return { color: COLORS[Math.floor(Math.random() * COLORS.length)], special: null };
  }, [bubbles]);

  const resetGame = useCallback(() => {
    bubbleIdCounter.current = 0;
    const initialBubbles: Bubble[] = [];
    for (let row = 0; row < 5; row++) {
      const numCols = row % 2 === 0 ? COLS : COLS - 1;
      for (let col = 0; col < numCols; col++) {
        const x = col * BUBBLE_RADIUS * 2 + (row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
        const y = row * BUBBLE_RADIUS * 1.732 + BUBBLE_RADIUS;
        initialBubbles.push({ 
            id: bubbleIdCounter.current++, 
            x, y, row, col, 
            color: COLORS[Math.floor(Math.random() * COLORS.length)], 
            isStatic: true,
            special: null
        });
      }
    }
    setBubbles(initialBubbles);
    setProjectile(null);
    setScore(0);
    setGameOver(false);
    setShooterAngle(0);
    setShotsFired(0);
  }, []);
  
  useEffect(() => {
    if (isClient) {
      resetGame();
    }
  }, [isClient, resetGame]);

  useEffect(() => {
      setNextBubble(getNextBubble());
  }, [bubbles, getNextBubble]);

  const advanceBubbles = useCallback(() => {
    setBubbles(prevBubbles => {
      const newBubbles = prevBubbles.map(b => ({
        ...b,
        y: b.y + BUBBLE_RADIUS * 1.732,
        row: b.row + 1,
      }));

      // Add a new top row
      const newRow = 0;
      const numCols = newRow % 2 === 0 ? COLS : COLS - 1;
      for (let col = 0; col < numCols; col++) {
        const x = col * BUBBLE_RADIUS * 2 + (newRow % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
        const y = newRow * BUBBLE_RADIUS * 1.732 + BUBBLE_RADIUS;
        newBubbles.push({ 
          id: bubbleIdCounter.current++, 
          x, y, row: newRow, col, 
          color: COLORS[Math.floor(Math.random() * COLORS.length)], 
          isStatic: true,
          special: null
        });
      }

      // Check for game over
      const isGameOver = newBubbles.some(b => b.y + BUBBLE_RADIUS >= SHOOTER_Y - BUBBLE_RADIUS * 2);
      if (isGameOver && !gameOver) {
        setGameOver('LOSE');
        toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
      }

      return newBubbles;
    });
  }, [gameOver, toast]);

  useEffect(() => {
    if (shotsFired >= SHOTS_BEFORE_ADVANCE) {
      advanceBubbles();
      setShotsFired(0);
    }
  }, [shotsFired, advanceBubbles]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    bubbles.forEach(bubble => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = bubble.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.stroke();
    });

    if (projectile) {
      ctx.beginPath();
      ctx.arc(projectile.x, projectile.y, BUBBLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = projectile.color;
      ctx.fill();
    }
    
    const shooterX = BOARD_WIDTH / 2;
    ctx.beginPath();
    ctx.arc(shooterX, SHOOTER_Y, BUBBLE_RADIUS * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#4A4A4A';
    ctx.fill();

    const angleRad = (shooterAngle - 90) * Math.PI / 180;
    const barrelLength = BUBBLE_RADIUS * 2.5;
    const endX = shooterX + barrelLength * Math.cos(angleRad);
    const endY = SHOOTER_Y + barrelLength * Math.sin(angleRad);
    ctx.beginPath();
    ctx.moveTo(shooterX, SHOOTER_Y);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.lineWidth = 1;

    // Draw next bubble
    ctx.save();
    ctx.globalAlpha = projectile ? 1.0 : 0.0; // Show only when projectile is in flight
    ctx.beginPath();
    ctx.arc(shooterX, SHOOTER_Y, BUBBLE_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = nextBubble.color;
    ctx.fill();
    if (nextBubble.special === 'bomb') {
      ctx.fillStyle = 'white';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('B', shooterX, SHOOTER_Y);
    } else if (nextBubble.special === 'rainbow') {
      const gradient = ctx.createRadialGradient(shooterX, SHOOTER_Y, BUBBLE_RADIUS / 2, shooterX, SHOOTER_Y, BUBBLE_RADIUS);
      gradient.addColorStop(0, '#FF5A5A');
      gradient.addColorStop(0.5, '#5AFF5A');
      gradient.addColorStop(1, '#5A5AFF');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    ctx.restore();

  }, [bubbles, projectile, nextBubble, shooterAngle]);
  
  const shoot = useCallback(() => {
    if (projectile || gameOver) return;
    const angleRad = (shooterAngle - 90) * Math.PI / 180;
    setProjectile({
      id: bubbleIdCounter.current++,
      x: BOARD_WIDTH / 2,
      y: SHOOTER_Y,
      color: nextBubble.color,
      isStatic: false,
      special: nextBubble.special,
      vx: Math.cos(angleRad) * PROJECTILE_SPEED,
      vy: Math.sin(angleRad) * PROJECTILE_SPEED
    });
    setNextBubble(getNextBubble());
    setShotsFired(prev => prev + 1);
  }, [projectile, gameOver, shooterAngle, nextBubble, getNextBubble]);

  const handleAngleChange = useCallback((direction: 'left' | 'right') => {
    if (gameOver) return;
      setShooterAngle(prev => {
          let newAngle = prev + (direction === 'left' ? -10 : 10);
          return Math.max(-80, Math.min(80, newAngle));
      });
  }, [gameOver]);

  useEffect(() => {
    if (!isClient) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (gameOver) return;
        e.preventDefault();
        switch (e.key) {
            case 'ArrowLeft': handleAngleChange('left'); break;
            case 'ArrowRight': handleAngleChange('right'); break;
            case 'ArrowUp': case ' ': shoot(); break;
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isClient, gameOver, shoot, handleAngleChange]);

  const findNeighbors = (bubble: Bubble, allBubbles: Bubble[]): Bubble[] => {
    return allBubbles.filter(other => {
      if (bubble.id === other.id) return false;
      const dist = Math.hypot(bubble.x - other.x, bubble.y - other.y);
      return dist < BUBBLE_RADIUS * 2.2;
    });
  };

  const findMatches = (startBubble: Bubble, existingBubbles: Bubble[]): Bubble[] => {
    const toCheck: Bubble[] = [startBubble];
    const matched: Bubble[] = [];
    const checked = new Set<number>([startBubble.id]);
    
    while (toCheck.length > 0) {
      const current = toCheck.pop()!;
      if (current.color === startBubble.color) {
        matched.push(current);
        const neighbors = findNeighbors(current, existingBubbles);
        for (const neighbor of neighbors) {
            if (!checked.has(neighbor.id)) {
              toCheck.push(neighbor);
              checked.add(neighbor.id);
            }
        }
      }
    }
    return matched;
  };

  const findFloating = (existingBubbles: Bubble[]): Bubble[] => {
    const connectedToTop = new Set<number>();
    const toCheck: Bubble[] = [];
    
    existingBubbles.forEach(b => {
      if (b.row === 0) {
        toCheck.push(b);
        connectedToTop.add(b.id);
      }
    });

    let head = 0;
    while (head < toCheck.length) {
      const current = toCheck[head++];
      const neighbors = findNeighbors(current, existingBubbles);
      for (const neighbor of neighbors) {
        if (!connectedToTop.has(neighbor.id)) {
          connectedToTop.add(neighbor.id);
          toCheck.push(neighbor);
        }
      }
    }
    
    return existingBubbles.filter(b => !connectedToTop.has(b.id));
  };
  
  // Game Loop and Collision Logic
  useEffect(() => {
    if (!isClient) return;
    let animationFrameId: number;

    const gameUpdate = () => {
      if (projectile) {
        let newProjectile: Projectile = { ...projectile, x: projectile.x + projectile.vx, y: projectile.y + projectile.vy };

        // Wall bounces
        if (newProjectile.x - BUBBLE_RADIUS < 0 || newProjectile.x + BUBBLE_RADIUS > BOARD_WIDTH) {
          newProjectile.vx *= -1;
        }

        let collision = false;
        let snapBubble: Bubble | null = null;
        
        // Ceiling collision
        if (newProjectile.y - BUBBLE_RADIUS <= 0) {
          collision = true;
          snapBubble = null;
        } else {
            // Bubble-bubble collision
            for (const bubble of bubbles) {
                const dist = Math.hypot(newProjectile.x - bubble.x, newProjectile.y - bubble.y);
                if (dist < BUBBLE_RADIUS * 2) {
                    collision = true;
                    snapBubble = bubble;
                    break;
                }
            }
        }
        
        if (collision) {
          const landedProjectile = { ...newProjectile };
          setProjectile(null);
          
          const row = Math.round((landedProjectile.y - BUBBLE_RADIUS) / (BUBBLE_RADIUS * 1.732));
          const colOffset = row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2;
          const col = Math.round((landedProjectile.x - colOffset) / (BUBBLE_RADIUS * 2));
          const snapX = col * BUBBLE_RADIUS * 2 + colOffset;
          const snapY = row * BUBBLE_RADIUS * 1.732 + BUBBLE_RADIUS;
          
          const finalBubble: Bubble = { 
            ...landedProjectile, 
            isStatic: true, x: snapX, y: snapY, row, col 
          };

          let newBubbles = [...bubbles];
          
          // --- Handle Special Bubbles ---
          if(finalBubble.special === 'bomb') {
            const neighbors = findNeighbors(finalBubble, newBubbles);
            const toRemove = new Set(neighbors.map(n => n.id));
            newBubbles = newBubbles.filter(b => !toRemove.has(b.id));
            const points = (neighbors.length + 1) * 20;
            setScore(s => s + points); addPoints(points);
            toast({ title: 'KABOOM!', description: `Bomb cleared ${neighbors.length} gems!`});
          } else if(finalBubble.special === 'rainbow') {
            if(snapBubble) {
              finalBubble.color = snapBubble.color; // It becomes the color of the bubble it hit
            } else {
              // If it hits the ceiling, it just becomes a random color
               finalBubble.color = COLORS[Math.floor(Math.random() * COLORS.length)];
            }
            newBubbles.push(finalBubble);
          } else {
             newBubbles.push(finalBubble);
          }

          const matches = findMatches(finalBubble, newBubbles);

          if (matches.length >= 3) {
            const matchIds = new Set(matches.map(b => b.id));
            newBubbles = newBubbles.filter(b => !matchIds.has(b.id));
            const pointsEarned = matches.length * 10 * matches.length; // Bonus for bigger chains
            setScore(s => s + pointsEarned); addPoints(pointsEarned);
          }

          const floating = findFloating(newBubbles);
          if (floating.length > 0) {
            const floatingIds = new Set(floating.map(b => b.id));
            newBubbles = newBubbles.filter(b => !floatingIds.has(b.id));
            const dropPoints = floating.length * 50;
            setScore(s => s + dropPoints); addPoints(dropPoints);
            toast({ title: 'Nice Drop!', description: `+${dropPoints} bonus points!` });
          }

          setBubbles(newBubbles);

          // Check Win/Loss conditions after everything is resolved
          if (newBubbles.length === 0) {
            setGameOver('WIN');
            const winBonus = 5000;
            addPoints(winBonus); setScore(s => s + winBonus);
            toast({ title: 'You Win!', description: `All gems cleared! +${winBonus} bonus points.` });
          } else if (newBubbles.some(b => b.y + BUBBLE_RADIUS > SHOOTER_Y - BUBBLE_RADIUS * 2)) {
            setGameOver('LOSE');
            toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
          }
        } else {
          setProjectile(newProjectile);
        }
      }
      
      draw();
      animationFrameId = requestAnimationFrame(gameUpdate);
    };

    animationFrameId = requestAnimationFrame(gameUpdate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isClient, projectile, bubbles, addPoints, toast, draw]);

  const renderNextBubbleIcon = () => {
    if (nextBubble.special === 'bomb') return <Bomb className="h-8 w-8 text-white" />;
    if (nextBubble.special === 'rainbow') return <Sparkles className="h-8 w-8 text-purple-400" />;
    return <ArrowUp className="h-8 w-8" />;
  }
  
  if (!isClient) {
    return <div className="text-lg font-headline text-primary">Loading Minigame...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-headline text-primary">Score: {score.toLocaleString()}</div>
      <div className="relative bg-card rounded-lg border-2 border-primary shadow-lg" style={{width: BOARD_WIDTH, height: BOARD_HEIGHT + 60}}>
         <AnimatePresence>
            {gameOver && (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20"
                >
                <p className="text-4xl font-headline text-primary mb-2">{gameOver === 'LOSE' ? 'Game Over' : 'You Win!'}</p>
                <Button onClick={resetGame} variant="secondary">Play Again</Button>
                </motion.div>
            )}
            </AnimatePresence>
        <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT + 60} className="z-10" />
      </div>
       <div className="flex items-center gap-4 mt-2">
            <Button onClick={() => handleAngleChange('left')} variant="outline" size="icon" className="h-12 w-12"><ArrowLeft /></Button>
            <Button onClick={shoot} className="h-16 w-24 text-lg font-bold">
              {renderNextBubbleIcon()}
            </Button>
            <Button onClick={() => handleAngleChange('right')} variant="outline" size="icon" className="h-12 w-12"><ArrowRight /></Button>
       </div>
       <Button onClick={resetGame} variant="ghost" size="sm" className="mt-2"><RefreshCw className="mr-2 h-4 w-4" /> Reset</Button>
    </div>
  );
};

export default GemstoneBurst;

    