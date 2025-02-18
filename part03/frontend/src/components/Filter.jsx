const Filter = ({filter, filterInput}) => {
    return (
      <div>filter shown with
        <input 
            name="filter"
            value={filter}
            onChange={filterInput}
        />
      </div>
    )
  }

  export default Filter