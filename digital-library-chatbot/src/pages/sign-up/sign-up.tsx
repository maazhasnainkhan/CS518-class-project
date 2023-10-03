import Form from "react-bootstrap/esm/Form";
import "./sign-up.css";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function SignUp() {
  return (
    <Container>
      <Row>
        <Col
          md={{ span: 6, offset: 3 }}
          style={{ textAlign: "left", marginTop: "100px" }}
        >
          <h1>Signup </h1>
          <br />
          <Form>
            <Form.Group className="mb-3" controlId="fromFullName">
              <Form.Label>Enter Full Name</Form.Label>
              <Form.Control type="fullname" placeholder="Enter Full Name" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Enter Email Address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Enter Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRetypePassword">
              <Form.Label>Retype Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
