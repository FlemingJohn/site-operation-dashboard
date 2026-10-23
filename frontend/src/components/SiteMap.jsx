import { useEffect, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import { Button, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import { pluralize } from '../lib/pluralize';
import { COLORS } from '../styles/colors';
import MapFocus from './MapFocus';
import StatusChip from './StatusChip';

const INDIA_CENTER = [21.15, 79.09];
const INDIA_ZOOM = 5;
const MAP_TILE_KEY = import.meta.env.VITE_MAP_TILE_KEY ?? '';
const TILE_URL = `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${MAP_TILE_KEY}`;
const TILE_SUBDOMAINS = 'abcd';
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const getMarkerStyle = (site, isSelected) => ({
  color: COLORS.white,
  weight: 2,
  fillColor: site.status === 'active' ? COLORS.primary : COLORS.danger,
  fillOpacity: isSelected ? 1 : 0.85,
});

const SiteMap = ({ sites, selectedId, onSelect }) => {
  const markers = useRef({});
  const selected = sites.find((site) => site.id === selectedId);

  useEffect(() => {
    markers.current[selectedId]?.openPopup();
  }, [selectedId]);

  return (
    <MapContainer center={INDIA_CENTER} zoom={INDIA_ZOOM} className="site-map" scrollWheelZoom>
      <TileLayer url={TILE_URL} subdomains={TILE_SUBDOMAINS} attribution={TILE_ATTRIBUTION} />
      <MapFocus points={sites.map((site) => site.coordinates)} focusPoint={selected?.coordinates} />
      {sites.map((site) => (
        <CircleMarker
          key={site.id}
          ref={(marker) => {
            markers.current[site.id] = marker;
          }}
          center={site.coordinates}
          radius={site.id === selectedId ? 11 : 8}
          pathOptions={getMarkerStyle(site, site.id === selectedId)}
          eventHandlers={{ click: () => onSelect(site.id) }}
        >
          <Popup>
            <div className="map-popup">
              <Typography variant="subtitle2" className="text-strong">
                {site.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {site.region} · {site.city} · {pluralize(site.installationCount, 'installation')}
              </Typography>
              <StatusChip status={site.status} />
              <Button
                size="small"
                variant="contained"
                component={RouterLink}
                to={`/sites/${site.id}`}
              >
                Open site
              </Button>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

export default SiteMap;
