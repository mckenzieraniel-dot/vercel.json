export const getPublicUrl = (idOrUrl: string | undefined) => {
  if (!idOrUrl) return '';
  
  // Use the VITE_CONVEX_URL from environment
  let convexUrl = (import.meta as any).env.VITE_CONVEX_URL;
  
  // Dynamic mapping for sandbox environment
  if (typeof window !== 'undefined') {
    if (window.location.origin.includes('3000-')) {
      convexUrl = window.location.origin.replace('3000-', '3210-');
    } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      convexUrl = window.location.origin.replace('3000', '3210');
    }
  }
  
  // If it was already a full URL, extract the path part
  let path = idOrUrl;
  if (idOrUrl.startsWith('http')) {
    if (idOrUrl.includes('/api/storage/')) {
      path = idOrUrl.split('/api/storage/').pop() || '';
    } else if (idOrUrl.includes('/storage/')) {
      path = idOrUrl.split('/storage/').pop() || '';
    }
  }
  
  return `${convexUrl}/api/storage/${path}`;
};
