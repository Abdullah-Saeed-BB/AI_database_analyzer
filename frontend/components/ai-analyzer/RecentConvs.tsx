import { Plus, Clock } from 'lucide-react'

interface Conversation {
  id: string;
  title: string;
  date: string;
}

const RecentConvs = () => {
    const RECENT_CONVS: Conversation[] = [
    { id: '1', title: 'Q4 Revenue Analysis', date: '2h ago' },
    { id: '2', title: 'User Retention Trends', date: '5h ago' },
    { id: '3', title: 'Marketing Campaign ROI', date: 'Yesterday' },
    ];

    return (
            <aside className="w-72 border-r border-gray-100 flex flex-col bg-gray-50/50">
            <div className="p-4">
            <button className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#2772CE] hover:bg-[#1e5eb0] text-white rounded-full transition-all font-medium">
                <Plus size={18} />
                New Chat
            </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 py-2">
            <h3 className="text-xs font-semibold text-[#5A5E63] uppercase tracking-wider mb-4 px-2">
                Recent Conversations
            </h3>
            <nav className="space-y-1">
                {RECENT_CONVS.map((conv) => (
                <button
                    key={conv.id}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-gray-100 text-[#5A5E63] transition-colors text-left"
                >
                    <Clock size={16} className="shrink-0" />
                    <span className="truncate">{conv.title}</span>
                </button>
                ))}
            </nav>
            </div>
        </aside>
    )
}

export default RecentConvs