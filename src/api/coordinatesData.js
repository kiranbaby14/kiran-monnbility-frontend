import axios from "axios";
import proj4 from "proj4";

const URL_DOMAIN = 'http://localhost:8000'

const getRouteCoords = async () => {
    // const routeCoords = await axios.get(`${URL_DOMAIN}/coordinates/route`);
    // console.log(routeCoords);

    // let routeCoords = /await shp("/NetworkWaymarks.shp");
    // -------------------------------

    let routeCoords = []

    var shapefile = require("shapefile");

    // Define the source and destination projections
    const sourceProjection = 'EPSG:27700'; // British National Grid
    const destProjection = 'EPSG:4326';    // WGS 84

    await shapefile.openShp("/NetworkWaymarks.shp")
        .then(source => source.read()
            .then(async function log(result) {
                if (result.done) return;
                // Define the EPSG:27700 projection manually
                proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs");

                // Define the input coordinates (easting, northing)
                // Make sure these coordinates are in the British National Grid format
                const inputCoordinates = result.value.coordinates;

                // Convert the coordinates to latitude and longitude
                const [longitude, latitude] = proj4(sourceProjection, destProjection, inputCoordinates);
                routeCoords.push([longitude, latitude]);
                return source.read().then(log);
            }))
        .catch(error => console.error(error.stack));


    return routeCoords
}

const getTrainCoords = async () => {
    const trainCoords = await axios.get(`${URL_DOMAIN}/coordinates/train`);
    return trainCoords
}

const getfaultCoords = async () => {
    const faultCoords = await axios.get(`${URL_DOMAIN}/coordinates/fault`);
    return faultCoords
}



export {
    getRouteCoords,
    getTrainCoords,
    getfaultCoords
}