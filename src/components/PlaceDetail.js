import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import './PlaceDetail.css';

const PlaceDetail = () => {
    const { placeId } = useParams();
    const navigate = useNavigate();
    const [placeDetails, setPlaceDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: ["places"]
    });

    useEffect(() => {
        if (!isLoaded) return;

        const map = new window.google.maps.Map(document.createElement('div'));
        const service = new window.google.maps.places.PlacesService(map);

        const request = {
            placeId: placeId,
            fields: ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'website', 'photos', 'reviews', 'opening_hours', 'price_level']
        };

        service.getDetails(request, (place, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                setPlaceDetails(place);
                setLoading(false);
                // Check if this place is in favorites
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                setIsFavorite(favorites.some(fav => fav.placeId === placeId));
            } else {
                setError('Could not load place details');
                setLoading(false);
            }
        });
    }, [placeId, isLoaded]);

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (isFavorite) {
            // Remove from favorites
            const updatedFavorites = favorites.filter(fav => fav.placeId !== placeId);
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } else {
            // Add to favorites
            const newFavorite = {
                placeId: placeId,
                name: placeDetails.name,
                address: placeDetails.formatted_address
            };
            localStorage.setItem('favorites', JSON.stringify([...favorites, newFavorite]));
        }
        
        setIsFavorite(!isFavorite);
    };

    if (loadError) return <div className="error-message">Error loading Google Maps</div>;
    if (!isLoaded) return <div className="loading">Loading Maps...</div>;
    if (loading) return <div className="loading">Loading place information...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!placeDetails) return <div className="error-message">No details found for this place.</div>;

    return (
        <div className="place-details-container">
            <div className="header-actions">
                <button className="back-button" onClick={() => navigate('/vibes')}>← Back to Map</button>
                <button className="favorites-button" onClick={() => navigate('/favorites')}>View Favorites</button>
            </div>
            <div className="place-details-content">
                <div className="place-header">
                    <h1>{placeDetails.name}</h1>
                    <button 
                        className={`favorite-button ${isFavorite ? 'favorited' : ''}`}
                        onClick={toggleFavorite}
                    >
                        {isFavorite ? '★' : '☆'}
                    </button>
                </div>
                
                {placeDetails.photos && placeDetails.photos[0] && (
                    <img 
                        src={placeDetails.photos[0].getUrl()}
                        alt={placeDetails.name}
                        className="place-photo"
                    />
                )}

                <div className="details-section">
                    <div className="detail-item">
                        <h3>Address</h3>
                        <p>{placeDetails.formatted_address}</p>
                    </div>

                    {placeDetails.formatted_phone_number && (
                        <div className="detail-item">
                            <h3>Phone</h3>
                            <p>{placeDetails.formatted_phone_number}</p>
                        </div>
                    )}

                    {placeDetails.rating && (
                        <div className="detail-item">
                            <h3>Rating</h3>
                            <p>{placeDetails.rating} ★</p>
                        </div>
                    )}

                    {placeDetails.opening_hours && (
                        <div className="detail-item">
                            <h3>Hours</h3>
                            <ul>
                                {placeDetails.opening_hours.weekday_text.map((day, index) => (
                                    <li key={index}>{day}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {placeDetails.website && (
                        <div className="detail-item">
                            <h3>Website</h3>
                            <a 
                                href={placeDetails.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="website-link"
                            >
                                Visit Website
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlaceDetail; 



