import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { EDT } from "../../global/types/edt";

function Detail() {
  const [edtData, setEdtData] = useState<EDT>();
  useEffect(() => {
    async function getEdtData(edtid: any) {
      const response = await fetch(
        `${String(process.env.REACT_APP_API_HOST)}/get-edt?id=${edtid}`
      );

      const edtResponse = await response.json();
      //   const pdfLink =
      setEdtData(edtResponse.data);
    }

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("id") !== null) {
      const edtid = String(queryParams.get("id"));
      localStorage.setItem("edtid", edtid);
      getEdtData(edtid);
    }
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <br />
          <h1 style={{ textAlign: "left" }}>EDT Meta Information </h1>
          <br />
          <Form style={{ textAlign: "left" }}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>EDT ID</Form.Label>
                <Form.Control type="text" value={String(edtData?.edtid)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={String(edtData?.title)} />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Author</Form.Label>
                <Form.Control type="text" value={String(edtData?.author)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Year</Form.Label>
                <Form.Control type="text" value={String(edtData?.year)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>University</Form.Label>
                <Form.Control type="text" value={String(edtData?.university)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Program</Form.Label>
                <Form.Control type="text" value={String(edtData?.program)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Degree</Form.Label>
                <Form.Control type="text" value={String(edtData?.degree)} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Advisor</Form.Label>
                <Form.Control type="text" value={String(edtData?.advisor)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>PDF</Form.Label>
                <a href={edtData?.pdf}>Download</a>
              </Form.Group>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Detail;
