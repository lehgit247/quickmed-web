// app/api/auth/login/route.js
export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Simple mock authentication
    const users = [
      { id: 1, email: 'doctor@quickmed.com', password: 'password', name: 'Dr. Ada Okoye', role: 'doctor' },
      { id: 2, email: 'pharmacy@quickmed.com', password: 'password', name: 'Pharmacy Manager', role: 'pharmacy' }
    ];
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      return Response.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: 'mock-jwt-token-' + Date.now()
      });
    } else {
      return Response.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }
    
  } catch (error) {
    return Response.json({
      success: false,
      error: 'Login failed'
    }, { status: 500 });
  }
}