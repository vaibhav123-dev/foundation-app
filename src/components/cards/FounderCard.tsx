import { Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Founder } from '@/data/mockData';

interface FounderCardProps {
  founder: Founder;
}

export function FounderCard({ founder }: FounderCardProps) {
  return (
    <Card className="overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300">
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={founder.photoURL}
          alt={founder.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-6">
        <div className="mb-2">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
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
  );
}
