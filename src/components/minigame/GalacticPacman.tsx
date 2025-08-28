
"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ship, Bot, Star, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- Game Constants ---
const GRID_SIZE = 15;
const CELL_SIZE = 24; // size in pixels
const GAME_SPEED = 200; // ms per game tick
const POINTS_PER_PELLET = 10;
const WIN_BONUS = 5000;

// --- Level Layout ---
// 0: empty, 1: wall, 2: pellet
const levelLayout = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
  [1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 2, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 1],
  [1, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1],
  [1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;

const GalacticPacman: React.FC = () => {
  const { addPoints } = useGame();
  const { toast } = useToast();
  
  const [grid, setGrid] = useState(levelLayout);
  const [playerPos, setPlayerPos] = useState<Position>({ x: 7, y: 7 });
  const [enemyPos, setEnemyPos] = useState<Position>({ x: 1, y: 1 });
  const [direction, setDirection] = useState<Direction>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState<false | 'WIN' | 'LOSE'>(false);
  const gameLoopRef = useRef<NodeJS.Timeout>();

  const totalPellets = useRef(levelLayout.flat().filter(cell => cell === 2).length);

  const resetGame = useCallback(() => {
    setGrid(levelLayout);
    setPlayerPos({ x: 7, y: 7 });
    setEnemyPos({ x: 1, y: 1 });
    setDirection(null);
    setScore(0);
    setGameOver(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const move = useCallback((pos: Position, dir: Direction | null): Position => {
    if (!dir) return pos;
    let { x, y } = pos;
    switch (dir) {
      case 'UP': y--; break;
      case 'DOWN': y++; break;
      case 'LEFT': x--; break;
      case 'RIGHT': x++; break;
    }
    // Check for wall collision
    if (grid[y] && grid[y][x] !== 1) {
      return { x, y };
    }
    return pos;
  }, [grid]);

  const gameTick = useCallback(() => {
    if (gameOver) return;

    // --- Player Movement ---
    setPlayerPos(prevPlayerPos => {
      const newPlayerPos = move(prevPlayerPos, direction);
      
      // Pellet collision
      if (grid[newPlayerPos.y][newPlayerPos.x] === 2) {
        setScore(s => s + POINTS_PER_PELLET);
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(row => [...row]);
          newGrid[newPlayerPos.y][newPlayerPos.x] = 0;
          return newGrid;
        });
      }
      return newPlayerPos;
    });

    // --- Enemy Movement (simple AI) ---
    setEnemyPos(prevEnemyPos => {
      let { x: ex, y: ey } = prevEnemyPos;
      let { x: px, y: py } = playerPos; // Use current player position for targeting
      
      // Simple chase logic
      if (ex < px && grid[ey][ex + 1] !== 1) ex++;
      else if (ex > px && grid[ey][ex - 1] !== 1) ex--;
      else if (ey < py && grid[ey + 1][ex] !== 1) ey++;
      else if (ey > py && grid[ey - 1][ex] !== 1) ey--;

      return { x: ex, y: ey };
    });

  }, [gameOver, direction, move, grid, playerPos]);

  // Game Loop
  useEffect(() => {
    if (!gameOver) {
      gameLoopRef.current = setInterval(gameTick, GAME_SPEED);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameTick, gameOver]);

  // Check Game Over Conditions
  useEffect(() => {
    if (playerPos.x === enemyPos.x && playerPos.y === enemyPos.y) {
      setGameOver('LOSE');
      toast({ title: "Caught!", description: "The patrol drone caught you. Try again!", variant: "destructive" });
    }
    
    if (score === totalPellets.current * POINTS_PER_PELLET) {
      setGameOver('WIN');
      addPoints(WIN_BONUS);
      toast({ title: "Success!", description: `Labrynth cleared! You earned a bonus of ${WIN_BONUS.toLocaleString()} points.` });
    }
  }, [playerPos, enemyPos, score, addPoints, toast]);

  // Handle Keyboard Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': setDirection('UP'); break;
        case 'ArrowDown': setDirection('DOWN'); break;
        case 'ArrowLeft': setDirection('LEFT'); break;
        case 'ArrowRight': setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderCell = (cell: number, x: number, y: number) => {
    const isPlayer = playerPos.x === x && playerPos.y === y;
    const isEnemy = enemyPos.x === x && enemyPos.y === y;

    if (cell === 1) return <div key={`${x}-${y}`} className="bg-border" />;
    
    return (
      <div key={`${x}-${y}`} className="bg-background/50 flex items-center justify-center">
        {isPlayer && <Ship className="text-primary h-5 w-5" />}
        {isEnemy && <Bot className="text-destructive h-5 w-5" />}
        {!isPlayer && !isEnemy && cell === 2 && <Star className="text-yellow-400 h-3 w-3 fill-current" />}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
       <Card className="w-full max-w-lg mx-auto bg-card/50">
        <CardContent className="p-2 sm:p-4">
            <div className="flex justify-between items-center mb-2">
                <p className="text-lg font-headline text-primary">Score: {score}</p>
                <p className="text-lg font-headline text-primary">Star Fragments Left: {totalPellets.current - (score / POINTS_PER_PELLET)}</p>
            </div>
            <div
                className="grid border-2 border-primary"
                style={{
                gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
                width: GRID_SIZE * CELL_SIZE,
                height: GRID_SIZE * CELL_SIZE,
                }}
            >
                <AnimatePresence>
                {gameOver && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-10"
                    >
                    <p className="text-4xl font-headline text-destructive mb-2">{gameOver === 'LOSE' ? 'Game Over' : 'You Win!'}</p>
                    <Button onClick={resetGame}>Play Again</Button>
                    </motion.div>
                )}
                </AnimatePresence>
                {grid.map((row, y) => row.map((cell, x) => renderCell(cell, x, y)))}
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-3 gap-2 w-48">
        <div/>
        <Button variant="outline" size="icon" onClick={() => setDirection('UP')} className="h-14 w-14"><ArrowUp /></Button>
        <div/>
        <Button variant="outline" size="icon" onClick={() => setDirection('LEFT')} className="h-14 w-14"><ArrowLeft /></Button>
        <div/>
        <Button variant="outline" size="icon" onClick={() => setDirection('RIGHT')} className="h-14 w-14"><ArrowRight /></Button>
        <div/>
        <Button variant="outline" size="icon" onClick={() => setDirection('DOWN')} className="h-14 w-14"><ArrowDown /></Button>
        <div/>
      </div>
    </div>
  );
};

export default GalacticPacman;
