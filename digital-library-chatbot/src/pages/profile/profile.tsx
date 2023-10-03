import Form from "react-bootstrap/esm/Form";
import "./profile.css";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Profile() {
  const [userData, setUserData] = useState({
    email: "",
    user_id: "",
    name: "",
    password: "",
  });

  useEffect(() => {
    const userInfo: any = JSON.parse(String(localStorage.getItem("userinfo")));
    setUserData({ ...userData, email: userInfo.email, user_id: userInfo.user_id, name: userInfo.name || "" });

  }, []);

  const handleChange = (event: any) => {
    setUserData({
      ...userData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    const response = await fetch(
      `${String(process.env.REACT_APP_API_HOST)}/update-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      }
    );
    if (response && response.status === 201) {
      toast("User has been updated.");
    }
  };
  return (
    <Container>
      <Row>
        <Col
          md={{ span: 6, offset: 3 }}
          style={{ textAlign: "left", marginTop: "100px" }}
        >
          <h1>Profile Update </h1>
          <br />
          <br />
          <Form>
          <Form.Group className="mb-3" controlId="fromFullName">
              <Form.Label style={{fontWeight: "bold"}}>{userData.email}</Form.Label>
              
            </Form.Group>
            <Form.Group className="mb-3" controlId="fromFullName">
              <Form.Label>Enter Full Name</Form.Label>
              <Form.Control
                name="name"
                value={userData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Enter Password</Form.Label>
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRetypePassword">
              <Form.Label>Retype Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="cpassword"
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

export default Profile;
