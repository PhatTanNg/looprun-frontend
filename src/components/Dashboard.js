import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [distance, setDistance] = useState('');
    const [total, setTotal] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            fetchTotal();
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleAddDistance = async () => {
        const km = parseFloat(distance);
        if (isNaN(km) || km <= 0) {
            alert('Please enter a valid distance in kilometers!');
            return;
        }

        const token = localStorage.getItem('token');

        try {
            const res = await fetch('https://looprun-backend.onrender.com/api/track', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ distance: km })
            });

            const data = await res.json();
            if (res.ok) {
                alert('Tracking saved!');
                setDistance('');
                fetchTotal();
            } else {
                alert(data.message);
            }
        } catch (err) {
            alert('System error!');
            console.log(err);
        }
    };

    const fetchTotal = async () => {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('https://looprun-backend.onrender.com/api/track', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                const totalKm = data.reduce((acc, item) => acc + item.distance, 0);
                setTotal(totalKm);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <h2>Welcome to LoopRun!</h2>
            <p>Total distance run: {total} km</p>

            <input
                placeholder="Enter distance (km)"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
            />
            <button onClick={handleAddDistance}>Submit</button>

            <br /><br />
            <button onClick={handleLogout}>Log out</button>
        </div>
    );
}
