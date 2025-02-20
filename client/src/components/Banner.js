import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Banner({data}) {

    console.log(data);
    const {title, content, destination, buttonLabel} = data;

    return (
        <Row className="justify-content-center align-items-center vh-100">
            <Col md={6} className="text-center">
                <h1 className="display-4 fw-bold text-danger mb-4">{title}</h1>
                <p className="fs-5 text-muted mb-4">{content}</p>
                <Link to={destination} className="btn btn-primary btn-lg px-4 py-2">
                	{buttonLabel}
                </Link>
            </Col>
        </Row>
    )
}