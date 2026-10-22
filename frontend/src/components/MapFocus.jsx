import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FIT_PADDING = [40, 40];
const SINGLE_SITE_ZOOM = 10;
const FOCUS_ZOOM = 11;

const MapFocus = ({ points, focusPoint }) => {
  const map = useMap();
  const pointsKey = JSON.stringify(points);
  const focusKey = JSON.stringify(focusPoint ?? null);

  useEffect(() => {
    const fitPoints = JSON.parse(pointsKey);
    map.invalidateSize();
    if (fitPoints.length === 1) map.setView(fitPoints[0], SINGLE_SITE_ZOOM);
    if (fitPoints.length > 1) map.fitBounds(fitPoints, { padding: FIT_PADDING });
  }, [map, pointsKey]);

  useEffect(() => {
    const point = JSON.parse(focusKey);
    if (point) map.flyTo(point, FOCUS_ZOOM);
  }, [map, focusKey]);

  return null;
};

export default MapFocus;
