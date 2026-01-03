import { useState } from 'react';
import { Phone, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Founder } from '@/data/mockData';

interface FounderCardProps {
  founder: Founder;
}

export function FounderCard({ founder }: FounderCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card 
        className="overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <div className="aspect-square overflow-hidden">
          <img
            src={founder.photoURL}
            alt={founder.name}
            className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
          />
        </div>
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 text-xs font-medium  text-primary rounded-full">
            {founder.role}
          </span>
        </div>
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">
          {founder.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {founder.description}
        </p>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 text-primary shrink-0" />
          <span>{founder.contact}</span>
        </div>
      </CardContent>
    </Card>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display">{founder.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Founder Profile Section */}
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Founder Photo - Smaller */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-lg overflow-hidden bg-muted">
                <img
                  src={founder.photoURL}
                  alt={founder.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Founder Info */}
            <div className="flex-1 space-y-4">
              <div>
                <Badge className="mb-3">{founder.role}</Badge>
                <h3 className="text-xl font-semibold mb-2">{founder.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <span className="font-medium">{founder.contact}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Full Description */}
          <div className="pt-4 border-t">
            <h4 className="font-semibold text-lg mb-3">About</h4>
            <p className="text-muted-foreground leading-relaxed">
              {founder.description}
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
