const Country = ({ country }) => {
    console.log(country)
    return (
        <>
            <h2>{country.name.common}</h2>
            <table>
                <tbody>
                    <tr>
                        <td>capital</td>
                        <td>{country.capital}</td>
                    </tr>
                    <tr>
                        <td>region</td>
                        <td>{country.region}</td>
                    </tr>
                    <tr>
                        <td>area</td>
                        <td>{country.area}</td>
                    </tr>
                </tbody>
            </table>
            <h3>languages</h3>
            <ul>
                {Object.values(country.languages).map(language => 
                    <li key={language}>{language}</li>
                )}
            </ul>
            <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="200px" />

        </>
    )
}

export default Country