import axios, { AxiosInstance } from 'axios';


// Configure the base URL for your API.
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9002';

// Function to create an authenticated Axios instance.
// This function gets credentials from localStorage and adds them to the header.
const createAuthenticatedApi = (): AxiosInstance => {
  const username = localStorage.getItem('username');
  const password = localStorage.getItem('password');

  if (!username || !password) {
    throw new Error('Authentication credentials not found in localStorage.');
  }

  const basicAuth = `Basic ${btoa(`${username}:${password}`)}`;

  return axios.create({
    baseURL: `${API_BASE}/api`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': basicAuth,
    },
  });
};

// 🔍 GET all terminologies
export const getTerminologies = () => {
  const api = createAuthenticatedApi();
  return api.get('/dictionary');
};

// 📄 GET a single terminology by ID
export const getTerminology = (id: string) => {
  const api = createAuthenticatedApi();
  return api.get(`/dictionary/${id}`);
};

// ➕ CREATE a new terminology
export const createTerminology = (data: {
  Terminology: string;
  Acronym: string;
  Description: string;
}) => {
  const api = createAuthenticatedApi();
  return api.post('/dictionary', data);
};

// ✏️ UPDATE an existing terminology
export const updateTerminology = (
  id: string,
  data: {
    Terminology: string;
    Acronym: string;
    Description: string;
  }
) => {
  const api = createAuthenticatedApi();
  return api.put(`/dictionary/${id}`, data);
};

// 🗑️ DELETE a terminology
export const deleteTerminology = (id: number) => {
  const api = createAuthenticatedApi();
  return api.delete(`/dictionary/${id}`);
};

// 👥 GET all contributors
export const getContributors = () => {
  const api = createAuthenticatedApi();
  return api.get('/contributors');
};

// 🔐 Login
export const loginUser = (username: string, password: string) => {
  const api = axios.create({ baseURL: `${API_BASE}/api` });
  return api.post('/login', { username, password });
};

// tickets
export const createTicket = (data: {
  name: string;
  email: string;
  department: string;
  urgency: string;
  description: string;
}) => {
  const api = createAuthenticatedApi();
  return api.post('/ticket', data);
};



