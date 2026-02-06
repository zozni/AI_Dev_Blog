import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './MarkdownViewer.css';

function MarkdownViewer({ content }) {
  // 헤딩 텍스트를 ID로 변환하는 함수
  const generateHeadingId = (text) => {
    return String(text)
      .toLowerCase()
      .replace(/[^a-z0-9가-힣]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <div className="markdown-viewer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 헤딩 컴포넌트에 ID 추가
          h1: ({ children }) => (
            <h1 id={generateHeadingId(children)}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 id={generateHeadingId(children)}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 id={generateHeadingId(children)}>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 id={generateHeadingId(children)}>{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 id={generateHeadingId(children)}>{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 id={generateHeadingId(children)}>{children}</h6>
          ),
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

export default MarkdownViewer;