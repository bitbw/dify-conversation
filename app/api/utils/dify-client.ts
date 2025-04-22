import axios from "axios";

// 类型定义
export const BASE_URL = "https://api.dify.ai/v1";

export type RequestMethods = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface Params {
  [key: string]: any;
}

interface HeaderParams {
  [key: string]: string;
}

interface User {
  // 用户接口可以根据实际需求扩展
}

// 路由定义
export const routes = {
  application: {
    method: "GET" as RequestMethods,
    url: () => `/parameters`,
  },
  feedback: {
    method: "POST" as RequestMethods,
    url: (message_id: string) => `/messages/${message_id}/feedbacks`,
  },
  createChatMessage: {
    method: "POST" as RequestMethods,
    url: () => `/chat-messages`,
  },
  getConversationMessages: {
    method: "GET" as RequestMethods,
    url: () => `/messages`,
  },
  getConversations: {
    method: "GET" as RequestMethods,
    url: () => `/conversations`,
  },
  renameConversation: {
    method: "POST" as RequestMethods,
    url: (conversation_id: string) => `/conversations/${conversation_id}/name`,
  },
  deleteConversation: {
    method: "DELETE" as RequestMethods,
    url: (conversation_id: string) => `/conversations/${conversation_id}`,
  },
  fileUpload: {
    method: "POST" as RequestMethods,
    url: () => `/files/upload`,
  },
  getMeta: {
    method: "GET" as RequestMethods,
    url: () => `/meta`,
  },
  getInfo: {
    method: "GET" as RequestMethods,
    url: () => `/info`,
  },
  aduioToText: {
    method: "POST" as RequestMethods,
    url: () => `/audio-to-text`,
  },
  textToAudio: {
    method: "POST" as RequestMethods,
    url: () => `/text-to-audio`,
  },
  getSuggested: {
    method: "GET" as RequestMethods,
    url: (message_id: string) => `/messages/${message_id}/suggested`,
  },
  stopChat: {
    method: "POST" as RequestMethods,
    url: (task_id: string) => `/chat-messages/${task_id}/stop`,
  },
  runWorkflow: {
    method: "POST" as RequestMethods,
    url: () => `/workflows/run`,
  },
  checkWorkflow: {
    method: "GET" as RequestMethods,
    url: (workflow_id: string) => `/workflows/run/${workflow_id}`,
  },
  stopWorkflow: {
    method: "POST" as RequestMethods,
    url: (task_id: string) => `/workflows/tasks/${task_id}/stop`,
  },
  getWorkflowLogs: {
    method: "GET" as RequestMethods,
    url: () => `/workflows/logs`,
  },
};

export class DifyClient {
  protected apiKey: string;
  protected baseUrl: string;

  constructor(apiKey: string, baseUrl: string = BASE_URL) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  updateApiKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  async sendRequest(
    method: RequestMethods,
    endpoint: string,
    data: any = null,
    params: Params | null = null,
    stream: boolean = false,
    headerParams: HeaderParams = {}
  ): Promise<any> {
    const headers = {
      ...{
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      ...headerParams
    };

    const url = `${this.baseUrl}${endpoint}`;
    let response;
    if (stream) {
      response = await axios({
        method,
        url,
        data,
        params,
        headers,
        responseType: "stream",
      });
    } else {
      response = await axios({
        method,
        url,
        ...(method !== "GET" && { data }),
        params,
        headers,
        responseType: "json",
      });
    }

    return response;
  }

  messageFeedback(message_id: string, rating: number, user: User): Promise<any> {
    const data = {
      rating,
      user,
    };
    return this.sendRequest(
      routes.feedback.method,
      routes.feedback.url(message_id),
      data
    );
  }

  getApplicationParameters(user: User): Promise<any> {
    const params = { user };
    return this.sendRequest(
      routes.application.method,
      routes.application.url(),
      null,
      params
    );
  }
  
  getInfo(user: User): Promise<any> {
    const params = { user };
    return this.sendRequest(
      routes.getInfo.method,
      routes.getInfo.url(),
      null,
      params
    );
  }
  

  
  fileUpload(data: FormData): Promise<any> {
    return this.sendRequest(
      routes.fileUpload.method,
      routes.fileUpload.url(),
      data,
      null,
      false,
      {
        "Content-Type": 'multipart/form-data'
      }
    );
  }
  
  aduioToText(data: FormData): Promise<any> {
    return this.sendRequest(
      routes.aduioToText.method,
      routes.aduioToText.url(),
      data,
      null,
      false,
      {
        "Content-Type": 'multipart/form-data'
      }
    );
  }
  
  textToAudio(data: FormData): Promise<any> {
    return this.sendRequest(
      routes.textToAudio.method,
      routes.textToAudio.url(),
      data,
      null,
      false,
      {
        "Content-Type": 'multipart/form-data'
      }
    );
  }

  getMeta(user: User): Promise<any> {
    const params = { user };
    return this.sendRequest(
      routes.getMeta.method,
      routes.getMeta.url(),
      null,
      params
    );
  }
}

// 重命名为CompletionClient以符合类型定义
export class CompletionClient extends DifyClient {
  checkWorkflowStatus(workflow_id: string, user: User): Promise<any> {
    return this.sendRequest(
      routes.checkWorkflow.method,
      routes.checkWorkflow.url(workflow_id),
      null
    );
  }

