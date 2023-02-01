import { useState, useCallback } from 'react';

export const useHttp = () => {
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async(url, 
                                    method = 'GET', 
                                    body = null, 
                                    headers = {'Content-Type': 'application/json'}) => {

        setLoading(true);
        
        try {

            let res = await fetch(url, {method, body, headers});

            if (!res.ok) {
                throw new Error(`Not found in ${url}, error type: ${res.status}`)
            }

            setLoading(false);

            return await res.json();

        } catch(e) {
            setLoading(false);
            setError(e);
            throw e;
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    return {loading, error, request, clearError};
}