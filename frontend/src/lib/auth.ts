export const saveTokens = (
  accessToken: string,
  refreshToken: string
) => {
  localStorage.setItem(
    "access_token",
    accessToken
  );

  localStorage.setItem(
    "refresh_token",
    refreshToken
  );
};

export const getAccessToken = () => {
  return localStorage.getItem(
    "access_token"
  );
};

export const logout = () => {
  localStorage.removeItem(
    "access_token"
  );

  localStorage.removeItem(
    "refresh_token"
  );
};