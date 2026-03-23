import { clsx } from 'clsx';
import { initials } from '../../utils/calculations';

const COLORS = [
  'bg-violet-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-lime-500', 'bg-rose-500', 'bg-indigo-500',
];

function colorFromName(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export default function Avatar({ name = '', size = 'md', className = '' }) {
  const sizeMap = { xs: 'w-6 h-6 text-xs', sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  return (
    <div className={clsx('rounded-full flex items-center justify-center font-bold text-white shrink-0', colorFromName(name), sizeMap[size], className)}>
      {initials(name)}
    </div>
  );
}
