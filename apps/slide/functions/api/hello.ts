export async function onRequestGet(request: Request) {
  const url = new URL(request.url);
  const name = url.searchParams.get('name') || 'World';
  
  // Simple input validation
  if (name.length > 100) {
    return new Response(JSON.stringify({
      error: true,
      message: 'Name too long (max 100 characters)',
      timestamp: Date.now()
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  
  return new Response(JSON.stringify({
    message: `Hello, ${name}!`,
    timestamp: Date.now()
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function onRequestOptions(request: Request) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}