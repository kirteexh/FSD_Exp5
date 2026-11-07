const mongoose = require('mongoose');
require('dotenv').config();
const Event = require('./models/Event');

const sampleEvents = [
  {
    name: 'Tech Conference 2024',
    date: '2024-12-15',
    location: 'Convention Center, Mumbai',
    description: 'Annual technology conference featuring latest innovations in AI, Cloud, and Web',
    capacity: 500,
    registered: 234
  },
  {
    name: 'Web Development Workshop',
    date: '2024-11-20',
    location: 'Online via Zoom',
    description: 'Hands-on workshop for modern full-stack development with MERN stack',
    capacity: 100,
    registered: 87
  },
  {
    name: 'AI & Machine Learning Summit',
    date: '2024-12-01',
    location: 'Tech Hub Auditorium, Pune',
    description: 'Exploring next-gen AI architectures, LLMs, and real-world deployment',
    capacity: 300,
    registered: 156
  },
  {
    name: 'Cloud Native & DevOps Bootcamp',
    date: '2025-01-10',
    location: 'Hybrid / Bangalore',
    description: 'Deep dive into Docker, Kubernetes, CI/CD pipelines, and cloud security',
    capacity: 250,
    registered: 110
  }
];

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB successfully.');

    // Clear existing events
    await Event.deleteMany();
    console.log('Cleared existing events collection.');

    // Insert sample events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`✅ Successfully seeded ${createdEvents.length} events into MongoDB:`);
    createdEvents.forEach((ev, idx) => {
      console.log(`   [${idx + 1}] ID: ${ev._id} | Name: "${ev.name}"`);
    });

    await mongoose.connection.close();
    console.log('Database connection closed. Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    process.exit(1);
  }
};

seedDatabase();

