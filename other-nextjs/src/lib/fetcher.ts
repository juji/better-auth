import { token } from "@/lib/auth-client-hono";
import { decodeJwt } from 'jose';

const tokenCache: { 
  token: string | null, 
  expiry: number,
  tokenPromise: Promise<{ token: string | null }> | null
} = { 
  token: null, 
  expiry: 0,
  tokenPromise: null
};

// prevent getting token multiple times in parallel
function getToken(){
 
  if(tokenCache.token && tokenCache.expiry > Date.now()){
    return Promise.resolve({ token: tokenCache.token });
  }

  if(tokenCache.expiry && tokenCache.expiry <= Date.now()){
    tokenCache.token = null;
    tokenCache.expiry = 0;
    tokenCache.tokenPromise = null;
  }

  if(tokenCache.tokenPromise){
    return tokenCache.tokenPromise;
  }

  tokenCache.tokenPromise = (async () => {
    const { data, error } = await token();
    if (error || !data?.token) {
      throw new Error('No auth token available');
    }
    
    // Decode JWT to get actual expiry time
    const decoded = decodeJwt(data.token);
    const expiryTime = decoded.exp ? decoded.exp * 1000 : Date.now() + (15 * 60 * 1000); // fallback to 15 minutes
    tokenCache.token = data.token;
    tokenCache.expiry = Math.round(expiryTime * 0.77); // 77% of actual expiry time
    return { token: data.token };
  })();

  return tokenCache.tokenPromise;

}

export const fetcher = async (url: string, options?: RequestInit) => {

  const needsToken = !(
    process.env.NEXT_PUBLIC_HONO_SERVER && 
    url.startsWith(process.env.NEXT_PUBLIC_HONO_SERVER
  ))

  if(needsToken) {

    // get from cache
    const { token } = await getToken();
    if(!token) {
      throw new Error('No auth token available');
    }

    options = {
      ...options||{},
      headers: {
        ...options?.headers||{},
        Authorization: `Bearer ${token}`
      }
    }

  }

  return fetch(url, {
    ...options||{},
    ...url.startsWith('http') && !url.startsWith(window.location.origin) ? {
      mode: 'cors',
      credentials: 'include'
    } : {}
  }).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
}