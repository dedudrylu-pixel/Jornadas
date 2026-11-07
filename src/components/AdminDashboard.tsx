import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Shield, Users, Cog, Crown, Search, Loader2, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import type { ProfileRow } from '@/lib/supabase';
import { stories } from '@/data';

interface AdminDashboardProps {
  onBack: () => void;
}

export default function AdminDashboard({ onBack }: AdminDashboardProps) {
  const { profile } = useAuth();
  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [stats, setStats] = useState<{ total_users: number; total_admins: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [profilesRes, statsRes] = await Promise.all([
        supabase.rpc('get_all_profiles'),
        supabase.rpc('get_admin_stats'),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      if (statsRes.error) throw statsRes.error;
      setUsers((profilesRes.data as ProfileRow[]) || []);
      setStats((statsRes.data as { total_users: number; total_admins: number }[])?.[0] || null);
    } catch {
      setError('Não foi possível carregar os dados do painel.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleToggleRole = async (user: ProfileRow) => {
    if (user.id === profile?.id) return;
    setActionId(user.id);
    setActionMsg('');
    const newRole = user.role === 'admin' ? 'member' : 'admin';
    try {
      const { error: rpcError } = await supabase.rpc('set_user_role', {
        p_user: user.id,
        p_role: newRole,
      });
      if (rpcError) throw rpcError;
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole as 'member' | 'admin' } : u))
      );
      setStats((prev) =>
        prev
          ? {
              total_users: prev.total_users,
              total_admins: newRole === 'admin' ? prev.total_admins + 1 : prev.total_admins - 1,
            }
          : prev
      );
      setActionMsg(`${user.email} agora é ${newRole === 'admin' ? 'administrador' : 'membro'}.`);
    } catch {
      setActionMsg('Não foi possível alterar a função deste utilizador.');
    } finally {
      setActionId(null);
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalCycles = stories.length;

  return (
    <div className="min-h-screen bg-black pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 bg-black/90 backdrop-blur-xl px-4 py-3 border-b border-emerald-500/20">
        <button
          onClick={onBack}
          className="text-white/60 hover:text-white active:scale-90 transition-transform"
          aria-label="Voltar"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-emerald-500" />
          <span className="text-lg font-bold text-white">Painel Admin</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pt-5">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            icon={<Users size={18} />}
            label="Utilizadores"
            value={loading ? '—' : String(stats?.total_users ?? 0)}
          />
          <StatCard
            icon={<Crown size={18} />}
            label="Admins"
            value={loading ? '—' : String(stats?.total_admins ?? 0)}
          />
          <StatCard
            icon={<Cog size={18} />}
            label="Ciclos"
            value={String(totalCycles)}
          />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
          <input
            type="text"
            placeholder="Buscar utilizador por e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:border-emerald-500/50 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Action feedback */}
      {actionMsg && (
        <div className="mx-4 mt-3 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-400 border border-emerald-500/20 animate-fade-in">
          {actionMsg}
        </div>
      )}
      {error && (
        <div className="mx-4 mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 border border-red-500/20">
          {error}
        </div>
      )}

      {/* Users list */}
      <div className="px-4 pt-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-emerald-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <Users size={32} className="mx-auto text-white/20" />
            <p className="mt-3 text-sm text-white/40">
              {search ? 'Nenhum utilizador encontrado.' : 'Nenhum utilizador registado ainda.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredUsers.map((u) => {
              const isSelf = u.id === profile?.id;
              const isActioning = actionId === u.id;
              return (
                <div
                  key={u.id}
                  className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.06] p-3"
                >
                  {/* Avatar placeholder with initial */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20">
                    <span className="text-sm font-bold text-emerald-400 uppercase">
                      {u.email.charAt(0)}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{u.email}</p>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                          <Crown size={10} /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold text-white/50 border border-white/10">
                          Membro
                        </span>
                      )}
                      <span className="text-[10px] text-white/30">
                        {new Date(u.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>

                  {/* Toggle role button */}
                  <button
                    onClick={() => handleToggleRole(u)}
                    disabled={isSelf || isActioning}
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all active:scale-95 ${
                      isSelf
                        ? 'cursor-not-allowed bg-white/[0.04] text-white/25'
                        : isActioning
                          ? 'bg-white/[0.06] text-white/40'
                          : u.role === 'admin'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25'
                            : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/25'
                    }`}
                  >
                    {isActioning ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : u.role === 'admin' ? (
                      <span className="flex items-center gap-1">
                        <X size={12} /> Remover
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Check size={12} /> Promover
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
      <div className="flex items-center gap-1.5 text-emerald-500">
        {icon}
      </div>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
      <p className="text-[10px] text-white/40">{label}</p>
    </div>
  );
}
