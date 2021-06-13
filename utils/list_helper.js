var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    var totalLikes = blogs.reduce(function(tot, blog) {
        return tot + blog.likes;
    },0);
    return totalLikes
}  

const favoriteBlog = (blogs) => {
    return blogs.reduce((maxLikes, likes) => !maxLikes || maxLikes.likes < likes.likes ? likes : maxLikes, null);
}  

const mostBlogsByAuthor = (blogs) => {
    var byAuthor = _.countBy(blogs,'author')
    var arrByAuthor = []
    var maxCount = 0
    _.each(byAuthor, (value, key) => {
        arrByAuthor[value] = key
        maxCount = value>maxCount ? value : maxCount
    })
    return arrByAuthor[maxCount]
}

const mostLikesByAuthor = (blogs) => {
    var byAuthor = _.groupBy(blogs,'likes')
    var maxLikes = 0
    _.forEach(byAuthor, (value, key) => {
        maxLikes = key>maxLikes ? value[0].likes : maxLikes
    })
    _.forEach(byAuthor, (value, key) => {
        if(key==maxLikes) { 
            console.log(value[0].author)
            return value[0].author
        }
    })
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogsByAuthor, mostLikesByAuthor
}