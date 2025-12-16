// server/websocket/scheduleSync.js
import { WebSocketServer } from 'ws';

class ScheduleSyncWebSocket {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Set();
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wss.on('connection', (ws, req) => {
      this.clients.add(ws);
      
      ws.on('message', async (message) => {
        const data = JSON.parse(message);
        await this.handleMessage(ws, data);
      });

      ws.on('close', () => {
        this.clients.delete(ws);
      });
    });
  }

  async handleMessage(ws, data) {
    switch (data.type) {
      case 'subscribe_schedule':
        ws.scheduleId = data.scheduleId;
        break;
      case 'request_sync':
        await this.handleSyncRequest(ws, data);
        break;
    }
  }

  broadcastScheduleUpdate(scheduleId, update) {
    const message = JSON.stringify({
      type: 'schedule_update',
      scheduleId,
      update,
      timestamp: new Date()
    });

    this.clients.forEach(client => {
      if (client.scheduleId === scheduleId && client.readyState === 1) {
        client.send(message);
      }
    });
  }
}