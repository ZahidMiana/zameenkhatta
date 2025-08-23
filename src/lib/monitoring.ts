import { NextRequest } from 'next/server';

interface PerformanceMetrics {
  endpoint: string;
  method: string;
  duration: number;
  statusCode: number;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
  memoryUsage?: NodeJS.MemoryUsage;
}

interface ErrorMetrics {
  endpoint: string;
  method: string;
  error: string;
  stack?: string;
  timestamp: Date;
  userAgent?: string;
  ip?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private errors: ErrorMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics in memory

  startTiming(): { end: () => number } {
    const start = performance.now();
    return {
      end: () => performance.now() - start
    };
  }

  recordMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow requests (> 1 second)
    if (metric.duration > 1000) {
      console.warn('Slow request detected:', {
        endpoint: metric.endpoint,
        method: metric.method,
        duration: `${metric.duration.toFixed(2)}ms`,
        statusCode: metric.statusCode,
      });
    }
  }

  recordError(error: ErrorMetrics): void {
    this.errors.push(error);
    
    // Keep only recent errors
    if (this.errors.length > this.maxMetrics) {
      this.errors = this.errors.slice(-this.maxMetrics);
    }

    console.error('API Error recorded:', {
      endpoint: error.endpoint,
      method: error.method,
      error: error.error,
      timestamp: error.timestamp,
    });
  }

  getMetrics(timeRange?: { start: Date; end: Date }): PerformanceMetrics[] {
    if (!timeRange) return this.metrics;
    
    return this.metrics.filter(m => 
      m.timestamp >= timeRange.start && m.timestamp <= timeRange.end
    );
  }

  getErrors(timeRange?: { start: Date; end: Date }): ErrorMetrics[] {
    if (!timeRange) return this.errors;
    
    return this.errors.filter(e => 
      e.timestamp >= timeRange.start && e.timestamp <= timeRange.end
    );
  }

  getAnalytics(timeRange?: { start: Date; end: Date }) {
    const metrics = this.getMetrics(timeRange);
    const errors = this.getErrors(timeRange);

    if (metrics.length === 0) {
      return {
        totalRequests: 0,
        averageResponseTime: 0,
        slowRequests: 0,
        errorRate: 0,
        topEndpoints: [],
        errorBreakdown: [],
        statusCodeBreakdown: {},
      };
    }

    const totalRequests = metrics.length;
    const averageResponseTime = metrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests;
    const slowRequests = metrics.filter(m => m.duration > 1000).length;
    const errorRate = (errors.length / totalRequests) * 100;

    // Top endpoints by request count
    const endpointCounts = metrics.reduce((acc, m) => {
      const key = `${m.method} ${m.endpoint}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topEndpoints = Object.entries(endpointCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([endpoint, count]) => ({ endpoint, count }));

    // Error breakdown
    const errorCounts = errors.reduce((acc, e) => {
      acc[e.error] = (acc[e.error] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const errorBreakdown = Object.entries(errorCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([error, count]) => ({ error, count }));

    // Status code breakdown
    const statusCodeBreakdown = metrics.reduce((acc, m) => {
      acc[m.statusCode] = (acc[m.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalRequests,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
      slowRequests,
      errorRate: Math.round(errorRate * 100) / 100,
      topEndpoints,
      errorBreakdown,
      statusCodeBreakdown,
      memoryUsage: process.memoryUsage(),
    };
  }

  // Middleware function for API routes
  middleware() {
    return (request: NextRequest, context: any) => {
      const timer = this.startTiming();
      const startTime = new Date();
      
      const originalJson = Response.json;
      let statusCode = 200;
      
      // Override Response.json to capture status codes
      Response.json = function(body: any, init?: ResponseInit) {
        statusCode = init?.status || 200;
        return originalJson.call(this, body, init);
      };

      return new Promise((resolve, reject) => {
        try {
          const result = context.next();
          
          Promise.resolve(result).then((response) => {
            const duration = timer.end();
            
            monitor.recordMetric({
              endpoint: new URL(request.url).pathname,
              method: request.method,
              duration,
              statusCode: response?.status || statusCode,
              timestamp: startTime,
              userAgent: request.headers.get('user-agent') || undefined,
              ip: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || undefined,
              memoryUsage: process.memoryUsage(),
            });

            resolve(response);
          }).catch((error) => {
            const duration = timer.end();
            
            monitor.recordError({
              endpoint: new URL(request.url).pathname,
              method: request.method,
              error: error.message || 'Unknown error',
              stack: error.stack,
              timestamp: startTime,
              userAgent: request.headers.get('user-agent') || undefined,
              ip: request.headers.get('x-forwarded-for') || 
                  request.headers.get('x-real-ip') || undefined,
            });

            reject(error);
          });
        } catch (error: any) {
          monitor.recordError({
            endpoint: new URL(request.url).pathname,
            method: request.method,
            error: error.message || 'Unknown error',
            stack: error.stack,
            timestamp: startTime,
            userAgent: request.headers.get('user-agent') || undefined,
            ip: request.headers.get('x-forwarded-for') || 
                request.headers.get('x-real-ip') || undefined,
          });

          reject(error);
        }
      });
    };
  }

  // Get system health information
  getSystemHealth() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024), // MB
        external: Math.round(memoryUsage.external / 1024 / 1024), // MB
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      uptime: Math.round(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }

  // Clear old metrics (call this periodically)
  cleanup(olderThanHours: number = 24): void {
    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - olderThanHours);
    
    this.metrics = this.metrics.filter(m => m.timestamp >= cutoff);
    this.errors = this.errors.filter(e => e.timestamp >= cutoff);
    
    console.log(`Cleaned up metrics older than ${olderThanHours} hours`);
  }
}

const monitor = new PerformanceMonitor();

// Cleanup old metrics every hour
setInterval(() => {
  monitor.cleanup();
}, 60 * 60 * 1000);

export default monitor;
