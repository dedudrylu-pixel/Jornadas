import { useState, useEffect } from 'react';
import { X, Heart, MessageCircle } from 'lucide-react';
import type { Story } from '@/types';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [liked, setLiked] = useState(false);

  const story = stories[current];

  useEffect(() => {
    setProgress(0);
    setLiked(false);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (current < stories.length - 1) {
            setCurrent((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return p + 100 / 250;
      });
    }, 20);
    return () => clearInterval(interval);
  }, [current, stories.length, onClose]);

  const goPrev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      setProgress(0);
    }
  };

  const goNext = () => {
    if (current < stories.length - 1) {
      setCurrent((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 animate-fade-in">
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:text-white"
      >
        <X size={24} />
      </button>

      <div className="relative w-full max-w-[420px] h-full max-h-[840px] md:h-[88vh] md:rounded-2xl overflow-hidden bg-black">
        {/* Progress bars */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1.5">
          {stories.map((_, i) => (
            <div key={i} className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: i < current ? '100%' : i === current ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-7 left-3 right-14 z-20 flex items-center gap-2.5">
          <img src={story.user.avatar} alt={story.user.name} className="h-8 w-8 rounded-full object-cover border border-white/20" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{story.user.name}</span>
            <span className="text-[11px] text-white/60">{story.timestamp} atrás</span>
          </div>
        </div>

        {/* Image */}
        <img src={story.storyImage} alt={story.milestone} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />

        {/* Tap zones */}
        <button onClick={goPrev} className="absolute left-0 top-0 z-10 h-full w-1/3" />
        <button onClick={goNext} className="absolute right-0 top-0 z-10 h-full w-2/3" />

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-5 animate-slide-up">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 backdrop-blur-md border border-emerald-500/30">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-semibold text-emerald-300">Nova conquista</span>
          </div>
          <p className="text-xl font-bold text-white mb-1 leading-tight">{story.milestone}</p>
          <p className="text-sm text-white/80 mb-4">{story.journeyTitle}</p>

          <div className="mb-4">
            <div className="flex justify-between mb-1.5">
              <span className="text-[11px] font-medium text-white/60">Progresso da jornada</span>
              <span className="text-[11px] font-bold text-emerald-400">{story.progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                style={{ width: `${story.progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2.5 rounded-full bg-white/10 border border-white/15 px-4 py-2.5 backdrop-blur-md">
              <input
                type="text"
                placeholder="Enviar apoio..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
              />
            </div>
            <button
              onClick={() => setLiked(!liked)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-md"
            >
              <Heart
                size={22}
                className={liked ? 'fill-emerald-400 text-emerald-400 animate-heart-pop' : 'text-white'}
              />
            </button>
            <button className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
              <MessageCircle size={22} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
