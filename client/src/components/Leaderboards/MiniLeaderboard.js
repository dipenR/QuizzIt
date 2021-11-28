import React, { useState } from 'react'
import { Image, Button, Row, Table, Nav, Card } from 'react-bootstrap';
import { useHistory, useParams, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function MiniLeaderboard({ doc }) {
    const history = useHistory()
    const location = useLocation();
    const memberList = useSelector((state) => state.platforms.memberList)

    const [leaderboard, setLb] = useState({
        type: "All",
        lb: doc.allTime_leaderboard
    })

    let { id, qid } = useParams();  // get the platform ID and/or quiz ID from the url if this is a platform or quiz leaderboard

    const routeToLeaderboardPage = () => {
        if (id && !qid) {
            history.push(`/platform/${id}/leaderboard`)
        }
        else if (id && qid){
            history.push(`/platform/${id}/quiz/${qid}/leaderboard`)
        }
        else{
            history.push(`/leaderboard/global`)
        }
    }

    if (!memberList) {
        return (<div>Loading...</div>)
    }

    return (
        <div className="position-relative container justify-content-center" style={{ marginTop: "13px", marginRight: "100px" }}>
            <Row>
                <Nav fill variant="tabs"
                >
                    <Nav.Item>
                        <Nav.Link onClick={() => setLb({ type: "Daily", lb: doc.daily_leaderboard })} disabled={leaderboard.type === "Daily"}>Daily</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => setLb({ type: "Weekly", lb: doc.weekly_leaderboard })} disabled={leaderboard.type === "Weekly"}>Weekly</Nav.Link>
                    </Nav.Item>
                    <Nav.Item >
                        <Nav.Link onClick={() => setLb({ type: "All", lb: doc.allTime_leaderboard })} disabled={leaderboard.type === "All"}>All</Nav.Link>
                    </Nav.Item>
                </Nav>
                <br />
            </Row>

            <Row className="justify-content-center" style={{ marginTop: "10px" }}>
                <Card border="dark" style={{ width: '50%' }}>
                    <Card.Body>
                        <Card.Title>1</Card.Title>
                        <Card.Text >
                            <Row className="justify-content-center">
                                <Image style={{ width: "80px", height: "80px" }} src="/quizzit_logo.png" roundedCircle thumbnail />
                            </Row>
                            <Row className="justify-content-center">
                                {leaderboard.lb[0] && memberList.find((m) => m.userId._id === leaderboard.lb[0].userId) ? memberList.find((m) => m.userId._id === leaderboard.lb[0].userId).userId.username : "--"}
                            </Row>
                            <Row className="justify-content-center">
                                {leaderboard.lb[0] ? (leaderboard.lb[0].points + ' Points') : ""}
                            </Row>

                        </Card.Text>
                    </Card.Body>
                </Card>
            </Row>

            <Row className="justify-content-center" style={{ marginTop: "10px" }}>
                <Card border="dark" style={{ width: '40%', marginRight: "10px" }}>
                    <Card.Body>
                        <Card.Title>2</Card.Title>
                        <Card.Text >
                            <Row className="justify-content-center">
                                <Image style={{ width: "80px", height: "80px" }} src="/quizzit_logo.png" roundedCircle thumbnail />
                            </Row>
                            <Row className="justify-content-center">
                                {leaderboard.lb[1] && memberList.find((m) => m.userId._id === leaderboard.lb[1].userId) ? memberList.find((m) => m.userId._id === leaderboard.lb[1].userId).userId.username : "--"}
                            </Row>
                            <Row className="justify-content-center">
                                {leaderboard.lb[1] ? (leaderboard.lb[1].points + ' Points') : ""}
                            </Row>
                        </Card.Text>
                    </Card.Body>
                </Card>
                <Card border="dark" style={{ width: '40%', marginLeft: "10px" }}>
                    <Card.Body>
                        <Card.Title>3</Card.Title>
                        <Card.Text >
                            <Row className="justify-content-center">
                                <Image style={{ width: "80px", height: "80px" }} src="/quizzit_logo.png" roundedCircle thumbnail />
                            </Row>
                            <Row className="justify-content-center">
                                {leaderboard.lb[2] && memberList.find((m) => m.userId._id === leaderboard.lb[2].userId) ? memberList.find((m) => m.userId._id === leaderboard.lb[2].userId).userId.username : "--"}
                            </Row>
                            <Row className="justify-content-center">
                                {leaderboard.lb[2] ? (leaderboard.lb[2].points + ' Points') : ""}
                            </Row>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Row>

            <Row style={{ marginTop: "10px" }}>
                <Table hover>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>User</th>
                            <th>Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 7 }, (_, i) => i + 4).map((rank, _) =>
                            <tr>
                                <td>{rank}</td>
                                <td>
                                    {leaderboard.lb[rank - 1] && memberList.find((m) => m.userId._id === leaderboard.lb[rank - 1].userId) ? memberList.find((m) => m.userId._id === leaderboard.lb[rank - 1].userId).userId.username : "--"}
                                </td>
                                <td>
                                    {leaderboard.lb[rank - 1] && memberList.find((m) => m.userId._id === leaderboard.lb[rank - 1].userId) ? leaderboard.lb[rank - 1].points : "--"}
                                </td>
                            </tr>

                        )}
                    </tbody>
                </Table>
            </Row>

            <Row>
                <Button variant="primary" size="sm" onClick={routeToLeaderboardPage}>
                    View Leaderboard
                </Button>
            </Row>

        </div>
    )
}
export default MiniLeaderboard;
