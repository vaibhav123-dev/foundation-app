import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { members, founders, events, socialWorks, contactInfo } from '../data/mockData';

// Initialize Firebase for Node.js environment
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedDatabase() {
  try {
    console.log('Starting database seed...');

    // Seed Members
    console.log('Seeding members...');
    for (const member of members) {
      const { id, ...memberData } = member;
      await addDoc(collection(db, 'members'), memberData);
    }
    console.log(`✓ Seeded ${members.length} members`);

    // Seed Founders
    console.log('Seeding founders...');
    for (const founder of founders) {
      const { id, ...founderData } = founder;
      await addDoc(collection(db, 'founders'), founderData);
    }
    console.log(`✓ Seeded ${founders.length} founders`);

    // Seed Events
    console.log('Seeding events...');
    for (const event of events) {
      const { id, ...eventData } = event;
      await addDoc(collection(db, 'events'), eventData);
    }
    console.log(`✓ Seeded ${events.length} events`);

    // Seed Social Work
    console.log('Seeding social work initiatives...');
    for (const work of socialWorks) {
      const { id, ...workData } = work;
      await addDoc(collection(db, 'socialWork'), workData);
    }
    console.log(`✓ Seeded ${socialWorks.length} social work initiatives`);

    // Seed Contact Info
    console.log('Seeding contact info...');
    await setDoc(doc(db, 'contactInfo', 'main'), contactInfo);
    console.log('✓ Seeded contact info');

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Seed script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });
