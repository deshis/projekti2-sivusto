import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import GuessForm from './GuessForm'
import userEvent from '@testing-library/user-event'

test('GuessForm updates parent state and calls on submit', async () => {
    const user = userEvent.setup()
    const createGuess = jest.fn()

    render(<GuessForm createGuess={createGuess} options={[]}/>)
  
    const input = screen.getByRole('textbox')
    const sendButton = screen.getByText('enter')
  
    await user.type(input, 'monkey?')
    await user.click(sendButton)
  
    expect(createGuess.mock.calls).toHaveLength(1)
    expect(createGuess.mock.calls[0][0]).toBe('monkey?')
    
})