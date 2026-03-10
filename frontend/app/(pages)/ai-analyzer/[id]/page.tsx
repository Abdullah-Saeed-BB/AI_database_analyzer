import { authFetch } from "@/lib/api/authFetch"
import { User } from "lucide-react";

interface Conversation {
    id: string;
    is_archived: boolean;
    data: object;
    data_metadata: {
        stats: object;
        columns: string[];
        datetime: string[];
        numerical: string[];
        categorical: string[];
    }
    title: string;
    user_id: string;
    prompt: string;
    text: string;
    sql: string;
    sql_generation_time: string;
    created_at: string;
}

const ConversationDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params 
    
    try {
        const res = await authFetch(`/api/conversations/${id}`)
        const conv: Conversation = await res.json()

        console.log(conv);

        return (
            <div className="flex gap-4 justify-end">
                <div className="max-w-[85%] order-1">
                  <div className="p-4 rounded-2xl bg-gray-100 text-primary">
                    <p className="text-[15px] leading-relaxed">{conv.prompt ? "You can jive" : "Having the time"}</p>
                    {/* {msg.data && <DataBlock data={msg.data} />} */}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 order-2">
                    <User size={18} className="text-[#5A5E63]" />
                </div>
            </div>
        )
    } catch (e) {
        return <div>ERROR</div>
    }
}

export default ConversationDetails