import React, { useState } from 'react'
import { Card, Image, Row, Col, Button } from 'react-bootstrap';
import authReducer from '../../reducers/authReducer';
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'

function PlatformCard({ platform }) {
    const auth = useSelector((state) => state.auth)
    const history = useHistory()

    const routeToPlatform = () => {
        history.push(`/platform/${platform._id}`);
    }

    return (
        <Card style={{ marginBottom: "20px" }}>
            <Card.Body>
                <Row>
                    <Col onClick={routeToPlatform} md={3} className="my-auto" align="center" style={{cursor: "pointer"}}>
                        <Image style={{ width: "150px", height: "150px" }} className="bg-dark" src={platform.icon ? platform.icon : '/quizzit_logo.png'} thumbnail />
                    </Col>
                    <Col onClick={routeToPlatform} md={6} style={{cursor: "pointer"}}>
                        <Row style={{ height: "25%" }}>
                            <p className="fs-4 text">{platform.name}</p>
                        </Row>
                        <Row style={{ height: "25%" }}>
                            <p>{platform.subscribers.length} Subscribers<i class="bi bi-dot" />{platform.quizzes.length} Quizzes</p>
                        </Row>
                        <Row style={{ height: "25%" }}>
                            <p>{platform.description}</p>
                        </Row>
                        <Row style={{ height: "25%" }}>
                            <p>
                                <i className="bi bi-hand-thumbs-up"></i> {platform.likes ? platform.likes.totalLikes : 0}
                                <i className="bi bi-hand-thumbs-down" style={{ marginLeft: "10px" }}></i> {platform.likes ? platform.likes.totalDislikes : 0}
                            </p>
                        </Row>

                    </Col >
                    <Col md={3} align="center" className="my-auto" style={{}}>
                        <Button size="lg" variant="primary">Subscribe</Button>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    )
}
export default PlatformCard;