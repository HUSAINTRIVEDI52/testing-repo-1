import React from 'react';

const SidebarBlog = ({ data, current }: any) => {
  return (
    <div className='sidebar-blog-wrapper'>
      {data?.map((item: any) => (
        <div key={item?.title} className='sidebar-blog-item'>
          {item?.title && <h3>{item?.title}</h3>}
          {(item?.title?.includes('Characters') || item?.title === 'Words') ? (
            <p>{Array.isArray(item?.description) ? item?.description[current - 1] : item?.description || 0}</p>
          ) : (
            <p>{(item?.description && item?.description !== 'null' && item?.description !== '-') ? item?.description : 'N/A'}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarBlog;
