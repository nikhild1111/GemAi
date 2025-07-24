// src/utils/authHeader.js

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
