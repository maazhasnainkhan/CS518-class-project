import Form from "react-bootstrap/esm/Form";
import "./sign-up.css";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignUp() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmpassword: "",
    is_admin: 0,
    is_active: 0,
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
      `${String(process.env.REACT_APP_API_HOST)}/user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );

    if (response && response.status === 201) {
      setUserData({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
        is_active: 0,
        is_admin: 0,
      });
      toast(
        "Your user has been created. You will receive an email once your user is approved by the admin."
      );
    } else {
      const res = await response.json();
      toast(res.message);
    }
  };
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
              <Form.Control
                type="fullname"
                placeholder="Enter Full Name"
                name="name"
                value={userData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Enter Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={userData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Enter Password</Form.Label>
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
              <Form.Control
                type="password"
                placeholder="Password"
                name="confirmpassword"
                value={userData.confirmpassword}
                onChange={handleChange}
              />
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

export default SignUp;
