import "./otp.css";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Col } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function OTP() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    otp: "",
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
    const userInfo: any = JSON.parse(String(localStorage.getItem("userinfo")));
    if(userInfo.otp === userData.otp){
      navigate("/profile");
    }else{
      toast('OTP does not match. Try again.')
    }
  };
  return (
    <Container>
      <Row>
        <Col md={{span: 6, offset: 3}} style={{ textAlign: 'left', marginTop: '100px'}} >
          <h1>Search </h1>
          <br />
          <Form>
            <Form.Group className="mb-3" controlId="otp">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control type="otp" placeholder="Enter OTP Here" name="otp"
                value={userData.otp}
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

export default OTP;