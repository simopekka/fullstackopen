import { useSelector, useDispatch } from 'react-redux'
import { newVote } from '../reducers/anecdoteReducer'
import { setTemporaryMessage } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter === "") {
      return state.anecdotes
    } else {
      return state.anecdotes.filter((anecdote) => anecdote.content.toLowerCase().includes(state.filter))
    }
  })
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(newVote(anecdote.id))
    dispatch(setTemporaryMessage(`You voted for "${anecdote.content}"`))
  }

  return (
    <>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList