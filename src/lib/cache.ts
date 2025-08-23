import { createClient, RedisClientType } from 'redis';

interface CacheEntry {
  data: any;
  expiry: number;
}

class CacheService {
  private client: RedisClientType;
  private isConnected = false;
  private readonly defaultTTL = 300; // 5 minutes
  private inMemoryCache = new Map<string, CacheEntry>();

  constructor() {
    // Initialize Redis client
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      console.log('Redis Client Disconnected');
      this.isConnected = false;
    });

    // Setup in-memory cache cleanup
    this.setupInMemoryCache();
  }

  async connect(): Promise<void> {
    try {
      if (this.client.isOpen) {
        this.isConnected = true;
        return;
      }

      this.client.on('error', (err) => {
        console.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      await this.client.connect();
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      // Fallback to in-memory cache
      this.setupInMemoryCache();
    }
  }

  private setupInMemoryCache(): void {
    console.log('Using in-memory cache as fallback');
    // Clean up expired entries every 5 minutes
    setInterval(() => {
      const now = Date.now();
      const entries = Array.from(this.inMemoryCache.entries());
      for (const [key, value] of entries) {
        if (value.expiry < now) {
          this.inMemoryCache.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (this.isConnected && this.client.isOpen) {
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        // Use in-memory cache
        const entry = this.inMemoryCache.get(key);
        if (entry && entry.expiry > Date.now()) {
          return entry.data;
        } else if (entry) {
          this.inMemoryCache.delete(key);
        }
        return null;
      }
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      if (this.isConnected && this.client.isOpen) {
        await this.client.setEx(key, ttl, JSON.stringify(value));
      } else {
        // Use in-memory cache
        this.inMemoryCache.set(key, {
          data: value,
          expiry: Date.now() + (ttl * 1000),
        });
      }
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (this.isConnected && this.client.isOpen) {
        await this.client.del(key);
      } else {
        this.inMemoryCache.delete(key);
      }
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (this.isConnected && this.client.isOpen) {
        await this.client.flushAll();
      } else {
        this.inMemoryCache.clear();
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  // Specialized cache methods for common data types

  async cacheProperty(propertyId: string, property: any, ttl = 1800): Promise<void> {
    await this.set(`property:${propertyId}`, property, ttl);
  }

  async getCachedProperty(propertyId: string): Promise<any> {
    return await this.get(`property:${propertyId}`);
  }

  async cacheUser(userId: string, user: any, ttl = 900): Promise<void> {
    await this.set(`user:${userId}`, user, ttl);
  }

  async getCachedUser(userId: string): Promise<any> {
    return await this.get(`user:${userId}`);
  }

  async cacheSearchResults(query: string, results: any[], ttl = 600): Promise<void> {
    const cacheKey = `search:${Buffer.from(query).toString('base64')}`;
    await this.set(cacheKey, results, ttl);
  }

  async getCachedSearchResults(query: string): Promise<any[] | null> {
    const cacheKey = `search:${Buffer.from(query).toString('base64')}`;
    return await this.get(cacheKey);
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      if (this.isConnected && this.client.isOpen) {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(keys);
        }
      } else {
        // For in-memory cache, we need to manually check each key
        const keysToDelete: string[] = [];
        const entries = Array.from(this.inMemoryCache.keys());
        for (const key of entries) {
          if (this.matchPattern(key, pattern)) {
            keysToDelete.push(key);
          }
        }
        for (const key of keysToDelete) {
          this.inMemoryCache.delete(key);
        }
      }
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
    }
  }

  private matchPattern(key: string, pattern: string): boolean {
    // Simple pattern matching for asterisk wildcards
    const regex = new RegExp(pattern.replace(/\*/g, '.*'));
    return regex.test(key);
  }

  async disconnect(): Promise<void> {
    try {
      if (this.client.isOpen) {
        await this.client.disconnect();
      }
    } catch (error) {
      console.error('Cache disconnect error:', error);
    }
  }
}

export default new CacheService();
