import { useState } from 'react';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, TrendingUp } from 'lucide-react';
import type { Post } from '@/types';

interface FeedCardProps {
  post: Post;
  onCommentClick: () => void;
}

export default function FeedCard({ post, onCommentClick }: FeedCardProps) {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [showFullCaption, setShowFullCaption] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount((c) => (liked ? c - 1 : c + 1));
  };

  return (
    <article className="border-b border-white/[0.06] pb-2">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5">
        <div className="story-ring p-[2px] rounded-full">
          <div className="rounded-full border-2 border-black overflow-hidden">
            <img src={post.user.avatar} alt={post.user.name} className="h-8 w-8 object-cover" loading="lazy" />
          </div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-white truncate">{post.user.username}</span>
          <span className="text-[11px] text-white/50 truncate">{post.user.name}</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
            {post.category}
          </span>
          <button className="text-white/40 hover:text-white transition-colors p-1">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-white/[0.03]">
        <img
          src={post.image}
          alt={post.milestone}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Milestone badge on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/50 backdrop-blur-md px-3 py-1.5 border border-white/10">
          <TrendingUp size={14} className="text-emerald-400" />
          <span className="text-xs font-semibold text-white">{post.milestone}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-medium text-white/70">{post.journeyTitle}</span>
          <span className="text-xs font-bold text-emerald-400">{post.progress}%</span>
        </div>
        <div className="relative h-2.5 w-full rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
            style={{ width: `${post.progress}%` }}
          />
          <div
            className="absolute inset-y-0 right-2 flex items-center text-[9px] font-bold text-white/30"
          >
            {post.goal}
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-4 px-4 pb-2">
        <button
          onClick={handleLike}
          className="active:scale-90 transition-transform"
          aria-label="Apoiar"
        >
          <Heart
            size={25}
            className={liked ? 'fill-emerald-400 text-emerald-400 animate-heart-pop' : 'text-white hover:text-white/80'}
          />
        </button>
        <button onClick={onCommentClick} className="active:scale-90 transition-transform" aria-label="Comentar">
          <MessageCircle size={25} className="text-white hover:text-white/80" />
        </button>
        <button className="active:scale-90 transition-transform" aria-label="Compartilhar">
          <Send size={24} className="text-white hover:text-white/80" />
        </button>
        <button
          onClick={() => setSaved(!saved)}
          className="ml-auto active:scale-90 transition-transform"
          aria-label="Salvar jornada"
        >
          <Bookmark
            size={24}
            className={saved ? 'fill-emerald-400 text-emerald-400' : 'text-white hover:text-white/80'}
          />
        </button>
      </div>

      {/* Likes count */}
      <div className="px-4">
        <span className="text-sm font-semibold text-white">
          {likeCount.toLocaleString('pt-BR')} apoios
        </span>
      </div>

      {/* Caption */}
      <div className="px-4 pt-1 pb-2">
        <span className="text-sm font-semibold text-white mr-1.5">{post.user.username}</span>
        <span className="text-sm text-white/85">
          {showFullCaption || post.caption.length <= 120
            ? post.caption
            : `${post.caption.slice(0, 120)}...`}
        </span>
        {post.caption.length > 120 && !showFullCaption && (
          <button
            onClick={() => setShowFullCaption(true)}
            className="text-sm text-white/45 ml-1"
          >
            mais
          </button>
        )}
      </div>

      {/* Comments preview */}
      {post.comments.length > 0 && (
        <button onClick={onCommentClick} className="px-4 block">
          <span className="text-sm text-white/45">
            Ver todos os {post.comments.length} comentários
          </span>
          <div className="mt-1 space-y-0.5">
            {post.comments.slice(0, 2).map((c) => (
              <div key={c.id} className="flex items-baseline gap-1.5">
                <span className="text-sm font-semibold text-white/80">{c.user.username}</span>
                <span className="text-sm text-white/70 truncate">{c.text}</span>
              </div>
            ))}
          </div>
        </button>
      )}

      <div className="px-4 pt-1.5">
        <span className="text-[11px] text-white/35 uppercase tracking-wide">{post.timeAgo} atrás</span>
      </div>
    </article>
  );
}
