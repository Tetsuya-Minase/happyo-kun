// List of slide directories for SPA routing
const SLIDE_DIRECTORIES = ['demo', 'genai-in-business', 'intro'];

export async function onRequest(context: any) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Check if this is a slide directory path (but not a static file)
  let slideDir: string | null = null;
  for (const dir of SLIDE_DIRECTORIES) {
    if (pathname.startsWith(`/${dir}/`) && !pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|json)$/)) {
      slideDir = dir;
      break;
    }
  }

  let response: Response;

  if (slideDir && !pathname.startsWith('/api/')) {
    // For SPA routes in slide directories, return the index.html
    const indexPath = `/${slideDir}/index.html`;
    const indexUrl = new URL(indexPath, url.origin);

    try {
      // Fetch the index.html for this slide directory
      response = await context.env.ASSETS.fetch(new Request(indexUrl));
    } catch (e) {
      console.error(`Failed to fetch ${indexPath}:`, e);
      // Fallback to normal request handling
      response = await context.next();
    }
  } else {
    // Normal request handling for static files and API endpoints
    response = await context.next();
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