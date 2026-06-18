import { API_BASE_URL } from "./api";
import { getAccessToken } from "./auth";

export const getCurrentUser =
  async () => {
    const token =
      getAccessToken();

    console.log("TOKEN:", token);

    const response =
      await fetch(
        `${API_BASE_URL}/auth/me`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    console.log(
      "STATUS:",
      response.status
    );

    const data =
      await response.json();

    console.log(
      "RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch user"
      );
    }

    return data;
  };