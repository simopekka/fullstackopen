const dummy = (blogs) => {
  console.log(blogs)
  return 0
}

const totalLikes = (blogs) => {
  var total = 0
  for(var i = 0; i !== blogs.length; i++) {
    total += blogs[i].likes
  }
  return total
}

const favouriteBlog = (blogs) => {
  const mostLikes = blogs.reduce((previous, current) => {
    if(current.likes >= previous) {
      return current.likes
    } else {
      return previous
    }
  },0)
  var blog = blogs.find(blog => blog.likes === mostLikes)

  return blog
}
const _ = require('lodash')

const mostBlogs = (blogs) => {
  const blogCounts = _.countBy(blogs, 'author')
  const mostBlogs = _.maxBy(Object.keys(blogCounts), author => blogCounts[author])
  console.log(mostBlogs)
  const result = { author: mostBlogs, blogs: blogCounts[mostBlogs] }
  return result
}

const mostLikes = (blogs) => {
  const groupedByAuthor = _.groupBy(blogs, 'author')
  const totalLikesByAuthor = _.mapValues(groupedByAuthor, authorBlogs => _.sumBy(authorBlogs, 'likes'))
  const mostLikedAuthor = _.maxBy(Object.keys(totalLikesByAuthor), author => totalLikesByAuthor[author])
  const result = { author: mostLikedAuthor, likes: totalLikesByAuthor[mostLikedAuthor] }

  return result
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}