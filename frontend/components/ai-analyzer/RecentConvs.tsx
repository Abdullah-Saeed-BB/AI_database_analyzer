import { authFetch } from '@/lib/api/authFetch';
import { Plus } from 'lucide-react'
import ConversationItem from './ConversationItem';
import { redirect } from 'next/navigation';

interface Conversation {
  id: string;
  title: string;
  date: string;
}

const Bar = ({ children }: { children: React.ReactNode }) => {
    async function handleNewChat() {
        'use server'
        redirect('/ai-analyzer')
    }

    return (
        <aside className="w-72 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-4">
                <form action={handleNewChat}>
                    <button 
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#2772CE] hover:bg-[#1e5eb0] text-white rounded-full transition-all font-medium"
                    >
                        <Plus size={18} />
                        New Chat
                    </button>
                </form>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-2 text-wrap truncate">
                <h3 className="text-xs font-semibold text-[#5A5E63] uppercase tracking-wider mb-4 px-2">
                    Recent Conversations
                </h3>
                {children}
            </div>
        </aside>
    )
}

const RecentConvs = async () => {
    try {
        const res = await authFetch("/api/conversations", {
            method: "GET",
            // Add a cache: 'no-store' or revalidate to ensure it's fresh when router.refresh() is called
            next: { revalidate: 0 }
        })
        const data: Conversation[] = await res.json()

        return (
            <Bar>
                <nav className="space-y-1">
                    {data.map((conv) => (
                        <ConversationItem 
                            key={conv.id}
                            id={conv.id}
                            title={conv.title}
                        />
                    ))}
                </nav>
            </Bar>
        )
    } catch (e) {
        console.log("FROM THE RecentConvs COMPONENT: ", e);
        return <Bar><h4 className='text-red-800 italic bg-red-200 rounded px-4 py-2'>Error occurs while fetching your conversations</h4></Bar>
    }
}

export default RecentConvs