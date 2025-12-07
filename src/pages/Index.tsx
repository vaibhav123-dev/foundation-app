import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, Heart } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { SocialWorkCard } from '@/components/cards/SocialWorkCard';
import { QuotesSlider } from '@/components/QuotesSlider';
import { socialWorkService, eventsService, membersService } from '@/lib/firebaseService';
import type { SocialWork, Event } from '@/data/mockData';

const Index = () => {
  const [socialWorks, setSocialWorks] = useState<SocialWork[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let loadedCount = 0;
    const totalToLoad = 3;

    const checkLoading = () => {
      loadedCount++;
      if (loadedCount === totalToLoad) {
        setLoading(false);
      }
    };

    const unsubscribeSocialWork = socialWorkService.subscribe((data) => {
      setSocialWorks(data);
      checkLoading();
    });

    const unsubscribeEvents = eventsService.subscribe((data) => {
      setEvents(data);
      setEventCount(data.length);
      checkLoading();
    });

    const unsubscribeMembers = membersService.subscribe((data) => {
      setMemberCount(data.length);
      checkLoading();
    });

    return () => {
      unsubscribeSocialWork();
      unsubscribeEvents();
      unsubscribeMembers();
    };
  }, []);

  // Calculate lives impacted (using a multiplier for demonstration - can be customized)
  const livesImpacted = memberCount * 5;

  const stats = [
    { icon: Users, value: memberCount.toLocaleString(), label: 'Members' },
    { icon: Calendar, value: eventCount.toLocaleString(), label: 'Events' },
    { icon: Heart, value: livesImpacted.toLocaleString(), label: 'Lives Impacted' },
  ];

  if (loading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop"
            alt="Community volunteers working together"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 hero-overlay" />
        </div>
        
        <div className="container relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
              साहस से प्रेरित,
              <br />
              <span className="text-primary">सेवा के लिए समर्पित</span>
            </h1>

            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto text-balance">
              वीर भगत सिंह फाउंडेशन शिक्षा, स्वास्थ्य सेवा और सामुदायिक विकास के माध्यम से 
              वर्धा और उससे आगे सकारात्मक बदलाव लाने के लिए समर्पित है।
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/join">
                <Button size="lg" className="text-base">
                  Join Our Mission
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/events">
                <Button size="lg" variant="outline" className="text-base bg-white/10 text-white border-white/30 hover:bg-white/20">
                  Upcoming Events
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        
      </section>

      {/* Inspirational Quotes Slider Section */}
      <section className="relative">
        <QuotesSlider />
      </section>

      {/* Stats Bar Section */}
      <section className="bg-card border-y border-border">
        <div className="container py-6">
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Work Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container">
          <SectionHeader
            title="Our Social Initiatives"
            subtitle="Making a difference in communities through sustainable programs that empower and uplift."
          />
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {socialWorks.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <SocialWorkCard work={work} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 hero-gradient">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
              Be Part of the Change
            </h2>
            <p className="text-primary-foreground/90 text-lg mb-8">
              Join our community of passionate volunteers and make a lasting impact
              in the lives of those who need it most.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/join">
                <Button size="lg" variant="secondary" className="text-base">
                  Become a Member
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-white border-white dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">
                Upcoming Events
              </h2>
              <p className="mt-2 text-muted-foreground">
                Join us at our upcoming community events and programs.
              </p>
            </div>
            <Link to="/events">
              <Button variant="outline">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events
              .filter((e) => e.status === 'upcoming')
              .slice(0, 3)
              .map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-lg overflow-hidden card-shadow hover:card-shadow-hover transition-shadow"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={event.imageURL}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <div className="text-sm text-primary font-medium mb-1">
                      {new Date(event.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {event.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
