const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.likes;
      }, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  let max = -Infinity;
  let key;
  blogs.forEach((blog, k) => {
    if (max < blog.likes) {
      max = blog.likes;
      key = k;
    }
  });

  const mostFavBlog = blogs[key];
  return {
    title: mostFavBlog.title,
    author: mostFavBlog.author,
    likes: mostFavBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else if (blogs.length === 1) {
    return { author: blogs[0].author, blogs: 1 };
  } else {
    const groupedAuthor = blogs.reduce((accumulator, currentValue) => {
      const existedAuthorIndex = accumulator.findIndex(
        (item) => item.author === currentValue.author
      );
      if (existedAuthorIndex > -1) {
        accumulator[existedAuthorIndex].blogs++;
        return [...accumulator];
      } else {
        return [...accumulator, { author: currentValue.author, blogs: 1 }];
      }
    }, []);

    return groupedAuthor.reduce((accumulator, currentValue) => {
      return accumulator.blogs > currentValue.blogs
        ? accumulator
        : currentValue;
    }, {});
  }
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return {};
  } else if (blogs.length === 1) {
    return { author: blogs[0].author, likes: blogs[0].likes };
  } else {
    const groupedAuthor = blogs.reduce((accumulator, currentValue) => {
      const existedAuthorIndex = accumulator.findIndex(
        (item) => item.author === currentValue.author
      );
      if (existedAuthorIndex > -1) {
        accumulator[existedAuthorIndex].likes += currentValue.likes;
        return [...accumulator];
      } else {
        return [
          ...accumulator,
          { author: currentValue.author, likes: currentValue.likes },
        ];
      }
    }, []);

    return groupedAuthor.reduce((accumulator, currentValue) => {
      return accumulator.likes > currentValue.likes
        ? accumulator
        : currentValue;
    }, {});
  }
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
