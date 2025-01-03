import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const startTime = Date.now();
    
    // Try different headers to get client IP
    const getClientIP = (event: any): string => {
        const headers = event.request.headers;
        return headers.get('cf-connecting-ip') || // Cloudflare
               headers.get('x-real-ip') || // Nginx
               headers.get('x-client-ip') ||
               headers.get('x-forwarded-for')?.split(',')[0] ||
               event.getClientAddress?.() || // SvelteKit method
               'unknown';
    };

    const clientIP = getClientIP(event);
    const userAgent = event.request.headers.get('user-agent') || 'unknown';
    
    const response = await resolve(event);
    
    if (event.url.pathname.startsWith('/api/')) {
        // const endTime = Date.now();
        const endTime = Date.now();
        const timestamp = new Date().toISOString(); 
        console.log(`${timestamp} IP: ${clientIP} | UA: ${userAgent} | ${event.url.pathname} | Response Time: ${endTime - startTime} ms`);
    }
    
    return response;
};

