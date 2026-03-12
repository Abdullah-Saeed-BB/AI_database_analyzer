import { authFetch } from "@/lib/api/authFetch"
import Conversation from "@/types/conversation";
import Message from "@/components/ai-analyzer/Message";

const ConversationDetails = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params 
    
    try {
        const res = await authFetch(`/api/conversations/${id}`)
        const conv: Conversation = await res.json()

        if (!conv.text) throw new Error("The converstion not exist anymore")

        return (
            <div>
                <Message role="user" content={conv.prompt}/>
                <Message role="assistant" content={conv.text} data={conv.data} metadata={conv.data_metadata} sql_query={conv.sql}/>
            </div>
        )
    } catch (e) {
        return <Message role="assistant" content="Error occurs while getting your conversation. Try again later" isError={true}/>
    }
}

export default ConversationDetails