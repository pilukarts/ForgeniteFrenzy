
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft, ArrowRight, ArrowUp, Bomb, Sparkles } from 'lucide-react';

// --- Game Constants & Types ---
const COLS = 11;
const ROWS = 16;
const BUBBLE_DIAMETER = 32;
const BUBBLE_RADIUS = BUBBLE_DIAMETER / 2;
const BOARD_WIDTH = (COLS * BUBBLE_DIAMETER) + BUBBLE_RADIUS;
const ROW_HEIGHT = Math.sqrt(3) * BUBBLE_RADIUS; // Height of an equilateral triangle
const BOARD_HEIGHT = (ROWS - 1) * ROW_HEIGHT + BUBBLE_DIAMETER;
const SHOOTER_Y = BOARD_HEIGHT - BUBBLE_RADIUS;
const PROJECTILE_SPEED = 20;
const SHOTS_BEFORE_ADVANCE = 6;
const WIN_BONUS = 5000;
const POINTS_PER_BUBBLE = 10;
const POINTS_PER_DROPPED_BUBBLE = 50;

const COLORS = ['#FF5A5A', '#FFD700', '#5AFF5A', '#5A5AFF', '#FF5AE4', '#5AFFFF'];
type BubbleColor = string;
type SpecialType = 'bomb' | 'rainbow' | null;

interface Bubble {
  id: number;
  row: number;
  col: number;
  color: BubbleColor;
  special: SpecialType;
  x: number;
  y: number;
}

interface Projectile extends Omit<Bubble, 'row' | 'col'> {
  vx: number;
  vy: number;
}

