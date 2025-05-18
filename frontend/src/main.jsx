import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom";
import Login from "./components/Login.jsx";
import Todo from "./components/Todo.jsx";
import Signup from "./components/Signup.jsx";

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <BrowserRouter>
        <Routes>
            <Route path="/*" element={<App />}>
                <Route path="login" element={<Login />}></Route>
                <Route path="signup" element={<Signup />}></Route>
                <Route path="todo" element={<Todo />}></Route>
            </Route>
        </Routes>
    </BrowserRouter>
    // </StrictMode>
);
