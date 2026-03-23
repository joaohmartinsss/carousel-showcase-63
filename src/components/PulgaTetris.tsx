import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PulgaTetrisProps {
  open: boolean;
  onClose: () => void;
  inline?: boolean;
}

const COLS = 10, ROWS = 18, CELL = 32;
const CW = COLS * CELL, CH = ROWS * CELL;
const BALL_R = CELL * 0.44;

const EYE_L_NX = 0;
const EYE_R_NX = 104.432 / 164.44;
const EYE_NY = 0;
const EYE_NR = 22.363 / 164.44;

const PIECES = [
  [[0,0],[0,1],[0,2],[0,3]],
  [[0,0],[0,1],[1,0],[1,1]],
  [[0,1],[1,0],[1,1],[1,2]],
  [[0,0],[1,0],[1,1],[1,2]],
  [[0,2],[1,0],[1,1],[1,2]],
  [[0,0],[0,1],[1,1],[1,2]],
  [[0,1],[0,2],[1,0],[1,1]],
];

function rotatePiece(cells: number[][]) {
  const maxR = Math.max(...cells.map(([r]) => r));
  return cells.map(([r, c]) => [c, maxR - r]);
}

function normalizeOffset(cells: number[][]) {
  const minR = Math.min(...cells.map(([r]) => r));
  const minC = Math.min(...cells.map(([, c]) => c));
  return cells.map(([r, c]) => [r - minR, c - minC]);
}

