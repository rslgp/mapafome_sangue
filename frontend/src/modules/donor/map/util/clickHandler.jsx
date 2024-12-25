import { useMapEvents } from 'react-leaflet';

// eslint-disable-next-line react/prop-types
const ClickHandler = ({ addMarker }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            console.log("coords", [lat, lng].toString());
            addMarker({ position: [lat, lng], popupContent: `New marker at [${lat}, ${lng}]` });
        },
    });
    return null;
};
export default ClickHandler;