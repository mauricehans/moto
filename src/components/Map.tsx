import { useEffect, useRef } from 'react';

interface MapProps {
  address: string;
  height?: string;
}

const Map = ({ address, height = '400px' }: MapProps) => {
  const mapRef = useRef<HTMLIFrameElement>(null);
  
  useEffect(() => {
    // In a real implementation, you would load a proper map integration
    // For demonstration purposes, we're using a simple iframe with Google Maps
    if (mapRef.current) {
      const encodedAddress = encodeURIComponent(address);
      mapRef.current.src = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}`;
    }
  }, [address]);
  
  return (
    <div className="rounded-lg overflow-hidden shadow-md" style={{ height }}>
      <iframe
        ref={mapRef}
        title="Garage location"
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        allowFullScreen
        src={`https://www.openstreetmap.org/export/embed.html?bbox=3.4447,43.3031,3.4847,43.3131&layer=mapnik&marker=43.3081,3.4647`}
      ></iframe>
    </div>
  );
};

export default Map;