import { type NextRequest } from 'next/server'
import { client, getInfo } from '@/app/api/utils/common'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    inputs,
    query,
    files,
    conversation_id: conversationId,
    response_mode: responseMode,
  } = body
  const { user } = getInfo(request)
  const res = await client.createChatMessage(inputs, query, user, responseMode, conversationId, files)
  // 确保使用流式响应
  const headers = new Headers({
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
    'X-Accel-Buffering': 'no',
    'Connection': 'keep-alive',
    'Transfer-Encoding': 'chunked',
  })

  return new Response(res.data, { headers })
}
