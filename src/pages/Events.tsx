import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { EventCard } from '@/components/cards/EventCard';
import { eventsService } from '@/lib/firebaseService';
import type { Event } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'upcoming' | 'past';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const unsubscribe = eventsService.subscribe((updatedEvents) => {
      setEvents(updatedEvents);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter((event) => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const upcomingCount = events.filter((e) => e.status === 'upcoming').length;
  const pastCount = events.filter((e) => e.status === 'past').length;

  if (loading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Events & Programs
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stay updated with our upcoming events and explore our past initiatives.
            Join us in making a difference in our community.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-8 border-b border-border">
        <div className="container">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all', label: `All Events (${events.length})` },
              { value: 'upcoming', label: `Upcoming (${upcomingCount})` },
              { value: 'past', label: `Past (${pastCount})` },
            ].map((tab) => (
              <Button
                key={tab.value}
                variant={filter === tab.value ? 'default' : 'outline'}
                onClick={() => setFilter(tab.value as FilterType)}
                className={cn(
                  filter === tab.value && 'shadow-md'
                )}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container">
          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No {filter === 'all' ? '' : filter} events found.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
