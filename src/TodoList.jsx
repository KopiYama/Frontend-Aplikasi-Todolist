import { useState, useEffect } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editStatus, setEditStatus] = useState(false);
    const [filterStatus, setFilterStatus] = useState(null);

    useEffect(() => {
        const url = filterStatus === null
            ? 'http://127.0.0.1:8080/api/todoitems'
            : `http://127.0.0.1:8080/api/todoitems?status=${filterStatus}`;

        fetch(url)
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, [filterStatus]);

    const handleAddTodo = (e) => {
        e.preventDefault();
        const newTodo = {
            title: newTitle,
            description: newDescription,
            status: false
        };
        fetch('http://127.0.0.1:8080/api/todoitems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTodo)
        })
            .then((response) => response.json())
            .then((addedTodo) => {
                setTodos([...todos, addedTodo]);
                setNewTitle('');
                setNewDescription('');
            })
            .catch((error) => console.error('Error adding todo:', error));
    };

    const handleUpdateTodo = (id) => {
        const updatedTodo = {
            title: editTitle,
            description: editDescription,
            status: editStatus
        };
        fetch(`http://127.0.0.1:8080/api/todoitems/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTodo)
        })
            .then((response) => response.json())
            .then(() => {
                setTodos(todos.map(todo => todo.id === id ? { ...todo, title: editTitle, description: editDescription, status: editStatus } : todo));
                setEditingId(null);
                setEditTitle('');
                setEditDescription('');
                setEditStatus(false);
            })
            .catch((error) => console.error('Error updating todo:', error));
    };

    const handleDeleteTodo = (id) => {
        fetch(`http://127.0.0.1:8080/api/todoitems/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                setTodos(todos.filter(todo => todo.id !== id));
            })
            .catch((error) => console.error('Error deleting todo:', error));
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold text-center mb-4">To-Do List</h1>

            <form onSubmit={handleAddTodo} className="mb-4">
                <input
                    type="text"
                    placeholder="Title"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2 mb-2"
                />
                <textarea
                    placeholder="Description"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full p-2 mb-2"
                ></textarea>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 mb-4">
                    Add Todo
                </button>
            </form>

            <div className="flex justify-center mb-4">
                <button onClick={() => setFilterStatus(null)} className="bg-gray-500 text-white p-2 mx-1">
                    All
                </button>
                <button onClick={() => setFilterStatus(true)} className="bg-green-500 text-white p-2 mx-1">
                    Complete
                </button>
                <button onClick={() => setFilterStatus(false)} className="bg-yellow-500 text-white p-2 mx-1">
                    Pending
                </button>
            </div>

            <ul className="divide-y divide-gray-200">
                {todos.map((todo) => (
                    <li key={todo.id} className="py-4">
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                {editingId === todo.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editTitle}
                                            onChange={(e) => setEditTitle(e.target.value)}
                                            className="text-lg font-semibold p-1"
                                        />
                                        <textarea
                                            value={editDescription}
                                            onChange={(e) => setEditDescription(e.target.value)}
                                            className="text-gray-500 p-1"
                                        ></textarea>
                                        <div>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={editStatus}
                                                    onChange={(e) => setEditStatus(e.target.checked)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="ml-2">Completed</span>
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-lg font-semibold">{todo.title}</p>
                                        <p className="text-gray-500">{todo.description}</p>
                                        <p>Status: {todo.status ? 'Completed' : 'Pending'}</p>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center">
                                {editingId === todo.id ? (
                                    <button
                                        onClick={() => handleUpdateTodo(todo.id)}
                                        className="bg-green-500 text-white p-1 mr-2"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => {
                                                setEditingId(todo.id);
                                                setEditTitle(todo.title);
                                                setEditDescription(todo.description);
                                                setEditStatus(todo.status);
                                            }}
                                            className="bg-yellow-500 text-white p-1 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTodo(todo.id)}
                                            className="bg-red-500 text-white p-1 mr-2"
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

    );
}

export default TodoList;