const PulgaTetris = ({ open, onClose }: PulgaTetrisProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<{
    board: boolean[][];
    piece: { cells: number[][]; row: number; col: number } | null;
    ghostRow: number;
    over: boolean;
    lastTick: number;
    interval: number;
    animId: number;
  } | null>(null);

  const drawPulga = useCallback((ctx: CanvasRenderingContext2D, cx: number, cy: number, ballR: number, alpha = 1) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.arc(0, 0, ballR, 0, Math.PI * 2);
    ctx.fillStyle = '#000000';
    ctx.fill();
    const eyeR = ballR * EYE_NR;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(ballR * EYE_L_NX, ballR * EYE_NY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ballR * EYE_R_NX, ballR * EYE_NY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, []);

  useEffect(() => {
    if (!open || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = CW;
    canvas.height = CH;

    const g = {
      board: Array.from({ length: ROWS }, () => new Array(COLS).fill(false)),
      piece: null as { cells: number[][]; row: number; col: number } | null,
      ghostRow: 0,
      over: false,
      lastTick: performance.now(),
      interval: 600,
      animId: 0,
    };
    gameRef.current = g;

    function canPlace(cells: number[][], row: number, col: number) {
      for (const [dr, dc] of cells) {
        const r = row + dr, c = col + dc;
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
        if (g.board[r][c]) return false;
      }
      return true;
    }

    function updateGhost() {
      if (!g.piece) return;
      let gr = g.piece.row;
      while (canPlace(g.piece.cells, gr + 1, g.piece.col)) gr++;
      g.ghostRow = gr;
    }

    function clearLines() {
      for (let r = ROWS - 1; r >= 0; r--) {
        if (g.board[r].every(v => v)) {
          g.board.splice(r, 1);
          g.board.unshift(new Array(COLS).fill(false));
          r++;
        }
      }
    }

    function lockPiece() {
      if (!g.piece) return;
      for (const [dr, dc] of g.piece.cells) {
        const r = g.piece.row + dr, c = g.piece.col + dc;
        if (r >= 0) g.board[r][c] = true;
      }
      clearLines();
      newPiece();
    }

    function newPiece() {
      const template = PIECES[Math.floor(Math.random() * PIECES.length)];
      const cells = template.map(([r, c]) => [r, c]);
      const startCol = Math.floor((COLS - Math.max(...cells.map(([, c]) => c)) - 1) / 2);
      g.piece = { cells, row: 0, col: startCol };
      updateGhost();
      if (!canPlace(g.piece.cells, g.piece.row, g.piece.col)) {
        g.over = true;
        g.piece = null;
        draw();
      }
    }

    function moveLeft() { if (g.piece && canPlace(g.piece.cells, g.piece.row, g.piece.col - 1)) { g.piece.col--; updateGhost(); } }
    function moveRight() { if (g.piece && canPlace(g.piece.cells, g.piece.row, g.piece.col + 1)) { g.piece.col++; updateGhost(); } }
    function moveDown() {
      if (!g.piece) return;
      if (canPlace(g.piece.cells, g.piece.row + 1, g.piece.col)) g.piece.row++;
      else lockPiece();
    }
    function hardDrop() {
      if (!g.piece) return;
      g.piece.row = g.ghostRow;
      lockPiece();
    }
    function rotate() {
      if (!g.piece) return;
      const rotated = normalizeOffset(rotatePiece(g.piece.cells));
      for (const kick of [0, -1, 1, -2, 2]) {
        if (canPlace(rotated, g.piece.row, g.piece.col + kick)) {
          g.piece.cells = rotated;
          g.piece.col += kick;
          updateGhost();
          return;
        }
      }
    }

    function cellCenter(r: number, c: number) {
      return { x: c * CELL + CELL / 2, y: r * CELL + CELL / 2 };
    }

    function draw() {
      ctx.clearRect(0, 0, CW, CH);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, CW, CH);

      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          if (g.board[r][c]) {
            const { x, y } = cellCenter(r, c);
            drawPulga(ctx, x, y, BALL_R);
          }
        }
      }

      if (g.piece) {
        for (const [dr, dc] of g.piece.cells) {
          const { x, y } = cellCenter(g.ghostRow + dr, g.piece.col + dc);
          drawPulga(ctx, x, y, BALL_R, 0.12);
        }
        for (const [dr, dc] of g.piece.cells) {
          const { x, y } = cellCenter(g.piece.row + dr, g.piece.col + dc);
          drawPulga(ctx, x, y, BALL_R);
        }
      }

      if (g.over) {
        ctx.fillStyle = 'rgba(255,255,255,0.82)';
        ctx.fillRect(0, 0, CW, CH);
        ctx.fillStyle = '#000';
        ctx.font = '500 11px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', CW / 2, CH / 2 - 10);
        ctx.font = '400 9px Inter, system-ui, sans-serif';
        ctx.fillText('CLICK TO RESTART', CW / 2, CH / 2 + 10);
      }
    }

    function loop(ts: number) {
      if (g.over) return;
      if (ts - g.lastTick > g.interval) {
        moveDown();
        g.lastTick = ts;
      }
      draw();
      g.animId = requestAnimationFrame(loop);
    }

    function restart() {
      g.over = false;
      g.board = Array.from({ length: ROWS }, () => new Array(COLS).fill(false));
      newPiece();
      g.lastTick = performance.now();
      g.animId = requestAnimationFrame(loop);
    }

    const handleKey = (e: KeyboardEvent) => {
      if (g.over || !g.piece) return;
      switch (e.key) {
        case 'ArrowLeft': case 'a': e.preventDefault(); moveLeft(); break;
        case 'ArrowRight': case 'd': e.preventDefault(); moveRight(); break;
        case 'ArrowDown': case 's': e.preventDefault(); moveDown(); break;
        case 'ArrowUp': case 'w': e.preventDefault(); rotate(); break;
        case ' ': e.preventDefault(); hardDrop(); break;
      }
      draw();
    };

    const handleClick = () => {
      if (g.over) restart();
    };

    let touchX0 = 0, touchY0 = 0, touchT0 = 0;
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchX0 = e.touches[0].clientX;
      touchY0 = e.touches[0].clientY;
      touchT0 = Date.now();
    };
    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (g.over) { restart(); return; }
      if (!g.piece) return;
      const dx = e.changedTouches[0].clientX - touchX0;
      const dy = e.changedTouches[0].clientY - touchY0;
      const dt = Date.now() - touchT0;
      const adx = Math.abs(dx), ady = Math.abs(dy);
      if (adx < 8 && ady < 8 && dt < 200) { rotate(); draw(); return; }
      if (adx > ady) {
        if (dx > 20) moveRight(); else if (dx < -20) moveLeft();
      } else {
        if (dy > 20) { if (dt < 150) hardDrop(); else moveDown(); }
      }
      draw();
    };

    document.addEventListener('keydown', handleKey);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    newPiece();
    g.animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(g.animId);
      document.removeEventListener('keydown', handleKey);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [open, drawPulga]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/90 backdrop-blur-sm"
          style={{ cursor: 'default' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -top-10 left-0 right-0 flex items-center justify-between">
              <p className="text-[9px] uppercase tracking-tight text-muted-foreground font-sans">
                ← → move &nbsp; ↑ rotate &nbsp; ↓ descend &nbsp; space drop
              </p>
              <button
                onClick={onClose}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
                style={{ cursor: 'default' }}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>
            <canvas ref={canvasRef} style={{ width: CW, height: CH, display: 'block' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PulgaTetris;
