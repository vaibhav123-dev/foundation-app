import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from './cloudinaryService';
import type { Member, Founder, Event, SocialWork, ContactInfo, Testimonial, NewsArticle } from '@/data/mockData';

// Helper function to upload image to Cloudinary
export const uploadImage = async (file: File, folder: string): Promise<string> => {
  return await uploadImageToCloudinary(file, folder);
};

// Helper function to delete image from Cloudinary
export const deleteImage = async (imageURL: string): Promise<void> => {
  try {
    await deleteImageFromCloudinary(imageURL);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

// Members Service
export const membersService = {
  // Check for duplicate members by email or name
  checkDuplicate: async (email: string, name: string): Promise<{ isDuplicate: boolean; field: 'email' | 'name' | null }> => {
    // Check for duplicate email
    const emailQuery = query(collection(db, 'members'), where('email', '==', email));
    const emailSnapshot = await getDocs(emailQuery);
    
    if (!emailSnapshot.empty) {
      return { isDuplicate: true, field: 'email' };
    }
    
    // Check for duplicate name (case-insensitive)
    const nameQuery = query(collection(db, 'members'), where('name', '==', name));
    const nameSnapshot = await getDocs(nameQuery);
    
    if (!nameSnapshot.empty) {
      return { isDuplicate: true, field: 'name' };
    }
    
    return { isDuplicate: false, field: null };
  },

  // Get all members
  getAll: async (): Promise<Member[]> => {
    const q = query(collection(db, 'members'), orderBy('joinedDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
  },

  // Subscribe to members in real-time
  subscribe: (callback: (members: Member[]) => void) => {
    const q = query(collection(db, 'members'), orderBy('joinedDate', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const members = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
      callback(members);
    });
  },

  // Add new member
  add: async (member: Omit<Member, 'id'>, photoFile?: File): Promise<string> => {
    let photoURL = member.photoURL;
    
    if (photoFile) {
      photoURL = await uploadImage(photoFile, 'members');
    }
    
    const docRef = await addDoc(collection(db, 'members'), {
      ...member,
      photoURL,
      joinedDate: member.joinedDate || new Date().toISOString(),
    });
    
    return docRef.id;
  },

  // Update member
  update: async (id: string, member: Partial<Member>, photoFile?: File): Promise<void> => {
    const memberRef = doc(db, 'members', id);
    
    let updateData: any = { ...member };
    
    if (photoFile) {
      updateData.photoURL = await uploadImage(photoFile, 'members');
    }
    
    await updateDoc(memberRef, updateData);
  },

  // Delete member
  delete: async (id: string, photoURL?: string): Promise<void> => {
    if (photoURL) {
      await deleteImage(photoURL);
    }
    await deleteDoc(doc(db, 'members', id));
  },
};

// Founders Service
export const foundersService = {
  getAll: async (): Promise<Founder[]> => {
    const snapshot = await getDocs(collection(db, 'founders'));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Founder));
  },

  subscribe: (callback: (founders: Founder[]) => void) => {
    return onSnapshot(collection(db, 'founders'), (snapshot) => {
      const founders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Founder));
      callback(founders);
    });
  },

  add: async (founder: Omit<Founder, 'id'>, photoFile?: File): Promise<string> => {
    let photoURL = founder.photoURL;
    
    if (photoFile) {
      photoURL = await uploadImage(photoFile, 'founders');
    }
    
    const docRef = await addDoc(collection(db, 'founders'), {
      ...founder,
      photoURL,
    });
    
    return docRef.id;
  },

  update: async (id: string, founder: Partial<Founder>, photoFile?: File): Promise<void> => {
    const founderRef = doc(db, 'founders', id);
    
    let updateData: any = { ...founder };
    
    if (photoFile) {
      updateData.photoURL = await uploadImage(photoFile, 'founders');
    }
    
    await updateDoc(founderRef, updateData);
  },

  delete: async (id: string, photoURL?: string): Promise<void> => {
    if (photoURL) {
      await deleteImage(photoURL);
    }
    await deleteDoc(doc(db, 'founders', id));
  },
};

// Events Service
export const eventsService = {
  getAll: async (): Promise<Event[]> => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event));
  },

  subscribe: (callback: (events: Event[]) => void) => {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Event));
      callback(events);
    });
  },

  add: async (event: Omit<Event, 'id'>, imageFile?: File): Promise<string> => {
    let imageURL = event.imageURL;
    
    if (imageFile) {
      imageURL = await uploadImage(imageFile, 'events');
    }
    
    const docRef = await addDoc(collection(db, 'events'), {
      ...event,
      imageURL,
    });
    
    return docRef.id;
  },

  update: async (id: string, event: Partial<Event>, imageFile?: File): Promise<void> => {
    const eventRef = doc(db, 'events', id);
    
    let updateData: any = { ...event };
    
    if (imageFile) {
      updateData.imageURL = await uploadImage(imageFile, 'events');
    }
    
    await updateDoc(eventRef, updateData);
  },

  delete: async (id: string, imageURL?: string): Promise<void> => {
    if (imageURL) {
      await deleteImage(imageURL);
    }
    await deleteDoc(doc(db, 'events', id));
  },
};

