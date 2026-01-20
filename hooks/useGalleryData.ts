import { useEffect, useState } from 'react';
import { API_ENDPOINT } from '../constants/config';
import { GalleryItem } from '../types/gallery';

export function useGalleryData() {
    const [data, setData] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(API_ENDPOINT);
                const json = await response.json();
                // API returns { data: { gallery: [...] } } or similar?
                // Prompt says: "Use this endpoint as-is... You will use data.gallery (array)"
                // Typically Axios/Fetch returns response. 
                // Let's assume response.json() matches the prompt structure.
                // Prompt says: "GET ... response... You will use data.gallery".
                // Usually `data` is the top level key or the response body has a `data` field.
                // Let's inspect the API response if possible or assume `json.data.gallery`.

                if (json.data && Array.isArray(json.data.gallery)) {
                    setData(json.data.gallery);
                } else if (json.gallery) { // Fallback check
                    setData(json.gallery);
                } else {
                    console.warn("Unexpected API structure", json);
                    // Might be just array? No, "data.gallery".
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    return { data, loading, error };
}
