export interface AiService {
  generateCarbonAdvice(lifestyleData: any): Promise<string>;
  generateHabitAnalysis(entries: any[]): Promise<string>;
  chatWithEcoCoach(message: string, history: any[]): Promise<string>;
  generateChallenges(userProfile: any): Promise<any[]>;
}
