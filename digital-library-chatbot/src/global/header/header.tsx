import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/esm/Nav";
import Navbar from "react-bootstrap/esm/Navbar";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    // <div>
    //   <ul>
    //     <li>
    //       <Link to={`/login`}>Login</Link>
    //     </li>
    //     <li>
    //     <Link to={`/sign-up`}>Sign up</Link>
    //     </li>
    //   </ul>

    // </div>
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">Digital Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link>
              <Link className="header-link" to={"/login"}>
                Login
              </Link>
            </Nav.Link>
            <Nav.Link>
              <Link className="header-link" to={"/sign-up"}>
                Sign up
              </Link>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
