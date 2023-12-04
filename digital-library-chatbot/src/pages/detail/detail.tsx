import { useEffect, useState } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { EDT } from "../../global/types/edt";
import parse from "html-react-parser";
import ChatBot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

import botconfig from "../../chatbot/config";
import MessageParser from "../../chatbot/MessageParser";
import ActionProvider from "../../chatbot/ActionProvider";

function Detail() {
  const [edtData, setEdtData] = useState<EDT>();
  const [abstract, setAbstract] = useState<string>();
  useEffect(() => {
    async function getEdtData(edtid: any) {
      const response = await fetch(
        `${String(process.env.REACT_APP_API_HOST)}/get-edt?id=${edtid}`
      );

      const edtResponse = await response.json();
      //   const pdfLink =
      setEdtData(edtResponse.data);

      const wikifierArray = JSON.parse(edtResponse.data.wikifier_terms);
      const abstractResult = edtResponse.data.abstract
        .replace('["', "")
        .replace('"]', "");
      localStorage.setItem("abstractdata", abstractResult);
      const htmlAbstract = abstractResult
        .split(" ")
        .map((item: string) => {
          const exist = wikifierArray.find((wikiitem: any) => {
            return String(wikiitem.title).toLowerCase() === item.toLowerCase();
          });
          if (exist) {
            return `<a href="${exist.url}">${item}</a>`;
          } else {
            return item;
          }
        })
        .join(" ");
      setAbstract(`<p style="font-size: 12px;">${htmlAbstract}</p>`);
    }

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("id") !== null) {
      const edtid = String(queryParams.get("id"));
      localStorage.setItem("edtid", edtid);
      getEdtData(edtid);
    }
  }, []);

  const onChange = () => {};

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
                <Form.Control
                  type="text"
                  value={String(edtData?.edtid)}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={String(edtData?.title)}
                  onChange={onChange}
                />
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  value={String(edtData?.author)}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="text"
                  value={String(edtData?.year)}
                  onChange={onChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>University</Form.Label>
                <Form.Control
                  type="text"
                  value={String(edtData?.university)}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Program</Form.Label>
                <Form.Control type="text" value={String(edtData?.program)} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Degree</Form.Label>
                <Form.Control
                  type="text"
                  value={String(edtData?.degree)}
                  onChange={onChange}
                />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Advisor</Form.Label>
                <Form.Control
                  type="text"
                  value={String(edtData?.advisor)}
                  onChange={onChange}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>Abstract</Form.Label>
                {/* <Form.Control as="textarea" value={String(edtData?.abstract)} /> */}
                {/* <p style={{ fontSize: "12px" }}>
                  {edtData?.abstract.replace('["', "").replace('"]', "")}
                </p> */}
                {parse(abstract || "")}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>PDF</Form.Label>
                <a href={edtData?.pdf}>Download</a>
              </Form.Group>
            </Row>
          </Form>
          <ChatBot
            config={botconfig}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Detail;
