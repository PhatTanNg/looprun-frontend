import React, { useEffect, useState } from 'react';

export default function RoutePlanner() {
  const [userPos, setUserPos] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [targetDistance, setTargetDistance] = useState(5);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [directionsRenderers, setDirectionsRenderers] = useState([]);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google) {
        initializeMap();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAsVf-rZCQmjfEK0_Al8JQLQGvDvqm4KGw&libraries=geometry`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  const initializeMap = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const userPosition = { lat: latitude, lng: longitude };
        setUserPos(userPosition);

        const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: userPosition,
          mapTypeId: 'roadmap'
        });

        new window.google.maps.Marker({
          position: userPosition,
          map: mapInstance,
          title: 'You are here',
          icon: {
            url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiM0Mjg1RjQiLz4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iNCIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4K',
            scaledSize: new window.google.maps.Size(24, 24)
          }
        });

        setMap(mapInstance);
      },
      (err) => {
        alert('Please allow location access to use the route planner');
        console.error('Geolocation error:', err);
      }
    );
  };

  const fetchRunnableRoutes = async () => {
    if (!userPos) return;

    setLoading(true);
    directionsRenderers.forEach(renderer => renderer.setMap(null));
    setDirectionsRenderers([]);
    setSelectedRoute(null);

    try {
      const response = await fetch('https://looprun-backend.onrender.com/api/routes/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: userPos.lat,
          longitude: userPos.lng,
          distance: targetDistance
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch routes');
      }

      const data = await response.json();

      const newRenderers = data.routes.map((route, index) => {
        const path = route.coordinates.map(coord => ({
          lat: coord.lat,
          lng: coord.lng
        }));

        const polyline = new window.google.maps.Polyline({
          path,
          strokeColor: ['#FF0000', '#0000FF', '#00FF00'][index],
          strokeWeight: 4,
          strokeOpacity: 0.8,
          map: map
        });

        polyline.addListener('click', () => {
          handleSelectRoute(route.id);
        });

        return polyline;
      });

      setDirectionsRenderers(newRenderers);
      setRoutes(data.routes);

    } catch (error) {
      console.error('Error fetching routes:', error);
      alert(`Error generating routes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (routeId) => {
    const found = routes.find((r) => r.id === routeId);
    setSelectedRoute(found);

    directionsRenderers.forEach((renderer, index) => {
      const isSelected = index + 1 === routeId;
      renderer.setMap(isSelected ? map : null); // Show only selected route on map
    });
  };

  const startNavigation = () => {
    if (selectedRoute && userPos) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userPos.lat},${userPos.lng}&destination=${userPos.lat},${userPos.lng}&travelmode=walking`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Running Route Planner</h1>
        <p className="text-gray-600 mb-6">Generate actual runnable routes that follow real roads and paths</p>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <label htmlFor="distance" className="text-sm font-medium text-gray-700">
              Target Distance (km):
            </label>
            <input
              id="distance"
              type="number"
              value={targetDistance}
              onChange={(e) => setTargetDistance(Math.max(1, Math.min(20, e.target.value)))}
              min="1"
              max="20"
              className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={fetchRunnableRoutes}
            disabled={loading || !userPos}
            className={`px-6 py-2 rounded-md font-medium ${
              loading || !userPos
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Generating Routes...' : 'Generate Runnable Routes'}
          </button>
        </div>

        <div className="mb-6">
          <div
            id="map"
            className="w-full h-96 border border-gray-300 rounded-lg"
            style={{ minHeight: '384px' }}
          />
        </div>

        {routes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Runnable Routes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {routes.map((route, index) => {
                const isSelected = selectedRoute?.id === route.id;
                return (
                  <div
                    key={route.id}
                    className={`p-4 border rounded-lg transition-all ${
                      isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <h3 className="font-medium text-gray-800 mb-2">{route.checkInPOI}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Distance:</strong> {route.distance}</p>
                      <p><strong>Duration:</strong> {route.duration}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <span className="text-green-600">✅</span>
                        <span className="text-xs">Follows actual roads & paths</span>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full mt-2 ${
                      ['bg-red-500', 'bg-blue-500', 'bg-green-500'][index]
                    }`} />

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleSelectRoute(route.id)}
                        className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        {isSelected ? 'Selected' : 'Select Route'}
                      </button>

                      {isSelected && (
                        <button
                          onClick={startNavigation}
                          className="px-4 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          🏃‍♂️ Start Run
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">🔄 Generating actual runnable routes...</p>
            <p className="text-sm text-gray-500">Getting routes that follow real roads and paths</p>
          </div>
        )}

        {!userPos && (
          <div className="text-center py-8 text-gray-600">
            <p>📍 Please allow location access to generate running routes</p>
          </div>
        )}
      </div>
    </div>
  );
}
