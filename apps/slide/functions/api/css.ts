// Simple rate limiting implementation
const rateLimitMap = new Map();

function checkRateLimit(request: Request): boolean {
  const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
  const key = `rate_${ip}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const max = 100; // 100 requests per minute

  const current = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };
  
  if (now > current.resetTime) {
    current.count = 0;
    current.resetTime = now + windowMs;
  }
  
  current.count++;
  rateLimitMap.set(key, current);
  
  return current.count <= max;
}

function sanitizeCss(css: string): string {
  // Remove potentially dangerous CSS
  const dangerous = [
    /expression\s*\(/gi,
    /javascript\s*:/gi,
    /@import/gi,
    /behavior\s*:/gi,
    /-moz-binding/gi,
    /vbscript\s*:/gi
  ];
  
  let sanitized = css;
  dangerous.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '/* removed */');
  });
  
  return sanitized;
}

export async function onRequestPost(request: Request) {
  // Rate limiting check
  if (!checkRateLimit(request)) {
    return new Response(JSON.stringify({
      error: true,
      message: 'Rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT',
      timestamp: Date.now()
    }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    const body = await request.json();
    const { css, timestamp } = body;
    
    // Validation
    if (!css || typeof css !== 'string') {
      return new Response(JSON.stringify({
        error: true,
        message: 'Invalid CSS data',
        timestamp: Date.now()
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (css.length > 100 * 1024) { // 100KB limit
      return new Response(JSON.stringify({
        error: true,
        message: 'CSS too large (max 100KB)',
        timestamp: Date.now()
      }), {
        status: 413,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Sanitize CSS
    const sanitizedCss = sanitizeCss(css);
    
    // Generate unique ID (simple implementation)
    const id = `css_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // In a real application, you would save this to a database
    // For now, we just return success
    console.log(`Saved CSS with ID: ${id}, Length: ${sanitizedCss.length} chars`);
    
    return new Response(JSON.stringify({
      success: true,
      id,
      savedAt: Date.now()
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: true,
      message: 'Invalid JSON format',
      timestamp: Date.now()
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export async function onRequestOptions(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}