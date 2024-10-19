import { User } from "../schemas/user";
import { Wish } from "../schemas/wish";

export let wishes: Wish[] = [
  {
    id: 1,
    description: "New Laptop",
    price: 1500,
    priority: "high",
    dateAdded: "2024-10-01",
    userId: 1,
  },
  {
    id: 2,
    description: "Vacation",
    price: 3000,
    priority: "medium",
    dateAdded: "2024-10-05",
    userId: 1,
  },
];

export const users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  },
];
