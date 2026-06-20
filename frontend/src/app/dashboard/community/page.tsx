'use client';

import { motion } from 'framer-motion';
import { Users, Medal, TrendingUp, Crown } from 'lucide-react';

const leaderboard = [
  { rank: 1, name: 'Emma Wilson', score: 95, reduction: '45%', avatar: '🌟' },
  { rank: 2, name: 'James Chen', score: 91, reduction: '42%', avatar: '🏆' },
  { rank: 3, name: 'Sofia Rodriguez', score: 88, reduction: '38%', avatar: '🥉' },
  { rank: 4, name: 'You', score: 78, reduction: '28%', avatar: '👤', isUser: true },
  { rank: 5, name: 'Liam Patel', score: 75, reduction: '25%', avatar: '🌱' },
  { rank: 6, name: 'Olivia Kim', score: 72, reduction: '22%', avatar: '🌿' },
  { rank: 7, name: 'Noah Smith', score: 68, reduction: '18%', avatar: '🌍' },
  { rank: 8, name: 'Ava Johnson', score: 65, reduction: '15%', avatar: '🍃' },
];

export default function CommunityPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-emerald-500" aria-hidden="true" />
          Community
        </h1>
        <p className="text-muted-foreground text-sm mt-1">See how you compare with other eco warriors</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <Medal className="h-8 w-8 text-yellow-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold">#4</p>
          <p className="text-sm text-muted-foreground">Your Rank</p>
        </div>
        <div className="glass-card p-5 text-center">
          <TrendingUp className="h-8 w-8 text-emerald-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold">28%</p>
          <p className="text-sm text-muted-foreground">Your Reduction</p>
        </div>
        <div className="glass-card p-5 text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" aria-hidden="true" />
          <p className="text-2xl font-bold">1,247</p>
          <p className="text-sm text-muted-foreground">Active Members</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" aria-hidden="true" />
          Leaderboard
        </h2>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: user.rank * 0.05 }}
              className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                user.isUser ? 'bg-primary/10 border border-primary/20' : 'hover:bg-muted/50'
              }`}
            >
              <span className={`text-lg font-bold w-8 text-center ${user.rank <= 3 ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                {user.rank}
              </span>
              <span className="text-2xl">{user.avatar}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${user.isUser ? 'gradient-text font-bold' : ''}`}>
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.reduction} emission reduction</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{user.score}</p>
                <p className="text-xs text-muted-foreground">Eco Score</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
