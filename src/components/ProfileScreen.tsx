import { Settings, Grid3x3, Trophy, Flame, Heart, Bookmark, Shield } from 'lucide-react';
import { currentUser, posts } from '@/data';

interface ProfileScreenProps {
  onOpenComment: (postId: string) => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
  isAdmin: boolean;
}

export default function ProfileScreen({ onOpenComment, onOpenTerms, onOpenAdmin, isAdmin }: ProfileScreenProps) {
  const userPosts = posts.slice(0, 3);
  const savedPosts = posts.filter((p) => p.saved);

  const stats = [
    { label: 'Jornadas', value: 3 },
    { label: 'Apoios dados', value: 847 },
    { label: 'Conquistas', value: 5 },
  ];

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-black/90 backdrop-blur-xl px-4 py-3 border-b border-white/[0.06]">
        <span className="text-lg font-bold text-white">{currentUser.username}</span>
        <button className="text-white/60 hover:text-white">
          <Settings size={22} />
        </button>
      </div>

      {/* Profile info */}
      <div className="px-4 py-5">
        <div className="flex items-center gap-6">
          <div className="story-ring p-[3px] rounded-full">
            <div className="rounded-full border-2 border-black overflow-hidden">
              <img src={currentUser.avatar} alt={currentUser.name} className="h-20 w-20 object-cover" loading="lazy" />
            </div>
          </div>
          <div className="flex flex-1 justify-around">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col items-center">
                <span className="text-lg font-bold text-white">{s.value}</span>
                <span className="text-[11px] text-white/50">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-base font-bold text-white">{currentUser.name}</h2>
          <p className="text-sm text-white/60 mt-0.5">Evoluindo um dia de cada vez</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
              <Flame size={11} /> 45 dias de progresso
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[11px] font-semibold text-white/60 border border-white/10">
              <Trophy size={11} /> Nível 12
            </span>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button className="flex-1 rounded-xl bg-white/[0.08] border border-white/[0.1] py-2 text-sm font-semibold text-white active:scale-95 transition-transform">
            Editar perfil
          </button>
          <button className="flex-1 rounded-xl bg-emerald-500 py-2 text-sm font-semibold text-black active:scale-95 transition-transform">
            Compartilhar jornada
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-white/[0.06] flex">
        <button className="flex flex-1 items-center justify-center py-3 border-t-2 border-white text-white">
          <Grid3x3 size={20} />
        </button>
        <button className="flex flex-1 items-center justify-center py-3 border-t-2 border-transparent text-white/30">
          <Heart size={20} />
        </button>
        <button className="flex flex-1 items-center justify-center py-3 border-t-2 border-transparent text-white/30">
          <Bookmark size={20} />
        </button>
      </div>

      {/* Posts grid */}
      <div className="grid grid-cols-3 gap-[2px]">
        {userPosts.map((p) => (
          <button
            key={p.id}
            onClick={() => onOpenComment(p.id)}
            className="relative aspect-square overflow-hidden bg-white/[0.03] active:opacity-80 transition-opacity"
          >
            <img src={p.image} alt={p.milestone} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-1 left-1.5 right-1.5">
              <div className="h-1 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-400" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
          </button>
        ))}
        {savedPosts.map((p) => (
          <button
            key={`saved-${p.id}`}
            onClick={() => onOpenComment(p.id)}
            className="relative aspect-square overflow-hidden bg-white/[0.03] active:opacity-80 transition-opacity"
          >
            <img src={p.image} alt={p.milestone} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute top-1.5 right-1.5">
              <Bookmark size={14} className="fill-emerald-400 text-emerald-400" />
            </div>
          </button>
        ))}
      </div>

      {/* Admin link */}
      {isAdmin && (
        <div className="px-4 pt-4">
          <button
            onClick={onOpenAdmin}
            className="flex w-full items-center gap-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm font-semibold text-emerald-400 active:scale-[0.98] transition-transform"
          >
            <Shield size={18} />
            Painel de Administração
          </button>
        </div>
      )}

      {/* Footer */}
      <div className="px-4 py-6 mt-2 border-t border-white/[0.06]">
        <button
          onClick={onOpenTerms}
          className="text-xs font-medium text-white/40 hover:text-white/70 active:scale-95 transition-all"
        >
          Termos de Uso & Política de Privacidade
        </button>
        <p className="mt-1.5 text-[11px] text-white/25">© 2026 Evolução. Todos os direitos reservados.</p>
      </div>
    </div>
  );
}
