'use client';

import { useEffect, useRef, useState } from "react";
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj';
import { getUserCoordinates, drawShape } from '../helper/mapHelper';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from "ol/source/Vector";
import DropdownSelector from "./Selector";

export default function MapComponent() {
    // Create a reference to the map element 
    const mapElementRef = useRef<HTMLDivElement | null>(null);
    // State to store the user's coordinates
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
    // State to store the map instance
    const [map, setMap] = useState<Map | null>(null);
    // State to store the vector source for drawing shapes
    const [vectorSource, setVectorSource] = useState<VectorSource | null>(null);

    // Options for the dropdown selector
    let options: string[] = ["Point", "LineString", 'Polygon'];

    // Effect hook to fetch user coordinates 
    useEffect(() => {
        async function fetchUserCoordinates() {
            try {
                const coords = await getUserCoordinates();
                setCoordinates(coords);
            } catch (error) {
                console.error('Error getting user coordinates:', error);
            }
        }
        fetchUserCoordinates();
    }, []);

    // Set the projection to geographic (EPSG:4326)
    useGeographic();

    // Effect hook to initialize the map and add a marker when coordinates are available
    useEffect(() => {
        if (mapElementRef.current && coordinates.latitude !== 0 && coordinates.longitude !== 0) {
            mapElementRef.current.style.width = '100%';
            mapElementRef.current.style.height = '100vh';
            const map = new Map({
                target: mapElementRef.current,
                layers: [
                    new TileLayer({
                        source: new OSM(),
                    }),
                ],
                view: new View({
                    center: [coordinates.longitude, coordinates.latitude],
                    zoom: 18,
                }),
            });

            // Create a marker feature at the user's coordinates
            const marker = new Feature({
                geometry: new Point([coordinates.longitude, coordinates.latitude])
            });
            // Create a vector source with the marker
            const vectorSource = new VectorSource({ features: [marker] });
            // Create a vector layer with the vector source
            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });
            // Update the map and vector source states
            setMap(map);
            setVectorSource(vectorSource);
            // Add the vector layer to the map
            map.addLayer(vectorLayer);
        }
    }, [coordinates]);

    // Handler for when the dropdown selection changes
    const handleSelectionChange = (shape: string) => {
        // Call drawShape with the current map, vector source, and the selected shape
        drawShape(map!, vectorSource!, shape);
    };

    // Render the map component
    return (
        <>
            {/* Dropdown selector for shape selection */}
            <DropdownSelector
                options={options}
                onSelectionChange={handleSelectionChange}
                className="absolute z-50 right-10 top-25 border-2 border-black rounded-md p-2"
            />
            {/* Div element to hold the map */}
            <div ref={mapElementRef} style={{ width: '100%', height: '100vh' }}></div>
        </>
    );
}