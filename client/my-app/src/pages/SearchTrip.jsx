import React from 'react'
import { useState } from 'react'
import { Form, Button, Stack } from 'react-bootstrap'
import { FormContainer } from '../components/FormContainer'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { TextField, Slider, Box, Typography, FormControl } from '@mui/material'
import axios from 'axios'
import { searchTripRoute } from '../api/ApiRoutes'
import moment from 'moment'
import DriverTrip from '../components/DriverTrip'
import { useNavigate } from 'react-router-dom'

function valuetext(value) {
    return `${value}`;
}

export const SearchTrip = () => {
    const [origin, changeOrigin] = useState("")
    const [dest, changeDest] = useState("")
    const [depDateAfter, changeDepDateAft] = useState(null)
    const [depDateBef, changeDepDateBef] = useState(null)
    const [priceRange, setPriceRange] = useState([0, 150])
    const currentUser = JSON.parse(sessionStorage.getItem('WatCarPool-User'))
    const [helper, changeHelp] = useState(0);

    const handlePriceChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setPriceRange([Math.min(newValue[0], priceRange[1] - 10), priceRange[1]]);
        } else {
            setPriceRange([priceRange[0], Math.max(newValue[1], priceRange[0] + 10)]);
        }
    }

    const navigate = useNavigate()

    const tripSearch = async (e) => {
        e.preventDefault();
        let depDateAfterRealTime = null;
        if (depDateAfter != null) {
            depDateAfterRealTime = moment(new Date(depDateAfter)).format("YYYY/MM/DD HH:MM")
        }
        let depDateBefRealTime = null;
        if (depDateBef != null) {
            depDateBefRealTime = moment(new Date(depDateBef)).format("YYYY/MM/DD HH:MM")
        }

        const requestJson = {
            origin: origin, destination: dest,
            departTimeStart: depDateAfterRealTime, departTimeEnd: depDateBefRealTime,
            priceLow: priceRange[0], priceHigh: priceRange[1]
        }
        console.log(requestJson)
        const { data } = await axios.post(searchTripRoute, requestJson);
        console.log(data)
        navigate("/searchresult", {
            state: {
                tripResult: data,
            }
        });
        return (
            <>
                <DriverTrip trips={data} currentUser={currentUser} helper={helper} changeHelp={changeHelp} />
            </>
        )
    }

    return (
        <div style={{ position: "center", marginTop: "50px", marginBottom: "50px" }}>
            <FormContainer>
                <h1 style={{ textAlign: "center" }}>Search Trips</h1>
                <br />
                <Form>
                    <Form.Group controlId='Origin'>
                        <FormControl fullWidth>
                            <TextField
                                label="Origin"
                                value={origin}
                                onChange={(e) => changeOrigin(e.target.value)}
                            />
                        </FormControl>
                    </Form.Group>
                    <br />
                    <Form.Group controlId='Destination'>
                        <FormControl fullWidth>
                            <TextField
                                label="Destination"
                                value={dest}
                                onChange={(e) => changeDest(e.target.value)}
                            />
                        </FormControl>
                    </Form.Group>
                    <br />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2}>
                            <DateTimePicker
                                label="Departure After"
                                value={depDateAfter}
                                inputFormat="YYYY/MM/DD HH:mm"
                                onChange={(newValue) => {
                                    changeDepDateAft(newValue)
                                }}
                                renderInput={(params) => <TextField  {...params} inputProps={{
                                    ...params.inputProps
                                }} />}
                            />
                            <br />
                            <DateTimePicker
                                label="Departure Before"
                                value={depDateBef}
                                inputFormat="YYYY/MM/DD HH:mm"
                                onChange={(newValue) => {
                                    changeDepDateBef(newValue)
                                }}
                                renderInput={(params) => <TextField  {...params} inputProps={{
                                    ...params.inputProps
                                }} />}
                            />
                        </Stack>
                    </LocalizationProvider>
                    <br />
                    <Box sx={{ width: '100%' }}>
                        <Typography gutterBottom>Price Range</Typography>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            step={10}
                            marks
                            min={0}
                            max={150}
                        />
                    </Box>
                    <br />
                    <center>
                        <Button type='submit' variant='primary' className="rounded" onClick={tripSearch}>Search</Button>
                    </center>
                </Form>

            </FormContainer>
        </div>
    )
}