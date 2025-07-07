import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const res = await fetch('https://looprun-backend.onrender.com/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } else {
            alert(data.message);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Welcome<br />To<br />LoopRun</h1>
            
            <label style={styles.label}>Email Address</label>
            <input
                style={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <label style={styles.label}>Password</label>
            <input
                style={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button style={styles.button} onClick={handleLogin}>Login</button>

            <p style={styles.footer}>
                Don't have an account? <span style={styles.link} onClick={() => navigate('/register')}>Sign up</span> here
            </p>
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
    label: {
        alignSelf: 'flex-start',
        marginTop: 10
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
        marginTop: 10
    },
    footer: {
        marginTop: 15,
        fontSize: 12
    },
    link: {
        color: '#007BFF',
        cursor: 'pointer',
        textDecoration: 'underline'
    }
};
