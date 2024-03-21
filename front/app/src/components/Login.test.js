import React from 'react'
import { render, screen, act } from '@testing-library/react'
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

