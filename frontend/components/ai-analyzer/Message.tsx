// c:\Projects\Python\projects\AI database analyzer\frontend\components\ai-analyzer\Message.tsx
import { Bot, User } from 'lucide-react';
import { DataBlock } from './DataBlock';
import { metadata } from '@/types/conversation';
import { useMDXComponents } from '@/mdx-components';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  data?: {[key: string]: any[]};
  isError?: boolean;
  metadata?: metadata;
  sql_query?: string;
}

const Message = ({role, content, data, metadata, sql_query, isError = false}: MessageProps) => {
  // Get the styled components for MDX
  const mdxComponents = useMDXComponents({});
  const components = mdxComponents as Components;

  return (
    <div className={`flex gap-4 mb-10 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {role === 'assistant' && (
            <div className="w-8 h-8 rounded-full bg-[#2772CE]/10 flex items-center justify-center shrink-0">
            <Bot size={18} className="text-[#2772CE]" />
            </div>
        )}
        <div className={`max-w-[85%] ${role === 'user' ? 'order-1' : 'order-2'}`}>
            <div className={`p-4 rounded-2xl shadow-sm ${
            role === 'user' 
                ? 'bg-gray-100 text-[#1F2324]' 
                : isError? 'bg-red-300 border-red-100' : 'bg-white border border-gray-100 '
            }`}>
            <div className="text-[15px] leading-relaxed markdown-content">
                <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={components}
                >
                    {content}
                </ReactMarkdown>
            </div>
            
            {data && metadata && sql_query && <DataBlock data={data} metadata={metadata} sql_query={sql_query}/>}
            </div>
        </div>
        {role === 'user' && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 order-2">
            <User size={18} className="text-[#5A5E63]" />
            </div>
        )}
    </div>
  )
}

export default Message
