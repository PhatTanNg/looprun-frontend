import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const res = await fetch('https://looprun-backend.onrender.com/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            navigate('/');
        } else {
            alert(data.message || 'Registration failed.');
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Create Your LoopRun Account</h1>

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

            <label style={styles.label}>Confirm Password</label>
            <input
                style={styles.input}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button style={styles.button} onClick={handleRegister}>Register</button>

            <p style={styles.footer}>
                Already have an account? <span style={styles.link} onClick={() => navigate('/')}>Login</span> here
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
