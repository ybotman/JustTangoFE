import { useState, useEffect } from 'react';

export const useRegionService = () => {
    const [regions, setRegions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all regions
    const fetchRegions = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/regions');
            const data = await response.json();
            setRegions(data);
        } catch (error) {
            setError('Error fetching regions');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Fetch regions on mount
    useEffect(() => {
        fetchRegions();
    }, []);

    return {
        regions,
        loading,
        error,
    };
};