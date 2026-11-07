import { X, Check, Circle, Cog, Flag, Play, Trophy } from 'lucide-react';
import type { Story, CyclePhase } from '@/types';

interface CycleModalProps {
  story: Story;
  storyIndex: number;
  onClose: () => void;
  onViewStory: (index: number) => void;
}

const phaseConfig: Record<CyclePhase, { icon: typeof Flag; color: string; bg: string; border: string; ring: string }> = {
  planejamento: { icon: Flag, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30', ring: 'ring-sky-500/40' },
  execucao: { icon: Play, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', ring: 'ring-emerald-500/40' },
  conclusao: { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', ring: 'ring-amber-500/40' },
};

const phaseOrder: CyclePhase[] = ['planejamento', 'execucao', 'conclusao'];

export default function CycleModal({ story, storyIndex, onClose, onViewStory }: CycleModalProps) {
  const { cycle, user, journeyTitle, progress } = story;
  const config = phaseConfig[cycle.phase];
  const PhaseIcon = config.icon;
  const currentPhaseIndex = phaseOrder.indexOf(cycle.phase);
  const completedTasks = cycle.tasks.filter((t) => t.done).length;
  const phaseProgress = Math.round((completedTasks / cycle.tasks.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="w-full max-w-[468px] max-h-[85vh] overflow-y-auto no-scrollbar rounded-t-3xl sm:rounded-3xl bg-[#0a0a0a] border border-white/10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2">
          <div className="flex items-center gap-3">
            <div className={`story-ring p-[2px] rounded-full`}>
              <div className="rounded-full border-2 border-black overflow-hidden">
                <img src={user.avatar} alt={user.name} className="h-10 w-10 object-cover" loading="lazy" />
              </div>
            </div>
            <div>
              <span className="text-sm font-bold text-white block">{user.name}</span>
              <span className="text-xs text-white/50">{story.timestamp} atrás</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white p-1">
            <X size={22} />
          </button>
        </div>

        {/* Journey title */}
        <div className="px-5 pt-3 pb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40">Jornada</span>
          <h2 className="text-lg font-bold text-white leading-tight mt-0.5">{journeyTitle}</h2>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/60">Progresso geral</span>
            <span className="text-xs font-bold text-emerald-400">{progress}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Phase timeline */}
        <div className="px-5 pb-4">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/40 mb-3 block">Ciclo atual</span>
          <div className="flex items-center justify-between gap-1">
            {phaseOrder.map((phase, i) => {
              const pConfig = phaseConfig[phase];
              const PIcon = pConfig.icon;
              const isCurrent = phase === cycle.phase;
              const isPast = currentPhaseIndex > i;
              return (
                <div key={phase} className="flex flex-1 flex-col items-center gap-1.5">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                      isCurrent
                        ? `${pConfig.border} ${pConfig.bg} ${pConfig.ring} ring-2`
                        : isPast
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-white/10 bg-white/[0.02]'
                    }`}
                  >
                    <PIcon
                      size={18}
                      className={isCurrent ? pConfig.color : isPast ? 'text-emerald-400/60' : 'text-white/25'}
                    />
                  </div>
                  <span className={`text-[10px] font-semibold capitalize ${isCurrent ? pConfig.color : isPast ? 'text-emerald-400/50' : 'text-white/30'}`}>
                    {phaseConfig[phase].icon === Flag ? 'Planejamento' : phaseConfig[phase].icon === Play ? 'Execução' : 'Conclusão'}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Connector line */}
          <div className="relative mt-[-32px] mx-12 h-[2px] bg-white/[0.08] mb-6">
            <div
              className="absolute h-full bg-emerald-500/40 rounded-full transition-all"
              style={{ width: `${(currentPhaseIndex / 2) * 100}%` }}
            />
          </div>
        </div>

        {/* Phase detail card */}
        <div className="px-5 pb-4">
          <div className={`rounded-2xl border ${config.border} ${config.bg} p-4`}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${config.bg} border ${config.border}`}>
                <Cog size={18} className={config.color} />
              </div>
              <div>
                <span className="text-sm font-bold text-white">Fase: {cycle.phaseLabel}</span>
                <span className="text-[11px] text-white/50 block">
                  {cycle.daysInPhase} de {cycle.totalDaysPlanned} dias planejados
                </span>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">{cycle.description}</p>

            {/* Phase progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-white/60">Tarefas da fase</span>
                <span className={`text-[11px] font-bold ${config.color}`}>{completedTasks}/{cycle.tasks.length}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    cycle.phase === 'conclusao' ? 'bg-amber-400' : cycle.phase === 'planejamento' ? 'bg-sky-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${phaseProgress}%` }}
                />
              </div>
            </div>

            {/* Task list */}
            <div className="space-y-2.5">
              {cycle.tasks.map((task, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border shrink-0 ${
                    task.done ? 'bg-emerald-500 border-emerald-500' : 'border-white/20'
                  }`}>
                    {task.done ? (
                      <Check size={12} className="text-black" strokeWidth={3} />
                    ) : (
                      <Circle size={6} className="text-white/30" />
                    )}
                  </div>
                  <span className={`text-sm ${task.done ? 'text-white/50 line-through' : 'text-white/85'}`}>
                    {task.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-6 pt-1 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-white/[0.06] border border-white/[0.08] py-3 text-sm font-semibold text-white active:scale-95 transition-transform"
          >
            Fechar
          </button>
          <button
            onClick={() => onViewStory(storyIndex)}
            className="flex-1 rounded-xl bg-emerald-500 py-3 text-sm font-bold text-black active:scale-95 transition-transform"
          >
            Ver atualização
          </button>
        </div>
      </div>
    </div>
  );
}
