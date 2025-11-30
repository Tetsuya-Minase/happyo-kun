// List of slide directories for SPA routing
const SLIDE_DIRECTORIES = ['demo', 'genai-in-business', 'intro'];

export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Try to get the response from static assets or API endpoints
  let response = await context.next();

  // If 404 and not an API endpoint, check if it's a SPA route
  if (response.status === 404 && !pathname.startsWith('/api/')) {
    // Check which slide directory the path belongs to
    for (const slideDir of SLIDE_DIRECTORIES) {
      if (pathname.startsWith(`/${slideDir}/`)) {
        // Return the index.html for this slide directory
        const indexPath = `/${slideDir}/index.html`;
        const indexUrl = new URL(indexPath, url.origin);

        try {
          // Fetch the index.html from the static assets
          const indexRequest = new Request(indexUrl, context.request);
          response = await context.env.ASSETS.fetch(indexRequest);

          // Return 200 status with index.html content for SPA routing
          response = new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        } catch (e) {
          // If fetching index.html fails, continue with 404
          console.error(`Failed to fetch ${indexPath}:`, e);
        }
        break;
      }
    }
  }

  // Security headers
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // CORS headers for API endpoints
  if (pathname.startsWith('/api/')) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  }

  return response;
}