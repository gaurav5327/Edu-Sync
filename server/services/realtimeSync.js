// server/services/realtimeSync.js
import { APIGateway } from '../middleware/apiGateway.js';

class RealtimeSyncService {
  constructor() {
    this.gateway = new APIGateway();
    this.syncQueue = [];
    this.isProcessing = false;
  }

  async initializeExternalSystems() {
    // Register common AMS systems
    await this.gateway.registerExternalSystem({
      name: 'moodle',
      baseURL: process.env.MOODLE_API_URL,
      authType: 'oauth2',
      credentials: {
        clientId: process.env.MOODLE_CLIENT_ID,
        clientSecret: process.env.MOODLE_CLIENT_SECRET
      }
    });

    await this.gateway.registerExternalSystem({
      name: 'blackboard',
      baseURL: process.env.BLACKBOARD_API_URL,
      authType: 'api_key',
      credentials: {
        apiKey: process.env.BLACKBOARD_API_KEY
      }
    });
  }

  async syncScheduleChanges(scheduleId, changes) {
    const syncData = {
      scheduleId,
      changes,
      timestamp: new Date(),
      source: 'dynamic_scheduler'
    };

    // Queue for processing
    this.syncQueue.push(syncData);
    await this.processSyncQueue();
  }

  async processSyncQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.syncQueue.length > 0) {
      const syncData = this.syncQueue.shift();
      
      // Sync with all registered systems
      for (const [systemName, system] of this.gateway.externalSystems) {
        try {
          await this.gateway.syncWithExternalSystem(systemName, syncData);
        } catch (error) {
          console.error(`Sync failed with ${systemName}:`, error);
          // Retry logic
          this.scheduleRetry(systemName, syncData);
        }
      }
    }

    this.isProcessing = false;
  }
}