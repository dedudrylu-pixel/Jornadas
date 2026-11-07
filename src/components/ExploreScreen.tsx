import { Search as SearchIcon } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { categories, posts, stories } from '@/data';

interface ExploreScreenProps {
  onOpenStory: (index: number) => void;
}

export default function ExploreScreen({ onOpenStory }: ExploreScreenProps) {
  const allImages = [
    ...posts.map((p) => ({ url: p.image, id: p.id, label: p.category, progress: p.progress })),
    ...stories.map((s) => ({ url: s.storyImage, id: s.id, label: s.milestone, progress: s.progress })),
  ];

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Search */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-xl px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 rounded-xl bg-white/[0.06] px-3.5 py-2.5">
          <SearchIcon size={18} className="text-white/40" />
          <input
            type="text"
            placeholder="Buscar jornadas, categorias, pessoas..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4">
        <h2 className="text-lg font-bold text-white mb-3">Categorias</h2>
        <div className="no-scrollbar flex gap-2.5 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[cat.icon] || LucideIcons.Hash;
            return (
              <button
                key={cat.name}
                className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 min-w-[88px] active:scale-95 transition-transform"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
                  <Icon size={20} className="text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-white">{cat.name}</span>
                <span className="text-[10px] text-white/40">{cat.count.toLocaleString('pt-BR')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="px-1">
        <h2 className="px-3 text-lg font-bold text-white mb-3">Descobrir jornadas</h2>
        <div className="grid grid-cols-3 gap-[2px]">
          {allImages.map((img) => (
            <button
              key={img.id}
              onClick={() => onOpenStory(0)}
              className="relative aspect-square overflow-hidden bg-white/[0.03] active:opacity-80 transition-opacity"
            >
              <img src={img.url} alt={img.label} className="h-full w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-1.5 right-1.5">
                <p className="text-[10px] font-semibold text-white truncate">{img.label}</p>
                <div className="mt-1 h-1 w-full rounded-full bg-white/20 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{ width: `${img.progress}%` }}
                  />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
