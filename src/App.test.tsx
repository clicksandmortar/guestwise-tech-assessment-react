import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RestaurantList from "../src/components/RestaurantList";
import { getRestaurants } from "../src/services/api";

jest.mock("../src/services/api");

const mockRestaurants = [
  { id: 1, name: "Restaurant A", shortDescription: "Description A", rating: 4.5 },
  { id: 2, name: "Restaurant B", shortDescription: "Description B", rating: 4.0 },
  { id: 3, name: "Cafe C", shortDescription: "Description C", rating: 3.0 },
];

describe("RestaurantList", () => {
  const onRestaurantSelectMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers(); 

  afterEach(() => {
    jest.useRealTimers(); 
  });

  it("calls onRestaurantSelect when a restaurant is selected", async () => {
    (getRestaurants as jest.Mock).mockResolvedValue(mockRestaurants);

    render(<RestaurantList onRestaurantSelect={onRestaurantSelectMock} />);

    await waitFor(() => {
      expect(screen.getByText("Restaurant A")).toBeInTheDocument();
    });

    const restaurantItem = screen.getByText("Restaurant A");
    userEvent.click(restaurantItem);

    jest.runAllTimers();

    await waitFor(() => {
      expect(onRestaurantSelectMock).toHaveBeenCalledWith(1);
    });
  });

  it("filters restaurants based on search input", async () => {
    (getRestaurants as jest.Mock).mockResolvedValue(mockRestaurants);

    render(<RestaurantList onRestaurantSelect={onRestaurantSelectMock} />);

    await waitFor(() => {
      expect(screen.getByText("Restaurant A")).toBeInTheDocument();
      expect(screen.getByText("Restaurant B")).toBeInTheDocument();
      expect(screen.getByText("Cafe C")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText("Search restaurants");
    userEvent.type(searchInput, "Cafe");

    await waitFor(() => {
      expect(screen.queryByText("Restaurant A")).not.toBeInTheDocument();
      expect(screen.queryByText("Restaurant B")).not.toBeInTheDocument();
      expect(screen.getByText("Cafe C")).toBeInTheDocument();
    });
  });
  
});
