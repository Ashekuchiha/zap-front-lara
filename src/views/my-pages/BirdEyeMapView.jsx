import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Autocomplete, Box } from '@mui/material';
import top100Films from 'src/components/forms/form-elements/autoComplete/data';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';


const customIcon = L.icon({
    iconUrl: 'marker-icon.png', // Replace with the path to your custom icon
    iconSize: [48, 48], // Size of the icon [width, height]
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
});

const ambulanceIcon = L.icon({
    iconUrl: '/icons/ambulance.png',
    iconSize: [56, 56],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const busIcon = L.icon({
    iconUrl: '/icons/bus.png',
    iconSize: [56, 56],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const truckIcon = L.icon({
    iconUrl: '/icons/truck.png',
    iconSize: [48, 48],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const cargoIcon = L.icon({
    iconUrl: '/icons/cargo.png',
    iconSize: [60, 60],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const trollerIcon = L.icon({
    iconUrl: '/icons/troller.png',
    iconSize: [56, 56],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const shipIcon = L.icon({
    iconUrl: '/icons/ship.png',
    iconSize: [48, 48],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const lorryIcon = L.icon({
    iconUrl: '/icons/lorry.png',
    iconSize: [48, 48],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const helicopterIcon = L.icon({
    iconUrl: '/icons/helicopter.png',
    iconSize: [60, 60],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const cngIcon = L.icon({
    iconUrl: '/icons/cng.png',
    iconSize: [60, 60],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const pickupIcon = L.icon({
    iconUrl: '/icons/pickup.png',
    iconSize: [56, 56],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const miniTruckIcon = L.icon({
    iconUrl: '/icons/mini-truck.png',
    iconSize: [56, 56],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const getIconByCarType = (carType) => {
    switch (carType) {
        case 'Ambulance':
            return ambulanceIcon;
        case 'Bus':
            return busIcon;
        case 'Truck':
            return truckIcon;
        case 'Cargo':
            return cargoIcon;
        case 'Troller':
            return trollerIcon;
        case 'Ship':
            return shipIcon;
        case 'Lorry':
            return lorryIcon;
        case 'Helicopter':
            return helicopterIcon;
        case 'CNG':
            return cngIcon;
        case 'Pickup':
            return pickupIcon;
        case 'Mini Truck':
            return miniTruckIcon;
        default:
            return null;
    }
};


const positions = [
        { lat: 23.8103, lng: 90.4125, carType: 'Ambulance', carNumber: 'DHAKA-METRO-1234', riderName: 'Aminul Islam' }, // Gulshan
        { lat: 23.7808, lng: 90.2792, carType: 'Bus', carNumber: 'DHAKA-METRO-5678', riderName: 'Rahim Khan' }, // Dhanmondi
        { lat: 23.7455, lng: 90.3736, carType: 'Truck', carNumber: 'DHAKA-METRO-9101', riderName: 'Sajid Hossain' }, // Motijheel
        { lat: 23.7372, lng: 90.3952, carType: 'Cargo', carNumber: 'DHAKA-METRO-1121', riderName: 'Fahim Ahmed' }, // Shahbagh
        { lat: 23.7809, lng: 90.3620, carType: 'Troller', carNumber: 'DHAKA-METRO-3141', riderName: 'Nazmul Hassan' }, // Mohammadpur
        { lat: 23.8679, lng: 90.3964, carType: 'Ship', carNumber: 'DHAKA-METRO-5161', riderName: 'Kamal Uddin' }, // Uttara
        { lat: 23.7528, lng: 90.3826, carType: 'Lorry', carNumber: 'DHAKA-METRO-7181', riderName: 'Rafiq Islam' }, // Tejgaon
        { lat: 23.7548, lng: 90.3760, carType: 'Helicopter', carNumber: 'DHAKA-METRO-9202', riderName: 'Jahirul Islam' }, // Panthapath
        { lat: 23.7938, lng: 90.4067, carType: 'CNG', carNumber: 'DHAKA-METRO-2232', riderName: 'Mizanur Rahman' }, // Banani
        { lat: 23.7099, lng: 90.4072, carType: 'Pickup', carNumber: 'DHAKA-METRO-3243', riderName: 'Hasan Mahmud' }, // Old Dhaka
        { lat: 23.7748, lng: 90.3659, carType: 'Mini Truck', carNumber: 'DHAKA-METRO-4254', riderName: 'Tariqul Islam' }, // Mirpur
        { lat: 23.8315, lng: 90.4106, carType: 'Ambulance', carNumber: 'DHAKA-METRO-5265', riderName: 'Sharif Hossain' }, // Baridhara
        { lat: 23.7465, lng: 90.3760, carType: 'Bus', carNumber: 'DHAKA-METRO-6276', riderName: 'Babul Mia' }, // Karwan Bazar
        { lat: 23.7424, lng: 90.4175, carType: 'Truck', carNumber: 'DHAKA-METRO-7287', riderName: 'Sumon Ahmed' }, // Jatrabari
        { lat: 23.7636, lng: 90.4312, carType: 'Cargo', carNumber: 'DHAKA-METRO-8298', riderName: 'Masud Rana' }, // Badda
        { lat: 23.7815, lng: 90.4006, carType: 'Troller', carNumber: 'DHAKA-METRO-9309', riderName: 'Shahinur Rahman' }, // Mohakhali
        { lat: 23.7313, lng: 90.4226, carType: 'Ship', carNumber: 'DHAKA-METRO-1030', riderName: 'Anwar Hossain' }, // Sadarghat
        { lat: 23.7509, lng: 90.3843, carType: 'Lorry', carNumber: 'DHAKA-METRO-1121', riderName: 'Salman Ali' }, // Farmgate
        { lat: 23.7600, lng: 90.3654, carType: 'Helicopter', carNumber: 'DHAKA-METRO-2232', riderName: 'Mamun Khan' }, // Kallyanpur
        { lat: 23.7621, lng: 90.4190, carType: 'CNG', carNumber: 'DHAKA-METRO-3343', riderName: 'Abdur Rahman' }, // Rampura
    ];

    const MapUpdater = ({ selectedPosition }) => {
        const map = useMap();
    
        React.useEffect(() => {
            if (selectedPosition) {
                map.flyTo([selectedPosition.lat, selectedPosition.lng], 16, {
                    animate: true,
                    duration: 1.5, // Duration of the animation in seconds
                });
            }
        }, [selectedPosition, map]);
    
        return null;
    };
    
    
    const BirdEyeMapView = () => {
        const [selectedCar, setSelectedCar] = useState(null);
    
        // Handle free solo search
        const handleInputChange = (event, value) => {
            const filteredPosition = positions.find(
                (pos) => pos.carNumber === value || pos.riderName === value
            );
            setSelectedCar(filteredPosition || null);
        };
    
        return (
            <div style={{ position: 'relative', width: '100%', height: '80vh' }}>
                <Autocomplete
                    freeSolo
                    fullWidth
                    id="free-solo-2-demo"
                    disableClearable
                    options={positions.map((option) => option.carNumber)}
                    onInputChange={handleInputChange}
                    renderInput={(params) => (
                        <CustomTextField
                            {...params}
                            placeholder="Search Vehicle by number"
                            aria-label="Search input"
                            inputProps={{
                                ...params.inputProps,
                                type: 'search',
                            }}
                        />
                    )}
                    style={{
                        background: "white",
                        position: 'absolute',
                        top: '10px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '90%',
                        padding: '10px',
                        borderRadius: '10px',
                        zIndex: 1000,
                        border: '1px solid #ccc',
                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                    }}
                />
    
                {/* Map Container */}
                <MapContainer
                    center={[23.8103, 90.4125]}
                    zoom={12}
                    style={{ height: '100%', width: '100%', borderRadius: '10px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {positions.map((position, index) => (
                        <Marker
                            key={index}
                            position={[position.lat, position.lng]}
                            icon={getIconByCarType(position.carType)}
                        >
                            <Popup>
                                <div>
                                    <strong>Rider Name:</strong> {position.riderName} <br />
                                    <strong>Vehicle Type:</strong> {position.carType} <br />
                                    <strong>Vehicle Number:</strong> {position.carNumber}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    <MapUpdater selectedPosition={selectedCar} />
                </MapContainer>
            </div>
        );
    };

export default BirdEyeMapView;

