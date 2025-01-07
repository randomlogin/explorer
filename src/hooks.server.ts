import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    const startTime = Date.now();
    
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
    
    if (event.url.pathname.startsWith('/api/')) {
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 5000);
        });

        try {
            const response = await Promise.race([
                resolve(event),
                timeoutPromise
            ]);
            
            const endTime = Date.now();
            const timestamp = new Date().toISOString();
            console.log(`${timestamp} IP: ${clientIP} | UA: ${userAgent} | ${event.url.pathname} | Response Time: ${endTime - startTime} ms`);
            
            return response;
        } catch (error) {
            const timestamp = new Date().toISOString();
            console.log(`${timestamp} IP: ${clientIP} | UA: ${userAgent} | ${event.url.pathname} | TIMEOUT after 5000ms`);
            
            return new Response('Request timed out', { 
                status: 504,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
    
    const response = await resolve(event);
    return response;
};
