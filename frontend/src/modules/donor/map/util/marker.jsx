import { Marker, Popup } from 'react-leaflet';

const createMarker = (markerData) => {
    const { position, popupContent } = markerData;
    return (
        <Marker position={position} key={`${position[0]}-${position[1]}`}>
            <Popup>{popupContent}</Popup>
        </Marker>
    );
};

export { createMarker };
export default createMarker;