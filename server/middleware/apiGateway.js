// server/middleware/apiGateway.js
import { WebSocketServer } from 'ws';
import { EventEmitter } from 'events';

class APIGateway extends EventEmitter {
  constructor() {
    super();
    this.connections = new Map();
    this.externalSystems = new Map();
  }

  async registerExternalSystem(systemConfig) {
    const { name, baseURL, authType, credentials } = systemConfig;
    
    const system = {
      name,
      client: this.createAPIClient(baseURL, authType, credentials),
      lastSync: null,
      status: 'disconnected'
    };
    
    this.externalSystems.set(name, system);
    await this.testConnection(system);
  }

  async syncWithExternalSystem(systemName, data) {
    const system = this.externalSystems.get(systemName);
    if (!system) throw new Error(`System ${systemName} not registered`);
    
    try {
      const response = await system.client.post('/sync', data);
      system.lastSync = new Date();
      this.emit('syncSuccess', { system: systemName, data: response.data });
      return response.data;
    } catch (error) {
      this.emit('syncError', { system: systemName, error });
      throw error;
    }
  }
}