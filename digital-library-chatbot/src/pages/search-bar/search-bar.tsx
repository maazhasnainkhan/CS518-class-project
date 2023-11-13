import "./search-bar";
import Form from "react-bootstrap/esm/Form";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import { Card, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { EDT } from "../../global/types/edt";
import ReactPaginate from "react-paginate";

function SearchBar() {
  const navigate = useNavigate();
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get("id") !== null) {
      const guid = String(queryParams.get("id"));
      localStorage.setItem("guid", guid);
      navigate(`/reset-password?id=${guid}`);
    }
  }, [navigate]);

  const [edts, setEDTS] = useState<EDT[]>();
  const [query, setQuery] = useState<string>();

  const [itemsPerPage, setItemsPerPage] = useState<number>(5);

  // We start with an empty list of items.
  const [currentItems, setCurrentItems] = useState<EDT[]>();
  const [pageCount, setPageCount] = useState(0);
  // Here we use item offsets; we could also use page offsets
  // following the API or data you're working with.
  const [itemOffset, setItemOffset] = useState(0);

  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(edts?.slice(itemOffset, endOffset));
    setPageCount(Math.ceil((edts?.length || 0) / itemsPerPage));
  }, [itemOffset, itemsPerPage, edts]);

  // Invoke when user click to request another page.
  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % (edts?.length || 0);
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };

  const onSubmit = async () => {
    const response: any = await fetch(
      `${String(process.env.REACT_APP_API_HOST)}/query-documents?query=${query}`
    );
    if (response && response.status === 201) {
      const result = await response.json();
      setEDTS(result.data);
    }
    console.log(edts);
  };

  return (
    <Container>
      <Row>
        <Col
          md={{ span: 6, offset: 3 }}
          style={{ textAlign: "left", marginTop: "100px" }}
        >
          <h1>Search </h1>
          <br />
          <Form>
            <Form.Group className="mb-3" controlId="searchBar">
              <Form.Label>Search</Form.Label>
              <Form.Control
                type="search"
                placeholder="Search Here"
                onChange={(event) => {
                  setQuery(event.target.value);
                }}
              />
            </Form.Group>
            <Button variant="primary" onClick={onSubmit}>
              Search
            </Button>
          </Form>
        </Col>
      </Row>

      {currentItems && currentItems.length > 0 && (
        <Row>
          <Col>
            <h2 style={{ textAlign: "left" }}>Results</h2>
            <p
              style={{ textAlign: "left" }}
            >{`Total Records: ${edts?.length}`}</p>

            {currentItems.map((item: EDT) => {
              return (
                <Card
                  style={{
                    textAlign: "left",
                    marginTop: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Card.Header>{item.university.toUpperCase()}</Card.Header>
                  <Card.Body>
                    <Card.Title>{item.title.toUpperCase()}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{`${item.university}, ${item.year}`}</Card.Subtitle>
                    <Card.Text>
                      {`Program: ${item.program}, Degree: ${item.degree}, Year: ${item.year}`}
                    </Card.Text>
                    <Card.Text className="mb-2 text-muted">
                      {item.author}
                    </Card.Text>
                    <br />
                    <Button variant="primary">More...</Button>
                  </Card.Body>
                </Card>
              );
            })}
            <ReactPaginate
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              marginPagesDisplayed={2}
              pageCount={pageCount}
              previousLabel="< previous"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakLabel="..."
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default SearchBar;
