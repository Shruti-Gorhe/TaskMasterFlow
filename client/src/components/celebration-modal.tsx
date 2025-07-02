import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Task } from "@shared/schema";

interface CelebrationModalProps {
  tasks: Task[];
}

export function CelebrationModal({ tasks }: CelebrationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownToday, setHasShownToday] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const allTasksCompleted = totalTasks > 0 && completedTasks === totalTasks;

  useEffect(() => {
    const today = new Date().toDateString();
    const lastShown = localStorage.getItem("celebration-shown");
    
    if (allTasksCompleted && lastShown !== today && !hasShownToday) {
      setIsOpen(true);
      setHasShownToday(true);
      localStorage.setItem("celebration-shown", today);
      
      // Create confetti effect
      createConfetti();
    }
  }, [allTasksCompleted, hasShownToday]);

  const createConfetti = () => {
    const colors = ['#10B981', '#0EA5E9', '#A78BFA', '#F472B6', '#FDE047'];
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '9999';
    document.body.appendChild(confettiContainer);

    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'absolute';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = '10px';
      confetti.style.height = '10px';
      confetti.style.borderRadius = '50%';
      confetti.className = 'animate-confetti';
      confetti.style.animationDelay = Math.random() * 3 + 's';
      confettiContainer.appendChild(confetti);
    }

    setTimeout(() => {
      document.body.removeChild(confettiContainer);
    }, 3000);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-4 text-center animate-bounce-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
        <p className="text-gray-600 mb-6">
          You've completed all your tasks for today! You're crushing it! 🌟
          <br />
          <br />
          <strong>{completedTasks} tasks completed</strong> - What an achievement!
        </p>
        <Button
          onClick={handleClose}
          className="px-6 py-3 bg-gradient-to-r from-mint to-sky text-white rounded-xl hover:shadow-lg transition-all font-medium"
        >
          Awesome! 🚀
        </Button>
      </DialogContent>
    </Dialog>
  );
}
