import React, { useState, useEffect } from "react";
import { ListGroup, Container, Spinner, Alert, Form, Row, Col } from "react-bootstrap";
import { getRestaurants } from "../services/api";

type Restaurant = {
  id: number;
  name: string;
  shortDescription: string;
  rating: number; // Assuming rating is a number
};

type RestaurantListProps = {
  onRestaurantSelect: (id: number) => void;
};

const RestaurantList: React.FC<RestaurantListProps> = ({ onRestaurantSelect }) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(""); // Debounced search query
  const [sortOption, setSortOption] = useState<string>("name"); // Sorting state (default: sort by name)

  // Fetch restaurant data on component mount
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

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // Delay of 300ms

    // Clear timeout if the user types again within 300ms
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Handle search functionality with debounced query
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  // Handle sorting functionality
  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortOption === "name") {
      return a.name.localeCompare(b.name); // Alphabetical sorting
    } else if (sortOption === "rating") {
      return b.rating - a.rating; // Sort by rating, highest first
    }
    return 0;
  });

  // Render spinner while loading
  if (loading) {
    return (
      <Container>
        <h2>Restaurants</h2>
        <div className="d-flex justify-content-center mt-4">
          <Spinner animation="border" role="status"></Spinner>
        </div>
      </Container>
    );
  }

  // Render error message if an error occurs
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
      {/* Search and Sort Controls */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search restaurants by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={6}>
          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="rating">Sort by Rating</option>
          </Form.Select>
        </Col>
      </Row>

      {/* Render the filtered and sorted restaurant list */}
      <ListGroup className="fade-in">
        {sortedRestaurants.map((restaurant) => (
          <ListGroup.Item
            key={restaurant.id}
            action
            onClick={() => onRestaurantSelect(restaurant.id)}
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
