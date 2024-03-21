import Users from '../services/Users';
import { useState } from 'react';

const Login = ({ setUser, setNotification }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = (event) => {
        event.preventDefault();
        Users.login(username, password).then((data) => {
            setUser(data);
            Users.setToken(data.token);
            window.localStorage.setItem(
                'loggedUser', JSON.stringify(data)
            )
        }).catch(error => setNotification(error.response.data.error));
    }

    const handleSingUp = (event) => {
        event.preventDefault();
        if(password !== confirmPassword){
            setNotification("Make sure both passwords are the same!");
        }else{
            Users.signUp(username, password).then((data) => {
                Users.login(username, password).then((data) => {
                    setUser(data);
                    Users.setToken(data.token);
                    window.localStorage.setItem(
                        'loggedUser', JSON.stringify(data)
                    )
                }).catch(error => setNotification(error.response.data.error));
            }).catch(error => setNotification(error.response.data.error));
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
                            <label htmlFor="username">username:</label><input id="username" value={username} onChange={(text)=>setUsername(text.target.value)}></input>
                            <label htmlFor="password">password:</label><input id="password" type="password" value={password} onChange={(text)=>setPassword(text.target.value)}></input>
                            <label htmlFor="conPassword">confirm password:</label><input id="conPassword" type="password" value={confirmPassword} onChange={(text)=>setConfirmPassword(text.target.value)}></input>
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