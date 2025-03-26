/* eslint-disable no-case-declarations */
const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case 'NEW_VOTE':
      const id = action.payload.id
      const anecdoteToFind = state.find(a => a.id === id)
      console.log(anecdoteToFind)
      const changedAnecdote = {
        ...anecdoteToFind,
        votes: anecdoteToFind.votes + 1
      }
      return sortAnecdotes(state.map(anecdote => 
        anecdote.id !== id ? anecdote : changedAnecdote
      ))
    case 'NEW_ANECDOTE':
      return state.concat(action.payload)
    default:
      return state
  }
}

export const newVote = (id) => {
  return {
    type:'NEW_VOTE',
    payload: { id }
  }
}

export const newAnecdote = (anecdote) => {
  return {
    type: 'NEW_ANECDOTE',
    payload: {
      content: anecdote,
      id: getId(),
      votes: 0
    }
  }
}

const sortAnecdotes = ( anecdotes ) => {
  return anecdotes.sort((a,b) => b.votes - a.votes)
}

export default reducer