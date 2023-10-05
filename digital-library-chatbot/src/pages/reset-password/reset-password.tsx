import "./reset-password.css";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Col } from "react-bootstrap";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ResetPassword() {
  const [userData, setUserData] = useState({
    guid: "",
    password: "",
  });

  const queryParams = new URLSearchParams(window.location.search)
  
  const handleChange = (event: any) => {
    setUserData({
      ...userData, guid: String(queryParams.get("id")),
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log(userData);
    const response = await fetch(
      `${String(process.env.REACT_APP_API_HOST)}/update-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (response && response.status === 201) {
      toast("Password has been updated.");
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
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={userData.password}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRetypePassword">
              <Form.Label>Retype Password</Form.Label>
              <Form.Control type="password"
                placeholder="Confirm Password" />
            </Form.Group>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <ToastContainer />
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default ResetPassword;
