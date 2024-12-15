
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
// Icon for marker
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationInput = ({ setFieldValue }) => {
  const [position, setPosition] = useState(null); // Initial position is null
  // Fetch user's current location using the Geolocation API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]); // Set the current position
          setFieldValue('location', [latitude, longitude]); // Update formik field
        },
        (error) => {
          console.error('Error getting current position: ', error);
          // Set default location if user denies or an error occurs (e.g., London)
          setPosition([51.505, -0.09]);
        }
      );
    } else {
      // If geolocation is not supported, use a default location
      setPosition([51.505, -0.09]); // London
    }
  }, [setFieldValue]);
  // Custom component to handle map clicks
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const newPos = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        setFieldValue('mapSelection', newPos);
      },
    });
    return position ? <Marker position={position} icon={markerIcon} /> : null;
  };
  return position ? (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
      whenCreated={(mapInstance) => mapInstance.invalidateSize()}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
      />
      <LocationMarker /> {/* Add the marker component here */}
    </MapContainer>
  ) : (
    <p>Loading map...</p>
  );
};
export default LocationInput;