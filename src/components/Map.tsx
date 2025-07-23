import { useMemo } from 'react';

interface MapProps {
  address: string;
  height?: string;
}

const Map = ({ address, height = '400px' }: MapProps) => {
  // Coordonnées précises d'Agde Moto
  const defaultCoords = { lat: 43.3143111, lon: 3.4666913 };
  
  // Générer l'URL OpenStreetMap basée sur l'adresse ou les coordonnées par défaut
  const mapSrc = useMemo(() => {
    // Créer une bbox autour des coordonnées (zoom plus précis)
    const bbox = {
      minLon: defaultCoords.lon - 0.003,
      minLat: defaultCoords.lat - 0.002,
      maxLon: defaultCoords.lon + 0.003,
      maxLat: defaultCoords.lat + 0.002
    };
    
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}&layer=mapnik&marker=${defaultCoords.lat},${defaultCoords.lon}`;
  }, [address]);
  
  return (
    <div className="rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <iframe
        title="Localisation du garage"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        src={mapSrc}
      ></iframe>
    </div>
  );
};

export default Map;