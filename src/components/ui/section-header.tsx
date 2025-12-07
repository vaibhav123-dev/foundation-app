import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({ title, subtitle, className, align = 'center' }: SectionHeaderProps) {
  return (
    <div className={cn('mb-10', align === 'center' && 'text-center', className)}>
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          {subtitle}
        </p>
      )}
    </div>
  );
}
