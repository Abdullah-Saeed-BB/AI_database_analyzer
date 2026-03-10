import RecentConvs from '@/components/ai-analyzer/RecentConvs';

import ChatPart from '@/components/ai-analyzer/ChatPart';

export default function AIChatPage() {

  return (
    <div className="flex h-full w-full font-sans text-text-primary">
      <RecentConvs/>
      <main className="flex-1 flex flex-col relative overflow-hidden p-5">
        <ChatPart/>
      </main>
    </div>
  );
}
