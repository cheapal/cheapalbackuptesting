import cron from 'node-cron';
import Chat from '../models/Chat.js';

const expireChats = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const result = await Chat.updateMany(
        { expiresAt: { $lt: new Date() }, isExpired: false },
        { $set: { isExpired: true } }
      );
      console.log(`[Cron] Expired ${result.modifiedCount} chats`);
    } catch (error) {
      console.error('[Cron] Error expiring chats:', error);
    }
  });
};

export default expireChats;