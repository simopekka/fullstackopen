const Persons = ({persons, filter, deletePerson}) => {
    return (
      <>
        {persons.filter((person) =>
          person.name.toUpperCase().includes(filter.toUpperCase()))
          .map(person => 
            <Person key={person.id} person={person} deletePerson={deletePerson}/> 
        )}
      </>
    )
  }
  
  const Person = ({person, deletePerson}) => {
    return (
      <p key={person.id}>{person.name} {person.number}
        <button onClick={() => deletePerson(person.id)}>delete</button> 
      </p>
    )
  }

  export default Persons