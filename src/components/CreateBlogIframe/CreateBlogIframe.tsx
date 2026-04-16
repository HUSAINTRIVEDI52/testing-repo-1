import React, { useEffect, useState } from 'react'
import RemoteComponentIframe from '../RemoteComponent/RemoteComponentIframe';

function CreateBlogIframe() {
  const [dataToSend, setDataToSend] = useState<Record<string, any>>({});

  useEffect(() => {
    console.log('=== CreateBlogIframe: Component mounted ===');

    // Debug: Check all localStorage
    console.log('All localStorage keys:', Object.keys(localStorage));

    // Gather data from localStorage to send to the iframe
    const userId = localStorage.getItem('userId');
    const accessToken = localStorage.getItem('accessToken');
    const userName = localStorage.getItem('userName');
    const blogMode = localStorage.getItem('blog-mode');

    console.log('Raw localStorage values:', {
      userId,
      accessToken: accessToken ? '***exists***' : null,
      userName,
      blogMode
    });

    // Prepare the data object
    const data = {
      userId: userId || '',
      accessToken: accessToken || '',
      userName: userName || '',
      blogMode: blogMode || '',
      timestamp: new Date().toISOString(),
    };

    setDataToSend(data);
    console.log('=== Data prepared for iframe:', data);
  }, []);

  const handleMessage = (data: any) => {
    // Handle messages from the iframe component
    console.log('Received from remote component:', data);
  };

  return (
    <>
        {/* Custom Alert Note */}
            <div style={{ background: '#fff3cd', color: '#856404', padding: '10px', borderRadius: '4px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
                <strong>Feature Update:</strong>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>If you’ve used the form-based approach before and can’t find it now, there’s no need to worry. The stepper has been fully replaced by our new <strong style={{ fontWeight: 700 }}>Bloggr Agent</strong></li>
                <li><strong style={{ fontWeight: 700 }}>Bloggr Agent</strong> is our latest feature. Earlier, blog generation was done using a stepper-based form. We’ve now and are upgrading this experience to a <strong style={{ fontWeight: 700 }}>conversational blog generation agent,</strong> designed to be more intuitive, flexible, and powerful.</li>
            </ul>
            </div>
    <RemoteComponentIframe
      src={`${process.env.REACT_APP_AGENT_URL}`}
      componentPath="/agent"
      data={dataToSend}
      onMessage={handleMessage}
    />
    </>
  );
}

export default CreateBlogIframe