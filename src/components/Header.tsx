import Container from 'react-bootstrap/Container';
import { Link, useLocation } from "react-router-dom";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import classNames from 'classnames';
import { ROUTES, TITLE } from '../constants';

function Header() {
  const { pathname } = useLocation();
  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <Navbar.Brand as={Link} to="/">{TITLE}</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {ROUTES.map((item) => {
              return (
                <Nav.Link
                  as={Link}
                  key={item.path}
                  className={classNames({ active: item.path === pathname })}
                  to={item.path}>
                    {item.title}
                </Nav.Link>
              )
            })}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;