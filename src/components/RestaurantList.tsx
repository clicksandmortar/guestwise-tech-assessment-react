import React, { useState, useEffect } from "react";
import { ListGroup, Container, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import { getRestaurants } from "../services/api";

type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
  rating: number;
};

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({ onRestaurantSelect }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<number | null>(null);
  const [isLoadingRestaurant, setIsLoadingRestaurant] = useState<boolean>(false); 

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);
        const restaurantData = await getRestaurants();
        setRestaurants(restaurantData);
      } catch (error) {
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  const handleRestaurantSelect = async (id: number) => {
    setSelectedRestaurantId(id); 
    setIsLoadingRestaurant(true); 

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); 
      onRestaurantSelect(id); 
    } catch (err) {
      console.error("Error selecting restaurant", err);
    } finally {
      setIsLoadingRestaurant(false); 
    }
  };

  if (loading) {
    return (
      <Container>
        <h2>Restaurants</h2>
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" role="status" />
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <h2>Restaurants</h2>
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h2>Restaurants</h2>
      {isLoadingRestaurant && (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" role="status" />
        </div>
      )}

      <ListGroup className="fade-in">
        {restaurants.map((restaurant) => (
          <ListGroup.Item
            key={restaurant.id}
            action
            onClick={() => handleRestaurantSelect(restaurant.id)}
            className="fade-item"
          >
            <h5>{restaurant.name}</h5>
            <p>{restaurant.shortDescription}</p>
            <small>Rating: {restaurant.rating}</small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default RestaurantList;
