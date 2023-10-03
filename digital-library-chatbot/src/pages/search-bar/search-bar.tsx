import "./search-bar";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Col } from "react-bootstrap";

function SearchBar() {
  return (
    <Container>
      <Row>
        <Col md={{span: 6, offset: 3}} style={{ textAlign: 'left', marginTop: '100px'}} >
          <h1>Search </h1>
          <br />
          <Form>
            <Form.Group className="mb-3" controlId="searchBar">
              <Form.Label>Search</Form.Label>
              <Form.Control type="search" placeholder="Search Here" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Search
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SearchBar;