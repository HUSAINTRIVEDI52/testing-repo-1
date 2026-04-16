import { useEffect } from 'react';

const useGlobalClickTracker = () => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
     const target = event.target as Node;
     // Guard: iframe DOM nodes & text nodes don't support .closest()
      if (!target || !(target instanceof Element)) return;

      // Find the nearest clickable element
      const clickableElement = target.closest("button, a, input, [role='button'], [data-track-click]");
      if (!clickableElement) return;

      const tagName = clickableElement.tagName.toLowerCase();

      // Determine the event type
      let eventType = 'element_click';

      if (tagName === 'button' || clickableElement.getAttribute('role') === 'button') {
        eventType = 'button_click';
      } else if (tagName === 'a') {
        eventType = 'link_click';
      } else if (tagName === 'input') {
        eventType = 'input_click';
      } else if (tagName === 'div' || tagName === 'span') {
        eventType = `${tagName}_click`;
      }

      // Label (priority order)
      const label =
        (clickableElement as HTMLElement).innerText?.trim() ||
        clickableElement.getAttribute('data-gtm') ||
        clickableElement.getAttribute('aria-label') ||
        clickableElement.getAttribute('alt') ||
        clickableElement.getAttribute('title') ||
        clickableElement.id ||
        clickableElement.className ||
        tagName;

      // Push to GTM
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: eventType,
        tag: tagName,
        label
      });
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};

export default useGlobalClickTracker;
