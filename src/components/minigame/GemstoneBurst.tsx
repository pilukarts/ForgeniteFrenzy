
"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, ArrowLeft, ArrowRight, ArrowUp, Bomb, Sparkles } from 'lucide-react';

// --- Game Constants & Types ---
const COLS = 11;
const ROWS = 14;
const BUBBLE_RADIUS = 16;
const BOARD_WIDTH = COLS * BUBBLE_RADIUS * 2 + BUBBLE_RADIUS;
const BOARD_HEIGHT = ROWS * BUBBLE_RADIUS * 1.732;
const SHOOTER_Y = BOARD_HEIGHT + BUBBLE_RADIUS * 2;
const PROJECTILE_SPEED = 20;
const SHOTS_BEFORE_ADVANCE = 5;

const COLORS = ['#FF5A5A', '#FFD700', '#5AFF5A', '#5A5AFF', '#FF5AE4', '#5AFFFF'];
const SPECIAL_TYPES = {
  BOMB: 'BOMB',
  RAINBOW: 'RAINBOW',
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
  special: SpecialType;
};

type Projectile = Omit<Bubble, 'row' | 'col' | 'isStatic'> & {
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

  useEffect(() => setIsClient(true), []);

  const getGridPos = (row: number, col: number) => {
    const x = col * BUBBLE_RADIUS * 2 + (row % 2 === 0 ? BUBBLE_RADIUS : BUBBLE_RADIUS * 2);
    const y = row * BUBBLE_RADIUS * 1.732 + BUBBLE_RADIUS;
    return { x, y };
  };

  const getNextBubble = useCallback((): { color: BubbleColor; special: SpecialType } => {
    if (bubbles.length === 0) {
      return { color: COLORS[Math.floor(Math.random() * COLORS.length)], special: null };
    }
     // 10% chance for a special bubble
    if (Math.random() < 0.1) {
      return Math.random() < 0.5 
        ? { color: 'black', special: 'bomb' }
        : { color: 'white', special: 'rainbow' };
    }
    const availableColors = [...new Set(bubbles.filter(b => b.special === null).map(b => b.color))];
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
        const { x, y } = getGridPos(row, col);
        initialBubbles.push({
          id: bubbleIdCounter.current++,
          x, y, row, col,
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
    setNextBubble(getNextBubble());
  }, [getNextBubble]);

  useEffect(() => {
    if (isClient) resetGame();
  }, [isClient, resetGame]);

  useEffect(() => {
    if (bubbles.length > 0) {
        setNextBubble(getNextBubble());
    }
  }, [bubbles, getNextBubble]);

  const advanceBubbles = useCallback(() => {
    let isGameOver = false;
    const newBubbles = bubbles.map(b => {
      const {x, y} = getGridPos(b.row + 1, b.col);
      if (y + BUBBLE_RADIUS >= SHOOTER_Y - BUBBLE_RADIUS * 2) {
          isGameOver = true;
      }
      return { ...b, y, row: b.row + 1 };
    });

    // Add a new top row
    const newRow = 0;
    const numCols = newRow % 2 === 0 ? COLS : COLS - 1;
    for (let col = 0; col < numCols; col++) {
      const { x, y } = getGridPos(newRow, col);
      newBubbles.push({
        id: bubbleIdCounter.current++,
        x, y, row: newRow, col,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        special: null,
      });
    }

    setBubbles(newBubbles);

    if (isGameOver && !gameOver) {
      setGameOver('LOSE');
      toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
    }
  }, [bubbles, gameOver, toast]);

  useEffect(() => {
    if (shotsFired > 0 && shotsFired % SHOTS_BEFORE_ADVANCE === 0) {
      advanceBubbles();
    }
  }, [shotsFired, advanceBubbles]);

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
  
  useEffect(() => {
      if(!projectile) {
          setNextBubble(getNextBubble());
      }
  }, [projectile, getNextBubble]);


  const findNeighbors = (targetBubble: Bubble, allBubbles: Bubble[]): Bubble[] => {
    const neighbors: Bubble[] = [];
    for (const other of allBubbles) {
        if (targetBubble.id === other.id) continue;
        const dist = Math.hypot(targetBubble.x - other.x, targetBubble.y - other.y);
        if (dist < BUBBLE_RADIUS * 2.1) { // Slightly larger radius for adjacency
            neighbors.push(other);
        }
    }
    return neighbors;
  };

  const getMatches = (startBubble: Bubble, allBubbles: Bubble[]): Bubble[] => {
    if (startBubble.special === 'bomb') return [];
    if (startBubble.special === 'rainbow') return [];

    const toCheck: Bubble[] = [startBubble];
    const checked = new Set<number>([startBubble.id]);
    const matches: Bubble[] = [];

    while (toCheck.length > 0) {
        const current = toCheck.pop()!;
        if (current.special === 'rainbow' || current.color === startBubble.color) {
            matches.push(current);
            const neighbors = findNeighbors(current, allBubbles);
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
  
  const getFloating = (allBubbles: Bubble[]): Bubble[] => {
    const checked = new Set<number>();
    const toCheck: Bubble[] = [];

    // Find all bubbles connected to the ceiling
    allBubbles.forEach(b => {
        if (b.row === 0) {
            checked.add(b.id);
            toCheck.push(b);
        }
    });

    while(toCheck.length > 0) {
        const current = toCheck.pop()!;
        const neighbors = findNeighbors(current, allBubbles);
        for(const neighbor of neighbors) {
            if(!checked.has(neighbor.id)) {
                checked.add(neighbor.id);
                toCheck.push(neighbor);
            }
        }
    }
    
    return allBubbles.filter(b => !checked.has(b.id));
  };

  // Game Loop
  useEffect(() => {
    if (!isClient) return;
    let animationFrameId: number;

    const gameUpdate = () => {
      const canvas = canvasRef.current;
      if (canvas && !gameOver) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw bubbles
          bubbles.forEach(bubble => {
              ctx.beginPath();
              ctx.arc(bubble.x, bubble.y, BUBBLE_RADIUS, 0, Math.PI * 2);
              ctx.fillStyle = bubble.color;
              ctx.fill();
              if (bubble.special === 'bomb') {
                  ctx.fillStyle = 'white'; ctx.fillText('B', bubble.x, bubble.y + 4);
              } else if (bubble.special === 'rainbow') {
                  const gradient = ctx.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, BUBBLE_RADIUS);
                  COLORS.forEach((c, i) => gradient.addColorStop(i/COLORS.length, c));
                  ctx.fillStyle = gradient;
                  ctx.fill();
              }
              ctx.stroke();
          });
          // Draw projectile
          if (projectile) {
            ctx.beginPath();
            ctx.arc(projectile.x, projectile.y, BUBBLE_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = projectile.color;
            ctx.fill();
             if (projectile.special === 'bomb') {
              ctx.fillStyle = 'white'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
              ctx.fillText('B', projectile.x, projectile.y + 4);
            } else if (projectile.special === 'rainbow') {
               const gradient = ctx.createRadialGradient(projectile.x, projectile.y, 0, projectile.x, projectile.y, BUBBLE_RADIUS);
                  COLORS.forEach((c, i) => gradient.addColorStop(i/COLORS.length, c));
                  ctx.fillStyle = gradient;
                  ctx.fill();
            }
          }
          // Draw shooter
           const shooterX = BOARD_WIDTH / 2;
          const angleRad = (shooterAngle - 90) * Math.PI / 180;
          const endX = shooterX + 40 * Math.cos(angleRad);
          const endY = SHOOTER_Y + 40 * Math.sin(angleRad);
          ctx.beginPath(); ctx.moveTo(shooterX, SHOOTER_Y); ctx.lineTo(endX, endY);
          ctx.strokeStyle = 'white'; ctx.lineWidth = 4; ctx.stroke();
           // Draw next bubble
          ctx.beginPath(); ctx.arc(shooterX, SHOOTER_Y, BUBBLE_RADIUS, 0, Math.PI * 2);
          ctx.fillStyle = nextBubble.color; ctx.fill();
          if (nextBubble.special === 'bomb') {
            ctx.fillStyle = 'white'; ctx.font = 'bold 16px sans-serif'; ctx.textAlign = 'center';
            ctx.fillText('B', shooterX, SHOOTER_Y + 4);
          } else if(nextBubble.special === 'rainbow') {
            const gradient = ctx.createRadialGradient(shooterX, shooterY, 0, shooterX, shooterY, BUBBLE_RADIUS);
            COLORS.forEach((c, i) => gradient.addColorStop(i/COLORS.length, c));
            ctx.fillStyle = gradient;
            ctx.fill();
          }

        }
      }

      if (projectile && !gameOver) {
        let newX = projectile.x + projectile.vx;
        let newY = projectile.y + projectile.vy;

        // Wall collision
        if (newX - BUBBLE_RADIUS < 0 || newX + BUBBLE_RADIUS > BOARD_WIDTH) {
            setProjectile(p => p ? { ...p, vx: -p.vx } : null);
        }

        // Ceiling or bubble collision
        let hit = false;
        if (newY - BUBBLE_RADIUS <= 0) {
            hit = true;
        } else {
            for (const bubble of bubbles) {
                if (Math.hypot(newX - bubble.x, newY - bubble.y) < BUBBLE_RADIUS * 2) {
                    hit = true;
                    break;
                }
            }
        }
        
        if (hit) {
            const snappedPos = getSnapPosition(newX, newY);
            const newBubble: Bubble = {
                id: projectile.id,
                x: snappedPos.x,
                y: snappedPos.y,
                row: snappedPos.row,
                col: snappedPos.col,
                color: projectile.color,
                special: projectile.special
            };

            let tempBubbles = [...bubbles, newBubble];
            let bubblesToRemove = new Set<number>();
            let pointsFromThisShot = 0;

            if (newBubble.special === 'bomb') {
                const neighbors = findNeighbors(newBubble, tempBubbles);
                neighbors.forEach(n => bubblesToRemove.add(n.id));
                bubblesToRemove.add(newBubble.id);
                pointsFromThisShot += bubblesToRemove.size * 20;
                toast({ title: 'KABOOM!', description: `Bomb cleared ${bubblesToRemove.size} gems!`});
            } else {
                if (newBubble.special === 'rainbow') {
                    const neighbors = findNeighbors(newBubble, tempBubbles);
                    const mostCommonColor = neighbors.length > 0 ? neighbors[0].color : COLORS[0];
                    newBubble.color = mostCommonColor;
                }

                const matches = getMatches(newBubble, tempBubbles);
                if (matches.length >= 3) {
                    matches.forEach(b => bubblesToRemove.add(b.id));
                    pointsFromThisShot += matches.length * 10 * matches.length;
                }
            }

            tempBubbles = tempBubbles.filter(b => !bubblesToRemove.has(b.id));
            const floating = getFloating(tempBubbles);
            if (floating.length > 0) {
                floating.forEach(f => bubblesToRemove.add(f.id));
                pointsFromThisShot += floating.length * 50;
                toast({ title: 'Nice Drop!', description: `+${floating.length * 50} bonus points!` });
            }
            
            if(pointsFromThisShot > 0) {
                setScore(s => s + pointsFromThisShot);
                addPoints(pointsFromThisShot);
            }

            const finalBubbles = bubbles.filter(b => !bubblesToRemove.has(b.id));
            if(!bubblesToRemove.has(newBubble.id)) {
                finalBubbles.push(newBubble);
            }
            setBubbles(finalBubbles);

            if (finalBubbles.length === 0) {
                setGameOver('WIN');
                const winBonus = 5000;
                addPoints(winBonus); setScore(s => s + winBonus);
                toast({ title: 'You Win!', description: `All gems cleared! +${winBonus} bonus points.` });
            } else if (finalBubbles.some(b => b.y + BUBBLE_RADIUS >= SHOOTER_Y - BUBBLE_RADIUS * 2)) {
                setGameOver('LOSE');
                toast({ title: 'Game Over', description: 'The gems reached the bottom!', variant: 'destructive' });
            }

            setProjectile(null);
        } else {
            setProjectile(p => p ? { ...p, x: newX, y: newY } : null);
        }
      }
      animationFrameId = requestAnimationFrame(gameUpdate);
    };

    animationFrameId = requestAnimationFrame(gameUpdate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isClient, projectile, bubbles, addPoints, toast, gameOver]);
  
  const getSnapPosition = (x: number, y: number) => {
      let row = Math.floor(y / (BUBBLE_RADIUS * 1.732));
      let col;
      if (row % 2 === 0) {
          col = Math.floor(x / (BUBBLE_RADIUS * 2));
      } else {
          col = Math.floor((x - BUBBLE_RADIUS) / (BUBBLE_RADIUS * 2));
      }
      return { ...getGridPos(row, col), row, col};
  };

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
  }, [isClient, gameOver, shoot, handleAngleChange]);

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
      <div className="relative bg-card rounded-lg border-2 border-primary shadow-lg" style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT + 60 }}>
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
        <canvas ref={canvasRef} width={BOARD_WIDTH} height={BOARD_HEIGHT + 60} className="z-10 rounded-lg" />
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
