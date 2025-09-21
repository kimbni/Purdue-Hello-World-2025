import { GoogleGenAI } from '@google/genai';
import { User, HangoutSuggestion } from '../types';

class GeminiService {
  private genAI: GoogleGenAI;

  constructor() {
    // Initialize Gemini with API key from environment variables
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('REACT_APP_GEMINI_API_KEY environment variable is required');
    }
    
    this.genAI = new GoogleGenAI({ apiKey });
  }

  async generateActivitySuggestions(
    user: User, 
    existingSuggestions: HangoutSuggestion[],
    buddyCount: number = 0
  ): Promise<{
    activity: string;
    description: string;
    location: string;
    duration: number;
    category: string;
    suggestedTime: Date;
  }> {
    try {
      // Get existing activity names to avoid duplicates
      const usedActivities = existingSuggestions.map(s => s.activity);
      
      // Create a comprehensive prompt for Gemini
      const prompt = this.createPrompt(user, usedActivities, buddyCount);
      
      const result = await this.genAI.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: [{ parts: [{ text: prompt }] }]
      });
      
      // Safely extract text from response
      const candidates = result.candidates;
      if (!candidates || candidates.length === 0) {
        throw new Error('No candidates returned from Gemini');
      }
      
      const candidate = candidates[0];
      if (!candidate?.content?.parts || candidate.content.parts.length === 0) {
        throw new Error('No content parts returned from Gemini');
      }
      
      const text = candidate.content.parts[0].text;
      if (!text) {
        throw new Error('No text content returned from Gemini');
      }
      
      // Parse the response and extract activity details
      return this.parseGeminiResponse(text);
    } catch (error) {
      console.error('Error generating Gemini suggestions:', error);
      // Fallback to a default suggestion if Gemini fails
      return this.getFallbackSuggestion();
    }
  }

  private createPrompt(user: User, usedActivities: string[], buddyCount: number): string {
    const interests = user.interests.join(', ');
    const majors = user.majors.join(', ');
    const usedActivitiesText = usedActivities.length > 0 ? `Avoid these activities: ${usedActivities.join(', ')}` : '';
    
    return `You are an AI assistant helping college students at Purdue University find fun hangout activities. 

User Profile:
- Name: ${user.name}
- Majors: ${majors}
- Interests: ${interests}
- Number of buddies: ${buddyCount}
- Current schedule: ${user.schedule.length} classes

${usedActivitiesText}

Please suggest ONE creative, personalized hangout activity that would be perfect for this user and their buddies. Consider:
1. Their academic interests and majors
2. Their personal interests
3. The fact they're at Purdue University (West Lafayette, Indiana)
4. Seasonal appropriateness (current season)
5. Group size considerations
6. Accessibility and feasibility

Respond in this EXACT JSON format:
{
  "activity": "Activity Name",
  "description": "Brief description of what this activity involves",
  "location": "Specific location in West Lafayette/Purdue area or general location",
  "duration": 120,
  "category": "Category (Study, Entertainment, Outdoor, Food, Sports, Arts, etc.)",
  "reasoning": "Why this activity is perfect for this user"
}

Make sure the activity is:
- Appropriate for college students
- Feasible in the West Lafayette/Purdue area
- Not already suggested (avoid: ${usedActivities.join(', ')})
- Engaging and fun
- Considerate of their interests and academic background

Duration should be in minutes (60-300 range).`;
  }

  private parseGeminiResponse(text: string): {
    activity: string;
    description: string;
    location: string;
    duration: number;
    category: string;
    suggestedTime: Date;
  } {
    try {
      // Extract JSON from the response (it might have extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Generate a suggested time (next 1-14 days, avoiding weekends if possible)
      const suggestedTime = this.generateSuggestedTime();
      
      return {
        activity: parsed.activity || 'Fun Activity',
        description: parsed.description || 'A great way to spend time together',
        location: parsed.location || 'Purdue Campus',
        duration: parsed.duration || 120,
        category: parsed.category || 'Social',
        suggestedTime
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return this.getFallbackSuggestion();
    }
  }

  private generateSuggestedTime(): Date {
    // Generate random time in the next 2 weeks
    const randomDays = Math.floor(Math.random() * 14) + 1;
    const randomHours = Math.floor(Math.random() * 12) + 9; // Between 9 AM and 9 PM
    const randomMinutes = Math.random() < 0.5 ? 0 : 30; // Either on the hour or half hour
    
    const suggestedTime = new Date();
    suggestedTime.setDate(suggestedTime.getDate() + randomDays);
    suggestedTime.setHours(randomHours, randomMinutes, 0, 0);
    
    // Ensure it's not on a weekend if possible
    const dayOfWeek = suggestedTime.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Move to next Monday if it's weekend
      const daysToAdd = dayOfWeek === 0 ? 1 : 2;
      suggestedTime.setDate(suggestedTime.getDate() + daysToAdd);
    }
    
    return suggestedTime;
  }

  private getFallbackSuggestion(): {
    activity: string;
    description: string;
    location: string;
    duration: number;
    category: string;
    suggestedTime: Date;
  } {
    const fallbackActivities = [
      {
        activity: 'Coffee & Study Session',
        description: 'Grab coffee and study together at a local cafe',
        location: 'Local Coffee Shop',
        duration: 120,
        category: 'Study'
      },
      {
        activity: 'Campus Exploration',
        description: 'Take a walk around campus and discover new spots',
        location: 'Purdue Campus',
        duration: 90,
        category: 'Outdoor'
      },
      {
        activity: 'Game Night',
        description: 'Play board games or video games together',
        location: 'Home or Game Cafe',
        duration: 180,
        category: 'Entertainment'
      }
    ];
    
    const randomActivity = fallbackActivities[Math.floor(Math.random() * fallbackActivities.length)];
    
    return {
      ...randomActivity,
      suggestedTime: this.generateSuggestedTime()
    };
  }
}

export const geminiService = new GeminiService();
