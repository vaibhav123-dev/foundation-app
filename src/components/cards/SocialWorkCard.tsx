import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SocialWork } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SocialWorkCardProps {
  work: SocialWork;
}

export function SocialWorkCard({ work }: SocialWorkCardProps) {
  const isOngoing = work.status === 'ongoing';

  return (
    <Card className="overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={work.imageURL}
          alt={work.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
        <Badge
          className={cn(
            'absolute top-3 left-3',
            isOngoing
              ? 'bg-accent text-accent-foreground'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {isOngoing ? 'Ongoing' : 'Completed'}
        </Badge>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-display text-xl font-semibold text-card mb-1">
            {work.title}
          </h3>
        </div>
      </div>
      <CardContent className="p-5">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {work.description}
        </p>
      </CardContent>
    </Card>
  );
}
