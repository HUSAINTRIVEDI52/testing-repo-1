import React from 'react';
import BlogEdit from '../../components/BlogEdit/BlogEdit';
import Canonical from '../../utils/Canonical';

const BlogEditPage = () => {
  return (
    <>
      <Canonical path={`/blog-edit`} title={`Edit Blog`} />
      <BlogEdit />
    </>
  );
};

export default BlogEditPage;
