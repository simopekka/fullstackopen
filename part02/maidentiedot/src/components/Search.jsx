const Search = ({ handle }) => {
    return (
        <>
            <p>find countries <input type='text' onChange={handle}></input></p>
        </>
    )
}

export default Search