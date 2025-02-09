import { useState } from 'react'

const Header = ({text}) => (
  <h2>{text}</h2>
)

const Text = ({text, vote}) => (
  <table>
    <tbody>
      <tr>
        <td>{text}</td>
      </tr>
      <tr>
        <td>has {vote} votes</td>
      </tr>
    </tbody>
  </table>
)

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
)

const App = () => {

  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(Array(9).fill(0))
  const highest = Math.max(...vote)
  const top = vote.indexOf(highest)

  const handleClick = () => {
    const randomNumber = Math.floor(Math.random() * anecdotes.length)
    console.log(randomNumber)
    setSelected(randomNumber)
  }

  const handleVote = () => {
    console.log(selected, vote)
    const updatedVotes = [...vote]
    updatedVotes[selected] += 1
    setVote(updatedVotes)
  }
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  return (
    <div>
      <Header text='Anecdote of the day'/>
      <Text text={anecdotes[selected]} vote={vote[selected]}/>
      <Button handleClick={handleVote} text='vote'/>
      <Button handleClick={handleClick} text='next anecdote'/>
      <Header text='Anecdote with most votes'/>
      <Text text={anecdotes[top]} vote={vote[top]}/>
    </div>
  )
}

export default App