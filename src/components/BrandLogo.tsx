interface BrandLogoProps {
  size?: number;
  textSize?: string;
  withWordmark?: boolean;
}

function GearMark({ size, color }: { size: number; color: string }) {
  const TEETH = 14;
  const TOOTH_DEPTH = size * 0.08;
  const bodyR = size / 2 - TOOTH_DEPTH;
  const innerR = bodyR - size * 0.06;
  const TOOTH_HALF = 0.13;
  const TOOTH_TIP = 0.07;
  const ROUND = size * 0.04;
  const cx = size / 2;
  const cy = size / 2;

  const segs: string[] = [];
  for (let i = 0; i < TEETH; i++) {
    const a = (i / TEETH) * Math.PI * 2;
    const aNext = ((i + 1) / TEETH) * Math.PI * 2;
    const aHalf = (a + aNext) / 2;
    const b1 = [cx + bodyR * Math.cos(a - TOOTH_HALF), cy + bodyR * Math.sin(a - TOOTH_HALF)];
    const b2 = [cx + bodyR * Math.cos(a + TOOTH_HALF), cy + bodyR * Math.sin(a + TOOTH_HALF)];
    const t1 = [cx + (bodyR + TOOTH_DEPTH) * Math.cos(aHalf - TOOTH_TIP), cy + (bodyR + TOOTH_DEPTH) * Math.sin(aHalf - TOOTH_TIP)];
    const t2 = [cx + (bodyR + TOOTH_DEPTH) * Math.cos(aHalf + TOOTH_TIP), cy + (bodyR + TOOTH_DEPTH) * Math.sin(aHalf + TOOTH_TIP)];
    segs.push(
      `Q ${cx + bodyR * Math.cos(a - TOOTH_HALF + 0.04)},${cy + bodyR * Math.sin(a - TOOTH_HALF + 0.04)} ${b1[0]},${b1[1]}`,
      `Q ${cx + (bodyR + ROUND) * Math.cos(aHalf - TOOTH_TIP - 0.02)},${cy + (bodyR + ROUND) * Math.sin(aHalf - TOOTH_TIP - 0.02)} ${t1[0]},${t1[1]}`,
      `Q ${cx + (bodyR + TOOTH_DEPTH + ROUND * 0.6) * Math.cos(aHalf)},${cy + (bodyR + TOOTH_DEPTH + ROUND * 0.6) * Math.sin(aHalf)} ${t2[0]},${t2[1]}`,
      `Q ${cx + (bodyR + ROUND) * Math.cos(aHalf + TOOTH_TIP + 0.02)},${cy + (bodyR + ROUND) * Math.sin(aHalf + TOOTH_TIP + 0.02)} ${b2[0]},${b2[1]}`
    );
  }
  const startX = cx + bodyR * Math.cos(-TOOTH_HALF);
  const startY = cy + bodyR * Math.sin(-TOOTH_HALF);
  const path = `M ${startX},${startY} ${segs.join(' ')} Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="animate-[spin_12s_linear_infinite]">
      <path d={path} fill={color} />
      <circle cx={cx} cy={cy} r={innerR} fill="#000" />
      <circle cx={cx} cy={cy} r={innerR * 0.45} fill={color} />
    </svg>
  );
}

export default function BrandLogo({ size = 18, textSize = 'text-2xl', withWordmark = true }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-2">
      <GearMark size={size * 2} color="#10B981" />
      {withWordmark && (
        <h1
          className={`${textSize} font-bold tracking-tight text-emerald-500`}
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Jornadas
        </h1>
      )}
    </div>
  );
}
