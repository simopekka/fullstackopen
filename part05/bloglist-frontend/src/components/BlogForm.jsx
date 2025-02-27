const AddBlog = ({ addNewBlog, newBlog, handleInputChange}) => {
  return (
    <form onSubmit={addNewBlog}>
      <div>
        title:
        <input name="title" value={newBlog.title} onChange={handleInputChange}/>
      </div>
      <div>
        author:
        <input name="author" value={newBlog.author} onChange={handleInputChange}/>
      </div>
      <div>
        url:
        <input name="url" value={newBlog.url} onChange={handleInputChange}/>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default AddBlog