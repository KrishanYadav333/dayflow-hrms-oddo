const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const config = {
  API_BASE_URL,
  API_ENDPOINTS: {
    AUTH: {
      SIGNUP: `${API_BASE_URL}/auth/signup`,
      SIGNIN: `${API_BASE_URL}/auth/signin`,
    },
    EMPLOYEE: {
      PROFILE: `${API_BASE_URL}/employee/profile`,
      ALL: `${API_BASE_URL}/employee/all`,
      UPDATE: (id) => `${API_BASE_URL}/employee/${id}`,
    },
    ATTENDANCE: {
      CHECKIN: `${API_BASE_URL}/attendance/checkin`,
      CHECKOUT: `${API_BASE_URL}/attendance/checkout`,
      MY: `${API_BASE_URL}/attendance/my`,
      ALL: `${API_BASE_URL}/attendance/all`,
    },
    LEAVE: {
      APPLY: `${API_BASE_URL}/leave/apply`,
      MY: `${API_BASE_URL}/leave/my`,
      ALL: `${API_BASE_URL}/leave/all`,
      UPDATE_STATUS: (id) => `${API_BASE_URL}/leave/${id}/status`,
    },
  },
};

export default config;
