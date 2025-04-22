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
      "icon_url": "https://liai-builder.chj.cloud/files/07cc5de0-bc55-46a7-8d24-ae39cbbf4ea9/file-preview?timestamp=1745287866&nonce=929dc82d3aa36d695c272f96f5035414&sign=3Ete9t0TPonr1LpMpPhTVYzIE2L-ykZFI4rUK9vFhbQ=",
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
