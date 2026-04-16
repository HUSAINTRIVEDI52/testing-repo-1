import React, { useEffect, useRef, useState } from 'react';

interface RemoteComponentIframeProps {
  /**
   * URL of the other React app that serves the component
   * Example: 'http://localhost:3001' or 'https://your-other-app.com'
   */
  src: string;
  /**
   * Optional: Path to the specific component route in the other app
   * Example: '/component' or '/embed/my-component'
   */
  componentPath?: string;
  /**
   * Optional: Data to pass to the iframe component
   */
  data?: Record<string, any>;
  /**
   * Optional: Callback when iframe sends a message
   */
  onMessage?: (data: any) => void;
  /**
   * Optional: Custom styles for the iframe container
   */
  className?: string;
  /**
   * Optional: Iframe width
   */
  width?: string | number;
  /**
   * Optional: Iframe height
   */
  height?: string | number;
}

/**
 * RemoteComponentIframe - Embeds a React component from another repository using iframe
 * 
 * Usage:
 * <RemoteComponentIframe 
 *   src="http://localhost:3001" 
 *   componentPath="/embed/my-component"
 *   data={{ userId: 123 }}
 *   onMessage={(data) => console.log(data)}
 * />
 */
const RemoteComponentIframe: React.FC<RemoteComponentIframeProps> = ({
  src,
  componentPath = '',
  data,
  onMessage,
  className = '',
  width = '100%',
  height = '100%',
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const fullUrl = `${src}${componentPath}`;

  const sendMessageToIframe = (messageData: any) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      // Get target origin from environment or use wildcard for development
      const targetOrigin = process.env.REACT_APP_AGENT_URL || '*';

      // Send data with proper message structure
      const message = {
        type: 'PARENT_DATA',
        payload: messageData,
        timestamp: new Date().toISOString(),
      };

      iframe.contentWindow.postMessage(message, targetOrigin);
      console.log('Data sent to iframe:', message);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      console.log('=== Iframe loaded successfully:', fullUrl);

      // Wait a bit for the child app to fully initialize its message listener
      setTimeout(() => {
        setIsLoaded(true);

        // Send initial data to iframe when it's loaded
        if (data && Object.keys(data).length > 0) {
          console.log('=== Sending data on iframe load (after 200ms delay)');
          sendMessageToIframe(data);
        } else {
          console.warn('=== No data to send on iframe load');
        }
      }, 200); // 200ms delay to ensure child listener is ready

      // Try to access iframe content for debugging (may fail due to CORS)
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          console.log('Iframe document accessible. Elements found:', iframeDoc.body?.children.length);
        }
      } catch (e) {
        console.log('Cannot access iframe content (CORS restriction - this is normal)');
      }
    };

    const handleMessage = (event: MessageEvent) => {
      

      // Listen for CHILD_READY message and send data immediately
      if (event.data?.type === 'CHILD_READY') {
        console.log('=== Child app is ready! Sending data now...');
        if (data && Object.keys(data).length > 0) {
          sendMessageToIframe(data);
        }
      }

      // Security: Verify origin (in production, use specific domain)
      // if (event.origin !== 'http://localhost:3002') return;

      if (onMessage && event.data) {
        onMessage(event.data);
      }
    };

    const handleError = () => {
      console.error('Iframe failed to load:', fullUrl);
    };

    iframe.addEventListener('load', handleLoad);
    iframe.addEventListener('error', handleError);
    window.addEventListener('message', handleMessage);

    return () => {
      iframe.removeEventListener('load', handleLoad);
      iframe.removeEventListener('error', handleError);
      window.removeEventListener('message', handleMessage);
    };
  }, [fullUrl, onMessage]);

  // Send data whenever it changes (after iframe is already loaded)
  useEffect(() => {
    if (isLoaded && data && Object.keys(data).length > 0) {
      console.log('=== Data updated, sending to iframe:', data);
      sendMessageToIframe(data);
    }
  }, [data, isLoaded]);

  return (
    <div
      className={`remote-component-iframe-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: typeof height === 'number' ? `${height}px` : height,
        overflow: 'hidden',
        border: '1px solid #e2e4e8',
        borderRadius: '8px',
      }}
    >
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{ color: '#6b7280' }}>Loading Agent...</div>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={fullUrl}
        width={width}
        height={height}
        style={{
          border: 'none',
          display: isLoaded ? 'block' : 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        title="Remote Component"
        allow="clipboard-read; clipboard-write"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
      />
    </div>
  );
};

export default RemoteComponentIframe;

