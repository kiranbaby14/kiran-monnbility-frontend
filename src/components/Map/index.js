import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Marker, NavigationControl } from 'mapbox-gl';
import './map.css'
import { useCoordinates } from '../../providers/CoordinatesContext';
import ReactMapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_TOKEN}`;

const Map = ({ children }) => {
  // Reference to store marker elements
  const markers = useRef([]);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [lng, setLng] = useState(-0.13814608966609365);
  const [lat, setLat] = useState(51.53502865191151);
  const [zoom, setZoom] = useState(9);

  const { routeCoordinates, trainCoordinates, faultCoordinates } = useCoordinates()

  const handleMapLoad = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();

      map.on('move', () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });

      // Add zoom and rotation controls to the map.
      map.addControl(new NavigationControl(), 'top-right');

      // console.log(routeCoordinates);
      map.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': routeCoordinates
          }
        }
      });

      // Add a circle layer to display the individual points
      map.addLayer({
        'id': 'route-points',
        'type': 'circle',
        'source': 'route',
        'paint': {
          'circle-radius': 5,
          'circle-color': 'yellow'
        }
      });

      // Add a line layer to connect the points
      // map.addLayer({
      //   'id': 'route',
      //   'type': 'line',
      //   'source': 'route',
      //   'layout': {
      //     'line-join': 'round',
      //     'line-cap': 'round'
      //   },
      //   'paint': {
      //     'line-color': 'blue',
      //     'line-width': 2
      //   }
      // });

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
          markers.current.forEach((marker) => { // Make other markers to default state
            marker.getElement().style.boxShadow = ""
          })
          el.style.boxShadow = "0 0 10px 5px #48abe0, 0 0 20px 7px #ffff, 0 0 25px 20px #ffff, 0 0 30px 25px #ffff";
        });


        const marker = new Marker(el).setLngLat(coord)
          .addTo(map);

        markers.current.push(marker);

      })
    }
  }

  return (
    <div style={{ zIndex: 10 }}>
      <div className="map-container" >
        <ReactMapGL
          ref={mapRef}
          mapboxAccessToken={`${process.env.REACT_APP_MAPBOX_API_TOKEN}`}
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: zoom
          }}
          mapStyle='mapbox://styles/kiranbaby14/clxoh9fe500kr01r2dbeef4wu'
          onLoad={handleMapLoad}

        >
          {children}
        </ReactMapGL>
      </div>
    </div>
  );
}

export default Map;