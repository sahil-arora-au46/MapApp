'use client';

import { useEffect, useRef, useState } from "react";
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj';
import { getUserCoordinates } from '../helper/mapHelper';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from "ol/source/Vector";
import { Draw } from 'ol/interaction';
import DropdownSelector from "./Selector";
import { getLength, getArea } from 'ol/sphere';

export default function MapComponent() {
    const mapElementRef = useRef<HTMLDivElement | null>(null);
    const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
    const [map, setMap] = useState<Map | null>(null);
    const [vectorSource, setVectorSource] = useState<VectorSource | null>(null);

    function drawShape(map: Map, vectorSource: VectorSource, shape: string) {
        if (!map || !vectorSource) {
            console.error('Map or vectorSource is not initialized');
            return;
        }
        const draw = new Draw({
            source: vectorSource,
            type: shape as import("ol/geom/Geometry").Type,
        });
        map.addInteraction(draw);
        draw.on('drawend', (event) => {
            const feature = event.feature;
            const geometry = feature.getGeometry();
            if (!geometry) {
                console.error('Geometry is undefined');
                return;
            }
            const geometryType = geometry.getType();
            const transformedGeometry = geometry.clone().transform('EPSG:4326', 'EPSG:3857');
            let measurement;
            if (geometryType === 'Polygon') {
                measurement = getArea(transformedGeometry);
                alert(`Area: ${measurement.toFixed(2)} square meters`);
            } else if (geometryType === 'LineString') {
                measurement = getLength(transformedGeometry);
                alert(`Length: ${measurement.toFixed(2)} meters`);
            }
        });
    }

    function removeShape(vectorSource: VectorSource) {
        vectorSource.clear();
    }

    let options: string[] = ["Point", "LineString", 'Polygon'];

    useEffect(() => {
        async function fetchUserCoordinates() {
            try {
                const coords = await getUserCoordinates();
                console.log(coords, "from promise");
                setCoordinates(coords);
            } catch (error) {
                console.error('Error getting user coordinates:', error);
            }
        }
        fetchUserCoordinates();
    }, []);

    useGeographic();
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

            const marker = new Feature({
                geometry: new Point([coordinates.longitude, coordinates.latitude])
            });
            const vectorSource = new VectorSource({ features: [marker] });
            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });
            setMap(map);
            setVectorSource(vectorSource);
            map.addLayer(vectorLayer);
        }
    }, [coordinates]);
    const handleSelectionChange = (shape: string) => {
        console.log(shape, "from function");
        console.log('Selected shape: from parent ', shape);
        drawShape(map!, vectorSource!, shape);
    };

    return (
        <>
            <DropdownSelector
                options={options}
                onSelectionChange={handleSelectionChange}
                className="z-50 right-10 top-25 border-2 border-black rounded-md p-2"
            />
            <div ref={mapElementRef} style={{ width: '100%', height: '100vh' }}></div>
        </>
    );
}
