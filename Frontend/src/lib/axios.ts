// src/lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8080/api', // change if different
  withCredentials: true, // if backend uses cookies for auth
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;