// Social Work Service
export const socialWorkService = {
  getAll: async (): Promise<SocialWork[]> => {
    const q = query(collection(db, 'socialWork'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SocialWork));
  },

  subscribe: (callback: (socialWork: SocialWork[]) => void) => {
    const q = query(collection(db, 'socialWork'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const socialWork = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as SocialWork));
      callback(socialWork);
    });
  },

  add: async (work: Omit<SocialWork, 'id'>, imageFile?: File): Promise<string> => {
    let imageURL = work.imageURL;
    
    if (imageFile) {
      imageURL = await uploadImage(imageFile, 'socialWork');
    }
    
    const docRef = await addDoc(collection(db, 'socialWork'), {
      ...work,
      imageURL,
      date: work.date || new Date().toISOString(),
    });
    
    return docRef.id;
  },

  update: async (id: string, work: Partial<SocialWork>, imageFile?: File): Promise<void> => {
    const workRef = doc(db, 'socialWork', id);
    
    let updateData: any = { ...work };
    
    if (imageFile) {
      updateData.imageURL = await uploadImage(imageFile, 'socialWork');
    }
    
    await updateDoc(workRef, updateData);
  },

  delete: async (id: string, imageURL?: string): Promise<void> => {
    if (imageURL) {
      await deleteImage(imageURL);
    }
    await deleteDoc(doc(db, 'socialWork', id));
  },
};

// Contact Info Service
export const contactInfoService = {
  get: async (): Promise<ContactInfo | null> => {
    const snapshot = await getDocs(collection(db, 'contactInfo'));
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { ...doc.data() } as ContactInfo;
  },

  subscribe: (callback: (contactInfo: ContactInfo | null) => void) => {
    return onSnapshot(collection(db, 'contactInfo'), (snapshot) => {
      if (snapshot.empty) {
        callback(null);
        return;
      }
      const doc = snapshot.docs[0];
      callback({ ...doc.data() } as ContactInfo);
    });
  },

  update: async (contactInfo: ContactInfo): Promise<void> => {
    const snapshot = await getDocs(collection(db, 'contactInfo'));
    
    if (snapshot.empty) {
      // Create new document if it doesn't exist
      await setDoc(doc(db, 'contactInfo', 'main'), contactInfo);
    } else {
      // Update existing document
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, contactInfo as any);
    }
  },
};

// Contact Messages Service
export const contactMessagesService = {
  add: async (message: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<string> => {
    const docRef = await addDoc(collection(db, 'contactMessages'), {
      ...message,
      createdAt: new Date().toISOString(),
      read: false,
    });
    
    return docRef.id;
  },

  getAll: async () => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  markAsRead: async (id: string): Promise<void> => {
    await updateDoc(doc(db, 'contactMessages', id), { read: true });
  },

  delete: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'contactMessages', id));
  },
};

// Site Settings Service
export interface SiteSettings {
  bannerImageURL?: string; // Keep for backward compatibility
  bannerImages?: string[]; // New: multiple banner images
}

export const siteSettingsService = {
  get: async (): Promise<SiteSettings | null> => {
    const docRef = doc(db, 'siteSettings', 'main');
    const snapshot = await getDocs(query(collection(db, 'siteSettings')));
    if (snapshot.empty) return null;
    const settingsDoc = snapshot.docs[0];
    return { ...settingsDoc.data() } as SiteSettings;
  },

  subscribe: (callback: (settings: SiteSettings | null) => void) => {
    const docRef = doc(db, 'siteSettings', 'main');
    return onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null);
        return;
      }
      callback({ ...snapshot.data() } as SiteSettings);
    });
  },

  updateBannerImage: async (imageFile: File): Promise<void> => {
    try {
      // Upload new image
      const imageURL = await uploadImage(imageFile, 'site-settings');
      
      // Get current settings to delete old image if exists
      const docRef = doc(db, 'siteSettings', 'main');
      const snapshot = await getDocs(collection(db, 'siteSettings'));
      
      if (!snapshot.empty) {
        const currentData = snapshot.docs[0].data();
        if (currentData.bannerImageURL) {
          try {
            await deleteImage(currentData.bannerImageURL as string);
          } catch (deleteError) {
            console.log('Could not delete old image, continuing...', deleteError);
          }
        }
      }
      
      // Update settings - use setDoc to create or update
      await setDoc(docRef, { bannerImageURL: imageURL }, { merge: true });
    } catch (error) {
      console.error('Error updating banner image:', error);
      throw error;
    }
  },

  // Add multiple banner images
  addBannerImages: async (imageFiles: File[]): Promise<void> => {
    try {
      // Upload all images
      const uploadPromises = imageFiles.map(file => uploadImage(file, 'site-settings'));
      const imageURLs = await Promise.all(uploadPromises);
      
      // Get current settings
      const docRef = doc(db, 'siteSettings', 'main');
      const snapshot = await getDocs(collection(db, 'siteSettings'));
      
      let currentImages: string[] = [];
      if (!snapshot.empty) {
        const currentData = snapshot.docs[0].data();
        currentImages = (currentData.bannerImages as string[]) || [];
      }
      
      // Append new images to existing ones
      const updatedImages = [...currentImages, ...imageURLs];
      
      // Update settings
      await setDoc(docRef, { bannerImages: updatedImages }, { merge: true });
    } catch (error) {
      console.error('Error adding banner images:', error);
      throw error;
    }
  },

  // Remove a specific banner image
  removeBannerImage: async (imageURL: string): Promise<void> => {
    try {
      // Delete image from Cloudinary
      await deleteImage(imageURL);
      
      // Get current settings
      const docRef = doc(db, 'siteSettings', 'main');
      const snapshot = await getDocs(collection(db, 'siteSettings'));
      
      if (!snapshot.empty) {
        const currentData = snapshot.docs[0].data();
        const currentImages = (currentData.bannerImages as string[]) || [];
        
        // Remove the image from array
        const updatedImages = currentImages.filter(url => url !== imageURL);
        
        // Update settings
        await setDoc(docRef, { bannerImages: updatedImages }, { merge: true });
      }
    } catch (error) {
      console.error('Error removing banner image:', error);
      throw error;
    }
  },

  update: async (settings: Partial<SiteSettings>): Promise<void> => {
    const docRef = doc(db, 'siteSettings', 'main');
    await setDoc(docRef, settings, { merge: true });
  },
};

