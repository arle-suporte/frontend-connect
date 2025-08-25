export async function logout(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      window.location.href = '/login';
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    window.location.href = '/login';
    return false;
  }
}