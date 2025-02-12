const PersonForm = ({addName, newName, handleInputChange}) => {
    return (
      <form onSubmit={addName}>
        <div>name:<input name="name" value={newName.name} onChange={handleInputChange}/></div>
        <div>number:<input name="number" value={newName.number} onChange={handleInputChange}/></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
  }

  export default PersonForm