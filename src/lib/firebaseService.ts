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
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from './cloudinaryService';
import type { Member, Founder, Event, SocialWork, ContactInfo } from '@/data/mockData';

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
