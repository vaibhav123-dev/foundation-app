import { Phone, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Member } from '@/data/mockData';

interface MemberCardProps {
  member: Member;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <Card className="overflow-hidden card-shadow hover:card-shadow-hover transition-shadow duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={member.photoURL}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <h3 className="font-display text-xl font-semibold text-foreground mb-1">
          {member.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">Age: {member.age} years</p>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="truncate">{member.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 text-primary shrink-0" />
            <span>{member.contact}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>Joined: {new Date(member.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
