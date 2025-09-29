'use client'
import { useSession, token } from "@/lib/auth-client-hono"
import { useEffect, useRef } from "react";

function useAuthJwt( servers: string[] ){

  const { data, error, isPending } = useSession();

  // Helper function for retrying fetch with exponential backoff
  async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3, baseDelay = 1000) {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) {
          return response;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error as Error;
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          console.warn(`Fetch attempt ${attempt + 1} failed for ${url}, retrying in ${delay}ms:`, error);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }
    throw lastError!;
  }

  // GET /auth/token to the server
  // to get cookie back
  async function registerTokenWithServers(token: string) {
    const promises = servers.map(async server => {
      try {
        await fetchWithRetry(server + '/auth/token', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log(`Successfully registered token with ${server}`);
      } catch (error) {
        console.error(`Failed to register token with ${server} after retries:`, error);
      }
    });
    
    await Promise.allSettled(promises);
  };

  // DELETE /auth/token to the server
  // to clear cookie
  async function clearTokenWithServers() {
    const promises = servers.map(async server => {
      try {
        await fetchWithRetry(server + '/auth/token', {
          method: 'DELETE'
        });
        console.log(`Successfully cleared token with ${server}`);
      } catch (error) {
        console.error(`Failed to clear token with ${server} after retries:`, error);
      }
    });
    
    await Promise.allSettled(promises);
  }

  useEffect(() => {
    
    // Don't do anything while loading
    if (isPending) return;
    if(error) return;

    if (data?.user) {
      // user is logged in
      // register token with all servers
      token().then(jwt => {
        if(!jwt?.data?.token) return;
        registerTokenWithServers(jwt.data.token);
      });
    } else {
      // user is logged out
      // clear all tokens from all servers
      clearTokenWithServers();
    }


    
  }, [data, error, isPending]);

  return clearTokenWithServers

}

// this is a client component
// to make it easy to add to any server component...
// just add this to layout
export function AuthJwt(){
  

  const clear = useAuthJwt([
    "/api",
    process.env.NEXT_PUBLIC_EXPRESS_SERVER || "http://localhost:3002"
  ]);
  const clearFunc = useRef(clear);

  useEffect(() => {
    return () => {
      clearFunc.current();
    }
  }, []);

  return null;
}