export interface AiService {
  generateCarbonAdvice(lifestyleData: unknown): Promise<string>;
  generateHabitAnalysis(entries: unknown[]): Promise<string>;
  chatWithEcoCoach(message: string, history: unknown[]): Promise<string>;
  generateChallenges(userProfile: unknown): Promise<unknown[]>;
}
