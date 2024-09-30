import React, { useState, useEffect } from "react";
import { ListGroup, Container, Spinner, Alert } from "react-bootstrap";
import { getRestaurants } from "../services/api"; // Assuming you have this service

type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
};

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({
  onRestaurantSelect,
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true); // Start loading
        const restaurantData = await getRestaurants(); // API call
        setRestaurants(restaurantData); // Update state with the fetched restaurant data
      } catch (error) {
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchRestaurantData();
  }, []);


  if (loading) {
    return (
      <Container>
        <h2>Restaurants</h2>
        {/* Spinner while loading */}
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" role="status">
          </Spinner>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h2>Restaurants</h2>
        {/* Error message */}
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2>Restaurants</h2>
      <ListGroup className="fade-in">
        {restaurants.map((restaurant) => (
          <ListGroup.Item
            key={restaurant.id}
            action
            onClick={() => onRestaurantSelect(restaurant.id)}
            className="fade-item"
          >
            <h5>{restaurant.name}</h5>
            <p>{restaurant.shortDescription}</p>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RestaurantList;
