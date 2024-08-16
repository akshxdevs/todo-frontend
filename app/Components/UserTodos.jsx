import axios from "axios";
import { useEffect, useState } from "react";
import '../Styles/UserTodos.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import logo from './assets/list_1187525.png'

export const UserTodos = () => {
    const username = localStorage.getItem("username");
    const userid = localStorage.getItem("userId");
    const [showTodos, setShowTodos] = useState(false);
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [showCreateTodo, setShowCreateTodo] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState('');
    const [newDueDate, setNewDueDate] = useState('');
    const [reminder, setReminder] = useState(false);
    const [manualDate, setManualDate] = useState(false);
    const [newTodoDescription, setNewTodoDescription] = useState('');
    const [editTitleId, setEditTitleId] = useState(null);
    const [editDescriptionId, setEditDescriptionId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filtering, setFiltering] = useState(false);
    const [filterReminder, setFilterReminder] = useState(false);
    const [filterDueDate, setFilterDueDate] = useState('');

    const navigate = useNavigate();

    const handleDone = async (todoid) => {
        try {
            const res = await axios.put(`http://13.236.193.198:3000/todos/${todoid}`);
            setTodos(prevTodos => prevTodos.map(todo =>
                todo._id === todoid ? { ...todo, done: true } : todo 
            ));
            if (res.status===200) {
                toast.success("Marked done sucessfully!!")
                window.location.reload();
            }else{
                toast.error("Error!!!404")
            }
            
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    }

    const handleTodos = async () => {
        try {
            const res = await axios.get(`http://13.236.193.198:3000/todos/${userid}`);
            setTodos(res.data);
            setFilteredTodos(res.data);
            setShowTodos(true);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    }

    useEffect(() => {
        handleTodos();
    }, []);

    const handleLogout = () => {
        if (window.confirm("Do you want to logout?")) {
            localStorage.clear();
            navigate("/");
        } else {
            console.log("Logout canceled.");
        }
    }

    const handleDeleteTodo = async (todoid) => {
        try {
            const res = await axios.delete(`http://13.236.193.198:3000/todos/${todoid}`);
            if (res.status === 200) {
                setTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoid));
                setFilteredTodos(prevTodos => prevTodos.filter(todo => todo._id !== todoid));
                toast.success("Deleted successfully");
            } else {
                toast.error("Failed to delete todo");
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
            toast.error("An error occurred while deleting todo");
        }
    }

    const handleCreateTodo = async () => {
        try {
            const res = await axios.post(`http://13.236.193.198:3000/todos`, {
                title: newTodoTitle,
                description: newTodoDescription,
                dueDate: newDueDate,
                reminder: reminder,
                userId: userid
            });
            if (res.status === 201) {
                setTodos([...todos, res.data.Todo]);
                setFilteredTodos([...todos, res.data.Todo]);
                toast.success("Todo created successfully");
                setShowCreateTodo(false);
                setNewTodoTitle('');
                setNewTodoDescription('');
                setNewDueDate('');
                setManualDate(false);
                setReminder(false);
            } else {
                toast.error("Failed to create todo");
            }
        } catch (error) {
            console.error("Error creating todo:", error);
            toast.error("An error occurred while creating todo");
        }
    }

    const handleEdittedTodos = async (todoid) => {
        try {
            const res = await axios.put(`http://13.236.193.198:3000/edittodos/${todoid}`, {
                title: newTodoTitle,
                description: newTodoDescription,
            });
            if (res.status === 200) {
                handleTodos();
                toast.success("Todo edited successfully");
                setEditTitleId(null);
                setEditDescriptionId(null);
            } else {
                toast.error("Failed to edit todo");
            }
        } catch (error) {
            console.error("Error updating todo:", error);
            toast.error("An error occurred while updating the todo");
        }
    }

    const handleReminder = () => {
        setReminder(prev => !prev);
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredTodos(todos);
        } else {
            setFilteredTodos(todos.filter(todo =>
                todo.title.toLowerCase().includes(query.toLowerCase())
            ));
        }
    }

    const handleFilterSubmit = () => {
        let filtered = todos;
        if (filterReminder) {
            filtered = filtered.filter(todo => todo.reminder === filterReminder);
        }
        if (filterDueDate) {
            filtered = filtered.filter(todo => todo.dueDate.toLowerCase() === filterDueDate.toLowerCase());
        }
        setFilteredTodos(filtered);
        setFiltering(false);
    }

    const auth = localStorage.getItem("token");

    return (
        <div className="main-container">
            {auth ? (
                <div className="submain-container">
                    <h3 className="welcome">Welcome {showTodos ? "back " : ""}👋{username}</h3>
                    <img
                        width="48"
                        height="48"
                        src="https://img.icons8.com/fluency-systems-regular/48/exit--v1.png"
                        alt="logout"
                        className="logout-img"
                        onClick={handleLogout}
                        style={{ cursor: 'pointer' }}
                    /><br />
                    <button className="createTodo-btn" onClick={() => setShowCreateTodo(!showCreateTodo)}>Create Todo</button><br /><br />
                    {showCreateTodo && (
                        <div className="showCreateTodo-container">
                            {reminder && <h3>🔔</h3>}
                            <input 
                                className="showCreateTodo-container"
                                type="text"
                                placeholder="Title"
                                value={newTodoTitle}
                                onChange={(e) => setNewTodoTitle(e.target.value)}
                            />
                            <input
                                className="showCreateTodo-container"
                                type="text"
                                placeholder="Description"
                                value={newTodoDescription}
                                onChange={(e) => setNewTodoDescription(e.target.value)}
                            />
                            <br />
                            <label className="showCreateTodo-container">Due Date:</label>
                            <div className="showCreateTodo-container">
                                <input
                                    type="radio"
                                    onChange={() => setNewDueDate("Today")}
                                />
                                <label>Today</label>
                                <input
                                    type="radio"
                                    onChange={() => setNewDueDate("Tomorrow")}
                                />
                                <label>Tomorrow</label>
                            </div>
                            <button className="showCreateTodo-container" onClick={() => setManualDate(!manualDate)}>Set Manually</button>
                            {manualDate && (
                                <input
                                    type="date"
                                    value={newDueDate}
                                    onChange={(e) => setNewDueDate(e.target.value)}
                                />
                            )}
                            <br />
                            <button className="showCreateTodo-container" onClick={handleReminder}>Set Reminder</button>
                            <br />
                            <button className="showCreateTodo-container" onClick={handleCreateTodo}>Submit</button>
                        </div> 
                    )}<br />
                    <input type="text" placeholder="Search todos by title" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} />
                    <img width="20" height="20" src="https://img.icons8.com/ios/50/filter--v1.png" alt="filter" onClick={()=>{setFiltering(!filtering)}}/>
                    {filtering && (
                        <div className="showCreateTodo-container">
                            <label htmlFor="reminder">Reminder:</label>
                            <input type="checkbox" checked={filterReminder} onChange={(e) => setFilterReminder(e.target.checked)} />
                            <label htmlFor="dueDate">Due Date:</label>
                            <select onChange={(e) => setFilterDueDate(e.target.value)}>
                                <option value="">Select</option>
                                <option value="Today">Today</option>
                                <option value="Tomorrow">Tomorrow</option>
                            </select>
                            <button onClick={handleFilterSubmit}>Submit</button>
                        </div>
                    )}
                    
                    <div>
                        {filteredTodos.length === 0 ? (
                            <p>No todos available.</p>
                        ) : (
                            filteredTodos.map((todo) => (
                                <div key={todo._id}>
                                    {todo.reminder && <p>🔔</p>}
                                    <h4 className={todo.done ? 'strikethrough' : ''}>
                                        {todo.title}{" "}
                                        <button onClick={() => setEditTitleId(todo._id)}>🖋️</button>
                                    </h4>
                                    
                                    {editTitleId === todo._id && (
                                        <form onSubmit={(e) => { e.preventDefault(); handleEdittedTodos(todo._id); }}>
                                            <input
                                                type="text"
                                                placeholder="Title"
                                                value={newTodoTitle}
                                                onChange={(e) => setNewTodoTitle(e.target.value)}
                                            />
                                            <button type="submit">done</button>
                                        </form>
                                    )}
                                    
                                    <p className={todo.done ? 'strikethrough' : ''}>
                                        {todo.description}{" "}
                                        <button onClick={() => setEditDescriptionId(todo._id)}>🖋️</button>
                                    </p>
                                    
                                    {editDescriptionId === todo._id && (
                                        <form onSubmit={(e) => { e.preventDefault(); handleEdittedTodos(todo._id); }}>
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={newTodoDescription}
                                                onChange={(e) => setNewTodoDescription(e.target.value)}
                                            />
                                            <button type="submit">done</button>
                                        </form>
                                    )}
                                    
                                    <p className={todo.done ? 'strikethrough' : ''}>Due Date: {todo.dueDate}</p>
                                    <p className={todo.done ? 'strikethrough' : ''}>Created Date: {todo.todoCreatedDate}</p>
                                    {!todo.done && (
                                        <button onClick={() => handleDone(todo._id)}>Done</button>
                                    )}
                                    <button onClick={() => handleDeleteTodo(todo._id)}>Delete</button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <h1>Loading......</h1>
            )}
            <ToastContainer />
        </div>
    );
}