// Testimonials Service
export const testimonialsService = {
  getAll: async (): Promise<Testimonial[]> => {
    const q = query(collection(db, 'testimonials'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Testimonial));
  },

  subscribe: (callback: (testimonials: Testimonial[]) => void) => {
    const q = query(collection(db, 'testimonials'), orderBy('date', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const testimonials = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Testimonial));
      callback(testimonials);
    });
  },

  add: async (testimonial: Omit<Testimonial, 'id'>, photoFile?: File): Promise<string> => {
    let photoURL = testimonial.photoURL;
    
    if (photoFile) {
      photoURL = await uploadImage(photoFile, 'testimonials');
    }
    
    const docRef = await addDoc(collection(db, 'testimonials'), {
      ...testimonial,
      photoURL,
      date: testimonial.date || new Date().toISOString(),
    });
    
    return docRef.id;
  },

  update: async (id: string, testimonial: Partial<Testimonial>, photoFile?: File): Promise<void> => {
    const testimonialRef = doc(db, 'testimonials', id);
    
    let updateData: any = { ...testimonial };
    
    if (photoFile) {
      updateData.photoURL = await uploadImage(photoFile, 'testimonials');
    }
    
    await updateDoc(testimonialRef, updateData);
  },

  delete: async (id: string, photoURL?: string): Promise<void> => {
    if (photoURL) {
      await deleteImage(photoURL);
    }
    await deleteDoc(doc(db, 'testimonials', id));
  },
};

// News Service
export const newsService = {
  getAll: async (): Promise<NewsArticle[]> => {
    const q = query(collection(db, 'news'), orderBy('publishedDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as NewsArticle));
  },

  getPublished: async (): Promise<NewsArticle[]> => {
    const q = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      orderBy('publishedDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as NewsArticle));
  },

  getBySlug: async (slug: string): Promise<NewsArticle | null> => {
    const q = query(collection(db, 'news'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() } as NewsArticle;
  },

  subscribe: (callback: (news: NewsArticle[]) => void) => {
    const q = query(collection(db, 'news'), orderBy('publishedDate', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as NewsArticle));
      callback(news);
    });
  },

  subscribePublished: (callback: (news: NewsArticle[]) => void) => {
    const q = query(
      collection(db, 'news'),
      where('status', '==', 'published'),
      orderBy('publishedDate', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const news = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as NewsArticle));
      callback(news);
    });
  },

  add: async (article: Omit<NewsArticle, 'id'>, imageFile?: File): Promise<string> => {
    let imageURL = article.imageURL;
    
    if (imageFile) {
      imageURL = await uploadImage(imageFile, 'news');
    }
    
    const docRef = await addDoc(collection(db, 'news'), {
      ...article,
      imageURL,
      publishedDate: article.publishedDate || new Date().toISOString(),
      views: 0,
    });
    
    return docRef.id;
  },

  update: async (id: string, article: Partial<NewsArticle>, imageFile?: File): Promise<void> => {
    const articleRef = doc(db, 'news', id);
    
    let updateData: any = { ...article };
    
    if (imageFile) {
      updateData.imageURL = await uploadImage(imageFile, 'news');
    }
    
    await updateDoc(articleRef, updateData);
  },

  incrementViews: async (id: string): Promise<void> => {
    const articleRef = doc(db, 'news', id);
    const articleDoc = await getDocs(query(collection(db, 'news'), where('__name__', '==', id)));
    
    if (!articleDoc.empty) {
      const currentViews = (articleDoc.docs[0].data().views as number) || 0;
      await updateDoc(articleRef, { views: currentViews + 1 });
    }
  },

  delete: async (id: string, imageURL?: string): Promise<void> => {
    if (imageURL) {
      await deleteImage(imageURL);
    }
    await deleteDoc(doc(db, 'news', id));
  },
};
