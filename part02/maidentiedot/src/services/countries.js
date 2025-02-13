const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = () => {
    return fetch(`${baseUrl}api/all`)
        .then((response) => response.json())
        .then((data) => data);
}

export default { getAll }