import Users from '../services/Users';
import { useState } from 'react';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = (event) => {
        event.preventDefault();
        Users.login(username, password).then((data) => {
            setUser(data);
        }).catch(error => alert(error.message));
    }

    const handleSingUp = (event) => {
        event.preventDefault();
        if(password !== confirmPassword) alert('Make sure both passwords are the same!')
        else{
            Users.signUp(username, password).then((data) => {
                console.log(data);
            }).catch(error => alert(error.message));
        }
    }

    const switchForm = (value) => {
        setIsSignUp(value);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    }

    return (
        <div>
            {isSignUp ? (
                    <div>
                        <form className="loginForm" onSubmit={handleSingUp}>
                            <label>username:</label><input value={username} onChange={(text)=>setUsername(text.target.value)}></input>
                            <label>password:</label><input type="password" value={password} onChange={(text)=>setPassword(text.target.value)}></input>
                            <label>confirm password:</label><input type="password" value={confirmPassword} onChange={(text)=>setConfirmPassword(text.target.value)}></input>
                            <button type="submit">sing up</button>
                        </form>
                        <button onClick={()=>switchForm(false)}>log in...</button>
                    </div>
            ) : (
            <div>
                <form className="loginForm" onSubmit={handleLogin}>
                    <label>username:</label><input value={username} onChange={(text)=>setUsername(text.target.value)}></input>
                    <label>password:</label><input type="password" value={password} onChange={(text)=>setPassword(text.target.value)}></input>
                    <button type="submit">login</button>
                </form>
                <button onClick={()=>switchForm(true)}>sing up?</button>
            </div>
            )}
        </div>
    )
}

export default Login;