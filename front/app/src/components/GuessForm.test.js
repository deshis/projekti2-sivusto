import React from 'react'
import { fireEvent, getByText, render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import GuessForm from './GuessForm'
import userEvent from '@testing-library/user-event'

test('GuessForm updates parent state and calls on submit', async () => {
    const user = userEvent.setup()
    const createGuess = jest.fn()

    render(<GuessForm createGuess={createGuess} options={[]}/>)
  
    const input = screen.getByRole('textbox')
    const sendButton = screen.getByText('submit')
  
    await user.type(input, 'monkey?')
    await user.click(sendButton)
  
    expect(createGuess.mock.calls).toHaveLength(1)
    expect(createGuess.mock.calls[0][0].monkey).toBe('monkey?')
    
})

test('GuessForm updates autocomplete correctly', async () => {
    const user = userEvent.setup()
    const createGuess = jest.fn()
    const options = [
        "Dart Monkey",
        "Boomerang Monkey",
        "Bomb Shooter",
        "Tack Shooter",
        "Ice Monkey",
        "Glue Gunner",
        "Sniper Monkey",
        "Monkey Sub",
        "Monkey Buccaneer",
        "Monkey Ace",
        "Heli Pilot",
        "Mortar Monkey",
        "Dartling Gunner",
        "Wizard Monkey",
        "Super Monkey",
        "Ninja Monkey",
        "Alchemist",
        "Druid",
        "Banana Farm",
        "Spike Factory",
        "Monkey Village",
        "Engineer Monkey",
        "Beast Handler"
    ]

    Element.prototype.scrollIntoView = jest.fn();

    render(<GuessForm createGuess={createGuess} options={options}/>)
  
    const input = screen.getByPlaceholderText("Who's that monkey ⁉️");
    
    await user.type(input, 'bo');
    expect(screen.getByText('Boomerang Monkey')).toBeInTheDocument();
    expect(screen.getByText('Bomb Shooter')).toBeInTheDocument();
})