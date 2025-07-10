import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [distance, setDistance] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/');
        else fetchTotal();
    }, [navigate]);

    const fetchTotal = async () => {
        const res = await fetch('https://looprun-backend.onrender.com/api/track', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
            const sum = data.reduce((acc, item) => acc + item.distance, 0);
            setTotal(sum);
        }
    };

    const handleAdd = async () => {
        const km = parseFloat(distance);
        if (isNaN(km) || km <= 0) return alert('Invalid distance');
        
        await fetch('https://looprun-backend.onrender.com/api/track', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ distance: km })
        });
        setDistance('');
        fetchTotal();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome to LoopRun!</h1>
            <p style={styles.subtitle}>Total distance run: <b>{total} km</b></p>

            <input
                style={styles.input}
                placeholder="Enter distance (km)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
            />
            <button style={styles.button} onClick={() => navigate('/planner')}>Plan a Run</button>
            <button style={styles.button} onClick={handleAdd}>Submit</button>
            <button style={styles.logout} onClick={handleLogout}>Log out</button>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: 300,
        margin: '50px auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: 'sans-serif'
    },
    title: {
        textAlign: 'center',
        marginBottom: 20
    },
    subtitle: {
        marginBottom: 15
    },
    input: {
        width: '100%',
        padding: 8,
        marginBottom: 10,
        border: '1px solid #ccc',
        borderRadius: 4
    },
    button: {
        width: '100%',
        padding: 10,
        backgroundColor: '#007BFF',
        color: 'white',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        marginBottom: 10
    },
    logout: {
        width: '100%',
        padding: 10,
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer'
    }
};
