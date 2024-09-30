import React, { useEffect, useState } from "react";
import { Card, Container, Spinner, Alert } from "react-bootstrap";
import { getRestaurantDetails } from "../services/api";

type RestaurantDetailsProps = {
  restaurantId: number;
};

type RestaurantDetailsData = {
  id: number;
  name: string;
  shortDescription: string;
  cuisine: string;
  rating: number;
  details: {
    address: string;
    openingHours: {
      weekday: string;
      weekend: string;
    };
    reviewScore: number;
    contactEmail: string;
  };
};

const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurantId }) => {
  const [details, setDetails] = useState<RestaurantDetailsData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;  

    let isMounted = true; 

    const fetchDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getRestaurantDetails(restaurantId);
        if (isMounted) {
          setDetails(data);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load restaurant details.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();

    return () => {
      isMounted = false;  
    };
  }, [restaurantId]);  

  if (loading) {
    return (
      <Container className="mt-4">
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!details) {
    return <p>No details available.</p>;
  }

  const { name, details: nestedDetails } = details; 
  const { address, openingHours, reviewScore, contactEmail } = nestedDetails;

  const weekday = openingHours?.weekday ?? "Not available";
  const weekend = openingHours?.weekend ?? "Not available";

  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>{name} - Restaurant Details</Card.Title>
          <Card.Text>Address: {address || "Not available"}</Card.Text>
          <Card.Text>Opening Hours (Weekday): {weekday}</Card.Text>
          <Card.Text>Opening Hours (Weekend): {weekend}</Card.Text>
          <Card.Text>Review Score: {reviewScore || "Not available"}</Card.Text>
          <Card.Text>Contact: {contactEmail || "Not available"}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default RestaurantDetails;
