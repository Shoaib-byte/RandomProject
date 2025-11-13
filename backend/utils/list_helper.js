const dummy = (blogs) => {
    return 1
  }

const totalLikes = (blogs) => {
  if(blogs.length === 0){
    return 0
  } else if (blogs.length === 1){
    return blogs.likes
  }else{
    return blogs.reducer((sum, blog) => {
        return sum + blog.likes
    }, 0)
  }
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => {
     return  blog.likes >= max.likes ? blog : max
  },blogs[0])
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }