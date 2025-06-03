import type { DialogueHistory } from "../types/aiDialogue";
import { WorkerPool } from "../worker/workerPool";

const API_URL = "/compatible-mode/v1/chat/completions";
const userApiKey = "sk-5f7305fdcb094f40b701e5c9bb5ed12d";
const model = "qwen-turbo";
// 创建线程池
const workerPool = new WorkerPool(4);
export async function sendToQwenAIDialogue(messages: DialogueHistory,
    onResponse: (responseText: string, isComplete: boolean) => void): Promise<void> {
    workerPool.execute(messages, userApiKey, model, API_URL, onResponse);
}
