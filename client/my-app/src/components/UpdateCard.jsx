import React from 'react'
import { useState, useEffect } from 'react'
import { Card, Button } from 'react-bootstrap'
import { Col } from 'react-bootstrap'
import axios from 'axios'
import EditableLabel from 'react-inline-editing'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextField } from '@mui/material'
import moment from 'moment'
import { updateTripRoute } from '../api/ApiRoutes'
import 'react-toastify/dist/ReactToastify.css';

const UpdateCard = ({ index, trip, deleteTrip, finishTrip, toast, helper, changeHelp }) => {
    const [origin, changeOrigin] = useState(trip.origin)
    const [dest, changeDest] = useState(trip.destination)
    const [price, changePrice] = useState(trip.price)
    const [time, changeTime] = useState(trip.departTime)
    const [description, changeDescription] = useState(trip.description)
    const today = new Date();
    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light"
      };

    const updateTrip = async (e) => {
        e.preventDefault()
        let realTime = moment(new Date(time)).format("YYYY/MM/DD HH:MM")
        const requestJson = {
            driverID: trip.driverID,
            vehicleID: trip.vehicleID,
            tripID: trip.tripID,
            origin: origin,
            destination: dest,
            departTime: realTime,
            price: price,
            description: description
        }
        const { data } = await axios.post(updateTripRoute, requestJson);
        if (data.status === "Fail") {
            toast.error(data.errorMessage, toastOptions);
        }
        else if (data.status === "Success") {
            toast.success("Trip update successfully", toastOptions)
            changeHelp(helper + 1)
        }
    }

    return (
        <>
            <Col key={index} sm={10} md={110} lg={100} xl={12} style={{ padding: 20 }}>
                <Card style={{ width: '60rem' }} className="rounded">
                    <Card.Body>

                        <Card.Title style={{ color: "#2DA8D8FF", fontSize: "30px" }}>
                            Origin: <div style={{ display: "inline-block" }}><EditableLabel text={origin} inputWidth='30rem' inputMaxLength = {25} onFocusOut = {(newValue) => {
                                    changeOrigin(newValue)
                                }}></EditableLabel></div>
                        </Card.Title>

                        <Card.Title style={{ color: "#2DA8D8FF", fontSize: "30px" }}>
                            Destination: <div style={{ display: "inline-block" }}><EditableLabel text={dest} inputWidth='30rem' inputMaxLength = {25} onFocusOut = {(newValue) => {
                                    changeDest(newValue)
                                }}></EditableLabel></div>
                        </Card.Title>

                        <div style={{ marginTop: "2rem", display: "flex", alignItems : "center", justifyContent: "space-between" }}>

                            <Card.Subtitle style={{ fontSize: "20px" }} className="mb-2 text-muted">Price:
                                <TextField
                                    id="outlined-number"
                                    type="number"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value = {price}
                                    onChange={(e) => changePrice(e.target.value)}
                                />
                            </Card.Subtitle>

                            <Card.Subtitle style={{ fontSize: "20px" }} className="mb-2 text-muted">Time:
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Date & Time"
                                        value={time}
                                        inputFormat="YYYY/MM/DD HH:MM"
                                        onChange={(newValue) => {
                                            changeTime(newValue)
                                            console.log(newValue)
                                        }}
                                        renderInput={(params) => <TextField  {...params} inputProps={{
                                            ...params.inputProps,
                                            placeholder: ""
                                        }}
                                        />}
                                    />
                                </LocalizationProvider>
                            </Card.Subtitle>
                        </div>

                        <Card.Subtitle style={{ fontSize: "20px", marginTop: "1rem" }} className="mb-2 text-muted">Details:</Card.Subtitle>
                        <textarea placeholder="Add some details to your trip!" className="form-control" id="exampleFormControlTextarea1" rows="4" 
                        style={{ display: "block", marginBottom: "1rem" }} defaultValue = {description}
                        onChange={(e) => changeDescription(e.target.value)}>   
                        </textarea>
                        {
                            (today > new Date(trip.departTime)) ?
                            <Button variant="primary" className="rounded" style={{ margin: "0.5rem" }} onClick = {(e) => finishTrip(e, trip)}>Finish</Button>
                            :
                            <React.Fragment>
                            <Button variant="primary" className="rounded" style={{ margin: "0.5rem" }} onClick = {(e) => updateTrip(e, trip)}>Update</Button>
                            <Button variant="primary" className="rounded" onClick={(e) => deleteTrip(e, trip)}>Delete</Button>
                            </React.Fragment>
                        }
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

export default UpdateCard