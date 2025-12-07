import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const isUpcoming = event.status === 'upcoming';

  return (
    <Card className="overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300">
      <div className="relative aspect-video overflow-hidden">
        <img
          src={event.imageURL}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <Badge
          className={cn(
            'absolute top-3 right-3',
            isUpcoming
              ? 'bg-accent text-accent-foreground'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {isUpcoming ? 'Upcoming' : 'Past Event'}
        </Badge>
      </div>
      <CardContent className="p-5">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>{new Date(event.date).toLocaleDateString('en-IN', { 
              weekday: 'short', 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary shrink-0" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
