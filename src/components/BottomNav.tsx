import { Home, Search, Plus, Trophy, User } from 'lucide-react';

export type Tab = 'home' | 'explore' | 'create' | 'achievements' | 'profile';

interface BottomNavProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  avatar: string;
}

export default function BottomNav({ active, onChange, avatar }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[468px] -translate-x-1/2 border-t border-white/[0.08] bg-black/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around px-2 py-2">
        <NavButton active={active === 'home'} onClick={() => onChange('home')} icon={<Home size={26} />} />
        <NavButton active={active === 'explore'} onClick={() => onChange('explore')} icon={<Search size={26} />} />
        <button
          onClick={() => onChange('create')}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30 active:scale-90 transition-transform"
          aria-label="Nova jornada"
        >
          <Plus size={24} className="text-black" strokeWidth={2.5} />
        </button>
        <NavButton active={active === 'achievements'} onClick={() => onChange('achievements')} icon={<Trophy size={26} />} />
        <button
          onClick={() => onChange('profile')}
          className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${active === 'profile' ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-black' : ''}`}
          aria-label="Perfil"
        >
          <img src={avatar} alt="Você" className="h-8 w-8 rounded-full object-cover" />
        </button>
      </div>
    </nav>
  );
}

function NavButton({ active, onClick, icon }: { active: boolean; onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-10 w-12 items-center justify-center transition-colors ${active ? 'text-emerald-400' : 'text-white/55 hover:text-white'}`}
    >
      {icon}
    </button>
  );
}
