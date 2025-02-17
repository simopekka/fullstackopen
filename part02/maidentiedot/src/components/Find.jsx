import Country from './Country'
import Show from "./Show"

const Find = ({ countries, input, handle }) => {
    const filtered = countries.filter((country) =>
        country.name.common.toUpperCase().includes(input.toUpperCase()))
    
    if (filtered.length < 10 && filtered.length > 1) {
        console.log(filtered)
        return (
            <table>
                <tbody>
                    {filtered.map(country => 
                        <tr key={country.name.common}>
                            <td>{country.name.common}</td>
                            <td><Show country={country.name.common} handle={handle}/></td>
                        </tr>
                    )}
                </tbody>
            </table>
        )
    } else if (filtered.length === 1) {
        return (
                <Country country={filtered[0]} />
        )
    } else {
        return (
            <p>Too many matches, specify another filter</p>
        )
    }
}

export default Find