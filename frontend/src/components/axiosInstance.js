import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // fixed URL
    withCredentials: true,
});

// Automatically add access token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// If 401 error, try refreshing token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            (error.response?.status === 401 ||
                error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(
                    "http://localhost:5000/refresh",
                    {},
                    { withCredentials: true }
                );
                const newAccessToken = res.data.accessToken;

                localStorage.setItem("accessToken", newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest); // retry original request
            } catch (err) {
                console.error("Refresh token failed. Redirect to login.");
                console.log(err);
                setTimeout(() => {
                    console.log("error: ", err);
                    // window.location.href = "/login"; // ✅ Use this instead of useNavigate
                }, 3000);
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
