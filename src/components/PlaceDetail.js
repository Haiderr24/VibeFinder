import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';

const PlaceDetail = () => {
    const {placeId} = useParams();
    console.log("placeId from URL:", placeId);
    const [PlaceDetails, setPlaceDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const getPlaceDetails = ()=> {
            const service = new window.google.maps.places.PlacesService(document.createElement('div'));

            const request = {
                placeId:  placeId,
                fields: ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'website', 'photos', 'reviews'],
            };

            service.getDetails(request, (place, status) => {
                console.log("getDetails response:", { place, status });

                if (status === window.google.maps.places.PlacesServiceStatus.OK){
                    setPlaceDetails(place);
                    setLoading(false);
                } else{
                    console.error("Error loading place details:", status)
                    setLoading(false);
                }
            });
        };
        console.log("window.google exists?", !!window.google);

        if (window.google){
            getPlaceDetails();
        }
    }, [placeId]);

    if (loading) return <div>Loading place information</div>;
    if (!PlaceDetails) return <div>No details found for this place.</div>;

    return (
        <div className='place-details'>
            <h1>{PlaceDetails.name}</h1>
            <p>{PlaceDetails.formatted_address}</p>
            <p>{PlaceDetails.formatted_phone_number}</p>
            <p>Rating:{PlaceDetails.rating}</p>
            <a href={PlaceDetails.website} target="_blank" rel="noopener noreferrer">
        Visit Website
      </a>
        </div>
    );
};

export default PlaceDetail; 



