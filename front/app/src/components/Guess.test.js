import React from 'react'
import { render, screen } from '@testing-library/react'
import Guess from './Guess'
import '@testing-library/jest-dom'

test('Guess outputs as correct if the guess equals the answer.', async () => {
    const guess = 'sniper monkey'
    const answer = 'sniper monkey'

    render(<Guess guess={guess} answer={answer}/>)
    expect(screen.queryByText(guess+'✅')).toBeInTheDocument()
})

test('Guess outputs as incorrect if the guess does not equal the answer.', async () => {
    const guess = 'sniper monkey'
    const answer = 'engineer monkey'

    render(<Guess guess={guess} answer={answer}/>)
    expect(screen.queryByText(guess+'❌')).toBeInTheDocument()
})

test('Guess outputs as incorrect if the guess is empty.', async () => {
    const guess = ''
    const answer = 'engineer monkey'

    render(<Guess guess={guess} answer={answer}/>)
    expect(screen.queryByText(guess+'❌')).toBeInTheDocument()
})