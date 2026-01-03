import { useState } from 'react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Event } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

// Convert 24-hour time format to 12-hour with AM/PM
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12; // Convert 0 to 12 for midnight
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export function EventCard({ event }: EventCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isUpcoming = event.status === 'upcoming';
  const formattedTime = formatTime(event.time);

  return (
    <>
      <Card 
        className="overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
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
            <span>{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{event.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Event Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <img
              src={event.imageURL}
              alt={event.title}
              className="h-full w-full object-contain"
            />
            <Badge
              className={cn(
                'absolute top-3 right-3',
                isUpcoming
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </Badge>
          </div>

          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5 text-primary shrink-0" />
              <span className="font-medium">
                {new Date(event.date).toLocaleDateString('en-IN', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <span className="font-medium">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5 text-primary shrink-0" />
              <span className="font-medium">{event.location}</span>
            </div>
          </div>

          {/* Event Description */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-2">About This Event</h4>
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Close Button */}
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
