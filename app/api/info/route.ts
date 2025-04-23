import { type NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { client, getInfo, setSession } from '@/app/api/utils/common'

export async function GET(request: NextRequest) {
  const { sessionId, user } = getInfo(request)
  try {
    const { data } = await client.getInfo(user)
    // 接口未返回 建议从配置文件或者环境变量获取
    data.app_id = 'app_id'
    data.site = {
      "title": data.name,
      "chat_color_theme": "#00665f",
      "chat_color_theme_inverted": true,
      "icon_type": "image",
      "icon": "07cc5de0-bc55-46a7-8d24-ae39cbbf4ea9",
      "icon_background": "#FFEAD5",
      "icon_url": "data:image/png;base64,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",
      "description": data.description || "",
      "copyright": null,
      "privacy_policy": null,
      "custom_disclaimer": "",
      "default_language": "zh-Hans",
      "prompt_public": false,
      "show_workflow_steps": true,
      "use_icon_as_answer_icon": false
    }
    return NextResponse.json(data as object, {
      headers: setSession(sessionId),
    })
  }
  catch (error) {
    return NextResponse.json([])
  }
}
