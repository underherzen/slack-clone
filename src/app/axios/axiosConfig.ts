import { default as axiosBase } from 'axios';

export const API_BASE = process.env.REACT_APP_API_URL;

export const axios = axiosBase.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
  },
});
