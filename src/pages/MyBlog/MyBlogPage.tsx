import React from 'react';
import MyBlog from '../../components/MyBlog/MyBlog';
import Canonical from '../../utils/Canonical';

const MyBlogPage = () => {
  return (
    <>
      <Canonical path='/my-blog' title='My blogs' />
      <MyBlog />
    </>
  );
};

export default MyBlogPage;
