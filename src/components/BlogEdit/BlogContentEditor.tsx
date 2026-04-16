import React, { useEffect, useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Markdown from 'markdown-to-jsx';
import { renderToStaticMarkup } from 'react-dom/server';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';
import * as RTF from 'rtf.js';
import { message } from 'antd';

const BlogContentEditor = ({ setBlogContent, blogContent, current, setHasChanges, copy, setCopy, onEditorReady }: any) => {
  const turndownService = React.useMemo(() => {
    const service = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    service.use(gfm);
    return service;
  }, []);
  const editorRef = useRef<any>(null);
  const [initialContent, setInitialContent] = useState<string>('');
  const [isEditorReady, setIsEditorReady] = useState<boolean>(false); // Track initial load

  useEffect(() => {
    // Convert markdown to HTML string
    const htmlContent = blogContent && renderToStaticMarkup(<Markdown>{blogContent[current - 1]}</Markdown>);
    setInitialContent(htmlContent);
  }, [blogContent, current]);
  useEffect(() => {
    if (!editorRef.current) return;

    const html = editorRef.current.getContent();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const copyHtml = async () => {
      try {
        const supportsClipboardItem = typeof (window as any).ClipboardItem !== 'undefined';
        if (navigator.clipboard && supportsClipboardItem && window.isSecureContext) {
          const blobHtml = new Blob([html], { type: 'text/html' });
          const blobText = new Blob([tempDiv.innerText], { type: 'text/plain' });
          const data = {
            'text/html': blobHtml,
            'text/plain': blobText
          } as any;
          await navigator.clipboard.write([new (window as any).ClipboardItem(data)]);
        } else {
          document.body.appendChild(tempDiv);
          const range = document.createRange();
          range.selectNodeContents(tempDiv);
          const selection = window.getSelection();
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
            document.execCommand('copy');
            selection.removeAllRanges();
          }
          document.body.removeChild(tempDiv);
        }
        message.success({ content: 'Content copied to clipboard!', key: 'copy_content' });
      } catch (err) {
        message.error('Failed to copy formatted content');
      }
    };

    copyHtml();
  }, [copy]);
  const handleEditorChange = (content: string) => {
    if (!isEditorReady) {
      // Ignore changes until the editor has fully initialized
      setIsEditorReady(true);
      return;
    }

    let data = blogContent;
    const markdown = turndownService.turndown(content);
    data[current - 1] = markdown;
    sessionStorage.setItem('editData', JSON.stringify(data));
    setHasChanges(true);
  };

  return (
    <Editor
      apiKey={process.env.REACT_APP_EDITOR_KEY}
onInit={(_evt: any, editor: any) => {
  editorRef.current = editor;
  setIsEditorReady(false);
  if (onEditorReady) onEditorReady(editor);

  // Capture-phase listener runs BEFORE OptiMonk's listener
  // Stops iframe DOM nodes (which lack .closest()) from reaching OptiMonk
  const captureIframeClicks = (e: MouseEvent) => {
    if (!(e.target instanceof Element)) {
      e.stopImmediatePropagation();
    }
  };
  document.addEventListener('click', captureIframeClicks, true); // true = capture phase

  // Cleanup when editor is destroyed
  editor.on('remove', () => {
    document.removeEventListener('click', captureIframeClicks, true);
  });
}}
      onEditorChange={handleEditorChange}
      init={{
        menubar: false,
        statusbar: false,
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
        toolbar_mode: 'scrolling',
        link_default_target: '_blank',
        link_assume_external_targets: true,
setup: (editor: any) => {
  editor.on('click', (e: MouseEvent) => {
    e.stopPropagation(); // ← ADD THIS LINE
    if (!e.altKey) return;

            // e.target may be a text node which lacks .closest() — walk up the DOM safely
            let node: Node | null = e.target as Node;
            let anchor: HTMLAnchorElement | null = null;

            while (node && node !== editor.getBody()) {
              if ((node as Element).nodeType === Node.ELEMENT_NODE) {
                const el = node as HTMLElement;
                if (el.tagName === 'A') {
                  anchor = el as HTMLAnchorElement;
                  break;
                }
              }
              node = node.parentNode;
            }

            if (anchor && anchor.href) {
              e.preventDefault();
              e.stopPropagation();
              window.open(anchor.href, '_blank', 'noopener,noreferrer');
            }
          });
        }
      }}
      initialValue={initialContent}
    />
  );
};

export default BlogContentEditor;
