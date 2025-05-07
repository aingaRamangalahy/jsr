import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../config/db';
import { hashPassword } from '../utils/auth';
import * as testData from './testData';

// Import all models
import Admin from '../models/Admin';
import Bookmark from '../models/Bookmark';
import Category from '../models/Category';
import Comment from '../models/Comment';
import Resource from '../models/Resource';
import ResourceType from '../models/ResourceType';
import User from '../models/User';

/**
 * Seed the database with test data
 */
export const seedDatabase = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();
    console.log('🔌 Connected to database');

    // Clear existing data
    await clearDatabase();
    console.log('🧹 Cleared existing data');

    // Seed categories
    await Category.insertMany(testData.categories);
    console.log('🏷️  Seeded categories');

    // Seed resource types
    await ResourceType.insertMany(testData.resourceTypes);
    console.log('📚 Seeded resource types');

    // Seed users
    await User.insertMany(testData.users);
    console.log('👤 Seeded users');

    // Seed admins with hashed passwords
    const adminsWithHashedPasswords = await Promise.all(
      testData.admins.map(async (admin) => ({
        ...admin,
        password: await hashPassword(admin.password),
      }))
    );
    await Admin.insertMany(adminsWithHashedPasswords);
    console.log('👑 Seeded admins');

    // Seed resources
    await Resource.insertMany(testData.resources);
    console.log('📖 Seeded resources');

    // Seed comments
    await Comment.insertMany(testData.comments);
    console.log('💬 Seeded comments');

    // Seed bookmarks
    await Bookmark.insertMany(testData.bookmarks);
    console.log('🔖 Seeded bookmarks');

    console.log('✅ Database seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // Disconnect from database
    await disconnectDB();
    console.log('🔌 Disconnected from database');
  }
};

/**
 * Clear all collections in the database
 */
export const clearDatabase = async (): Promise<void> => {
  try {
    // Get all collections
    const collections = mongoose.connection.collections;

    // Drop each collection
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }

    console.log('✅ Database cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
};

/**
 * Drop the entire database
 */
export const dropDatabase = async (): Promise<void> => {
  try {
    await connectDB();
    console.log('🔌 Connected to database');

    await mongoose.connection.dropDatabase();
    console.log('💥 Database dropped successfully');
  } catch (error) {
    console.error('❌ Error dropping database:', error);
  } finally {
    await disconnectDB();
    console.log('🔌 Disconnected from database');
  }
}; 