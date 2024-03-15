import React from 'react'
import { fireEvent, getByText, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Login from './Login'
import userEvent from '@testing-library/user-event'

test('Login swithces correctly to sing up page', async () => {
    const user = userEvent.setup()
    const setUser = jest.fn()

    render(<Login setUser={setUser} />)
  
    var confirm = screen.queryByLabelText('confirm password:');
    expect(confirm).not.toBeInTheDocument();
    const button = screen.getByText("sing up?");
    
    await user.click(button);
    expect(screen.getByText('confirm password:')).toBeInTheDocument();
})

test("Send alert if confirm password isn't the same", async () => {
    const user = userEvent.setup();
    const setUser = jest.fn();

    render(<Login setUser={setUser} />)
    

    await user.click(screen.getByText("sing up?"));
    await user.type(screen.getByLabelText('password:'), 'password123');
    await user.type(screen.getByLabelText('confirm password:'), 'password321');
    await user.click(screen.getAllByRole('button')[0]);
    
    expect(screen.getByText('Make sure both passwords are the same!!!')).toBeInTheDocument();
})