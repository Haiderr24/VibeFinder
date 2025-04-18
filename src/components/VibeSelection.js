import React, { useState, useMemo } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import './VibeSelection.css';


const VibeSelection = () => {
  const [selectedVibe, setSelectedVibe] = useState(null);

  const {isLoaded, loadError} = useLoadScript({googleMapsApiKey : process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
      libraries: ["places"]
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
        console.log(`Found ${limitedResults.length} places for ${vibe} vibe`);
        setPlaces(limitedResults);

        //console.log(limitedResults[0].name);
        renderList(limitedResults);

      } else {
        console.error(`Place search failed for ${vibe} vibe. Status:`, status);
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

function renderList(locations) {
  const locationList = document.getElementById('locationNameList');
  locationList.innerHTML = ''; // Clear existing list

  locations.forEach(locations => {
    const div = document.createElement('div');
    div.classList.add('location-list');

    const dt = document.createElement('dt');
    const dd = document.createElement('dd');

    dt.textContent = locations.name;
    dd.textContent = "- " + locations.vicinity;

    div.appendChild(dt);
    div.appendChild(dd);
    locationList.appendChild(div);
  });
}


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
            ><Marker position={center} title="New York City" />
            {places.map((place) => (
            <Marker 
            key={place.place_id}
            position={place.geometry.location}
            title={place.name}
             />))}
          </GoogleMap>
            <div className="map-placeholder"></div>
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
          </div>

          
          
        </div>

        <div className="options-panel">
            <h2>Your Next Move</h2>
            <div className="secondary-panel">
              <dl id="locationNameList">
                <dt>Once you've picked a vibe, check out top-rated places nearby</dt>
              </dl>
              
              {/* <button 
              className="action-button"
              onClick={() => {
               if (selectedVibe) {
                  searchPlaces(selectedVibe);
                }
              }}
              >See More</button> */}
            </div>
          </div>
        
      </div>
    </div>
  );
};

export default VibeSelection; 