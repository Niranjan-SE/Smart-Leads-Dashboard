import mongoose from 'mongoose';
import { config } from '../config';
import { connectDB } from '../config/database';
import { User } from '../models/User';
import { Lead } from '../models/Lead';

const seed = async (): Promise<void> => {
  await connectDB();

  console.log('🌱 Seeding database...');

  // Clear existing data
  await User.deleteMany({});
  await Lead.deleteMany({});

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@smartleads.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create sales user
  const sales = await User.create({
    name: 'Sales User',
    email: 'sales@smartleads.com',
    password: 'sales123',
    role: 'sales',
  });

  const statuses = ['New', 'Contacted', 'Qualified', 'Lost'] as const;
  const sources = ['Website', 'Instagram', 'Referral'] as const;

  const sampleLeads = [
    { name: 'Rahul Sharma', email: 'rahul@example.com', status: 'Qualified', source: 'Instagram' },
    { name: 'Priya Patel', email: 'priya@example.com', status: 'New', source: 'Website' },
    { name: 'Arjun Singh', email: 'arjun@example.com', status: 'Contacted', source: 'Referral' },
    { name: 'Kavya Reddy', email: 'kavya@example.com', status: 'Lost', source: 'Instagram' },
    { name: 'Amit Kumar', email: 'amit@example.com', status: 'New', source: 'Website' },
    { name: 'Sneha Joshi', email: 'sneha@example.com', status: 'Qualified', source: 'Referral' },
    { name: 'Vikram Nair', email: 'vikram@example.com', status: 'Contacted', source: 'Website' },
    { name: 'Deepa Iyer', email: 'deepa@example.com', status: 'New', source: 'Instagram' },
    { name: 'Ravi Gupta', email: 'ravi@example.com', status: 'Qualified', source: 'Website' },
    { name: 'Ananya Das', email: 'ananya@example.com', status: 'Lost', source: 'Referral' },
    { name: 'Karan Mehta', email: 'karan@example.com', status: 'Contacted', source: 'Instagram' },
    { name: 'Pooja Verma', email: 'pooja@example.com', status: 'New', source: 'Website' },
  ];

  for (const lead of sampleLeads) {
    await Lead.create({
      ...lead,
      notes: `Follow up with ${lead.name.split(' ')[0]} regarding our services.`,
      createdBy: Math.random() > 0.5 ? admin._id : sales._id,
    });
  }

  console.log('✅ Seed completed!');
  console.log('👤 Admin: admin@smartleads.com / admin123');
  console.log('👤 Sales: sales@smartleads.com / sales123');

  await mongoose.disconnect();
};

seed().catch(console.error);
