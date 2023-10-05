import "./login.css";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Col } from "react-bootstrap";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { redirect, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (event: any) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };
  const handleSubmit = async (event: any) => {
    
    event.preventDefault();
    console.log(loginData);
    const response = await fetch(
      `${String(process.env.REACT_APP_API_HOST)}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      }
    );
    if (response && response.status === 201) {
      setLoginData({
        email: "",
        password: "",
      });
      const userData = await response.json();
      if (userData.userInfo.is_admin === 1) {
        toast("User successfully logged in.");
        localStorage.setItem("userinfo", JSON.stringify(userData.userInfo));
        navigate("/user-admin");
      } else {
        if (userData.userInfo.active_user === 1) {
          toast("User successfully logged in.");
          localStorage.setItem("userinfo", JSON.stringify(userData.userInfo));
          navigate("/otp");
        } else {
          toast("Your user is not active yet.");
        }
      }
    }
  };
  return (
    <Container>
      <Row>
        <Col
          md={{ span: 6, offset: 3 }}
          style={{ textAlign: "left", marginTop: "100px" }}
        >
          <h1>Login </h1>
          <br />
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
              />
            </Form.Group>
            <p>
              Forgot Password? <Link to={"/forgot-password"}>Click Here!</Link>
            </p>
            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
            <ToastContainer />
            <p>
              Dont have an account? <Link to={"/sign-up"}>Click Here!</Link>
            </p>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
