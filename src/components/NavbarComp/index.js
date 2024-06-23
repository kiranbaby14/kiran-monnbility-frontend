import Navbar from 'react-bootstrap/Navbar';
import { Container } from 'react-bootstrap';

const NavbarComp = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container fluid>
        <Navbar.Brand href="#home">Moonbility</Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default NavbarComp