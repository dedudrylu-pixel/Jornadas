import * as LucideIcons from 'lucide-react';
import { achievements, leaderboard } from '@/data';
import type { Achievement } from '@/types';

const rarityStyles: Record<Achievement['rarity'], { border: string; glow: string; text: string; bg: string }> = {
  common: { border: 'border-white/15', glow: '', text: 'text-white/70', bg: 'bg-white/[0.04]' },
  rare: { border: 'border-emerald-500/30', glow: 'shadow-emerald-500/10', text: 'text-emerald-400', bg: 'bg-emerald-500/5' },
  epic: { border: 'border-amber-500/30', glow: 'shadow-amber-500/10', text: 'text-amber-400', bg: 'bg-amber-500/5' },
  legendary: { border: 'border-rose-500/30', glow: 'shadow-rose-500/10', text: 'text-rose-400', bg: 'bg-rose-500/5' },
};

export default function AchievementsScreen() {
  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl px-4 py-3 border-b border-white/[0.06]">
        <h1 className="text-xl font-bold text-white">Conquistas & Ranking</h1>
      </div>

      {/* Leaderboard */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.Trophy size={18} className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Ranking de Apoio</h2>
        </div>
        <div className="space-y-2">
          {leaderboard.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 rounded-2xl border px-3.5 py-3 ${
                i === 0
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-white/[0.06] bg-white/[0.02]'
              }`}
            >
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                i === 0 ? 'bg-emerald-500 text-black' : i === 1 ? 'bg-white/20 text-white' : i === 2 ? 'bg-amber-600/50 text-amber-200' : 'bg-white/5 text-white/50'
              }`}>
                {i + 1}
              </div>
              <img src={entry.user.avatar} alt={entry.user.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
              <div className="flex-1 min-w-0">
                <span className="text-sm font-semibold text-white block truncate">{entry.user.name}</span>
                <span className="text-[11px] text-white/45">{entry.activeJourneys} jornadas ativas · {entry.journeysCompleted} concluídas</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-emerald-400">{entry.supportPoints.toLocaleString('pt-BR')}</span>
                <span className="text-[10px] text-white/40 block">pontos</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="px-4 py-2">
        <div className="flex items-center gap-2 mb-3">
          <LucideIcons.Award size={18} className="text-emerald-400" />
          <h2 className="text-lg font-bold text-white">Suas Conquistas</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((ach) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[ach.icon] || LucideIcons.Award;
            const style = rarityStyles[ach.rarity];
            const locked = ach.unlockedAt === 'Não desbloqueado';
            return (
              <div
                key={ach.id}
                className={`rounded-2xl border ${style.border} ${style.bg} p-4 ${locked ? 'opacity-40' : style.glow} shadow-lg`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${style.bg} border ${style.border} mb-3`}>
                  <Icon size={24} className={style.text} />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{ach.title}</h3>
                <p className="text-[11px] text-white/50 leading-relaxed mb-2">{ach.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-semibold uppercase tracking-wide ${style.text}`}>{ach.rarity}</span>
                  <span className="text-[10px] text-white/35">{ach.unlockedAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
