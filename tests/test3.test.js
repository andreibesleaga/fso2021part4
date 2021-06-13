const listHelper = require('../utils/list_helper')

  describe('max likes - favorite blog', () => {
    const listWithTwoBlogs = [
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 2,
        __v: 0
      },
      {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful 2',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful2.html',
        likes: 10,
        __v: 0
      }
    ]
  
    test('when list has two blogs, the max likes of that ', () => {
      const result = listHelper.favoriteBlog(listWithTwoBlogs)
      expect(result).toEqual(listWithTwoBlogs[1])
    })
  })