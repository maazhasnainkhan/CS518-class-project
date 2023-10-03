import "./forgot-password.css";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Col } from "react-bootstrap";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ForgotPassword() {

  const [userData, setUserData] = useState({
    email: ""
  });

  const handleChange = (event: any) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(userData);
    const response = await fetch(
      `${String(process.env.REACT_APP_API_HOST)}/forgot`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (response && response.status === 201) {
      
      toast(
        "Password reset url has been sent to your email address."
      );
    }
  };
  return (
    <Container>
      <Row>
        <Col
          md={{ span: 6, offset: 3 }}
          style={{ textAlign: "left", marginTop: "100px" }}
        >
          <h1>Forgot Password </h1>
          <br />
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control placeholder="Enter email" name="email" value={userData.email}
                onChange={handleChange} />
            </Form.Group>
            <Button variant="primary"  onClick={handleSubmit}>
              Submit
            </Button>
            <ToastContainer />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgotPassword;
