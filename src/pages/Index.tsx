import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Calendar, Heart, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/section-header';
import { SocialWorkCard } from '@/components/cards/SocialWorkCard';
import { QuotesSlider } from '@/components/QuotesSlider';
import { Card, CardContent } from '@/components/ui/card';
import { socialWorkService, eventsService, membersService, siteSettingsService, testimonialsService, newsService } from '@/lib/firebaseService';
import type { SocialWork, Event, Testimonial, NewsArticle } from '@/data/mockData';
import { cn } from '@/lib/utils';

const Index = () => {
  const [socialWorks, setSocialWorks] = useState<SocialWork[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [bannerImages, setBannerImages] = useState<string[]>(['https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop']);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeSocialWork = socialWorkService.subscribe((data) => {
      setSocialWorks(data);
    });

    const unsubscribeEvents = eventsService.subscribe((data) => {
      setEvents(data);
      setEventCount(data.length);
    });

    const unsubscribeMembers = membersService.subscribe((data) => {
      setMemberCount(data.length);
    });

    const unsubscribeTestimonials = testimonialsService.subscribe((data) => {
      setTestimonials(data);
    });

    const unsubscribeNews = newsService.subscribePublished((data) => {
      setNewsArticles(data);
    });

    const unsubscribeSiteSettings = siteSettingsService.subscribe((data) => {
      if (data?.bannerImages && data.bannerImages.length > 0) {
        setBannerImages(data.bannerImages);
      } else if (data?.bannerImageURL) {
        // Fallback to old single banner image for backward compatibility
        setBannerImages([data.bannerImageURL]);
      }
    });

    // Set loading to false after a short delay to ensure initial data is loaded
    const loadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      unsubscribeSocialWork();
      unsubscribeEvents();
      unsubscribeMembers();
      unsubscribeTestimonials();
      unsubscribeNews();
      unsubscribeSiteSettings();
      clearTimeout(loadingTimeout);
    };
  }, []);

  // Auto-scroll banner images every 5 seconds (pause on hover)
  useEffect(() => {
    if (bannerImages.length <= 1 || isCarouselPaused) return;

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length, isCarouselPaused]);

  // Navigate to previous banner
  const goToPreviousBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  // Navigate to next banner
  const goToNextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
  };

  // Navigate to specific banner
  const goToBanner = (index: number) => {
    setCurrentBannerIndex(index);
  };

  // Auto-scroll testimonials every 7 seconds
  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Navigate testimonials
  const goToPreviousTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNextTestimonial = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Calculate lives impacted (using a multiplier for demonstration - can be customized)
  const livesImpacted = memberCount * 5;

  const stats = [
    { icon: Users, value: memberCount, label: 'Members' },
    { icon: Calendar, value: eventCount, label: 'Events' },
    { icon: Heart, value: livesImpacted, label: 'Lives Impacted' },
  ];

  // Animated counter component
  const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
      if (!hasAnimated && value > 0) {
        let startTime: number | null = null;
        const startValue = 0;
        const endValue = value;

        const animate = (currentTime: number) => {
          if (!startTime) startTime = currentTime;
          const progress = Math.min((currentTime - startTime) / duration, 1);
          
          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4);
          const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart);
          
          setCount(currentCount);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(endValue);
            setHasAnimated(true);
          }
        };

        requestAnimationFrame(animate);
      }
    }, [value, duration, hasAnimated]);

    return <>{count.toLocaleString()}</>;
  };

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
      <section 
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setIsCarouselPaused(true)}
        onMouseLeave={() => setIsCarouselPaused(false)}
      >
        {/* Banner Images Carousel */}
        <div className="absolute inset-0">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000",
                index === currentBannerIndex ? "opacity-100" : "opacity-0"
              )}
            >
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 hero-overlay" />
        </div>

        {/* Carousel Controls - Only show if multiple images */}
        {bannerImages.length > 1 && (
          <>
            {/* Previous/Next Arrows */}
            <button
              onClick={goToPreviousBanner}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
              aria-label="Previous banner"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNextBanner}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
              aria-label="Next banner"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToBanner(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentBannerIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-white/50 hover:bg-white/70"
                  )}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        
        <div className="container relative z-10 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
              <span className="text-primary">वीर भगत सिंग फाउंडेशन</span>
              <br />
              साहस से प्रेरित, सेवा के लिए समर्पित
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
                  <AnimatedCounter value={stat.value} />
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

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container">
            <SectionHeader
              title="What People Say"
              subtitle="Hear from our members, volunteers, and those we've helped"
            />
            
            <div className="relative max-w-4xl mx-auto">
              <Card className="overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  {testimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      className={cn(
                        "transition-opacity duration-500",
                        index === currentTestimonialIndex ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"
                      )}
                    >
                      <div className="flex flex-col items-center text-center">
                        {/* Quote Icon */}
                        <Quote className="h-12 w-12 text-primary/20 mb-6" />
                        
                        {/* Rating */}
                        <div className="flex gap-1 mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-5 w-5",
                                i < testimonial.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                        </div>

                        {/* Message */}
                        <p className="text-lg md:text-xl text-foreground leading-relaxed mb-8 max-w-2xl">
                          "{testimonial.message}"
                        </p>

                        {/* Author Info */}
                        <div className="flex flex-col items-center">
                          <img
                            src={testimonial.photoURL}
                            alt={testimonial.name}
                            className="h-16 w-16 rounded-full object-cover mb-3"
                          />
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Navigation Controls */}
              {testimonials.length > 1 && (
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={goToPreviousTestimonial}
                    className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  
                  {/* Dots */}
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonialIndex(index)}
                        className={cn(
                          "h-2 rounded-full transition-all duration-300",
                          index === currentTestimonialIndex
                            ? "w-8 bg-primary"
                            : "w-2 bg-primary/30 hover:bg-primary/50"
                        )}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={goToNextTestimonial}
                    className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

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

      {/* Latest News Preview */}
      {newsArticles.length > 0 && (
        <section className="py-20 bg-secondary/30">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">
                  Latest News
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Stay updated with our recent activities and announcements
                </p>
              </div>
              <Link to="/news">
                <Button variant="outline">
                  View All News
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsArticles
                .slice(0, 3)
                .map((article, index) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-lg overflow-hidden card-shadow hover:card-shadow-hover transition-shadow"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.imageURL}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-primary font-medium">
                          {article.category}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(article.publishedDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {article.excerpt}
                      </p>
                      <a
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </section>
      )}

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
