import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { contactMessagesService, contactInfoService } from '@/lib/firebaseService';
import { sendContactEmail } from '@/lib/emailService';
import type { ContactInfo } from '@/data/mockData';
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Send,
  Clock,
} from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(20, 'Message must be at least 20 characters').max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = contactInfoService.subscribe((data) => {
      setContactInfo(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Save message to Firestore
      await contactMessagesService.add({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      });
      
      // Send email to foundation
      try {
        await sendContactEmail(
          data.name,
          data.email,
          data.subject,
          data.message
        );
        console.log('✅ Email sent to foundation successfully');
      } catch (emailError) {
        console.error('⚠️ Failed to send email, but message was saved:', emailError);
        // Don't fail the entire process if email fails
      }
      
      toast({
        title: 'Message Sent!',
        description: 'Thank you for reaching out. We will get back to you soon.',
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = contactInfo ? [
    {
      icon: MapPin,
      label: 'Address',
      value: contactInfo.address,
    },
    {
      icon: Phone,
      label: 'Phone',
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: Clock,
      label: 'Office Hours',
      value: 'Mon - Sat: 9:00 AM - 6:00 PM',
    },
  ] : [];

  const socialLinks = contactInfo ? [
    { icon: Facebook, href: contactInfo.facebook, label: 'Facebook' },
    { icon: Instagram, href: contactInfo.instagram, label: 'Instagram' },
    { icon: Twitter, href: contactInfo.twitter, label: 'Twitter' },
  ].filter((link) => link.href) : [];

  if (loading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <p className="text-muted-foreground">Loading contact information...</p>
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
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Have questions or want to get involved? We'd love to hear from you.
            Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Information */}
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                {contactItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{item.label}</h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8">
                <h3 className="font-medium text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label={link.label}
                    >
                      <link.icon className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <Card className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2" />
                      {/* <p className="text-sm">Map integration can be added here</p> */}
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="card-shadow">
                <CardContent className="p-6">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        {...register('name')}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What is this about?"
                        {...register('subject')}
                      />
                      {errors.subject && (
                        <p className="text-sm text-destructive">{errors.subject.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Write your message here..."
                        className="min-h-[150px]"
                        {...register('message')}
                      />
                      {errors.message && (
                        <p className="text-sm text-destructive">{errors.message.message}</p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        'Sending...'
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
