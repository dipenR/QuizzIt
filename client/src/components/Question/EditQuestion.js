import React, { useState } from 'react'
import { Form, Button, Modal, Alert } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { editQuizQuestion } from '../../actions/quizActions'

function EditQuizQuestion({ quizId, show, handleClose, question }) {
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [values, setValues] = useState({
        question: question.question,
        option1: question.choices[0],
        option2: question.choices[1],
        option3: question.choices[2],
        option4: question.choices[3],
        answer: question.answer
    });
    
    const closeModal = (err) => {
        if (err) {
            setErrors({ ...err })
            return;
        }
        setValues({ 
            ...values, 
            question: "", 
            option1:"", 
            option2:"", 
            option3:"", 
            option4:"", 
            answer:"" 
        });
        setErrors({});
        handleClose();
    }
    
    const onChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(quizId)
        console.log(values)

        let optionValues = [] // Currently options exsist as individual k:v pairs in values, get a list of them instead
        options.forEach(x => optionValues.push(values[x]))
        console.log(optionValues)


        dispatch(editQuizQuestion({ 
            id: quizId, 
            question: {
                _id: question._id, 
                question: values.question, 
                choices: optionValues, 
                answer: values.answer
            }, 
            callback: closeModal 
        }))
    }
    
    let options = ['option1', 'option2', 'option3', 'option4']
    let optionList = []
    options.forEach((option, index) => {
        optionList.push( 
            <Form.Group className="mb-3">
                <Form.Label>Option {index+1} </Form.Label>
                <Form.Control type="text" placeholder="Option" defaultValue={values[option]} name={option} onChange={onChange} />
            </Form.Group>
        )
    })
    
    console.log('modal edit question')
    return (
        <Modal show={show} onHide={closeModal}>
            <Modal.Header closeButton> <Modal.Title>Edit Question</Modal.Title> </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Question</Form.Label>
                        <Form.Control type="text" defaultValue={values.question} name="question" onChange={onChange} />
                    </Form.Group>
                        {optionList}
                    <Form.Group className="mb-3">
                        <Form.Label>Answer</Form.Label>
                        <Form.Control type="text" defaultValue={values.answer} name="answer" onChange={onChange} />
                    </Form.Group>
                </Modal.Body>
                {Object.keys(errors).length > 0 && (
                    <Form.Text className="text-muted">
                        <Alert variant={'danger'}>
                            <ul className='list'>
                                {Object.values(errors).map(v => (
                                    <li key={v}>{v}</li>
                                ))}
                            </ul>
                        </Alert>
                    </Form.Text>
                )}
                <Modal.Footer className="justify-content-between"> 
                    <Button variant="primary" type="submit"> Add </Button> 
                </Modal.Footer>
            </Form>
        </Modal>
    )
}

export default EditQuizQuestion;