import { Button, message, Tooltip } from 'antd';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@ant-design/icons';
import { ReactComponent as DownArrowSvg } from '../../assets/icons/Property 1=iconamoon_arrow-up-2.svg';
import axios from 'axios';
import { GlobalContext } from '../../Context';

const PlagrismCheck = ({ blogId, content, current, blogDetails }: any) => {
  const { usage, setUsage }: any = useContext(GlobalContext);
  const [show, setShow] = useState(false);
  const [plagarismLoader, setPlagarismLoader] = useState<boolean>(false);
  const [plagarismResult, setPlagarismResult] = useState<any>();
  const userId = localStorage.getItem('userId');
  const handleShow = () => {
    setShow(!show);
  };

  //This code is for checking plagarism
  const handlePlagCheck = async () => {
    setPlagarismLoader(true);
    setShow(true);
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(content[current - 1], 'text/html');
    const textContent = htmlDoc.body.textContent;

    let value = {
      content: textContent
    };
    try {
      const result = await axios.post(`${process.env.REACT_APP_SERVER_URL}/plagarism?blogId=${blogId}`, value, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      if (result.status === 200) {
        setPlagarismResult(result?.data?.details);
        const usage = await axios.get(`${process.env.REACT_APP_SERVER_URL}/usage?userId=${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        setUsage({
          usedBlog: usage.data?.blogCreated || 0,
          totalBlog: usage.data?.blogLimit || 0,
          usedPlagiarism: usage.data?.plagarismChecked || 0,
          totalPlagiarism: usage.data?.plagarismCheckLimit || 0
        });
      } else {
        message.error(result?.data?.error);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.error ? error?.response?.data?.error : error?.message);
    }

    setPlagarismLoader(false);
  };

  return (
    <div className={`plagrism-check-wrapper ${show && 'show'}`}>
      <Tooltip
        placement='left'
        title={
          (usage?.totalPlagiarism || 0) - (usage?.usedPlagiarism || 0) !== 0
            ? ''
            : 'You have not enough plagiarism check count kindly upgrade your limits'
        }
      >
        <button
          type='button'
          className='close-btn'
          onClick={handleShow}
          disabled={
            !show &&
            ((usage?.totalPlagiarism || 0) - (usage?.usedPlagiarism || 0) === 0 ||
              blogDetails?.language?.[current - 1] === 'Cantonese' ||
              blogDetails?.language?.[current - 1] === 'Mandarin')
          }
        >
          {show ? <Icon component={DownArrowSvg} /> : <span className='text'>Plagiarism Check</span>}
        </button>
      </Tooltip>
      <div className='check-block'>
        <span>Plagiarism Check</span>
        <Button
          loading={plagarismLoader}
          onClick={handlePlagCheck}
          disabled={
            (usage?.totalPlagiarism || 0) - (usage?.usedPlagiarism || 0) == 0 ||
            blogDetails?.language?.[current - 1] === 'Cantonese' ||
            blogDetails?.language?.[current - 1] === 'Mandarin'
          }
        >
          Check
        </Button>
      </div>
      <div className='check-tag-wrapper'>
        <div className='check-tag purple'>
          <span className='label'>Plagiarised Words:</span>
          {plagarismResult?.allwordsmatched && <span>{plagarismResult?.allwordsmatched}</span>}
        </div>
        <div className='check-tag orange'>
          <span className='label'>Plagiarised:</span>
          {plagarismResult?.allpercentmatched && <span>{plagarismResult?.allpercentmatched}</span>}
        </div>
        <div className='check-tag w-100 green'>
          <span className='label'>Plagiarised Text</span>
          {plagarismResult?.alltextmatched && <span>{plagarismResult?.alltextmatched}</span>}
        </div>
        <div className='check-tag no-bg'>
          <span className='label'>Plagiarised url:</span>
          {plagarismResult?.allviewurl && (
            <span>
              <Link to={plagarismResult?.allviewurl} target='_blank'>
                Link
              </Link>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlagrismCheck;
