import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from 'react';

export const formattedTs = (ts) => {
  return moment(ts).format("ddd, MMM D, h:mm A");
};

export const MardownText = ({text}) => {

  
  // text=text.replace(/```/g, '\n');
  // console.log("text data :",text)

  return <ReactMarkdown 
  children={text} 
  remarkPlugins={[remarkGfm,]} 
  // components={{ a: ({node, ...props}) => <a {...props} style={{ color: 'blue' }} />}}>
    //  components={{
    //     a: ({node, ...props}) => (
    //       <a {...props} style={{ color: 'blue' }} target="_blank" 
              // rel={isLink ? 'noopener noreferrer' : undefined}/>
    //     )
    //   }}>
        components={{
        a: ({node, ...props}) => {
          const isLink = props.href.includes('channels.readthedocs.io');
          return (
            <a
              {...props}
              style={{ color: 'blue' }}
              target={isLink ? '_self' :'_blank' }
            />
          );
        }
      }}>
  </ReactMarkdown>;
};

// import React from 'react';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// // import rehypeHighlight from 'rehype-highlight';
// // import 'highlight.js/styles/github.css'; // Import a highlight.js style (optional)

// export const formattedTs = (ts) => {
//   return moment(ts).format('ddd, MMM D, h:mm A');
// };

// export const MarkdownText = ({ text }) => {
//   return (
//     <ReactMarkdown
//       children={text}
//       remarkPlugins={[remarkGfm]}
     
//     />
//   );
// };
// ;



// import React, { useEffect, useState } from 'react';
// import moment from 'moment';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';

// // Helper function to format timestamps
// export const formattedTs = (ts) => {
//   return moment(ts).format("ddd, MMM D, h:mm A");
// };

// // Component to render Markdown text
// export const MardownText = ({ text }) => {
//   text = text.replace("```", "\n");
//   return (
//     <ReactMarkdown
//       children={text}
//       remarkPlugins={[remarkGfm]}
//       components={{
//         a: ({ node, ...props }) => {
//           const isLink = props.href.includes('channels.readthedocs.io');
//           return (
//             <a
//               {...props}
//               style={{ color: 'blue' }}
//               target={isLink ? '_self' : '_blank'}
//             />
//           );
//         }
//       }}
//     />
//   );
// };

// // Main component to fetch and display the Markdown file
// const MarkdownFileViewer = () => {
//   const [markdownText, setMarkdownText] = useState('');

//   useEffect(() => {
//     const fetchMarkdownFile = async () => {
//       try {
//         const response = await fetch('/media/pragnakalpl41/Projects/Dev_56/Mansi_frontend_2/Mansi_frontend_2/Chat_widget/Chatbot-Widget-Widget2.0_main/src/constant/test_res.md');
//         if (response.ok) {
//           const text = await response.text();
//           setMarkdownText(text);
//         } else {
//           console.error('Failed to fetch the Markdown file');
//         }
//       } catch (error) {
//         console.error('Error fetching the Markdown file:', error);
//       }
//     };

//     fetchMarkdownFile();
//   }, []);

//   return <MardownText text={markdownText} />;
// };

// export default MarkdownFileViewer;
