import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api';
import './VibeSelection.css';

// Define libraries array as a constant outside the component
const libraries = ["places"];

const VibeSelection = () => {
  const [selectedVibe, setSelectedVibe] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const locationRefs = useRef({});
  const navigate = useNavigate();

  const {isLoaded, loadError} = useLoadScript({
      googleMapsApiKey: 'AIzaSyBXo-hKgTIP-nLA_659tAQl0TLuIFnl40c',
      libraries
  });

  const [places, setPlaces] = useState([]);

    const center = useMemo(() => ({ lat: 40.7128, lng: -74.0060 }), []);
  
    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading map...</div>;
  

  const vibeOptions = [
    { id: 'social', label: 'Social' },
    { id: 'productive', label: 'Productive' },
    { id: 'adventurous', label: 'Adventurous' },
    { id: 'chill', label: 'Chill' }
  ];

  const handleVibeSelect = (vibeId) => {
    setSelectedVibe(vibeId);
    searchPlaces(vibeId);
  };

  const searchPlaces = (vibe) => {
    if (!window.google) return;

    const service = new window.google.maps.places.PlacesService(document.createElement('div'));

    const vibeKeywords = {
      social: ["cafe", "lounge", "bar", "restaurant", "comedy club", "arcade"],
      productive: ["library", "coffee shop", "bookstore", "study cafe", "workspace"],
      adventurous: ["escape room", "paintball", "rock climbing", "amusement park", "axe throwing", "speakeasy"],
      chill: ["park", "cafe", "garden", "spa", "art gallery", "museum"]
    };

    const request = {
      location: { lat: 40.7128, lng: -74.0060 },
      radius: 10000,
      keyword: vibeKeywords[vibe].join(" | ")  // Using | as OR operator
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const limitedResults = results.slice(0, 20); // Limit to 20 total places
        setPlaces(limitedResults);
      } else {
        setPlaces([]);
      }
    });
  };
    

  const mapStyle = {
    width: "100%",
    height: "585px",
    borderRadius: "1rem",
  };
  

  const darkMapStyle =[{ elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1b1b1b" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];

  return (
    <div className="vibe-selection">
      <div className="vibe-content">
        <h1>Find Your Vibe</h1>
        <div className="vibe-options">
          <div className="map-container">
            <GoogleMap
              mapContainerStyle={mapStyle}
              center={center}
              zoom={12}
              options={{
                styles: darkMapStyle,
                disableDefaultUI: true,
              }}
            >
              <Marker position={center} title="New York City" />
              {places.map((place) => (
                <Marker
                  key={place.place_id}
                  position={place.geometry.location}
                  title={place.name}
                  onClick={() => setSelectedPlace(place)}
                />
              ))}
              {selectedPlace && (
                <InfoWindow
                  position={selectedPlace.geometry.location}
                  onCloseClick={() => setSelectedPlace(null)}
                  options={{
                    pixelOffset: new window.google.maps.Size(0, -5),
                    maxWidth: 200,
                    disableAutoPan: true
                  }}
                >
                  <div style={{
                    padding: '8px',
                    background: 'rgba(26, 26, 26, 0.95)',
                    borderRadius: '8px',
                    color: 'white',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}>
                    <h3 style={{
                      margin: '0 0 4px 0',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#8B5CF6'
                    }}>{selectedPlace.name}</h3>
                    <p style={{
                      margin: '0 0 8px 0',
                      fontSize: '12px',
                      color: '#9CA3AF'
                    }}>{selectedPlace.vicinity}</p>
                    <button 
                      onClick={() => navigate(`/place/${selectedPlace.place_id}`)}
                      style={{
                        width: '100%',
                        padding: '6px 12px',
                        backgroundColor: 'rgba(139, 92, 246, 0.9)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(139, 92, 246, 1)'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(139, 92, 246, 0.9)'}
                    >
                      More Details →
                    </button>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
          
          <div className="options-panel">
            <h2>Choose your vibe</h2>
            <div className="toggle-list">
              {vibeOptions.map((vibe) => (
                <div 
                  key={vibe.id} 
                  className="toggle-option"
                >
                  <label className="toggle">
                    <input
                      type="radio"
                      name="vibe"
                      checked={selectedVibe === vibe.id}
                      onChange={() => handleVibeSelect(vibe.id)}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">{vibe.label}</span>
                  </label>
                </div>
              ))}
            </div>
            <button 
              className="view-favorites-button"
              onClick={() => navigate('/favorites')}
            >
              View Favorites ★
            </button>
          </div>
        </div>

        <div className="options-panel">
          <h3>Places to Check Out</h3>
          <div className="secondary-panel">
            {places.length > 0 ? (
              <div className="location-list-container">
                {places.map((place) => (
                  <div 
                    key={place.place_id} 
                    className="location-list"
                    ref={el => locationRefs.current[place.place_id] = el}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      margin: '8px 0',
                      background: 'rgba(139, 92, 246, 0.1)',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                      border: '1px solid rgba(139, 92, 246, 0.2)'
                    }}
                    onClick={() => navigate(`/place/${place.place_id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 92, 246, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 4px 0',
                        color: '#8B5CF6',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}>
                        {place.name}
                      </h4>
                      <p style={{ 
                        margin: 0,
                        color: '#9CA3AF',
                        fontSize: '14px'
                      }}>
                        {place.vicinity}
                      </p>
                    </div>
                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#8B5CF6',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      View Details
                      <svg 
                        style={{ marginLeft: '4px' }} 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Once you've picked a vibe, check out top-rated places nearby.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeSelection; 