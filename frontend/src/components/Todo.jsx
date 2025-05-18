    // src/components/Todo.jsx
    import React, { useState, useEffect } from "react";
    import toast from "react-hot-toast";
    import axiosInstance from "./axiosInstance";

    function Todo() {
        const [todos, setTodos] = useState([]);
        const [newTodo, setNewTodo] = useState("");
        const [loadingTodos, setLoadingTodos] = useState(false);

        // 1) Fetch all todos on mount
        useEffect(() => {
            const fetchTodos = async () => {
                setLoadingTodos(true);
                try {
                    const res = await axiosInstance.get("/todos");
                    setTodos(res.data.todos || []); // expecting { todos: [...] }
                } catch (err) {
                    console.error("Failed to load todos", err);
                    toast.error("Could not load todos.");
                } finally {
                    setLoadingTodos(false);
                }
            };

            fetchTodos();
        }, []);

        // 2) Create a new todo
        const handleCreateTodo = async () => {
            if (!newTodo.trim()) {
                toast.error("Please enter a todo");
                return;
            }

            try {
                const res = await toast.promise(
                    axiosInstance.post("/newTodo", { data: newTodo }),
                    {
                        loading: "Adding todo…",
                        success: "Added! 🎉",
                        error: "Failed to add todo",
                    }
                );

                // Assuming API returns the created todo as `res.data.todo`
                if (res.status === 200 && Array.isArray(res.data.todos)) {
                    setTodos(res.data.todos); // ← update your todos array
                    setNewTodo("");
                } else {
                    throw new Error("Unexpected response");
                }
            } catch (err) {
                console.error(err);
            }
        };

        return (
            <div className="max-w-md mx-auto p-4">
                <h1 className="text-2xl font-bold text-center mb-4">Todo App</h1>

                {/* Input + Create */}
                <div className="flex gap-2 mb-6">
                    <input
                        className="flex-1 p-2 border rounded"
                        type="text"
                        placeholder="Enter new todo"
                        value={newTodo}
                        onChange={(e) => setNewTodo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateTodo()}
                    />
                    <button
                        className="px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={handleCreateTodo}
                    >
                        Create
                    </button>
                </div>

                {/* List */}
                <div>
                    <h3 className="text-xl mb-2">All Todos</h3>
                    {loadingTodos ? (
                        <p>Loading…</p>
                    ) : todos.length === 0 ? (
                        <p>No todos yet.</p>
                    ) : (
                        <ul className="space-y-2">
                            {todos.map((todo) => (
                                <li
                                    key={todo._id}
                                    className="p-2 border rounded flex items-center justify-between"
                                >
                                    <span>{todo.data}</span>
                                    {/* You could add a delete button here later */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        );
    }

    export default Todo;
