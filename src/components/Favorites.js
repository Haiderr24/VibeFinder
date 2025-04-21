import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Favorites.css';

const Favorites = () => {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Load favorites from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
    }, []);

    const removeFavorite = (placeId) => {
        const updatedFavorites = favorites.filter(fav => fav.placeId !== placeId);
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    if (favorites.length === 0) {
        return (
            <div className="favorites-container">
                <button className="back-button" onClick={() => navigate('/vibes')}>← Back to Map</button>
                <div className="favorites-content">
                    <h1>Your Favorites</h1>
                    <p className="no-favorites">You haven't favorited any places yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="favorites-container">
            <button className="back-button" onClick={() => navigate('/vibes')}>← Back to Map</button>
            <div className="favorites-content">
                <h1>Your Favorites</h1>
                <div className="favorites-list">
                    {favorites.map((favorite) => (
                        <div key={favorite.placeId} className="favorite-item">
                            <div className="favorite-info">
                                <h3>{favorite.name}</h3>
                                <p>{favorite.address}</p>
                            </div>
                            <div className="favorite-actions">
                                <button 
                                    className="view-button"
                                    onClick={() => navigate(`/place/${favorite.placeId}`)}
                                >
                                    View Details
                                </button>
                                <button 
                                    className="remove-button"
                                    onClick={() => removeFavorite(favorite.placeId)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Favorites; 