import BrandLogo from '@/components/BrandLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  return (
    <div
      className="min-h-screen bg-black flex flex-col items-center justify-center"
      onAnimationEnd={onFinish}
    >
      <div className="animate-scale-in flex flex-col items-center gap-4">
        <BrandLogo size={32} textSize="text-4xl" />
        <p className="text-sm text-white/40 tracking-wide">Evolua um ciclo de cada vez</p>
      </div>
    </div>
  );
}
