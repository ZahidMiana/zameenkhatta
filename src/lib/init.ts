// import cacheService from '@/lib/cache';

// Initialize services
let servicesInitialized = false;

export async function initializeServices() {
  if (servicesInitialized) return;

  try {
    // Initialize cache service (disabled for now)
    // await cacheService.connect();
    console.log('✅ Services initialization skipped (cache disabled)');

    servicesInitialized = true;
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
  }
}

// Auto-initialize on import
initializeServices();
