import { Account, Client, Databases } from 'react-native-appwrite';


// console.log('Environment Variables:', {
//   endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
//   projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
//   platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM,
//   dbId: process.env.EXPO_PUBLIC_APPWRITE_DB_ID,
//   collectionId: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID,
//   completionsId: process.env.EXPO_PUBLIC_APPWRITE_COMPLETIONS_ID,
// });

export const client = new Client();

if (
  !process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ||
  !process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ||
  !process.env.EXPO_PUBLIC_APPWRITE_PLATFORM
) {
  console.error('Missing critical Appwrite environment variables');
} else {
  try {
    client
      .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
      .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
      .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM);
    console.log('Appwrite client initialized successfully');
  } catch (error: any) {
    console.error('Appwrite Initialization Error:', error.message, error.stack);
  }
}

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DB_ID || 'fallback-db-id';
export const HABIT_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID || 'fallback-collection-id';
export const COMPLETIONS_ID = process.env.EXPO_PUBLIC_APPWRITE_COMPLETIONS_ID || 'fallback-completions-id';

export interface RealTimeResponse {
  events: string[];
  payload: any;
}