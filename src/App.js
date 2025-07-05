import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Welcome to LoopRun</h2>
            <button onClick={() => navigate('/register')}>Register</button>
            <button onClick={() => navigate('/login')}>Sign in</button>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}
