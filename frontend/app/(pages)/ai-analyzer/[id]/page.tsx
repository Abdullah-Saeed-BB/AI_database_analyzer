import { authFetch } from "@/lib/api/authFetch"
import Conversation from "@/types/conversation";
import Message from "@/components/ai-analyzer/Message";
import getRandomElements from "@/lib/getRandElements";

const ConversationDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params 
    
    try {
        const res = await authFetch(`/api/conversations/${id}`)
        const conv: Conversation = await res.json()

        if (!conv.text) throw new Error("The converstion not exist anymore")

        return (
            <div>
                <div className="flex justify-center mb-4 ">
                    <div className="bg-bg-light border border-gray-200 shadow-sm rounded-lg flex items-center gap-2 px-6 py-3">
                        <h3 className="text-lg font-bold text-text-primary">
                            {conv.title}
                        </h3>
                        <span className="text-text-secondary mx-1">-</span>
                        <span className="text-sm text-text-secondary italic">{new Date(conv.created_at).toDateString()}</span>
                    </div>
                </div>
                <Message role="user" content={conv.prompt}/>
                <Message role="assistant" content={conv.text} data={getRandomElements(conv.data, 400)} metadata={conv.data_metadata} sql_query={conv.sql} sql_generation_time={conv.sql_generation_time} text_generation_time={conv.text_generation_time}/>
            </div>
        )
    } catch (e) {
        return <Message role="assistant" content="Error occurs while getting your conversation. Try again later" isError={true}/>
    }
}

export default ConversationDetails