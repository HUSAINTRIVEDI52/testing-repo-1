import React, { useContext, useEffect } from 'react';
import CreateBlog from '../../components/CreateBlog/CreateBlog';
import { GlobalContext } from '../../Context';
import Canonical from '../../utils/Canonical';

function CreateBlogPage() {
  const { currentScreen }: any = useContext(GlobalContext);

  useEffect(() => {
    if (currentScreen != 6) {
      const handleBeforeUnload = (e: any) => {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave this page? Your data will be lost.';
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [currentScreen]);

  return (
    <>
      <Canonical path='/createblog' title='create blog' />
      <CreateBlog />
    </>
  );
}

export default CreateBlogPage;
