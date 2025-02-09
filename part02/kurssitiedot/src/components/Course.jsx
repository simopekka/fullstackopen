const Course = ({ course }) => {
    return (
        <>
            <Header name={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </>
    )
}
  
const Header = ({ name }) => {
    return <h3>{name}</h3>
}
  
const Content = ({ parts }) => {
    console.log(parts)
    return (
        <div>
        {parts.map(part =>
            <Part key={part.id} name={part.name} exercises={part.exercises} />
        )}
        </div>
    )
}
  
const Part = (props) => {
    return <p>{props.name} {props.exercises}</p>
}
  
const Total = ({ parts }) => {
    const total = parts.reduce((s, p) => (s = s + p.exercises), 0)
    return <h4>total of {total} exercises</h4>
}

export default Course