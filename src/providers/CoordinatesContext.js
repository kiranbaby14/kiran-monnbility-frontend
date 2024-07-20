import { createContext, useContext, useState } from 'react';
import { getRouteCoords, getTrainCoords, getfaultCoords } from '../api/coordinatesData';

const CoordinatesContext = createContext();

const routeCoords = await getRouteCoords();
const trainCoords = await getTrainCoords();
const faultCoords = await getfaultCoords();

const CoordinatesProvider = ({ children }) => {
  const [routeCoordinates, setRouteCoordinates] = useState(routeCoords);
  const [trainCoordinates, setTrainCoordinates] = useState(trainCoords.data['trainRoutes']);
  const [faultCoordinates, setFaultCoordinates] = useState(faultCoords.data['faultyRoutes']);

  
  return (
    <CoordinatesContext.Provider value={{ routeCoordinates, trainCoordinates,faultCoordinates }}>
      {children}
    </CoordinatesContext.Provider>
  );
};

const useCoordinates = () => {
  return useContext(CoordinatesContext);
};

export { CoordinatesProvider, useCoordinates };