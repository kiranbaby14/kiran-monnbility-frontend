import './App.css';
import InfoCard from './components/InfoCard';
import Map from './components/Map';
import Navbar from './components/NavbarComp';

function App() {
  return (
    <>
      <Navbar />
      <Map >
        <InfoCard />
      </Map>
    </>
  );
}

export default App;
