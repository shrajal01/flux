import { API_BASE_URL } from "./api";
import { getAccessToken } from "./auth";
import { User } from "@/types";

export const getCurrentUser = async (): Promise<User> => {
  const token = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
};