import React, { useState, useEffect } from "react";
import { ListGroup, Container, Spinner, Alert, Form, Button } from "react-bootstrap";
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"name" | "rating-asc" | "rating-desc">("name");
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (sortType: "name" | "rating-asc" | "rating-desc") => {
    setSortOrder(sortType);
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedRestaurants = [...filteredRestaurants].sort((a, b) => {
    if (sortOrder === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === "rating-asc") {
      return a.rating - b.rating;
    } else {
      return b.rating - a.rating;
    }
  });

  const handleRestaurantSelect = async (id: number) => {
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

      <Form.Group controlId="search">
        <Form.Control
          type="text"
          placeholder="Search restaurants"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </Form.Group>

      <div className="my-3">
        <Button variant="secondary" onClick={() => handleSortChange("name")}>
          Sort by Name
        </Button>{" "}
        <Button variant="secondary" onClick={() => handleSortChange("rating-asc")}>
          Sort by Rating (Asc)
        </Button>{" "}
        <Button variant="secondary" onClick={() => handleSortChange("rating-desc")}>
          Sort by Rating (Desc)
        </Button>
      </div>

      {isLoadingRestaurant && (
        <div className="d-flex justify-content-center my-4">
          <Spinner animation="border" role="status" />
        </div>
      )}

      <ListGroup className="fade-in">
        {sortedRestaurants.length > 0 ? (
          sortedRestaurants.map((restaurant) => (
            <ListGroup.Item
              key={restaurant.id}
              action
              onClick={() => handleRestaurantSelect(restaurant.id)}
              className="fade-item"
              role="listitem"
            >
              <h5>{restaurant.name}</h5>
              <p>{restaurant.shortDescription}</p>
              <small>Rating: {restaurant.rating}</small>
            </ListGroup.Item>
          ))
        ) : (
          <Alert variant="info" className="mt-4">
            No restaurants found.
          </Alert>
        )}
      </ListGroup>
    </Container>
  );
};

export default RestaurantList;
