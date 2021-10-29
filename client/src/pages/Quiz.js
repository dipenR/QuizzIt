import React from 'react'
import { Container, Col, Table, Button } from 'react-bootstrap';

import Banner from '../components/Quiz/Banner'

function Quiz({ quizId }) {
    return (
        <div>
            <Banner></Banner>      

            <div style={{ height: "50px" }}></div>
                <Container>
                <Col>
                <Table striped bordered hover>
                    <tr><th>Quiz Rules</th></tr>
                    <tr>
                        <th>Time</th>
                        <th>5 minutes</th>
                    </tr>
                    <tr>
                        <th>Number of Questions</th>
                        <th>20</th>
                    </tr>
                </Table>
                <div className="d-grid gap-1">
                    <Button variant="outline-primary btn-lg" style={{ marginLeft: "10px" }}>Take Quiz</Button>
                    <Button variant="primary btn-lg" style={{ marginLeft: "10px" }}>View Submissions</Button>
                </div>
                </Col>
                <Col>
                    <div> Leaderboard Goes Here</div>
                </Col>
                </Container>
        </div>
    )
}

export default Quiz