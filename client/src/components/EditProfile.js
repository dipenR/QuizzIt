import React, { useState } from 'react'
import { Container, Form, Button, Modal, Alert } from "react-bootstrap";
import { useSelector, useDispatch } from 'react-redux'
import { signup } from '../actions/authActions'
import { useHistory } from 'react-router-dom';

function EditProfile({ type, show, handleClose }) {
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const history = useHistory()

  const [values, setValues] = useState({
    field: auth.user.username,
  });

  const onChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const closeModal = (err) => {
    if (err) {
      setErrors({ ...err });
      return;
    }
    setValues({ ...values, field: ""});
    setErrors({});
    handleClose();
  }

  const handleSubmit = ((e) => {
    e.preventDefault();

    // dispatch(signup({
      // username: values.username,
      // email: values.email,
      // password: values.password,
      // history: history,
      // callback: closeModal
    // }))
  })

  return (
    <Modal style={{ color: "black" }} show={show} onHide={closeModal} >
      <Modal.Header closeButton>
        <Modal.Title>Edit {type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formBasicField">
            <Form.Label>Enter New {type} </Form.Label>
            <Form.Control type="field" placeholder={type} name="field" onChange={onChange} />
          </Form.Group>
        </Form>
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
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );

}


export default EditProfile;