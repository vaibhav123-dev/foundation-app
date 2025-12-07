import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { FounderCard } from '@/components/cards/FounderCard';
import { foundersService } from '@/lib/firebaseService';
import type { Founder } from '@/data/mockData';

const FoundersPage = () => {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = foundersService.subscribe((updatedFounders) => {
      setFounders(updatedFounders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <p className="text-muted-foreground">Loading founders...</p>
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
            Our Founders
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Meet the visionary leaders who established Veer Bhagat Singh Foundation
            and continue to guide our mission of service and community development.
          </p>
        </div>
      </section>

      {/* Mission Quote */}
      <section className="py-12 bg-primary/5">
        <div className="container">
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="font-display text-2xl italic text-foreground mb-4">
              "वह मुझे मार सकते हैं, लेकिन मेरे विचारों को नहीं मार सकते।
              वे मेरे शरीर को कुचल सकते हैं, लेकिन मेरी आत्मा को कभी नहीं तोड़ पाएंगे।"

            </p>
            <footer className="text-muted-foreground">
              — Shaheed Bhagat Singh
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Founders Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <FounderCard founder={founder} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-foreground mb-6 text-center">
              Our Vision & Mission
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Veer Bhagat Singh Foundation was established in 2020 with a vision to carry 
                forward the ideals of Shaheed Bhagat Singh — selfless service, education for all, 
                and the empowerment of marginalized communities.
              </p>
              <p>
                Our founders, inspired by the revolutionary spirit of Bhagat Singh, came together 
                to create an organization that would work at the grassroots level to bring about 
                meaningful change in society.
              </p>
              <p>
                Today, we continue to expand our reach, touching thousands of lives through our 
                various programs in education, healthcare, environmental conservation, and 
                community development.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FoundersPage;
