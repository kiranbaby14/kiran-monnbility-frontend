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
            .then(function log(result) {
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
    // --------------------------------

    // [[-0.13814608966609365, 51.53502865191155],
    // [-0.13914608966609365, 51.6350286519116],
    // [-0.14014608966609365, 51.73502865191165],
    // [-0.13814608966609365, 51.9650286519117]]

    // routeCoords = [[446342.1610000003, 360292.79700000025],
    // [327208.1969999997, 324261.3100000005],
    // [446258.375, 409779.28500000015]]

    return routeCoords.slice(0, 10)
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