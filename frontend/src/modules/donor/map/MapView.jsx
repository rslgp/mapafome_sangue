import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Container, Typography, FormControl, InputLabel, Select, MenuItem, Box, Checkbox, ListItemText, CircularProgress } from '@mui/material';
import getDateFormat from './util/date_formatter';

const CENTER = [-8.0671132, -34.8766719];
const SERVER_ENDPOINT = `${import.meta.env.VITE_API_BACKEND_ENDPOINT}?func=mapdata`;
const MAP_INDEX = 0;

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});
const bloodTypes = [
    "A+", "A-", "AB+", "AB-", "O+", "O-"
];

const popupContentMake = (blood_row_array) => {
    const result = [];
    for (let i = 0, j = MAP_INDEX + 1; i < bloodTypes.length; i++, j++) {
        if (blood_row_array[j] === "TRUE") result.push(bloodTypes[i]);
    }

    const googleDirection = `https://www.google.com/maps/search/${blood_row_array[blood_row_array.length - 1]}`;
    let html_body = `<a href=${googleDirection} target='_blank' rel="noreferrer">Ir para o destino
    <img className="directionIcon" style="height:18px;width:18px" src="https://maps.gstatic.com/tactile/omnibox/directions-2x-20150909.png"></img></a> <br/>`;
    html_body += result.join(" ");
    const att = getDateFormat(blood_row_array[blood_row_array.length - 1]);
    if (att) html_body += `<br/> <span style="font-size:11px">${att}</span>`;
    return {
        missing_blood: result,
        html_body,
    };
};

const loadFromServer = async () => {
    try {
        const fetch_res = await fetch(SERVER_ENDPOINT);
        const data = await fetch_res.json();
        const { rows } = data.result;
        const markers = rows.map(r => {
            const { missing_blood, html_body } = popupContentMake(r)
            return {
                position: r[MAP_INDEX].split(","),
                missing_blood: missing_blood,
                popupContent: html_body,
            };
        });
        return markers;
    } catch (e) {
        console.log("error fetch", e);
        return [];
    }
};

const blood_compatible = {
    "donate_to": {
        "O+": ["O+", "A+", "B+", "AB+"],
        "A+": ["A+", "AB+"],
        "B+": ["B+", "AB+"],
        "AB+": ["AB+"],
        "O-": ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"],
        "A-": ["A-", "A+", "AB-", "AB+"],
        "B-": ["B-", "B+", "AB-", "AB+"],
        "AB-": ["AB-", "AB+"]
    },
    "receive_from": {
        "O+": ["O+", "O-"],
        "A+": ["A+", "A-", "O+", "O-"],
        "B+": ["B+", "B-", "O+", "O-"],
        "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
        "O-": ["O-"],
        "A-": ["A-", "O-"],
        "B-": ["B-", "O-"],
        "AB-": ["AB-", "A-", "B-", "O-"]
    }
}
const userDonorCanDonateTo = blood_compatible.donate_to;

const App = () => {
    const [markers, setMarkers] = useState([]);
    const [selectedBloodTypes, setSelectedBloodTypes] = useState([]);
    const [filteredMarkers, setFilteredMarkers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const data = await loadFromServer();
            setMarkers(data);
            setFilteredMarkers(data); // Initialize with all markers
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleBloodTypeChange = (event) => {
        const selectedBloodTypes = event.target.value;
        setSelectedBloodTypes(selectedBloodTypes);

        if (selectedBloodTypes.length > 0) {
            const filtered = markers.filter((marker) => {
                return selectedBloodTypes.some(selectedBloodType => {
                    const compatible_array = userDonorCanDonateTo[selectedBloodType];
                    return marker.missing_blood.some(bloodType => compatible_array.includes(bloodType));
                });
            });
            setFilteredMarkers(filtered);
        } else {
            setFilteredMarkers(markers); // Show all markers if no blood type selected
        }
    };

    return (
        <Container maxWidth="lg" sx={{ padding: { xs: '8px', sm: '16px' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ marginBottom: '16px', fontSize: { xs: '1.5rem', sm: '2rem' } }}>
                    Blood Donation Map
                </Typography>

                <FormControl fullWidth sx={{ marginBottom: '16px' }}>
                    <InputLabel>Escolha o seu tipo de sangue, ou do grupo de doadores</InputLabel>
                    <Select
                        multiple
                        value={selectedBloodTypes}
                        label="Escolha o seu tipo de sangue, ou do grupo de doadores"
                        onChange={handleBloodTypeChange}
                        sx={{ width: '100%' }}
                    >
                        {bloodTypes.map(bloodType => (
                            <MenuItem key={bloodType} value={bloodType}>
                                <Checkbox checked={selectedBloodTypes.indexOf(bloodType) > -1} />
                                <ListItemText primary={bloodType} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <MapContainer
                        center={CENTER}
                        zoom={12}
                        style={{ height: "500px", width: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {filteredMarkers.map((marker, index) => (
                            <Marker
                                key={index}
                                position={marker.position}
                                icon={L.divIcon({
                                    className: 'bloodTypeMarker',
                                    html: `
                                        <div style="position: relative; text-align: center;">
                                            <span style="position: absolute; top: -25px; font-size: 12px; font-weight: bold; color: black;">
                                                ${marker.missing_blood.join(' ')}
                                            </span>
                                            <img src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png" style="width: 30px; height: 40px;" />
                                        </div>
                                    `
                                })}
                                eventHandlers={{
                                    click: () => {
                                        alert(marker.popupContent);
                                    }
                                }}
                            />
                        ))}
                    </MapContainer>
                )}
            </Box>
        </Container>
    );
};

export default App;
