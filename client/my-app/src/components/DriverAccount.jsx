import React from 'react'
import { Header } from '../components/Header'
import { Card, Button } from 'react-bootstrap'
import { Row, Col } from 'react-bootstrap'
import { useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { 
  getVehiclesRoute,
  getDriverTripsRoute, 
  deleteTripRoute, 
  getDriverUpcomingTripsRoute,
  getDriverRatingRoute
} from '../api/ApiRoutes'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from "react-toastify"
import axios from 'axios'
import "./Card.css";
import TripDetailModal from './TripDetailModal';

const DriverAccount = ({ currentUser, helper, changeHelp }) => {

  const toastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light"
  };
  const [rating, setRating] = useState(0);
  const [trips, setTrips] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [modal, setModal] = useState(-1);

  useEffect(() => {
    async function fetchData() {
      const requestJson = { driverID: currentUser.userId };
      const responseRating = await axios.post(getDriverRatingRoute, requestJson);
      setRating(responseRating.data.rating);
      const responseVehicles = await axios.post(getVehiclesRoute, requestJson);
      setVehicles(responseVehicles.data);
      const responseTrips = await axios.post(getDriverTripsRoute, requestJson);
      setTrips(responseTrips.data);
      const responseUpcomingTrips = await axios.post(getDriverUpcomingTripsRoute, requestJson);
      setUpcomingTrips(responseUpcomingTrips.data);
    }
    fetchData();
  }, [helper, currentUser])

  const deleteTrip = async (e, trip) => {
    e.preventDefault();
    const requestJson = { 
      driverID: trip.driverID, 
      vehicleID: trip.vehicleID,
      tripID: trip.tripID,
    }

    const { data } = await axios.post(deleteTripRoute, requestJson);

    if (data.status === "Fail") {
      toast.error(data.errorMessage, toastOptions);
    }
    else if (data.status === "Success"){
      console.log("success")
      changeHelp(helper + 1)
    }
  }
  const toggleModal = (index) => {
    setModal(index)
  }

  return (
    <>
      <Header />
      <div style={{ textAlign: "center", fontSize: "20px" }}>
        <h1 style={{ fontSize: "50px", paddingTop: "2.5rem" }}>{currentUser.username}</h1>
        <p>{currentUser.email} | {currentUser.phone} | <i className='fas fa-star'/>{rating}</p>
      </div>
      <div style={{ paddingLeft: "10rem", paddingRight: "10rem", paddingTop: "2rem" }}>
        <h1>
          My Vehicles
        </h1>
        <div className="border-top my-4"></div>
        {
          (vehicles.length === 0)?
          <p style={{ fontSize: "20px" }}>
            You do not have a vehicle! Register one <Link to="/addvehicle">here</Link>!
          </p>
          :
          <Row>
            {vehicles.map((vehicle, index) => (
            <Col key={index} sm={10} md={110} lg={10} xl={6} style={{ padding: 20 }}>
              <Card style={{ width: '100%' }} className="rounded">
                <Card.Body>
                  <Card.Title style={{ color: "#2DA8D8FF", fontSize: "30px" }}>{vehicle.model}</Card.Title>
                  <Card.Subtitle style={{ fontSize: "16px" }} className="mb-2 text-muted">
                  {(vehicle.capacity > 1)?
                    <p>Capacity: {vehicle.capacity} people</p>: 
                    <p>Capacity: {vehicle.capacity} person</p>
                  }
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          ))}
          </Row>
          }
        </div>
        <div style={{ padding: "10rem", paddingTop: "1rem" }}>
        <h1 stype={{paddingTop: "2.5rem"}}>
          Upcoming Trips
        </h1>
        <div className="border-top my-4"></div>
        {
          (trips.length === 0)?
          <p style={{ fontSize: "20px" }}>
            You do not have any upcoming trips! Create one <Link to="/addmodify">here</Link>!
          </p>
          :
          <Row xs={1} md={2} className="g-4">
          {upcomingTrips.map((trip, index) => (
            <Col key={index} sm={10} md={110} lg={10} xl={6} style={{ padding: 20 }}>
              <Card border="secondary" className="cardClass">
              <Card.Header style={{ color: '#2DA8D8'}} className="card-header">{trip.origin} → {trip.destination}</Card.Header>
                <Card.Body>
                  <Card.Subtitle style={{ fontSize: "16px" }} className="mb-2 text-muted">Time: {trip.departTime}</Card.Subtitle>
                  <Card.Subtitle style={{ fontSize: "16px" }} className="mb-2 text-muted">Price: ${trip.price}</Card.Subtitle>
                  <Card.Text className="card-description">
                    {trip.description}
                  </Card.Text>
                  <React.Fragment>
                      <TripDetailModal 
                        open={modal} 
                        onClose={() => toggleModal(-1)} 
                        curTrip = {trip}
                        index={index}/>
                      <button className="open-button"
                        onClick={() => toggleModal(index)}>See More</button>
                  </React.Fragment>
                  <br/>
                  <Button variant="primary" className="rounded" onClick={(e) => deleteTrip(e, trip)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        }
        
        <h1 style={{ paddingTop: "5rem" }}>
          Trips History
        </h1>
        <div className="border-top my-4"></div>
        <Row>
          {trips.map((trip, index) => (
            <Col key={index} sm={10} md={110} lg={10} xl={6} style={{ padding: 10 }}>
              <Card className="cardClass">
              <Card.Header style={{ color: '#2DA8D8'}} className="card-header">{trip.origin} → {trip.destination}</Card.Header>
                <Card.Body>
                  <Card.Subtitle style={{ fontSize: "16px" }} className="mb-2 text-muted">Time: {trip.departTime}</Card.Subtitle>
                  <Card.Subtitle style={{ fontSize: "16px" }} className="mb-2 text-muted">Price: ${trip.price}</Card.Subtitle>
                  <Card.Text className="card-description">
                    {trip.description}
                  </Card.Text>
                  <React.Fragment>
                      <p>{trip.tripID}</p>
                      <TripDetailModal 
                        open={modal} 
                        onClose={()=>toggleModal(false)} 
                        curTrip = {{ origin: trip.origin }}/>
                      {/* <button className="open-button" onClick={(e) =>showTripDetail(e, trip)}>See More</button> */}
                  </React.Fragment>
                  {/* <button class="open-button" >See More</button> */}
                  <br/>
                  <Button variant="primary" className="rounded" onClick={(e) => deleteTrip(e, trip)}>Delete</Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <ToastContainer />
    </>
  )
}



export default DriverAccount