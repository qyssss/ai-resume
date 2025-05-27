export type DialogueMessage = {
    role: "user" | "assistant" | "system";
    content: string;
    suggestions?: string[];  // 添加可选的 suggestions 属性
};

export type DialogueHistory = DialogueMessage[]; 