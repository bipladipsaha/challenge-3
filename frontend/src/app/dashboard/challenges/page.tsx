'use client';

import { motion } from 'framer-motion';
import { Trophy, Bike, TreePine, Recycle, Bus, Flame, Star } from 'lucide-react';

const challenges = [
  {
    id: '1',
    title: 'Cycle 20km This Week',
    description: 'Replace car trips with bicycle rides totaling 20km.',
    difficulty: 'MEDIUM',
    points: 150,
    icon: Bike,
    progress: 65,
  },
  {
    id: '2',
    title: 'Plant Two Trees',
    description: 'Plant two trees in your local area or community garden.',
    difficulty: 'HARD',
    points: 300,
    icon: TreePine,
    progress: 0,
  },
  {
    id: '3',
    title: 'Zero Plastic Week',
    description: 'Avoid single-use plastics for an entire week.',
    difficulty: 'HARD',
    points: 250,
    icon: Recycle,
    progress: 42,
  },
  {
    id: '4',
    title: 'Public Transit Challenge',
    description: 'Use public transportation at least twice this week.',
    difficulty: 'EASY',
    points: 100,
    icon: Bus,
    progress: 100,
  },
];

const difficultyColors = {
  EASY: 'bg-emerald-500/10 text-emerald-500',
  MEDIUM: 'bg-yellow-500/10 text-yellow-500',
  HARD: 'bg-red-500/10 text-red-500',
};

export default function ChallengesPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-emerald-500" aria-hidden="true" />
          Eco Challenges
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Complete sustainability challenges to earn points and badges
        </p>
      </div>

      {/* Points Summary */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center">
            <Flame className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-2xl font-bold">1,250</p>
            <p className="text-sm text-muted-foreground">Total Points Earned</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" aria-hidden="true" />
          <span className="text-sm font-medium">Level 5 — Eco Warrior</span>
        </div>
      </div>

      {/* Challenge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <challenge.icon className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{challenge.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${difficultyColors[challenge.difficulty as keyof typeof difficultyColors]}`}>
                    {challenge.difficulty}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  {challenge.description}
                </p>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">{challenge.progress}%</span>
                  <span className="text-xs font-medium text-emerald-500">
                    +{challenge.points} pts
                  </span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${challenge.progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full gradient-bg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
