import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Marker, NavigationControl } from 'mapbox-gl';
import './map.css'
import { useCoordinates } from '../../providers/CoordinatesContext';

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_TOKEN}`;

const Map = ({ children }) => {
  // Reference to store marker elements
  const markers = useRef([]);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-0.13814608966609365);
  const [lat, setLat] = useState(51.53502865191151);
  const [zoom, setZoom] = useState(9);

  const { routeCoordinates, trainCoordinates, faultCoordinates } = useCoordinates()

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/kiranbaby14/clxoh9fe500kr01r2dbeef4wu',
      center: [lng, lat],
      zoom: zoom
    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });




    map.current.on('load', () => {
      // Add zoom and rotation controls to the map.
      map.current.addControl(new NavigationControl(), 'top-right');

      // Set marker options.
      trainCoordinates.forEach(coord => {
        const el = document.createElement('div');

        if (JSON.stringify(coord) === JSON.stringify(faultCoordinates[0])) {
          el.className = 'fault-marker'
        }
        else {
          el.className = 'custom-marker'
        }

        // Event listener for marker click
        el.addEventListener('click', () => {
          markers.current.forEach((marker) => { // Make other markers to default color
            marker.getElement().style.boxShadow = ""
          })
          el.style.boxShadow = "0 0 10px 5px #48abe0, 0 0 20px 7px #ffff, 0 0 25px 20px #ffff, 0 0 30px 25px #ffff";
        });


        const marker = new Marker(el).setLngLat(coord)
          .addTo(map.current);

        markers.current.push(marker);

      })

    })



  }, []);


  return (
    <div style={{ zIndex: 10 }}>
      <div ref={mapContainer} className="map-container" >
        {children}
      </div>
    </div>
  );
}

export default Map;