import { useState } from 'react';
import { X, Heart, Send } from 'lucide-react';
import type { Post, Comment } from '@/types';

interface CommentSheetProps {
  post: Post;
  onClose: () => void;
}

export default function CommentSheet({ post, onClose }: CommentSheetProps) {
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newComment: Comment = {
      id: `c${Date.now()}`,
      user: {
        id: 'u0',
        name: 'Você',
        username: 'voce_jornada',
        avatar: 'https://images.pexels.com/photos/30441507/pexels-photo-30441507.jpeg?auto=compress&cs=tinysrgb&h=350&w=350',
      },
      text: input.trim(),
      timeAgo: 'agora',
    };
    setComments([...comments, newComment]);
    setInput('');
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 animate-fade-in" onClick={onClose} />
      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[468px] -translate-x-1/2 rounded-t-3xl bg-[#0a0a0a] border-t border-white/10 max-h-[75vh] flex flex-col animate-slide-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-white/[0.06]">
          <span className="text-base font-semibold text-white">Comentários</span>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X size={22} />
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 no-scrollbar">
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <img src={c.user.avatar} alt={c.user.name} className="h-8 w-8 rounded-full object-cover shrink-0" loading="lazy" />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-white/90 mr-1.5">{c.user.username}</span>
                  <span className="text-sm text-white/75">{c.text}</span>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-white/40">
                    <span>{c.timeAgo}</span>
                    <button className="font-semibold">Responder</button>
                  </div>
                </div>
                <button className="text-white/30 hover:text-emerald-400 shrink-0 mt-1">
                  <Heart size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-white/[0.06] px-4 py-3 pb-5">
          <img src="https://images.pexels.com/photos/30441507/pexels-photo-30441507.jpeg?auto=compress&cs=tinysrgb&h=350&w=350" alt="Você" className="h-8 w-8 rounded-full object-cover" />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Adicione um comentário de apoio..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="text-sm font-semibold text-emerald-400 disabled:opacity-40"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </>
  );
}
