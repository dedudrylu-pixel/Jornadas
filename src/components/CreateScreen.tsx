import { useState } from 'react';
import { X, Camera, Image as ImageIcon, TrendingUp } from 'lucide-react';

interface CreateScreenProps {
  onClose: () => void;
}

const presetImages = [
  'https://images.pexels.com/photos/16549999/pexels-photo-16549999.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  'https://images.pexels.com/photos/4929671/pexels-photo-4929671.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  'https://images.pexels.com/photos/207732/pexels-photo-207732.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  'https://images.pexels.com/photos/40624324/pexels-photo-40624324.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  'https://images.pexels.com/photos/1234853/pexels-photo-1234853.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
  'https://images.pexels.com/photos/16550006/pexels-photo-16550006.jpeg?auto=compress&cs=tinysrgb&h=800&w=800',
];

const categories = ['Fitness', 'Alimentação', 'Educação', 'Bem-estar', 'Criativo', 'Carreira', 'Finanças', 'Social'];

export default function CreateScreen({ onClose }: CreateScreenProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [milestone, setMilestone] = useState('');
  const [category, setCategory] = useState('Fitness');
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  const canPost = selectedImage && title.trim() && milestone.trim();

  return (
    <div className="fixed inset-0 z-50 bg-black animate-fade-in overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-black/90 backdrop-blur-xl px-4 py-3">
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X size={24} />
        </button>
        <span className="text-base font-semibold text-white">Nova Atualização</span>
        <button
          disabled={!canPost}
          className="text-sm font-bold text-emerald-400 disabled:opacity-30"
          onClick={onClose}
        >
          Postar
        </button>
      </div>

      <div className="px-4 py-5 pb-24 space-y-5">
        {/* Image selection */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2.5 block">Foto do progresso</label>
          {selectedImage ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10">
              <img src={selectedImage} alt="Preview" className="h-full w-full object-cover" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {presetImages.map((url) => (
                <button
                  key={url}
                  onClick={() => setSelectedImage(url)}
                  className="relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.03] active:scale-95 transition-transform"
                >
                  <img src={url} alt="Opção" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
              <button className="flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/15 text-white/40 active:scale-95 transition-transform">
                <Camera size={22} />
                <span className="text-[10px] mt-1">Câmera</span>
              </button>
            </div>
          )}
        </div>

        {/* Journey title */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">Título da jornada</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Correr 10km sem parar"
            className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/40"
          />
        </div>

        {/* Milestone */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">Marco alcançado</label>
          <input
            type="text"
            value={milestone}
            onChange={(e) => setMilestone(e.target.value)}
            placeholder="Ex: 7km sem parar pela primeira vez!"
            className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/40"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">Categoria</label>
          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition-colors ${
                  category === cat
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/[0.06] text-white/60 border border-white/[0.08]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Progress slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-white/80 flex items-center gap-1.5">
              <TrendingUp size={15} className="text-emerald-400" />
              Progresso da jornada
            </label>
            <span className="text-sm font-bold text-emerald-400">{progress}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10 accent-emerald-500"
            style={{
              background: `linear-gradient(to right, #10b981 ${progress}%, rgba(255,255,255,0.1) ${progress}%)`,
            }}
          />
          <div className="mt-2 h-2 w-full rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Caption */}
        <div>
          <label className="text-sm font-semibold text-white/80 mb-2 block">Legenda</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Conte sobre sua conquista..."
            rows={3}
            className="w-full rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/40 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
