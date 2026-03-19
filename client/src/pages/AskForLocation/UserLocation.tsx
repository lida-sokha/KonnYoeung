import { useState, useEffect } from "react";

const useUserLocation = () => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
                setError(null);
            },
            (err) => {
                setError(err.message);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);
    return { position, error }; 
}
export default useUserLocation;