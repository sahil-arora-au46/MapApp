import { Draw } from 'ol/interaction';
import VectorSource from 'ol/source/Vector';
import { getLength, getArea } from 'ol/sphere';
import Map from 'ol/Map';

// Define a function to get the user's current geolocation coordinates
export const getUserCoordinates = (): Promise<{ latitude: number; longitude: number }> => {
 // Return a new Promise that resolves with the user's coordinates or rejects with an error
 return new Promise((resolve, reject) => {
      // Check if the browser supports geolocation
      if (!navigator.geolocation) {
          reject(new Error('Geolocation is not supported by this browser.'));
      } else {
          // If geolocation is supported, get the current position
          navigator.geolocation.getCurrentPosition(
              (position) => {
                 resolve({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                 });
              },
              (error) => {
                 reject(error);
              }
          );
      }
 });
};

// Define a function to draw shapes on a map
export function drawShape(map: Map, vectorSource: VectorSource, shape: string) {
 // Check if the map and vectorSource are initialized
 if (!map || !vectorSource) {
      console.error('Map or vectorSource is not initialized');
      return;
 }
 // Create a new Draw interaction with the specified vector source and shape type
 const draw = new Draw({
      source: vectorSource,
      type: shape as import("ol/geom/Geometry").Type,
 });
 // Add the Draw interaction to the map
 map.addInteraction(draw);
 // Listen for the 'drawend' event, which is fired when the user finishes drawing a shape
 draw.on('drawend', (event) => {
      // Get the feature that was drawn
      const feature = event.feature;
      const geometry = feature.getGeometry();
      // Check if the geometry is defined
      if (!geometry) {
          console.error('Geometry is undefined');
          return;
      }
      // Get the type of the geometry (e.g., 'Polygon', 'LineString')
      const geometryType = geometry.getType();
      // Clone the geometry and transform it from geographic coordinates to Web Mercator
      const transformedGeometry = geometry.clone().transform('EPSG:4326', 'EPSG:3857');
      let measurement;
      // Check if the geometry type is 'Polygon'
      if (geometryType === 'Polygon') {
          // If so, calculate the area of the polygon and display it in an alert
          measurement = getArea(transformedGeometry);
          alert(`Area: ${measurement.toFixed(2)} square meters`);
      } else if (geometryType === 'LineString') {
          // If the geometry type is 'LineString', calculate the length of the line and display it in an alert
          measurement = getLength(transformedGeometry);
          alert(`Length: ${measurement.toFixed(2)} meters`);
      }
 });
}