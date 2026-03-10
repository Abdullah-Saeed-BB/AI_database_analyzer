import { DataBlock } from "@/components/ai-analyzer/DataBlock";
import { authFetch } from "@/lib/api/authFetch"
import { Bot, User } from "lucide-react";
import Conversation from "@/types/conversation";

const ConversationDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params 
    
    try {
        const res = await authFetch(`/api/conversations/${id}`)
        const conv: Conversation = await res.json()

        return (
            <div>
                <div className="flex gap-4 justify-end">
                    <div className="max-w-[85%] order-1">
                        <div className="p-4 rounded-2xl bg-gray-100 text-primary">
                            <p className="text-[15px] leading-relaxed">{conv.prompt}</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 order-2">
                        <User size={18} className="text-[#5A5E63]" />
                    </div>
                </div>
                <div className="flex gap-4 justify-start">
                    <div className="w-8 h-8 rounded-full bg-[#2772CE]/10 flex items-center justify-center shrink-0">
                        <Bot size={18} className="text-[#2772CE]" />
                    </div>
                    <div className="max-w-[85%] order-2">
                        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <p className="text-[15px] leading-relaxed">{conv.text}</p>
                    <DataBlock data={conv.data} metadata={conv.data_metadata}/>
                  </div>
                </div>
              </div>
            </div>
        )
    } catch (e) {
        return <div>ERROR</div>
    }
}

export default ConversationDetails