import { useState } from 'react';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2 } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';
import { supabase } from '@/lib/supabase';

interface LoginScreenProps {
  onOpenTerms: () => void;
}

export default function LoginScreen({ onOpenTerms }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup' && !name.trim()) {
      setError('Digite seu nome.');
      return;
    }
    if (!email.trim()) {
      setError('Digite seu e-mail.');
      return;
    }
    if (password.length < 4) {
      setError('A senha deve ter ao menos 4 caracteres.');
      return;
    }
    if (mode === 'signup' && !accepted) {
      setError('Você precisa aceitar os Termos para criar sua conta.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (signUpError) throw signUpError;
      }
    } catch {
      setError(mode === 'login'
        ? 'E-mail ou senha incorretos.'
        : 'Não foi possível criar a conta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Decorative top */}
      <div className="relative h-44 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/30 via-black to-black" />
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          <BrandLogo size={26} textSize="text-3xl" />
        </div>
      </div>

      {/* Form */}
      <div className="flex flex-1 flex-col px-6 pt-10">
        <h1 className="text-center text-2xl font-bold text-white">
          {mode === 'login' ? 'Bem-vindo de volta' : 'Comece sua jornada'}
        </h1>
        <p className="mt-1.5 text-center text-sm text-white/50">
          {mode === 'login'
            ? 'Entre para acompanhar sua evolução'
            : 'Crie sua conta e defina suas primeiras metas'}
        </p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          {mode === 'signup' && (
            <Field
              icon={<UserIcon size={18} />}
              type="text"
              placeholder="Nome"
              value={name}
              onChange={setName}
            />
          )}
          <Field
            icon={<Mail size={18} />}
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={setEmail}
          />
          <div className="relative">
            <Field
              icon={<Lock size={18} />}
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={setPassword}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {mode === 'signup' && (
            <label className="flex items-start gap-2.5 pt-1 text-xs text-white/55">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/[0.06] accent-emerald-500"
              />
              <span>
                Li e aceito os{' '}
                <button
                  type="button"
                  onClick={onOpenTerms}
                  className="font-semibold text-emerald-400 underline underline-offset-2"
                >
                  Termos de Uso e Política de Privacidade
                </button>
                .
              </span>
            </label>
          )}

          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 border border-red-500/20">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-500 py-3.5 text-sm font-bold text-black active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        {mode === 'login' && (
          <button
            onClick={() => setError('')}
            className="mt-3 text-center text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Esqueceu sua senha?
          </button>
        )}

        {/* Divider */}
        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-xs text-white/35">ou continue com</span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* Social sign-in */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            disabled
            className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] border border-white/[0.1] py-3 text-sm font-semibold text-white/40 cursor-not-allowed"
          >
            <GoogleIcon /> Google
          </button>
          <button
            disabled
            className="flex items-center justify-center gap-2 rounded-xl bg-white/[0.06] border border-white/[0.1] py-3 text-sm font-semibold text-white/40 cursor-not-allowed"
          >
            <AppleIcon /> Apple
          </button>
        </div>

        {/* Mode switch */}
        <div className="mt-6 text-center text-sm text-white/50">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                className="font-semibold text-emerald-400"
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className="font-semibold text-emerald-400"
              >
                Entrar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer with Terms link */}
      <div className="px-6 pb-8 pt-4">
        <div className="border-t border-white/[0.06] pt-5 text-center">
          <button
            onClick={onOpenTerms}
            className="text-xs font-medium text-white/40 hover:text-white/70 active:scale-95 transition-all"
          >
            Termos de Uso & Política de Privacidade
          </button>
          <p className="mt-1.5 text-[11px] text-white/25">
            Ao continuar, você concorda com nossos Termos e nossa Política de Privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white/[0.06] border border-white/[0.1] py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-emerald-500/50 focus:outline-none transition-colors"
      />
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="text-white">
      <path d="M16.37 1.43c0 1.14-.43 2.2-1.18 3.02-.82.9-2.16 1.6-3.28 1.51-.13-1.08.42-2.22 1.07-2.97.78-.9 2.18-1.56 3.39-1.56ZM20.5 17.24c-.55 1.28-.82 1.85-1.53 2.98-.99 1.57-2.39 3.53-4.12 3.54-1.54.01-1.94-1-4.03-.99-2.09.01-2.53 1.01-4.07.99-1.73-.02-3.05-1.78-4.04-3.35C-.1 16.23-.27 11.27 1.45 8.62c1.22-1.87 3.16-3.02 4.98-3.02 1.85 0 3.01 1.02 4.54 1.02 1.48 0 2.39-1.02 4.54-1.02 1.63 0 3.36.89 4.58 2.43-4.03 2.21-3.37 7.97.41 9.21Z" />
    </svg>
  );
}
