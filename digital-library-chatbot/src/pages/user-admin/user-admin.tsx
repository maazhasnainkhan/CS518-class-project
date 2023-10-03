import "./user-admin";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Table from "react-bootstrap/esm/Table";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserAdmin() {
  const [userlist, setUserList] = useState([]);
  useEffect(() => {
    async function getUsers() {
      const response = await fetch(
        `${String(process.env.REACT_APP_API_HOST)}/getusers`
      );

      const users = await response.json();
      setUserList(users);
    }
    getUsers();
  });
  const handleActive = async (id: any) => {

    const response = await fetch(
      `${String(process.env.REACT_APP_API_HOST)}/active-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: id }),
      }
    );

    if (response && response.status === 201) {
      toast("User successfully activated.");
    }
  };
  const handleDeactive = async (id: any) => {

    const response = await fetch(
      `${String(process.env.REACT_APP_API_HOST)}/active-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      }
    );

    if (response && response.status === 201) {
      toast("User successfully activated.");
    }
  };
  return (
    <Container>
      <Row>
        <Col
          md={{ span: 6, offset: 3 }}
          style={{ textAlign: "left", marginTop: "100px" }}
        >
          <h1>User Admin </h1>
          <br />
          <br />

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Status</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {userlist.map((item: any) => {
                return (
                  <tr>
                    <td>{item.guid}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.active_user === 1 ? "Active": "Inactive"}</td>
                    <td>
                      <Button
                        variant="primary"
                        onClick={() => handleActive(item.user_id)}
                      >
                        Active
                      </Button>
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDeactive(item.user_id)}
                      >
                        Deactive
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
          <ToastContainer />
        </Col>
      </Row>
    </Container>
  );
}

export default UserAdmin;
