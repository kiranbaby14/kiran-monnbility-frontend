import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { Marker, NavigationControl } from 'mapbox-gl';
import './map.css'
import { useCoordinates } from '../../providers/CoordinatesContext';
import ReactMapGL from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import L, { geoJson } from 'leaflet'
import shp from 'shpjs';
import { Threebox } from 'threebox-plugin';
import * as turf from '@turf/turf'

mapboxgl.accessToken = `${process.env.REACT_APP_MAPBOX_API_TOKEN}`;


const Map = ({ children }) => {
  // Reference to store marker elements
  const markers = useRef([]);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [lng, setLng] = useState(-0.14814608966609365);
  const [lat, setLat] = useState(51.53502865191151);
  const [zoom, setZoom] = useState(20);
  const [geoJson, setGeoJson] = useState()

  const { routeCoordinates, trainCoordinates, faultCoordinates } = useCoordinates()

  // San Francisco
  const origin = [-0.14814608966609365, 51.53502865191151];

  // Washington DC
  const destination = [-0.14814608966609365, 51.55502865191151];

  // A simple line from origin to destination.
  const route = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [origin, destination]
        }
      }
    ]
  };

  // A single point that animates along the route.
  // Coordinates are initially set to origin.
  const point = {
    'type': 'FeatureCollection',
    'features': [
      {
        'type': 'Feature',
        'properties': {},
        'geometry': {
          'type': 'Point',
          'coordinates': origin
        }
      }
    ]
  };

  // Calculate the distance in kilometers between route start/end point.
  const lineDistance = turf.length(route.features[0]);

  const arc = [];

  // Number of steps to use in the arc and animation, more steps means
  // a smoother arc and animation, but too many steps will result in a
  // low frame rate
  const steps = 5000;

  // Draw an arc between the `origin` & `destination` of the two points
  for (let i = 0; i < lineDistance; i += lineDistance / steps) {
    const segment = turf.along(route.features[0], i);
    arc.push(segment.geometry.coordinates);
  }

  // Update the route with calculated arc coordinates
  route.features[0].geometry.coordinates = arc;

  // Used to increment the value of the point measurement against the route.
  let counter = 0;

  const fetchGeoPackage = async () => {
    try {

      const geo = await shp("/NetworkLinks.zip")
      setGeoJson(geo)
    } catch (error) {
      console.error('Error fetching or processing GeoPackage:', error);
    }
  }

  useEffect(() => {
    // Fetch and process the GeoPackage
    // fetchGeoPackage();
  }, [])

  const handleMapLoad = () => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();

      // map.on('move', () => {
      //   setLng(map.getCenter().lng.toFixed(4));
      //   setLat(map.getCenter().lat.toFixed(4));
      //   setZoom(map.getZoom().toFixed(2));
      // });

      map.setConfigProperty('basemap', 'lightPreset', 'day');

      // Add zoom and rotation controls to the map.
      map.addControl(new NavigationControl(), 'top-right');

      // Add a source and layer displaying a point which will be animated in a circle.
      map.addSource('route1', {
        'type': 'geojson',
        'data': route
      });

      map.addSource('point', {
        'type': 'geojson',
        'data': point
      });

      map.addLayer({
        'id': 'route1',
        'source': 'route1',
        'type': 'line',
        'paint': {
          'line-width': 10,
          'line-color': '#007cbf'
        }
      });

      function animateTruck() {
        if (counter >= steps) {
            return;
        }
    
        truck.setCoords(route.features[0].geometry.coordinates[counter]);
    
        // Calculate bearing for truck rotation
        // if (counter + 1 < steps) {
        //     var bearing = turf.bearing(
        //         turf.point(route.features[0].geometry.coordinates[counter]),
        //         turf.point(route.features[0].geometry.coordinates[counter + 1])
        //     );
        //     truck.setRotation({ x: 90, y: -90, z: bearing });
        // }
    
        counter++;
        requestAnimationFrame(animateTruck);
    }


      map.addSource('route', {
        type: 'geojson',
        data: '/network-links.geojson'
      });

      map.addLayer({
        id: 'route-layer',
        type: 'line',
        source: 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': 'blue',
          'line-width': 4
        },
        // 'paint': {
        //   'line-color': [
        //     'match',
        //     ['get', 'ELR'],
        //     'MLN3', 'red',
        //     'blue'

        //   ],
        //   'line-width': 2
        // }
      });

      // console.log(routeCoordinates);
      // map.addSource('route', {
      //   'type': 'geojson',
      //   'data': {
      //     'type': 'Feature',
      //     'properties': {},
      //     'geometry': {
      //       'type': 'LineString',
      //       'coordinates': routeCoordinates
      //     }
      //   }
      // });

      // // Add a circle layer to display the individual points
      // map.addLayer({
      //   'id': 'route-points',
      //   'type': 'circle',
      //   'source': 'route',
      //   'paint': {
      //     'circle-radius': 5,
      //     'circle-color': 'yellow'
      //   }
      // });

      // map.addLayer({
      //   id: 'points-of-interest',
      //   slot: 'middle',
      //   source: {
      //     type: 'vector',
      //     url: 'mapbox://mapbox.mapbox-streets-v8'
      //   },
      //   'source-layer': 'poi_label',
      //   type: 'circle'
      // });

      // Add a line layer to connect the points
      // map.addLayer({
      //   'id': 'route-lines',
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

      let truck;

      map.addLayer({
        id: 'custom_layer',
        source: 'point',
        type: 'custom',

        renderingMode: '3d',
        onAdd: function (map, mbxContext) {

          window.tb = new Threebox(
            map,
            mbxContext,
            { defaultLights: true }
          );

          var options = {
            obj: '/truck.glb',
            type: 'gltf',
            scale: 10,
            units: 'meters',
            rotation: { x: 90, y: -90, z: 0 } //default rotation
          }

          window.tb.loadObj(options, function (model) {
            truck = model.setCoords([lng, lat]);
            window.tb.add(truck);
            animateTruck();
          })

        },
        render: function (gl, matrix) {
          window.tb.update();
        }
      });

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
          mapStyle='mapbox://styles/mapbox/standard'
          projection='globe'
          onLoad={handleMapLoad}
        >
          {children}
        </ReactMapGL>
      </div>
    </div>
  );
}

export default Map;