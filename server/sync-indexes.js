import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './src/modules/user/user.schema.js';

dotenv.config();

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    console.log('Syncing indexes for User model...');
    // syncIndexes drops any indexes defined in MongoDB that aren't defined in the schema
    // and builds the new ones.
    const result = await User.syncIndexes();
    console.log('Index sync result:', result);
    console.log('Indexes synced successfully!');
  } catch (error) {
    console.error('Failed to sync indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected!');
  }
}

run();
