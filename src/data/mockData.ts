// Mock data for the foundation website
// Replace with actual database calls in production

export interface Member {
  id: string;
  name: string;
  email: string;
  age: number;
  address: string;
  contact: string;
  photoURL: string;
  joinedDate: string;
}

export interface Founder {
  id: string;
  name: string;
  role: string;
  description: string;
  contact: string;
  photoURL: string;
}

export interface SocialWork {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  date: string;
  status: 'ongoing' | 'completed';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  imageURL: string;
  date: string;
  time: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  location: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string; // e.g., "Member", "Volunteer", "Beneficiary"
  message: string;
  photoURL: string;
  rating: number; // 1-5 stars
  date: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string; // URL-friendly version of title
  excerpt: string; // Short summary
  content: string; // Full article content (markdown supported)
  imageURL: string;
  author: string;
  category: string; // e.g., "Event", "Achievement", "Announcement", "Community"
  publishedDate: string;
  status: 'draft' | 'published';
  views?: number;
}

export const founders: Founder[] = [
  {
    id: '1',
    name: 'Rajesh Kumar Singh',
    role: 'Founder & President',
    description: 'Dedicated social worker with 15+ years of experience in community development. Inspired by Shaheed Bhagat Singh\'s ideals of selfless service.',
    contact: '+91 98765 43210',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    role: 'Co-Founder & Secretary',
    description: 'Former educator committed to rural education and women empowerment. Believes in creating lasting change through grassroots initiatives.',
    contact: '+91 98765 43211',
    photoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Amit Patel',
    role: 'Treasurer',
    description: 'Finance professional who manages foundation funds with transparency. Ensures every rupee reaches those in need.',
    contact: '+91 98765 43212',
    photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  },
];

export const members: Member[] = [
  {
    id: '1',
    name: 'Vikram Malhotra',
    email: 'vikram.malhotra@example.com',
    age: 28,
    address: 'Sector 15, Chandigarh',
    contact: '+91 99876 54321',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    joinedDate: '2023-06-15',
  },
  {
    id: '2',
    name: 'Sunita Devi',
    email: 'sunita.devi@example.com',
    age: 35,
    address: 'Model Town, Ludhiana',
    contact: '+91 99876 54322',
    photoURL: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    joinedDate: '2023-07-20',
  },
  {
    id: '3',
    name: 'Harpreet Singh',
    email: 'harpreet.singh@example.com',
    age: 42,
    address: 'Civil Lines, Amritsar',
    contact: '+91 99876 54323',
    photoURL: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
    joinedDate: '2023-08-10',
  },
  {
    id: '4',
    name: 'Meera Kapoor',
    email: 'meera.kapoor@example.com',
    age: 31,
    address: 'Rajpura Road, Patiala',
    contact: '+91 99876 54324',
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    joinedDate: '2023-09-05',
  },
  {
    id: '5',
    name: 'Deepak Verma',
    email: 'deepak.verma@example.com',
    age: 26,
    address: 'Sarabha Nagar, Jalandhar',
    contact: '+91 99876 54325',
    photoURL: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
    joinedDate: '2023-10-12',
  },
  {
    id: '6',
    name: 'Anita Rani',
    email: 'anita.rani@example.com',
    age: 38,
    address: 'Green Park, Bathinda',
    contact: '+91 99876 54326',
    photoURL: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
    joinedDate: '2023-11-08',
  },
];

export const socialWorks: SocialWork[] = [
  {
    id: '1',
    title: 'Education for All Initiative',
    description: 'Providing free education and learning materials to underprivileged children in rural Punjab. Over 500 students benefited so far.',
    imageURL: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=800&h=600&fit=crop',
    date: '2023-01-15',
    status: 'ongoing',
  },
  {
    id: '2',
    title: 'Clean Water Project',
    description: 'Installing hand pumps and water purification systems in villages lacking access to clean drinking water.',
    imageURL: 'https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=800&h=600&fit=crop',
    date: '2023-03-20',
    status: 'ongoing',
  },
  {
    id: '3',
    title: 'Medical Camp Series',
    description: 'Organizing free health checkups and medicine distribution in collaboration with local hospitals.',
    imageURL: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop',
    date: '2023-05-10',
    status: 'completed',
  },
  {
    id: '4',
    title: 'Tree Plantation Drive',
    description: 'Planting thousands of trees across Punjab to combat climate change and create greener communities.',
    imageURL: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
    date: '2023-08-15',
    status: 'ongoing',
  },
];

export const events: Event[] = [
  {
    id: '1',
    title: 'Shaheed Bhagat Singh Remembrance Day',
    description: 'Annual commemoration of the martyrdom of Shaheed Bhagat Singh with cultural programs, speeches, and community service.',
    imageURL: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    date: '2024-03-23',
    time: '10:00 AM',
    status: 'upcoming',
    location: 'Community Hall, Chandigarh',
  },
  {
    id: '2',
    title: 'Annual Charity Gala',
    description: 'An evening of celebration, fundraising, and recognizing outstanding volunteers. Join us for dinner and cultural performances.',
    imageURL: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop',
    date: '2024-02-14',
    time: '6:00 PM',
    status: 'upcoming',
    location: 'Hotel Grand, Ludhiana',
  },
  {
    id: '3',
    title: 'Youth Leadership Workshop',
    description: 'A workshop to inspire and train young leaders in community service and social responsibility.',
    imageURL: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=600&fit=crop',
    date: '2024-01-20',
    time: '9:00 AM',
    status: 'upcoming',
    location: 'Punjab University, Chandigarh',
  },
  {
    id: '4',
    title: 'Blood Donation Camp',
    description: 'Successful blood donation drive in partnership with Government Hospital. 200+ units collected.',
    imageURL: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&h=600&fit=crop',
    date: '2023-11-15',
    time: '9:00 AM',
    status: 'completed',
    location: 'Civil Hospital, Amritsar',
  },
  {
    id: '5',
    title: 'Diwali Celebration with Orphanage',
    description: 'Spreading joy and light by celebrating Diwali with children at local orphanages.',
    imageURL: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&h=600&fit=crop',
    date: '2023-11-12',
    time: '5:00 PM',
    status: 'completed',
    location: 'Bal Ashram, Jalandhar',
  },
];

export const contactInfo: ContactInfo = {
  address: 'Trimurti Nagar, Umari Meghe, 442001, Wardha, Maharashtra India',
  phone: '+91 8007298143',
  email: 'contact@veerbhagatsinghfoundation.org',
  facebook: 'https://www.facebook.com/share/1FW3RbCYwt/?mibextid=wwXIfr',
  instagram: 'https://www.instagram.com/veer_bhagatsingh_foundation?igsh=N3Y5dnRwMnptenVn',
  twitter: 'https://www.threads.com/@veer_bhagatsingh_foundation?igshid=NTc4MTIwNjQ2YQ==',
};
