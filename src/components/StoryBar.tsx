import { useState } from 'react';
import { Cog } from 'lucide-react';
import type { Story } from '@/types';

interface StoryBarProps {
  stories: Story[];
  onSelect: (index: number) => void;
}

const AVATAR_SIZE = 62;
const GEAR_OUTER = 72;
const TEETH = 14;
const TOOTH_DEPTH = 2.5;
const TOOTH_HALF = 0.13;
const TOOTH_TIP = 0.07;
const ROUND = 1.2;

function GearFrame({
  color,
  spin,
  children,
}: {
  color: string;
  spin: boolean;
  children: React.ReactNode;
}) {
  const cx = GEAR_OUTER / 2;
  const cy = GEAR_OUTER / 2;
  const bodyR = GEAR_OUTER / 2 - TOOTH_DEPTH;
  const innerR = bodyR - 2.5;

  const teeth: string[] = [];
  for (let i = 0; i < TEETH; i++) {
    const a = (i / TEETH) * Math.PI * 2;
    const aNext = ((i + 1) / TEETH) * Math.PI * 2;
    const aHalf = (a + aNext) / 2;
    // base points on body circle
    const b1 = [cx + bodyR * Math.cos(a - TOOTH_HALF), cy + bodyR * Math.sin(a - TOOTH_HALF)];
    const b2 = [cx + bodyR * Math.cos(a + TOOTH_HALF), cy + bodyR * Math.sin(a + TOOTH_HALF)];
    // tip points (slightly outward, narrower)
    const t1 = [cx + (bodyR + TOOTH_DEPTH) * Math.cos(aHalf - TOOTH_TIP), cy + (bodyR + TOOTH_DEPTH) * Math.sin(aHalf - TOOTH_TIP)];
    const t2 = [cx + (bodyR + TOOTH_DEPTH) * Math.cos(aHalf + TOOTH_TIP), cy + (bodyR + TOOTH_DEPTH) * Math.sin(aHalf + TOOTH_TIP)];
    // Use quadratic curves for rounded tips and smooth base transitions
    teeth.push(
      `Q ${cx + bodyR * Math.cos(a - TOOTH_HALF + 0.04)},${cy + bodyR * Math.sin(a - TOOTH_HALF + 0.04)} ${b1[0]},${b1[1]}`,
      `Q ${cx + (bodyR + ROUND) * Math.cos(aHalf - TOOTH_TIP - 0.02)},${cy + (bodyR + ROUND) * Math.sin(aHalf - TOOTH_TIP - 0.02)} ${t1[0]},${t1[1]}`,
      `Q ${cx + (bodyR + TOOTH_DEPTH + ROUND * 0.6) * Math.cos(aHalf)},${cy + (bodyR + TOOTH_DEPTH + ROUND * 0.6) * Math.sin(aHalf)} ${t2[0]},${t2[1]}`,
      `Q ${cx + (bodyR + ROUND) * Math.cos(aHalf + TOOTH_TIP + 0.02)},${cy + (bodyR + ROUND) * Math.sin(aHalf + TOOTH_TIP + 0.02)} ${b2[0]},${b2[1]}`,
      `Q ${cx + bodyR * Math.cos(a + TOOTH_HALF + 0.04)},${cy + bodyR * Math.sin(a + TOOTH_HALF + 0.04)} ${cx + bodyR * Math.cos(a + TOOTH_HALF + 0.04)},${cy + bodyR * Math.sin(a + TOOTH_HALF + 0.04)}`
    );
  }
  // Build a single closed path starting at first base point
  const startA = -TOOTH_HALF;
  const startX = cx + bodyR * Math.cos(startA);
  const startY = cy + bodyR * Math.sin(startA);
  const path = `M ${startX},${startY} ${teeth.join(' ')} Z`;

  return (
    <div className="relative" style={{ width: GEAR_OUTER, height: GEAR_OUTER }}>
      <svg
        width={GEAR_OUTER}
        height={GEAR_OUTER}
        viewBox={`0 0 ${GEAR_OUTER} ${GEAR_OUTER}`}
        className={`absolute inset-0 ${spin ? 'gear-spin-slow' : ''}`}
        style={spin ? undefined : { transition: 'transform 0.6s ease' }}
      >
        <path d={path} fill={color} />
        <circle cx={cx} cy={cy} r={innerR} fill="#000" />
      </svg>
      {/* Static avatar — sits above the gear, does not rotate */}
      <div
        className="absolute overflow-hidden rounded-full border-2 border-black"
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          left: (GEAR_OUTER - AVATAR_SIZE) / 2,
          top: (GEAR_OUTER - AVATAR_SIZE) / 2,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function StoryBar({ stories, onSelect }: StoryBarProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="border-b border-white/[0.06] bg-black px-1 py-3">
      <div className="no-scrollbar flex gap-1 overflow-x-auto px-3">
        {stories.map((story, i) => {
          const isHovered = hoveredIndex === i;
          const active = story.hasNewUpdate;
          const gearColor = active ? '#10B981' : '#3f3f46';

          return (
            <button
              key={story.id}
              onClick={() => onSelect(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group flex flex-col items-center gap-1.5 active:scale-95 transition-transform shrink-0"
            >
              <div className="relative">
                <div className={`transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}>
                  <GearFrame color={gearColor} spin={isHovered}>
                    <img
                      src={story.user.avatar}
                      alt={story.user.name}
                      className="h-[62px] w-[62px] object-cover"
                      loading="lazy"
                    />
                  </GearFrame>
                </div>

                {/* Gear badge — bottom right overlay */}
                <span
                  className={`absolute -bottom-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-black transition-all duration-300 ${
                    isHovered
                      ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40'
                      : story.cycle.phase === 'conclusao'
                        ? 'bg-amber-500/90'
                        : story.cycle.phase === 'planejamento'
                          ? 'bg-sky-500/90'
                          : 'bg-white/15 backdrop-blur-md'
                  }`}
                >
                  <Cog
                    size={13}
                    className={`transition-all duration-500 ${isHovered ? 'text-black gear-spin-fast' : 'text-white'}`}
                  />
                </span>

                {active && !isHovered && (
                  <span className="absolute -top-0.5 -right-0.5 z-10 flex h-3.5 w-3.5 items-center justify-center">
                    <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative h-3 w-3 rounded-full bg-emerald-400 border-2 border-black" />
                  </span>
                )}
              </div>
              <span className="max-w-[66px] truncate text-[11px] font-medium text-white/70">
                {story.user.name.split(' ')[0].toLowerCase()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
