import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  delay: number;
}

interface ConfettiCelebrationProps {
  isVisible: boolean;
  onComplete?: () => void;
  message?: string;
}

export function ConfettiCelebration({ isVisible, onComplete, message = "Great job! 🎉" }: ConfettiCelebrationProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);

  const colors = [
    "#FFB3D4", // pastel pink
    "#B3D4FF", // pastel blue  
    "#D4FFB3", // pastel green
    "#FFD4B3", // pastel orange
    "#E6B3FF", // pastel purple
    "#FFE6B3", // pastel yellow
  ];

  useEffect(() => {
    if (isVisible) {
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        pieces.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: -20,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          delay: Math.random() * 0.5,
        });
      }
      setConfettiPieces(pieces);

      // Auto-complete after animation
      const timer = setTimeout(() => {
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Celebration Message */}
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 20,
              delay: 0.2 
            }}
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-2xl px-8 py-6 shadow-2xl border border-pastel-pink/50">
              <motion.div
                className="text-4xl font-bold gradient-text mb-2"
                animate={{ 
                  scale: [1, 1.1, 1],
                  textShadow: [
                    "0 0 0px rgba(255, 182, 193, 0.5)",
                    "0 0 20px rgba(255, 182, 193, 0.8)",
                    "0 0 0px rgba(255, 182, 193, 0.5)"
                  ]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "loop" 
                }}
              >
                {message}
              </motion.div>
              <motion.div
                className="text-lg text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Keep up the amazing work! ✨
              </motion.div>
            </div>
          </motion.div>

          {/* Confetti Pieces */}
          {confettiPieces.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-3 h-3 rounded-sm shadow-sm"
              style={{
                backgroundColor: piece.color,
                left: piece.x,
                top: piece.y,
              }}
              initial={{ 
                y: -20, 
                rotate: piece.rotation,
                scale: 0
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: piece.rotation + 360,
                scale: [0, 1, 0.8, 0.6, 0.4, 0.2, 0],
                x: piece.x + (Math.random() - 0.5) * 200
              }}
              transition={{
                duration: 3,
                delay: piece.delay,
                ease: "easeOut"
              }}
            />
          ))}

          {/* Additional sparkle effects */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute text-yellow-400"
              style={{
                left: Math.random() * window.innerWidth,
                top: Math.random() * window.innerHeight,
                fontSize: Math.random() * 20 + 10,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: 360
              }}
              transition={{
                duration: 2,
                delay: Math.random() * 1,
                repeat: 2,
                repeatType: "loop"
              }}
            >
              ✨
            </motion.div>
          ))}

          {/* Radial gradient background effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-pastel-pink/20 via-transparent to-transparent"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 2 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 1.5 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}