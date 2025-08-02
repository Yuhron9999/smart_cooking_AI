// Declare global google types
declare global {
  interface Window {
    google: any;
  }
}

export class GoogleMapsService {
  private apiKey: string;
  private map: any | null = null;
  private placesService: any | null = null;

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  }

  async initializeMap(elementId: string, center: { lat: number; lng: number }) {
    const mapElement = document.getElementById(elementId);
    if (!mapElement) throw new Error("Map element not found");

    this.map = new window.google.maps.Map(mapElement, {
      center,
      zoom: 15,
      mapTypeId: window.google.maps.MapTypeId.ROADMAP,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    });

    this.placesService = new window.google.maps.places.PlacesService(this.map);
    return this.map;
  }

  async getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }

  async findNearbyStores(
    location: { lat: number; lng: number },
    ingredients: string[]
  ) {
    try {
      const response = await fetch(
        `/api/maps/nearby-stores?lat=${location.lat}&lng=${location.lng}&radius=2000&type=supermarket`
      );
      const data = await response.json();

      if (data.status === "OK") {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          rating: place.rating,
          vicinity: place.vicinity,
          location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng,
          },
          types: place.types,
          photos: place.photos,
        }));
      }

      return [];
    } catch (error) {
      console.error("Error finding nearby stores:", error);
      return [];
    }
  }

  async getRegionalSuggestions(location: { lat: number; lng: number }) {
    try {
      const response = await fetch(
        `/api/maps/regional-suggestions?lat=${location.lat}&lng=${location.lng}`
      );
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error getting regional suggestions:", error);
      return { success: false, error: "Failed to get regional suggestions" };
    }
  }

  addStoreMarkers(stores: any[]) {
    if (!this.map) return;

    stores.forEach((store) => {
      const marker = new window.google.maps.Marker({
        position: store.location,
        map: this.map,
        title: store.name,
        icon: {
          url: "/icons/store-marker.png",
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="max-width: 200px;">
            <h4>${store.name}</h4>
            <p>⭐ ${store.rating || "N/A"}</p>
            <p>${store.vicinity}</p>
            <button 
              onclick="window.getDirections('${store.id}')"
              style="background: #4285f4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;"
            >
              🗺️ Chỉ đường
            </button>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(this.map, marker);
      });
    });
  }
}

// Global function for directions
declare global {
  interface Window {
    getDirections: (placeId: string) => void;
  }
}

window.getDirections = (placeId: string) => {
  window.open(
    `https://www.google.com/maps/dir/?api=1&destination_place_id=${placeId}`,
    "_blank"
  );
};
