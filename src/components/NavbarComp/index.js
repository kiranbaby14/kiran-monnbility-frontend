import Navbar from 'react-bootstrap/Navbar';
import { Container } from 'react-bootstrap';

const NavbarComp = () => {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Moonbility</Navbar.Brand>
      </Container>
    </Navbar>
  )
}

export default NavbarComp