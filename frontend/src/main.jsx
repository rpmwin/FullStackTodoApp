import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Todo from "./components/Todo.jsx";
import Signup from "./components/Signup.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import OAuthSuccess from "./components/OAuthSuccess.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/*" element={<App />}>
                    <Route path="login" element={<Login />}></Route>
                    <Route path="signup" element={<Signup />}></Route>
                    <Route path="oauth-success" element={<OAuthSuccess />} />
                    <Route
                        path="todo"
                        element={
                            <PrivateRoute>
                                <Todo />
                            </PrivateRoute>
                        }
                    ></Route>
                </Route>
            </Routes>
        </AuthProvider>
    </BrowserRouter>
    // </StrictMode>
);
