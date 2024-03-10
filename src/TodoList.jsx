import React, { useState, useEffect } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        // Fetch data dari API backend Anda
        fetch('http://127.0.0.1:8080/api/todoitems')
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold text-center mb-4">To-Do List</h1>
            <ul className="divide-y divide-gray-200">
                {todos.map((todo) => (
                    <li key={todo.id} className="py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <p className="text-lg font-semibold">{todo.title}</p>
                                <p className="text-gray-500">{todo.description}</p>
                            </div>
                            <div>
                                <input
                                    type="checkbox"
                                    checked={todo.status}
                                    readOnly
                                    className="w-4 h-4"
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TodoList;