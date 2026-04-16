import React from 'react';
import './side-title-info.scss';

const SideTitleInfo = ({ title, subTitle, children }: any) => {
    return (
        <div className='title-wrapper'>
            <div className='title-content'>
                <h1>{title}</h1>
                <p>{subTitle}</p>
            </div>
            {children}
        </div>
    );
};

export default SideTitleInfo;