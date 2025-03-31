import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

import { useQuery,useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
  const dispatch = useNotificationDispatch()

  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({ 
    mutationFn: updateAnecdote,
    onSuccess:(updatedAnecdote) =>{
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
      console.log(updatedAnecdote)
      dispatch({type: "VOTE", payload: updatedAnecdote.content})
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })

  if ( result.isLoading ) {
    return <div>connecting to server</div>
  }

  if (result.isError) {
    return <div>anecdote app not available due to problems in server</div>
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    const updatedAnecdote = {
      ...anecdote,
      votes: anecdote.votes +1
    }
    newAnecdoteMutation.mutate(updatedAnecdote)
  }

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
