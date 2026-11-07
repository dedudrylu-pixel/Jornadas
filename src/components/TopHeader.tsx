import { Compass } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

export default function TopHeader() {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-black/90 backdrop-blur-xl px-4 py-3">
      <BrandLogo size={18} textSize="text-2xl" />
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-400">Ao vivo</span>
        </span>
        <button className="text-white/70 hover:text-white">
          <Compass size={22} />
        </button>
      </div>
    </div>
  );
}
