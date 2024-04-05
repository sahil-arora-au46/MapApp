'use client'

import { useEffect, useRef, useState } from "react";
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';
import { useGeographic } from 'ol/proj';
import { getUserCoordinates } from '../helper/mapHelper';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import VectorLayer from 'ol/layer/Vector'
import VectorSource from "ol/source/Vector";
import { Draw } from 'ol/interaction';
import DropdownSelector from "./Selector";
import PopUp from "./PopUp";
import { LineString } from "ol/geom";
import { transform } from 'ol/proj';
import { getLength, getArea } from 'ol/sphere';

export default function MapComponent() {
    let mapElement = useRef<HTMLElement | null>(null);
    const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
    const [map, setMap] = useState<Map | null>(null);
    const [vectorSource, setVectorSource] = useState(null);
    const [isDrawn,setIsDrawn] = useState(false)
    const popUp = useRef(null)
    function drawShape(map,vectorSource,shape){
    if (!map || !vectorSource) {
        console.error('Map or vectorSource is not initialized');
        return;
     }
      const draw = new Draw({
        source: vectorSource,
        type: shape,
    });
    map.addInteraction(draw)
    draw.on('drawend', (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry();
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

    //   const area = polygon.getArea();
    //   console.log('Area:', area);
    });
    }
    function removeShape(vectorSource){
        vectorSource.clear()
    }
    let options: string[] = ["Point","LineString",'Polygon']
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

    useEffect(() => {
        if (mapElement.current && coordinates.latitude !== 0 && coordinates.longitude !== 0) {
            mapElement.current.style.width = '100%';
            mapElement.current.style.height = '100vh';
            useGeographic();
            const map = new Map({
                target: mapElement.current,
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
            setMap(map)
            setVectorSource(vectorSource)
            map.addLayer(vectorLayer);
          
        }
    }, [coordinates]);
   

    const [selectedShape, setSelectedShape] = useState(''); 
    const handleSelectionChange = (shape) => {
        console.log(shape,"from function")
        // setSelectedShape(shape);
        console.log('Selected shape: from parent ', shape);
        drawShape(map, vectorSource,shape)
      };


    return (
    <>
    <DropdownSelector options = {options}  onSelectionChange={handleSelectionChange}
          className="z-50 right-10 top-25 border-2 border-black rounded-md p-2" >
             </DropdownSelector>
       
        <div ref={mapElement} className=" w-full top-0 bottom-0"></div> 
        
        
    </>
    );
}
