import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SocialWork } from '@/data/mockData';
import { cn } from '@/lib/utils';

interface SocialWorkCardProps {
  work: SocialWork;
}

export function SocialWorkCard({ work }: SocialWorkCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isOngoing = work.status === 'ongoing';

  return (
    <>
      <Card 
        className="overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 group cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
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

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{work.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Initiative Image */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
            <img
              src={work.imageURL}
              alt={work.title}
              className="h-full w-full object-contain"
            />
            <Badge
              className={cn(
                'absolute top-3 right-3',
                isOngoing
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary text-primary-foreground'
              )}
            >
              {work.status.charAt(0).toUpperCase() + work.status.slice(1)}
            </Badge>
          </div>

          {/* Initiative Description */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-lg mb-2">About This Initiative</h4>
              <p className="text-muted-foreground leading-relaxed">
                {work.description}
              </p>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  variant={isOngoing ? 'default' : 'secondary'}
                  className={cn(
                    isOngoing
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-primary text-primary-foreground'
                  )}
                >
                  {work.status.charAt(0).toUpperCase() + work.status.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Date: </span>
              {new Date(work.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
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
