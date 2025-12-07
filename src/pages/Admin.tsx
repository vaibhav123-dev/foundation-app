import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Calendar,
  Heart,
  Settings,
  Plus,
  Edit,
  Trash2,
  UserCog,
  Home,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import {
  membersService,
  foundersService,
  eventsService,
  socialWorkService,
  contactInfoService,
} from '@/lib/firebaseService';
import type { Member, Founder, Event, SocialWork, ContactInfo } from '@/data/mockData';
import { cn } from '@/lib/utils';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { logout } = useAuth();
  const navigate = useNavigate();

  // State for all data
  const [members, setMembers] = useState<Member[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [socialWorks, setSocialWorks] = useState<SocialWork[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit dialog states
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingSocialWork, setEditingSocialWork] = useState<SocialWork | null>(null);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);

  // Load data from Firebase
  useEffect(() => {
    let unsubscribers: (() => void)[] = [];

    const unsubMembers = membersService.subscribe((data) => setMembers(data));
    const unsubFounders = foundersService.subscribe((data) => setFounders(data));
    const unsubEvents = eventsService.subscribe((data) => setEvents(data));
    const unsubSocialWork = socialWorkService.subscribe((data) => setSocialWorks(data));
    const unsubContact = contactInfoService.subscribe((data) => setContactInfo(data));

    unsubscribers = [unsubMembers, unsubFounders, unsubEvents, unsubSocialWork, unsubContact];
    
    // Set loading false after a short delay
    setTimeout(() => setLoading(false), 1000);

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, []);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
    navigate('/login');
  };

  const stats = [
    { label: 'Total Members', value: members.length, icon: Users, color: 'text-primary' },
    { label: 'Total Events', value: events.length, icon: Calendar, color: 'text-accent' },
    { label: 'Social Initiatives', value: socialWorks.length, icon: Heart, color: 'text-destructive' },
    { label: 'Founders', value: founders.length, icon: UserCog, color: 'text-muted-foreground' },
  ];

  const handleDeleteMember = async (id: string, photoURL?: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    
    try {
      await membersService.delete(id, photoURL);
      toast({
        title: 'Member Deleted',
        description: 'Member has been removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete member.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteFounder = async (id: string, photoURL?: string) => {
    if (!confirm('Are you sure you want to delete this founder?')) return;
    
    try {
      await foundersService.delete(id, photoURL);
      toast({
        title: 'Founder Deleted',
        description: 'Founder has been removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting founder:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete founder.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteEvent = async (id: string, imageURL?: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventsService.delete(id, imageURL);
      toast({
        title: 'Event Deleted',
        description: 'Event has been removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSocialWork = async (id: string, imageURL?: string) => {
    if (!confirm('Are you sure you want to delete this initiative?')) return;
    
    try {
      await socialWorkService.delete(id, imageURL);
      toast({
        title: 'Initiative Deleted',
        description: 'Social work initiative has been removed successfully.',
      });
    } catch (error) {
      console.error('Error deleting social work:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete initiative.',
        variant: 'destructive',
      });
    }
  };

  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newEvent: Omit<Event, 'id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      imageURL: formData.get('imageURL') as string,
      status: 'upcoming',
    };

    try {
      await eventsService.add(newEvent);
      toast({
        title: 'Event Created',
        description: 'Event has been added successfully.',
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error creating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to create event.',
        variant: 'destructive',
      });
    }
  };

  const handleAddSocialWork = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newWork: Omit<SocialWork, 'id'> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      imageURL: formData.get('imageURL') as string,
      status: formData.get('status') as 'ongoing' | 'completed',
      date: new Date().toISOString(),
    };

    try {
      await socialWorkService.add(newWork);
      toast({
        title: 'Initiative Added',
        description: 'Social work entry has been created.',
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error creating social work:', error);
      toast({
        title: 'Error',
        description: 'Failed to create initiative.',
        variant: 'destructive',
      });
    }
  };

  const handleAddFounder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newFounder: Omit<Founder, 'id'> = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      description: formData.get('description') as string,
      contact: formData.get('contact') as string,
      photoURL: formData.get('photoURL') as string,
    };

    try {
      await foundersService.add(newFounder);
      toast({
        title: 'Founder Added',
        description: 'Founder profile has been created.',
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error creating founder:', error);
      toast({
        title: 'Error',
        description: 'Failed to create founder.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingEvent) return;

    const formData = new FormData(e.currentTarget);
    const updates: Partial<Event> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      location: formData.get('location') as string,
      imageURL: formData.get('imageURL') as string,
    };

    try {
      await eventsService.update(editingEvent.id, updates);
      toast({
        title: 'Event Updated',
        description: 'Event has been updated successfully.',
      });
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      toast({
        title: 'Error',
        description: 'Failed to update event.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateSocialWork = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingSocialWork) return;

    const formData = new FormData(e.currentTarget);
    const updates: Partial<SocialWork> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      imageURL: formData.get('imageURL') as string,
      status: formData.get('status') as 'ongoing' | 'completed',
    };

    try {
      await socialWorkService.update(editingSocialWork.id, updates);
      toast({
        title: 'Initiative Updated',
        description: 'Social work has been updated successfully.',
      });
      setEditingSocialWork(null);
    } catch (error) {
      console.error('Error updating social work:', error);
      toast({
        title: 'Error',
        description: 'Failed to update initiative.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateFounder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingFounder) return;

    const formData = new FormData(e.currentTarget);
    const updates: Partial<Founder> = {
      name: formData.get('name') as string,
      role: formData.get('role') as string,
      description: formData.get('description') as string,
      contact: formData.get('contact') as string,
      photoURL: formData.get('photoURL') as string,
    };

    try {
      await foundersService.update(editingFounder.id, updates);
      toast({
        title: 'Founder Updated',
        description: 'Founder profile has been updated successfully.',
      });
      setEditingFounder(null);
    } catch (error) {
      console.error('Error updating founder:', error);
      toast({
        title: 'Error',
        description: 'Failed to update founder.',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateContactInfo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const updatedInfo: ContactInfo = {
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      facebook: formData.get('facebook') as string,
      instagram: formData.get('instagram') as string,
      twitter: formData.get('twitter') as string,
    };

    try {
      await contactInfoService.update(updatedInfo);
      toast({
        title: 'Settings Saved',
        description: 'Contact information has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating contact info:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contact information.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">VBS Foundation Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Home className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </Link>
            <Button variant="ghost" size="sm" className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <stat.icon className={cn('h-8 w-8', stat.color)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Admin Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:w-auto lg:inline-grid mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="social-work">Social Work</TabsTrigger>
            <TabsTrigger value="founders">Founders</TabsTrigger>
            <TabsTrigger value="contact">Contact Info</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Members</CardTitle>
                  <CardDescription>Latest members who joined the foundation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {members.slice(0, 5).map((member) => (
                      <div key={member.id} className="flex items-center gap-3">
                        <img
                          src={member.photoURL}
                          alt={member.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.contact}</p>
                        </div>
                        <Badge variant="secondary">
                          {new Date(member.joinedDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                        </Badge>
                      </div>
                    ))}
                    {members.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No members yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Events scheduled for the future</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events
                      .filter((e) => e.status === 'upcoming')
                      .slice(0, 5)
                      .map((event) => (
                        <div key={event.id} className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground">{event.location}</p>
                          </div>
                          <Badge variant="outline">
                            {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </Badge>
                        </div>
                      ))}
                    {events.filter((e) => e.status === 'upcoming').length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">No upcoming events</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Members Management</CardTitle>
                <CardDescription>View and manage foundation members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Member</TableHead>
                        <TableHead>Age</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={member.photoURL}
                                alt={member.name}
                                className="h-10 w-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {member.address}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{member.age}</TableCell>
                          <TableCell>{member.contact}</TableCell>
                          <TableCell>
                            {new Date(member.joinedDate).toLocaleDateString('en-IN')}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteMember(member.id, member.photoURL)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {members.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No members yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle>Events Management</CardTitle>
                  <CardDescription>Manage foundation events</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New Event</DialogTitle>
                      <DialogDescription>Add a new event to the foundation calendar</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddEvent} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="event-title">Event Title</Label>
                        <Input id="event-title" name="title" placeholder="Enter event title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-description">Description</Label>
                        <Textarea id="event-description" name="description" placeholder="Event description" required />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="event-date">Date</Label>
                          <Input id="event-date" name="date" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-time">Time</Label>
                          <Input id="event-time" name="time" type="time" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-location">Location</Label>
                        <Input id="event-location" name="location" placeholder="Event location" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-image">Image URL</Label>
                        <Input id="event-image" name="imageURL" type="url" placeholder="https://example.com/image.jpg" required />
                        <p className="text-xs text-muted-foreground">Paste a URL to an image (since Storage is not enabled)</p>
                      </div>
                      <Button type="submit" className="w-full">
                        Create Event
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Event</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img
                                src={event.imageURL}
                                alt={event.title}
                                className="h-12 w-16 rounded object-cover"
                              />
                              <p className="font-medium max-w-[200px] truncate">{event.title}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(event.date).toLocaleDateString('en-IN')}
                          </TableCell>
                          <TableCell className="max-w-[150px] truncate">{event.location}</TableCell>
                          <TableCell>
                            <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                              {event.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setEditingEvent(event)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDeleteEvent(event.id, event.imageURL)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {events.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No events yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Work Tab */}
          <TabsContent value="social-work">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle>Social Work Initiatives</CardTitle>
                  <CardDescription>Manage social work entries</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Initiative
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Social Initiative</DialogTitle>
                      <DialogDescription>Create a new social work entry</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSocialWork} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="work-title">Title</Label>
                        <Input id="work-title" name="title" placeholder="Initiative title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="work-description">Description</Label>
                        <Textarea id="work-description" name="description" placeholder="Describe the initiative" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="work-status">Status</Label>
                        <select id="work-status" name="status" className="w-full h-10 px-3 rounded-md border border-input bg-background" required>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="work-image">Image URL</Label>
                        <Input id="work-image" name="imageURL" type="url" placeholder="https://example.com/image.jpg" required />
                        <p className="text-xs text-muted-foreground">Paste a URL to an image</p>
                      </div>
                      <Button type="submit" className="w-full">
                        Add Initiative
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {socialWorks.map((work) => (
                    <Card key={work.id} className="overflow-hidden">
                      <div className="aspect-video relative">
                        <img
                          src={work.imageURL}
                          alt={work.title}
                          className="h-full w-full object-cover"
                        />
                        <Badge className="absolute top-2 right-2" variant={work.status === 'ongoing' ? 'default' : 'secondary'}>
                          {work.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{work.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                          {work.description}
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setEditingSocialWork(work)}
                          >
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-destructive"
                            onClick={() => handleDeleteSocialWork(work.id, work.imageURL)}
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {socialWorks.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No social work initiatives yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Founders Tab */}
          <TabsContent value="founders">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="space-y-1">
                  <CardTitle>Founders Management</CardTitle>
                  <CardDescription>Manage founder profiles</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Founder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Founder</DialogTitle>
                      <DialogDescription>Create a new founder profile</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddFounder} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="founder-name">Name</Label>
                        <Input id="founder-name" name="name" placeholder="Full name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="founder-role">Role</Label>
                        <Input id="founder-role" name="role" placeholder="e.g., Founder & President" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="founder-description">Description</Label>
                        <Textarea id="founder-description" name="description" placeholder="Brief bio" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="founder-contact">Contact</Label>
                        <Input id="founder-contact" name="contact" placeholder="+91 98765 43210" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="founder-photo">Photo URL</Label>
                        <Input id="founder-photo" name="photoURL" type="url" placeholder="https://example.com/photo.jpg" required />
                        <p className="text-xs text-muted-foreground">Paste a URL to a photo</p>
                      </div>
                      <Button type="submit" className="w-full">
                        Add Founder
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {founders.map((founder) => (
                    <Card key={founder.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        <img
                          src={founder.photoURL}
                          alt={founder.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <Badge className="mb-2">{founder.role}</Badge>
                        <h3 className="font-medium">{founder.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{founder.contact}</p>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setEditingFounder(founder)}
                          >
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-destructive"
                            onClick={() => handleDeleteFounder(founder.id, founder.photoURL)}
                          >
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {founders.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No founders yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Info Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Update foundation contact details</CardDescription>
              </CardHeader>
              <CardContent>
                {contactInfo && (
                  <form onSubmit={handleUpdateContactInfo} className="space-y-6 max-w-xl">
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Textarea 
                        id="address"
                        name="address"
                        defaultValue={contactInfo.address} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        defaultValue={contactInfo.phone} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email" 
                        defaultValue={contactInfo.email} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook URL</Label>
                      <Input 
                        id="facebook"
                        name="facebook"
                        defaultValue={contactInfo.facebook} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram URL</Label>
                      <Input 
                        id="instagram"
                        name="instagram"
                        defaultValue={contactInfo.instagram} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter URL</Label>
                      <Input 
                        id="twitter"
                        name="twitter"
                        defaultValue={contactInfo.twitter} 
                      />
                    </div>
                    <Button type="submit">
                      Save Changes
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Event Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>Update event details</DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-event-title">Event Title</Label>
                <Input id="edit-event-title" name="title" defaultValue={editingEvent.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-description">Description</Label>
                <Textarea id="edit-event-description" name="description" defaultValue={editingEvent.description} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-event-date">Date</Label>
                  <Input id="edit-event-date" name="date" type="date" defaultValue={editingEvent.date} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-event-time">Time</Label>
                  <Input id="edit-event-time" name="time" type="time" defaultValue={editingEvent.time} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-location">Location</Label>
                <Input id="edit-event-location" name="location" defaultValue={editingEvent.location} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-event-image">Image URL</Label>
                <Input id="edit-event-image" name="imageURL" type="url" defaultValue={editingEvent.imageURL} required />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingEvent(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update Event
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Social Work Dialog */}
      <Dialog open={!!editingSocialWork} onOpenChange={() => setEditingSocialWork(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Social Initiative</DialogTitle>
            <DialogDescription>Update initiative details</DialogDescription>
          </DialogHeader>
          {editingSocialWork && (
            <form onSubmit={handleUpdateSocialWork} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-work-title">Title</Label>
                <Input id="edit-work-title" name="title" defaultValue={editingSocialWork.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-work-description">Description</Label>
                <Textarea id="edit-work-description" name="description" defaultValue={editingSocialWork.description} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-work-status">Status</Label>
                <select id="edit-work-status" name="status" defaultValue={editingSocialWork.status} className="w-full h-10 px-3 rounded-md border border-input bg-background" required>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-work-image">Image URL</Label>
                <Input id="edit-work-image" name="imageURL" type="url" defaultValue={editingSocialWork.imageURL} required />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingSocialWork(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update Initiative
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Founder Dialog */}
      <Dialog open={!!editingFounder} onOpenChange={() => setEditingFounder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Founder</DialogTitle>
            <DialogDescription>Update founder profile</DialogDescription>
          </DialogHeader>
          {editingFounder && (
            <form onSubmit={handleUpdateFounder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-founder-name">Name</Label>
                <Input id="edit-founder-name" name="name" defaultValue={editingFounder.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-founder-role">Role</Label>
                <Input id="edit-founder-role" name="role" defaultValue={editingFounder.role} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-founder-description">Description</Label>
                <Textarea id="edit-founder-description" name="description" defaultValue={editingFounder.description} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-founder-contact">Contact</Label>
                <Input id="edit-founder-contact" name="contact" defaultValue={editingFounder.contact} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-founder-photo">Photo URL</Label>
                <Input id="edit-founder-photo" name="photoURL" type="url" defaultValue={editingFounder.photoURL} required />
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingFounder(null)}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Update Founder
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
