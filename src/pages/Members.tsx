import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { MemberCard } from '@/components/cards/MemberCard';
import { SectionHeader } from '@/components/ui/section-header';
import { membersService } from '@/lib/firebaseService';
import type { Member } from '@/data/mockData';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = membersService.subscribe((updatedMembers) => {
      setMembers(updatedMembers);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <p className="text-muted-foreground">Loading members...</p>
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
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground mb-2">
                Our Members
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Meet the dedicated individuals who make our mission possible through
                their time, effort, and commitment to serving the community.
              </p>
            </div>
            <Link to="/join">
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Join Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <MemberCard member={member} />
              </motion.div>
            ))}
          </div>

          {members.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No members yet. Be the first to join!</p>
              <Link to="/join">
                <Button className="mt-4">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MembersPage;
