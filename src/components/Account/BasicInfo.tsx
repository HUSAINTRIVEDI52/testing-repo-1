import { Progress } from 'antd';
import React from 'react';

const BasicInfo = ({ plan, currentPlanTitle }: any) => {
    return (
        <>
            <div className='label'>{plan}</div>
            <div className='title'>{currentPlanTitle}</div>
            <div className='basic-slide'>
                <div className='lable-info'>
                    <span className='label'>Usage</span>
                    <span className='credit-count'>396 credit left</span>
                </div>
                <Progress trailColor='#F1F4F8' strokeColor={"#FF7C02"} strokeWidth={window.innerWidth < 1440 ? 8 : 12} percent={25} showInfo={false} />
            </div>
        </>
    );
};

export default BasicInfo;