// --- Main Component ---
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
  const gameUpdateRef = useRef<number>();


  // Ensure component only runs on the client
  useEffect(() => {
    setIsClient(true);
    return () => {
        if(gameUpdateRef.current) cancelAnimationFrame(gameUpdateRef.current);
    }
  }, []);

  // --- Grid and Position Helpers ---
  const getGridPos = useCallback((row: number, col: number) => {
    const x = col * BUBBLE_DIAMETER + (row % 2) * BUBBLE_RADIUS + BUBBLE_RADIUS;
    const y = row * ROW_HEIGHT + BUBBLE_RADIUS;
    return { x, y };
  }, []);

  // --- Game State Management ---
  const getNextBubbleType = useCallback((): { color: BubbleColor; special: SpecialType } => {
    const staticBubbles = bubbles.filter(b => b.special === null);
    const availableColors = [...new Set(staticBubbles.map(b => b.color))];
    
    // 1 in 10 chance for a special bubble
    if (Math.random() < 0.1) {
        return Math.random() < 0.5
            ? { color: '#333333', special: 'bomb' }
            : { color: 'white', special: 'rainbow' };
    }

    if (availableColors.length > 0) {
        return { color: availableColors[Math.floor(Math.random() * availableColors.length)], special: null };
    }
    // Fallback if no normal bubbles are on the board
    return { color: COLORS[Math.floor(Math.random() * COLORS.length)], special: null };
  }, [bubbles]);

  const resetGame = useCallback(() => {
    if (gameUpdateRef.current) cancelAnimationFrame(gameUpdateRef.current);
    bubbleIdCounter.current = 0;
    const initialBubbles: Bubble[] = [];
    for (let row = 0; row < 6; row++) {
      const colsInRow = COLS - (row % 2);
      for (let col = 0; col < colsInRow; col++) {
        const { x, y } = getGridPos(row, col);
        initialBubbles.push({
          id: bubbleIdCounter.current++,
          row, col, x, y,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          special: null,
        });
      }
    }
    setBubbles(initialBubbles);
    setProjectile(null);
    setScore(0);
    setGameOver(false);
    setShooterAngle(0);
    setShotsFired(0);
    setNextBubble(initialBubbles.length > 0
        ? { color: initialBubbles[Math.floor(Math.random() * initialBubbles.length)].color, special: null }
        : { color: COLORS[Math.floor(Math.random() * COLORS.length)], special: null }
    );
  }, [getGridPos]);

  useEffect(() => {
    if (isClient) {
      resetGame();
    }
  }, [isClient, resetGame]);

  // --- Core Gameplay Logic ---
  const shoot = useCallback(() => {
    if (projectile || gameOver) return;
    const angleRad = (shooterAngle - 90) * Math.PI / 180;
    setProjectile({
      id: bubbleIdCounter.current++,
      x: BOARD_WIDTH / 2,
      y: SHOOTER_Y,
      color: nextBubble.color,
      special: nextBubble.special,
      vx: Math.cos(angleRad) * PROJECTILE_SPEED,
      vy: Math.sin(angleRad) * PROJECTILE_SPEED,
    });
    setShotsFired(prev => prev + 1);
  }, [projectile, gameOver, shooterAngle, nextBubble]);

  const getNeighbors = (bubble: Bubble, allBubbles: Bubble[]): Bubble[] => {
      const neighbors: Bubble[] = [];
      allBubbles.forEach(other => {
          if (bubble.id === other.id) return;
          const dist = Math.hypot(bubble.x - other.x, bubble.y - other.y);
          if (dist < BUBBLE_DIAMETER * 1.1) {
              neighbors.push(other);
          }
      });
      return neighbors;
  };
  
  const getMatches = (startBubble: Bubble, allBubbles: Bubble[], targetColor: string): Bubble[] => {
      const toCheck: Bubble[] = [startBubble];
      const checked = new Set<number>([startBubble.id]);
      const matches: Bubble[] = [];

      while (toCheck.length > 0) {
          const current = toCheck.pop()!;
          if (current.color === targetColor || current.special === 'rainbow' || startBubble.special === 'rainbow') {
              matches.push(current);
              const neighbors = getNeighbors(current, allBubbles);
              for (const neighbor of neighbors) {
                  if (!checked.has(neighbor.id)) {
                      checked.add(neighbor.id);
                      toCheck.push(neighbor);
                  }
              }
          }
      }
      return matches;
  };
  
  const getFloatingBubbles = (allBubbles: Bubble[]): Bubble[] => {
      const checked = new Set<number>();
      const toCheck: Bubble[] = [];

      allBubbles.forEach(b => {
          if (b.y - BUBBLE_RADIUS <= 0) { // Check if connected to the "ceiling"
              toCheck.push(b);
              checked.add(b.id);
          }
      });

      let head = 0;
      while(head < toCheck.length) {
          const current = toCheck[head++];
          const neighbors = getNeighbors(current, allBubbles);
          for (const neighbor of neighbors) {
              if (!checked.has(neighbor.id)) {
                  checked.add(neighbor.id);
                  toCheck.push(neighbor);
              }
          }
      }
      return allBubbles.filter(b => !checked.has(b.id));
  };
  
  const handleProjectileSnap = useCallback((proj: Projectile) => {
    setProjectile(null);

    const row = Math.round((proj.y - BUBBLE_RADIUS) / ROW_HEIGHT);
    const colOffset = row % 2 === 1 ? BUBBLE_RADIUS : 0;
    const col = Math.round((proj.x - colOffset - BUBBLE_RADIUS) / BUBBLE_DIAMETER);
    const { x, y } = getGridPos(row, col);

    const newBubble: Bubble = {
        id: proj.id,
        row, col, x, y,
        color: proj.color,
        special: proj.special,
    };

    let tempBubbles = [...bubbles, newBubble];
    let bubblesToRemoveIds = new Set<number>();
    let pointsThisShot = 0;
    let matchFound = false;

    if (newBubble.special === 'bomb') {
        const neighbors = getNeighbors(newBubble, tempBubbles);
        neighbors.forEach(n => bubblesToRemoveIds.add(n.id));
        bubblesToRemoveIds.add(newBubble.id);
        matchFound = true;
    } else {
        const targetColor = newBubble.color;
        const matches = getMatches(newBubble, tempBubbles, targetColor);
        if (matches.length >= 3 || (newBubble.special === 'rainbow' && matches.length >=2)) {
            matches.forEach(m => bubblesToRemoveIds.add(m.id));
            matchFound = true;
        }
    }
    
    let afterMatches = tempBubbles.filter(b => !bubblesToRemoveIds.has(b.id));

    if (matchFound) {
      pointsThisShot += bubblesToRemoveIds.size * POINTS_PER_BUBBLE;
      const floating = getFloatingBubbles(afterMatches);
      if(floating.length > 0) {
          floating.forEach(f => bubblesToRemoveIds.add(f.id));
          pointsThisShot += floating.length * POINTS_PER_DROPPED_BUBBLE;
          toast({ title: 'Nice Drop!', description: `+${floating.length * POINTS_PER_DROPPED_BUBBLE} bonus points!` });
      }
      afterMatches = tempBubbles.filter(b => !bubblesToRemoveIds.has(b.id));
    }
    
    // Always add the new bubble if no match was found, otherwise add the remaining bubbles
    const finalBubbles = !matchFound ? tempBubbles : afterMatches;
    setBubbles(finalBubbles);

    if (newBubble.y >= SHOOTER_Y - BUBBLE_DIAMETER && !gameOver) {
       setGameOver('LOSE');
       toast({ title: 'Game Over!', description: 'The gems reached the bottom!', variant: 'destructive' });
    }
    
    if (pointsThisShot > 0) {
        setScore(s => s + pointsThisShot);
        addPoints(pointsThisShot);
    }
    
    setNextBubble(getNextBubbleType());

  }, [bubbles, getGridPos, addPoints, toast, getNextBubbleType, gameOver]);
  
  const advanceBubbles = useCallback(() => {
    let isGameOver = false;
    setBubbles(prevBubbles => {
        const newBubbles = prevBubbles.map(b => {
            const newRow = b.row + 1;
            if (getGridPos(newRow, b.col).y >= SHOOTER_Y - BUBBLE_DIAMETER) isGameOver = true;
            return { ...b, row: newRow };
        }).map(b => ({...b, ...getGridPos(b.row, b.col)}));

        const newRow = 0;
        const colsInRow = COLS - (newRow % 2);
        for (let col = 0; col < colsInRow; col++) {
            const { x, y } = getGridPos(newRow, col);
            newBubbles.push({
                id: bubbleIdCounter.current++, x, y, row: newRow, col,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                special: null
            });
        }
        return newBubbles;
    });

    if (isGameOver && !gameOver) {
        setGameOver('LOSE');
        toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
    }
}, [gameOver, getGridPos, toast]);


  useEffect(() => {
      if (shotsFired > 0 && shotsFired % SHOTS_BEFORE_ADVANCE === 0) {
          advanceBubbles();
      }
  }, [shotsFired, advanceBubbles]);

  // Check for win condition
  useEffect(() => {
    if (bubbles.length === 0 && !gameOver && shotsFired > 0) {
      setGameOver('WIN');
      addPoints(WIN_BONUS); setScore(s => s + WIN_BONUS);
      toast({ title: 'You Win!', description: `All gems cleared! +${WIN_BONUS.toLocaleString()} bonus points.` });
    }
  }, [bubbles, gameOver, addPoints, toast, shotsFired]);


  // Game Loop
  useEffect(() => {
    if (!isClient || gameOver) {
      if (gameUpdateRef.current) cancelAnimationFrame(gameUpdateRef.current);
      return;
    }
    
    const gameUpdate = () => {
      if (projectile) {
        const newX = projectile.x + projectile.vx;
        const newY = projectile.y + projectile.vy;
        let collided = false;

        // Wall bounce
        if (newX - BUBBLE_RADIUS < 0 || newX + BUBBLE_RADIUS > BOARD_WIDTH) {
          setProjectile(p => p ? { ...p, vx: -p.vx, x: p.x - p.vx } : null); // Reverse and step back
        }

        // Top wall collision
        if (newY - BUBBLE_RADIUS <= 0) {
          collided = true;
        } else {
          // Bubble collision
          for (const bubble of bubbles) {
            if (Math.hypot(newX - bubble.x, newY - bubble.y) < BUBBLE_DIAMETER) {
              collided = true;
              break;
            }
          }
        }
        
        if (collided) {
           handleProjectileSnap({ ...projectile, x: newX, y: newY });
        } else {
           setProjectile(p => p ? { ...p, x: newX, y: newY } : null);
        }
      }
      gameUpdateRef.current = requestAnimationFrame(gameUpdate);
    };

    gameUpdateRef.current = requestAnimationFrame(gameUpdate);
    return () => {
      if (gameUpdateRef.current) cancelAnimationFrame(gameUpdateRef.current);
    }
  }, [isClient, projectile, bubbles, gameOver, handleProjectileSnap]);

  // Drawing Logic
  const drawGame = useCallback(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const drawBubble = (bubble: { x: number, y: number, color: string, special: SpecialType | null }) => {
          ctx.beginPath();
          ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS - 1, 0, Math.PI * 2);
          if (bubble.special === 'rainbow') {
            const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, BUBBLE_RADIUS);
            COLORS.forEach((c, i) => gradient.addColorStop(i / COLORS.length, c));
            ctx.fillStyle = gradient;
          } else {
            ctx.fillStyle = bubble.color;
          }
          ctx.fill();
          ctx.strokeStyle = "rgba(0,0,0,0.2)";
          ctx.stroke();
          if (bubble.special === 'bomb') {
              ctx.fillStyle = 'white'; ctx.font = 'bold 16px sans-serif';
              ctx.fillText('B', bubble.x, bubble.y);
          }
      };

      bubbles.forEach(drawBubble);
      if (projectile) drawBubble(projectile);
      
      // Draw shooter line
      const shooterX = BOARD_WIDTH / 2;
      const angleRad = (shooterAngle - 90) * Math.PI / 180;
      const endX = shooterX + 60 * Math.cos(angleRad);
      const endY = SHOOTER_Y + 60 * Math.sin(angleRad);
      ctx.beginPath(); ctx.moveTo(shooterX, SHOOTER_Y); ctx.lineTo(endX, endY);
      ctx.strokeStyle = 'hsl(var(--primary))'; ctx.lineWidth = 4; ctx.stroke();
      
      // Draw next bubble at shooter position
      drawBubble({ x: shooterX, y: SHOOTER_Y, color: nextBubble.color, special: nextBubble.special });
  }, [bubbles, projectile, shooterAngle, nextBubble]);

  useEffect(() => {
    let animFrame: number;
    const renderLoop = () => {
      drawGame();
      animFrame = requestAnimationFrame(renderLoop);
    };
    if (isClient && canvasRef.current) {
      animFrame = requestAnimationFrame(renderLoop);
    }
    return () => {
      if(animFrame) cancelAnimationFrame(animFrame);
    }
  }, [isClient, drawGame]);

  // --- User Input Handling ---
  const handleAngleChange = (direction: 'left' | 'right') => {
    if (gameOver) return;
    setShooterAngle(prev => Math.max(-80, Math.min(80, prev + (direction === 'left' ? -10 : 10))));
  };

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
  }, [isClient, gameOver, shoot]);

  // --- Render ---
  if (!isClient) {
    return <div className="text-lg font-headline text-primary animate-pulse">Loading Minigame...</div>;
  }

  const renderNextBubbleIcon = () => {
    if (nextBubble.special === 'bomb') return <Bomb className="h-8 w-8 text-white" />;
    if (nextBubble.special === 'rainbow') return <Sparkles className="h-8 w-8 text-purple-400" />;
    return <ArrowUp className="h-8 w-8" />;
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-lg font-headline text-primary">Score: {score.toLocaleString()}</div>
      <div className="relative bg-card rounded-lg border-2 border-primary shadow-lg" style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-20 rounded-lg"
            >
              <p className="text-4xl font-headline text-primary mb-2">{gameOver === 'LOSE' ? 'Game Over' : 'You Win!'}</p>
              <Button onClick={resetGame} variant="secondary">Play Again</Button>
            </motion.div>
          )}
        </AnimatePresence>
        <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT} className="z-10 rounded-lg" />
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

    