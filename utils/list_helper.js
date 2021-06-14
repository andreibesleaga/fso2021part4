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
    var rauthor = ''
    _.forEach(byAuthor, (value, key) => {
        if(key>maxLikes) {
            maxLikes = value[0].likes
            rauthor = value[0].author
        }
    })
    return rauthor
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogsByAuthor, mostLikesByAuthor
}