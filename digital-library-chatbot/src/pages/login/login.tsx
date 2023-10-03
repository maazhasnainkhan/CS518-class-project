import "./login.css";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Col } from "react-bootstrap";

function Login() {
  return (
    <Container>
      <Row>
        <Col md={{span: 6, offset: 3}} style={{ textAlign: 'left', marginTop: '100px'}} >
          <h1>Login </h1>
          <br />
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
            <p>
              Dont have an account? <a href="/sign-up">Click Here!</a>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