  createCompletionMessage(
    inputs: any,
    user: User,
    stream: boolean = false,
    files: File[] | null = null
  ): Promise<any> {
    const data = {
      inputs,
      user,
      response_mode: stream ? "streaming" : "blocking",
      files,
    };
    return this.sendRequest(
      routes.runWorkflow.method,
      routes.runWorkflow.url(),
      data,
      null,
      stream
    );
  }
}

export class ChatClient extends DifyClient {
  createChatMessage(
    inputs: any,
    query: string,
    user: User,
    stream: boolean = false,
    conversation_id: string | null = null,
    files: File[] | null = null
  ): Promise<any> {
    const data: any = {
      inputs,
      query,
      user,
      response_mode: stream ? "streaming" : "blocking",
      files,
    };
    if (conversation_id) data.conversation_id = conversation_id;

    return this.sendRequest(
      routes.createChatMessage.method,
      routes.createChatMessage.url(),
      data,
      null,
      stream
    );
  }

  getConversationMessages(
    user: User,
    conversation_id: string = "",
    first_id: string | null = null,
    limit: number | null = null
  ): Promise<any> {
    const params: any = { user };

    if (conversation_id) params.conversation_id = conversation_id;

    if (first_id) params.first_id = first_id;

    if (limit) params.limit = limit;

    return this.sendRequest(
      routes.getConversationMessages.method,
      routes.getConversationMessages.url(),
      null,
      params
    );
  }

  getConversations(
    user: User, 
    first_id: string | null = null, 
    limit: number | null = null, 
    pinned: boolean | null = null
  ): Promise<any> {
    const params = { user, first_id, limit, pinned };
    return this.sendRequest(
      routes.getConversations.method,
      routes.getConversations.url(),
      null,
      params
    );
  }

  renameConversation(
    conversation_id: string, 
    name: string, 
    user: User, 
    auto_generate: boolean
  ): Promise<any> {
    const data = { name, user, auto_generate };
    return this.sendRequest(
      routes.renameConversation.method,
      routes.renameConversation.url(conversation_id),
      data
    );
  }
  
  deleteConversation(conversation_id: string, user: User): Promise<any> {
    const data = { user };
    return this.sendRequest(
      routes.deleteConversation.method,
      routes.deleteConversation.url(conversation_id),
      data
    );
  }
  
  stopChat(task_id: string, user: User): Promise<any> {
    const data = { user };
    return this.sendRequest(
      routes.stopChat.method,
      routes.stopChat.url(task_id),
      data
    );
  }
  
  getSuggested(message_id: string, user: User): Promise<any> {
    const params = { user };
    return this.sendRequest(
      routes.getSuggested.method,
      routes.getSuggested.url(message_id),
      null,
      params
    );
  }
}