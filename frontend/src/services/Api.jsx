import axios from "axios";

// const BASE_URL = "https://workspace-kwgy.onrender.com/api";

const BASE_URL= "http://localhost:3000/api"


export const signup = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, data);
    return res.data;
  } catch (error) {
    return error.response?.data || { msg: "Signup failed" };
  }
};

export const login = async (data) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, data);
    return res.data;
  } catch (error) {
    return error.response?.data || { msg: "Login failed" };
  }
};

export const getWorkspace = async (token) => {
  try {
    const res = await axios.get(`${BASE_URL}/workspace`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return { workspaces: [] };
  }
};

export const setToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const createWorkspace = async (name, token) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/workspace`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    return { msg: "Failed to create workspace" };
  }
};

export const updateWorkspace = async (id, name, token) => {
  try {
    const res = await axios.put(
      `${BASE_URL}/workspace/${id}`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error(error);
    return { msg: "Failed to update workspace" };
  }
};

export const deleteWorkspace = async (id, token) => {
  try {
    const res = await axios.delete(`${BASE_URL}/workspace/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error(error);
    return { msg: "Failed to delete workspace" };
  }
};

export const addMember = async (id, email, token) => {
  try {
    const res = await fetch(`${BASE_URL}/workspace/${id}/add-member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    console.error(err);
    return { msg: "Failed to add member" };
  }
};
