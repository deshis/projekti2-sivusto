import Users from '../services/Users';
import { useState } from 'react';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (event) => {
        event.preventDefault();
        Users.login(username, password).then((data) => {
            setUser(data);
        }).catch(error => alert(error.message));
    }

    return (
        <form className="loginForm" onSubmit={handleLogin}>
            <label>username:</label><input value={username} onChange={(text)=>setUsername(text.target.value)}></input>
            <label>password:</label><input type="password" value={password} onChange={(text)=>setPassword(text.target.value)}></input>
            <button type="submit">login</button>
        </form>
    )
}

export default Login;