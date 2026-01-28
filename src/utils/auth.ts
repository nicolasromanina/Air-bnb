export function isAdmin(): boolean {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  return !!token && (userRole === 'admin' || userRole === 'superadmin' || userRole === 'manager');
}

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function getUserRole(): string | null {
  return localStorage.getItem('userRole');
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
}

export function logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userRole');
}

export function setAuthData(token: string, userId: string, email: string, role: string): void {
  localStorage.setItem('token', token);
  localStorage.setItem('userId', userId);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userRole', role);
}
