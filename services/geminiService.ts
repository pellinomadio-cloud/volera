
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async getFinancialInsight(transactions: Transaction[], currentBalance: number) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze these recent transactions for a wallet app named Easy Wallet: ${JSON.stringify(transactions)}. Current Balance: ${currentBalance}. Provide a 2-sentence encouraging financial tip or observation.`,
        config: {
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Keep tracking your spending to reach your financial goals faster!";
    }
  }

  async chatWithAssistant(query: string, context: { balance: number; name: string }) {
    try {
      const chat = this.ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are Easy Wallet Assistant, a friendly financial advisor for the Easy Wallet app. The user is ${context.name} and their balance is ${context.balance}. Be concise and helpful.`,
        },
      });
      const response = await chat.sendMessage({ message: query });
      return response.text;
    } catch (error) {
      console.error("Chat Error:", error);
      return "I'm having trouble connecting right now. Please try again later.";
    }
  }
}

export const geminiService = new GeminiService();
