// import React, { useEffect, useRef, useState } from 'react';
// import mapboxgl from 'mapbox-gl';
// import * as d3 from 'd3';
// import Stats from 'https://threejs.org/examples/jsm/libs/stats.module.js';
// import 'mapbox-gl/dist/mapbox-gl.css';
// import '../dist/threebox.css';
// import Threebox from '../dist/threebox.js';

// const AnimatedTruck = () => {
//   const mapContainerRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [origin, setOrigin] = useState([-122.4340, 37.7353]);
//   const [truck, setTruck] = useState(null);
//   const [line, setLine] = useState(null);
//   const statsRef = useRef(null);

//   useEffect(() => {
//     if (!config) {
//       console.error("Config not set! Make a copy of 'config_template.js', add in your access token, and save the file as 'config.js'.");
//       return;
//     }

//     mapboxgl.accessToken = config.accessToken;

//     const initializeMap = () => {
//       const map = new mapboxgl.Map({
//         container: mapContainerRef.current,
//         style: 'mapbox://styles/mapbox/dark-v9',
//         center: origin,
//         zoom: 16,
//         pitch: 60,
//         bearing: 90,
//         antialias: true,
//       });

//       map.on('style.load', () => {
//         statsRef.current = new Stats();
//         map.getContainer().appendChild(statsRef.current.dom);

//         const animate = () => {
//           requestAnimationFrame(animate);
//           statsRef.current.update();
//         };
//         animate();

//         map.addLayer({
//           id: 'custom_layer',
//           type: 'custom',
//           renderingMode: '3d',
//           onAdd: (map, mbxContext) => {
//             const tb = new Threebox(map, mbxContext, { defaultLights: true });

//             const options = {
//               type: 'gltf',
//               obj: '/truck.glb',
//               scale: 40,
//               units: 'meters',
//               anchor: 'bottom',
//               rotation: { x: 90, y: 90, z: 0 },
//             };

//             tb.loadObj(options, (model) => {
//               const truckModel = model.setCoords(origin);
//               truckModel.addEventListener('ObjectChanged', onObjectChanged, false);
//               tb.add(truckModel);
//               setTruck(truckModel);
//             });
//           },
//           render: (gl, matrix) => {
//             window.tb.update();
//           },
//         });
//       });

//       map.on('click', (e) => {
//         const pt = [e.lngLat.lng, e.lngLat.lat];
//         travelPath(pt, map);
//       });

//       setMap(map);
//     };

//     if (!map) initializeMap();

//     return () => {
//       if (map) map.remove();
//     };
//   }, [map, origin]);

//   const onObjectChanged = (e) => {
//     const model = e.detail.object;
//     const action = e.detail.action;
//     console.log(action);
//   };

//   const travelPath = (destination, map) => {
//     const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${[origin, destination].join(';')}?geometries=geojson&access_token=${config.accessToken}`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         const options = {
//           path: data.routes[0].geometry.coordinates,
//           duration: 10000,
//         };

//         truck.followPath(options, () => {
//           window.tb.remove(line);
//         });

//         const lineGeometry = options.path.map((coordinate) => coordinate.concat([15]));

//         const newLine = window.tb.line({
//           geometry: lineGeometry,
//           width: 5,
//           color: 'steelblue',
//         });

//         window.tb.add(newLine);
//         setLine(newLine);

//         setOrigin(destination);
//       });
//   };

//   return (
//     <div style={{ position: 'relative', width: '100%', height: '100%' }}>
//       <div id='map' ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
//       <div id='explainer' style={{ position: 'absolute', top: 10, left: 10, zIndex: 99 }}>
//         Click on the map to drive the truck there
//       </div>
//     </div>
//   );
// };

// export default AnimatedTruck;
