import React, { useState, useCallback } from 'react'
import { Container, Row, Col, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import axios from 'axios'
import { CLOUDINARY_URL, CLOUDINARY_IMG_URL, URL } from '../../config.js'
import DeletePlatform from './DeletePlatform.js'
import EditSetting from './EditSetting.js'
import { EDIT_PLATFORM_FAIL } from '../../actions/types'
import { editPlatform } from '../../actions/platformActions.js'

import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

function Settings({ platform }) {
    const dispatch = useDispatch()
    const auth = useSelector((state) => state.auth)

    let { id } = useParams();  // get the platform ID from the url

    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = useCallback(() => { setShowDelete(false) }, []);
    const handleShowDelete = () => { setShowDelete(true) };
    
    const [showEditName, setShowEditName] = useState(false);
    const [showEditDesc, setShowEditDesc] = useState(false);

    // uploads an image to cloudinary and gets the url
    const uploadImage = async (base64EncodedImg) => {
        // upload the image
        let imageURL = null;
        if (base64EncodedImg) {

            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const body = JSON.stringify({data:base64EncodedImg});
                console.log(body)

                let res = await axios.post(`${URL}/api/utils/uploadImage`,body,config)
                console.log(res)
                imageURL = res.data.url

                
            } catch (error) {
                console.log(error)
            }
        }
        return imageURL;
    }

    const handleEditIcon = async (e) => {
        e.preventDefault();
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = async () => {
            const imageURL = await uploadImage(reader.result);
            if (!imageURL) {
                dispatch({
                    type: EDIT_PLATFORM_FAIL
                })
                return;
            }
    
            // edit the platform 
            dispatch(editPlatform(
                {
                    newValue: {
                        icon: imageURL
                    },
                    userId: auth.user.id,
                    platformId: id,
                    confirmPassword: ""
                }
            ));
        }
        
    }

    const handleEditBanner = async (e) => {
        e.preventDefault();

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend = async () => {
            const imageURL = await uploadImage(reader.result);
            if (!imageURL) {
                dispatch({
                    type: EDIT_PLATFORM_FAIL
                })
                return;
            }

            // edit the platform 
            dispatch(editPlatform(
                {
                    newValue: {
                        banner: imageURL
                    },
                    userId: auth.user.id,
                    platformId: id,
                    confirmPassword: ""
                }
            ));
        };



    }

    return (
        <Container>
            <h4 style={{ marginBottom: "20px" }}>Platform Details</h4>
            <Row className="justify-content-md-center">
                <Col md={4}>
                    <Form.Group controlId="formIconFile" className="mb-3">
                        <Form.Label>Platform Icon</Form.Label>
                        <Form.Control type="file" onChange={handleEditIcon} />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md={4}>
                    <Form.Group controlId="formBannerFile" className="mb-3">
                        <Form.Label>Platform Banner</Form.Label>
                        <Form.Control type="file" onChange={handleEditBanner} />
                    </Form.Group>
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md={4}>
                    <Form.Label>Platform Name</Form.Label>
                    <InputGroup className="mb-3">

                        <FormControl
                            placeholder={platform.name}
                            aria-label="name"
                            readOnly
                        />
                        <Button variant="outline-primary" onClick={()=>setShowEditName(true)}>Edit</Button>
                    </InputGroup>
                </Col>
            </Row>

            <Row className="justify-content-md-center">
                <Col md={4}>
                    <Form.Label>Platform Description</Form.Label>
                    <InputGroup className="mb-3">

                        <FormControl
                            placeholder={platform.description}
                            aria-label="description"
                            readOnly
                        />
                        <Button variant="outline-primary" onClick={()=>setShowEditDesc(true)}>Edit</Button>
                    </InputGroup>
                </Col>
            </Row>

            <br />

            <Row className="justify-content-md-center">
                <Col md={4} className="justify-content-center">
                    <Button onClick={handleShowDelete} variant="outline-danger">Delete Platform</Button>
                </Col>
            </Row>


            <DeletePlatform show={showDelete} handleClose={handleCloseDelete}></DeletePlatform>
            <EditSetting type="Name" show={showEditName} handleClose={()=>setShowEditName(false)}></EditSetting>
            <EditSetting type="Description" show={showEditDesc} handleClose={()=>setShowEditDesc(false)}></EditSetting>

        </Container>

    )
}
export default Settings;
