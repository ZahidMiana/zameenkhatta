import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import monitor from '@/lib/monitoring';
// import cacheService from '@/lib/cache';
import { 
  asyncHandler, 
  successResponse, 
  errorResponse, 
  requireAuth 
} from '@/lib/error-handler';

export const GET = asyncHandler(async (request: NextRequest) => {
  const session = await getServerSession(authOptions);
  requireAuth(session, 'ADMIN');

  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || '24h';
  const type = searchParams.get('type') || 'analytics';

  // Get monitoring data directly (cache disabled for now)
  const cacheKey = `monitoring_${type}_${timeRange}`;
  
  let data: any = {};

  // Calculate time range
  const now = new Date();
  let start = new Date();
  
  switch (timeRange) {
    case '1h':
      start.setHours(now.getHours() - 1);
      break;
    case '24h':
      start.setDate(now.getDate() - 1);
      break;
    case '7d':
      start.setDate(now.getDate() - 7);
      break;
    case '30d':
      start.setDate(now.getDate() - 30);
      break;
    default:
      start.setDate(now.getDate() - 1);
  }

  const timeRangeFilter = { start, end: now };

  switch (type) {
    case 'analytics':
      data = monitor.getAnalytics(timeRangeFilter);
      break;
    case 'system':
      data = monitor.getSystemHealth();
      break;
    case 'errors':
      data = {
        errors: monitor.getErrors(timeRangeFilter),
        total: monitor.getErrors(timeRangeFilter).length,
      };
      break;
    case 'metrics':
      data = {
        metrics: monitor.getMetrics(timeRangeFilter),
        total: monitor.getMetrics(timeRangeFilter).length,
      };
      break;
    default:
      return errorResponse('Invalid monitoring type', 400);
  }

  // Cache disabled for now
  // await cacheService.cacheAnalytics(cacheKey, data, 300); // 5 minutes cache

  return successResponse(data);
});
