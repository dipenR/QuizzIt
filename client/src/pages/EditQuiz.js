import { React, useEffect, useState } from 'react'
import { Container, Col, Button } from 'react-bootstrap';

import Banner from '../components/Quiz/Banner'
import EditQuestionCard from '../components/Question/EditQuestionCard'
import AddQuestion from '../components/Question/AddQuestion'
import SignIn from '../components/SignIn';
import SignUp from '../components/SignUp';
import NotFound from '../components/NotFound';
import { getQuiz } from '../actions/quizActions'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'


function EditQuiz() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.auth.user)
    const isLoading = useSelector((state) => state.quiz.isLoading)
    const quiz = useSelector((state) => state.quiz.quiz)
    // const platform = useSelector((state) => state.platform.platform)

    let { qid } = useParams()
    
    const [showSignIn, setShowSignIn] = useState(true);
    const handleCloseSignIn = () => { setShowSignIn(false) };
    const handleShowSignIn = () => { setShowSignIn(true) };

    const [showSignUp, setShowSignUp] = useState(false);
    const handleCloseSignUp = () => { setShowSignUp(false) };
    const handleShowSignUp = () => { setShowSignIn(false); setShowSignUp(true) };

    
    useEffect(() => {
        dispatch(getQuiz(qid))
    }, [dispatch, qid])
    
    // useEffect(() => {
        //     if (!platform) dispatch(getQuiz(id))
        // }, [dispatch, platform])
    
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const handleShowAddQuestion = () => { setShowAddQuestion(true) };
    const handleCloseAddQuestion = () => { setShowAddQuestion(false) };
        
    if (isLoading) {
        return ( <div> Loading... </div> )
    }

    if (user == null) {
        return (
            <div className='justify-content-between'>
                <SignIn show={showSignIn} handleClose={handleCloseSignIn} />
                <SignUp show={showSignUp} handleClose={handleCloseSignUp} />
            </div>
        )
    }

    if (user !== quiz.owner)
        return <NotFound />

    return (
        <>
            <Banner></Banner>

            <div style={{ height: "10vh" }}></div>

            <Container className="row justify-content-center">
                <Col xs={1} md={4} className="g-4">
                    <Button onClick={handleShowAddQuestion} variant="primary btn-lg" style={{ marginLeft: "10px" }}>Add Question</Button>
                    <div style={{ height: "3vh" }}></div>
                    {quiz.questions.map((question, idx) => (
                        <>
                            <Col>
                                <EditQuestionCard quizId={qid} question={question}></EditQuestionCard>
                            </Col>
                            <div style={{ height: '20px'}}></div>
                        </>
                        ))}
                </Col>
            </Container>

            <AddQuestion quizId={qid} show={showAddQuestion} handleClose={handleCloseAddQuestion}></AddQuestion>
        </>
    )
}

export default EditQuiz