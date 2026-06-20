import { GoogleGenAI } from '@google/genai';
import { AiService } from './AiService';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class GeminiService implements AiService {
  private ai: GoogleGenAI | null = null;
  private isMockMode: boolean = true;

  constructor() {
    if (env.GEMINI_API_KEY) {
      try {
        this.ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
        this.isMockMode = false;
        logger.info('Gemini API initialized successfully.');
      } catch (error) {
        logger.error(error, 'Failed to initialize Gemini API. Falling back to mock mode.');
      }
    } else {
      logger.warn('GEMINI_API_KEY not found in environment. Running AI features in Mock Mode.');
    }
  }

  async generateCarbonAdvice(lifestyleData: any): Promise<string> {
    if (this.isMockMode || !this.ai) {
      return 'Mock Advice: Based on your recent travel logs, switching to public transport could reduce your emissions by 18% this month.';
    }

    try {
      const prompt = `Analyze this lifestyle data and provide personalized sustainability advice: ${JSON.stringify(lifestyleData)}`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || 'Unable to generate advice.';
    } catch (error) {
      logger.error(error, 'Gemini API Error');
      return 'Error generating advice. Please try again later.';
    }
  }

  async generateHabitAnalysis(entries: any[]): Promise<string> {
    if (this.isMockMode || !this.ai) {
      return 'Mock Analysis: You produce most emissions during weekends due to vehicle usage.';
    }

    try {
      const prompt = `Analyze these carbon entries and detect unhealthy habits: ${JSON.stringify(entries)}`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text || 'No significant patterns detected.';
    } catch (error) {
      logger.error(error, 'Gemini API Error');
      return 'Error analyzing habits.';
    }
  }

  async chatWithEcoCoach(message: string, history: any[]): Promise<string> {
    if (this.isMockMode || !this.ai) {
      return `Mock Coach: That's a great question about "${message}". Using reusable bags is a great first step!`;
    }

    try {
      // Setup a chat session
      const chat = this.ai.chats.create({
        model: 'gemini-2.5-pro',
        config: {
          systemInstruction: 'You are the CarbonIQ AI Eco Coach, a helpful sustainability assistant.',
        }
      });
      
      const response = await chat.sendMessage({ message });
      return response.text || 'I am having trouble understanding.';
    } catch (error) {
      logger.error(error, 'Gemini API Error');
      return 'Error communicating with Eco Coach.';
    }
  }

  async generateChallenges(userProfile: any): Promise<any[]> {
    if (this.isMockMode || !this.ai) {
      return [
        { title: 'Bike 20km', description: 'Use a bicycle for 20km this week instead of a car.', difficulty: 'MEDIUM' },
        { title: 'Plant a tree', description: 'Plant one tree in your local area.', difficulty: 'HARD' }
      ];
    }

    try {
      const prompt = `Generate 3 personalized sustainability challenges based on this profile: ${JSON.stringify(userProfile)}. Return ONLY valid JSON array with objects containing title, description, and difficulty (EASY, MEDIUM, HARD).`;
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      let text = response.text || '[]';
      // Basic cleanup for markdown json blocks
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(text);
    } catch (error) {
      logger.error(error, 'Gemini API Error');
      return [];
    }
  }
}

// Export singleton instance
export const aiService: AiService = new GeminiService();
