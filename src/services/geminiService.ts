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
      return this.parseGeminiResponse(text, user);
    } catch (error) {
      console.error('Error generating Gemini suggestions:', error);
      // Fallback to a default suggestion if Gemini fails
      return this.getFallbackSuggestion(user);
    }
  }

  private createPrompt(user: User, usedActivities: string[], buddyCount: number): string {
    const interests = user.interests.join(', ');
    const majors = user.majors.join(', ');
    const usedActivitiesText = usedActivities.length > 0 ? `Avoid these activities: ${usedActivities.join(', ')}` : '';
    
    // Create specific guidance based on majors
    const majorGuidance = this.getMajorSpecificGuidance(user.majors);
    
    // Create specific guidance based on interests
    const interestGuidance = this.getInterestSpecificGuidance(user.interests);
    
    return `You are an AI assistant helping college students at Purdue University find fun hangout activities. 

User Profile:
- Name: ${user.name}
- Majors: ${majors}
- Interests: ${interests}
- Number of buddies: ${buddyCount}
- Current schedule: ${user.schedule.length} classes

${usedActivitiesText}

CRITICAL REQUIREMENTS - The activity MUST align with their profile:

${majorGuidance}

${interestGuidance}

Please suggest ONE creative, personalized hangout activity that DIRECTLY connects to their academic and personal interests. The activity should:
1. DIRECTLY relate to their major(s): ${majors}
2. DIRECTLY relate to their interests: ${interests}
3. Be appropriate for Purdue University students in West Lafayette, Indiana
4. Work well for a group of ${buddyCount + 1} people (including the user)
5. Be feasible and accessible for college students
6. Be engaging and educational/fun

Respond in this EXACT JSON format:
{
  "activity": "Activity Name",
  "description": "Detailed description explaining how this activity connects to their ${majors} major and ${interests} interests",
  "location": "Specific location in West Lafayette/Purdue area",
  "duration": 120,
  "category": "Category (Study, Entertainment, Outdoor, Food, Sports, Arts, Technology, etc.)",
  "reasoning": "Specific explanation of how this activity aligns with their ${majors} major and ${interests} interests"
}

Make sure the activity is:
- DIRECTLY relevant to their academic field (${majors})
- DIRECTLY relevant to their personal interests (${interests})
- Appropriate for college students
- Feasible in the West Lafayette/Purdue area
- Not already suggested (avoid: ${usedActivities.join(', ')})
- Engaging and educational

Duration should be in minutes (60-300 range).`;
  }

  private getMajorSpecificGuidance(majors: string[]): string {
    const guidance: string[] = [];
    
    majors.forEach(major => {
      const lowerMajor = major.toLowerCase();
      
      if (lowerMajor.includes('computer') || lowerMajor.includes('cs') || lowerMajor.includes('software')) {
        guidance.push(`- For Computer Science/Software Engineering: Suggest tech-related activities like coding challenges, hackathons, tech meetups, programming workshops, AI/ML projects, game development, or tech company visits`);
      } else if (lowerMajor.includes('engineering')) {
        guidance.push(`- For Engineering: Suggest hands-on engineering activities like building projects, engineering competitions, maker spaces, robotics, or engineering workshops`);
      } else if (lowerMajor.includes('business') || lowerMajor.includes('management')) {
        guidance.push(`- For Business/Management: Suggest business-related activities like case study competitions, networking events, startup workshops, or business simulations`);
      } else if (lowerMajor.includes('math') || lowerMajor.includes('mathematics')) {
        guidance.push(`- For Mathematics: Suggest math-related activities like puzzle competitions, mathematical modeling, statistics projects, or math games`);
      } else if (lowerMajor.includes('physics')) {
        guidance.push(`- For Physics: Suggest physics-related activities like science experiments, physics demonstrations, astronomy, or science museum visits`);
      } else if (lowerMajor.includes('biology') || lowerMajor.includes('life')) {
        guidance.push(`- For Biology/Life Sciences: Suggest biology-related activities like nature walks, lab experiments, biology competitions, or science outreach`);
      } else if (lowerMajor.includes('chemistry')) {
        guidance.push(`- For Chemistry: Suggest chemistry-related activities like chemistry experiments, lab tours, chemistry competitions, or science demonstrations`);
      } else if (lowerMajor.includes('english') || lowerMajor.includes('literature')) {
        guidance.push(`- For English/Literature: Suggest literature-related activities like book clubs, writing workshops, poetry readings, or literary discussions`);
      } else if (lowerMajor.includes('psychology')) {
        guidance.push(`- For Psychology: Suggest psychology-related activities like psychology experiments, mental health awareness events, or psychology discussions`);
      } else if (lowerMajor.includes('communication')) {
        guidance.push(`- For Communication: Suggest communication-related activities like public speaking practice, media production, or communication workshops`);
      } else {
        guidance.push(`- For ${major}: Suggest activities that relate to ${major} field of study, such as professional development, field-specific projects, or academic competitions`);
      }
    });
    
    return guidance.length > 0 ? `MAJOR-SPECIFIC GUIDANCE:\n${guidance.join('\n')}` : '';
  }

  private getInterestSpecificGuidance(interests: string[]): string {
    const guidance: string[] = [];
    
    interests.forEach(interest => {
      const lowerInterest = interest.toLowerCase();
      
      if (lowerInterest.includes('technology') || lowerInterest.includes('tech')) {
        guidance.push(`- For Technology interest: Include tech elements like coding, AI, gadgets, tech talks, or digital projects`);
      } else if (lowerInterest.includes('gaming') || lowerInterest.includes('game')) {
        guidance.push(`- For Gaming interest: Include gaming elements like game development, gaming tournaments, esports, or gaming cafes`);
      } else if (lowerInterest.includes('music')) {
        guidance.push(`- For Music interest: Include music elements like concerts, music production, jam sessions, or music events`);
      } else if (lowerInterest.includes('sports') || lowerInterest.includes('athletic')) {
        guidance.push(`- For Sports interest: Include sports elements like team sports, fitness activities, sports events, or athletic competitions`);
      } else if (lowerInterest.includes('art') || lowerInterest.includes('creative')) {
        guidance.push(`- For Art/Creative interest: Include creative elements like art projects, creative workshops, galleries, or artistic activities`);
      } else if (lowerInterest.includes('science') || lowerInterest.includes('research')) {
        guidance.push(`- For Science/Research interest: Include scientific elements like experiments, research projects, science talks, or lab activities`);
      } else if (lowerInterest.includes('reading') || lowerInterest.includes('books')) {
        guidance.push(`- For Reading/Books interest: Include literary elements like book clubs, reading groups, literary events, or library activities`);
      } else if (lowerInterest.includes('outdoor') || lowerInterest.includes('nature')) {
        guidance.push(`- For Outdoor/Nature interest: Include outdoor elements like hiking, nature walks, outdoor sports, or environmental activities`);
      } else if (lowerInterest.includes('food') || lowerInterest.includes('cooking')) {
        guidance.push(`- For Food/Cooking interest: Include culinary elements like cooking classes, food tours, restaurant visits, or culinary experiments`);
      } else if (lowerInterest.includes('travel') || lowerInterest.includes('adventure')) {
        guidance.push(`- For Travel/Adventure interest: Include adventure elements like exploring new places, adventure activities, or travel planning`);
      } else {
        guidance.push(`- For ${interest} interest: Include elements related to ${interest}, such as ${interest}-focused activities, workshops, or events`);
      }
    });
    
    return guidance.length > 0 ? `INTEREST-SPECIFIC GUIDANCE:\n${guidance.join('\n')}` : '';
  }

  private parseGeminiResponse(text: string, user?: User): {
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
      return this.getFallbackSuggestion(user);
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

  private getFallbackSuggestion(user?: User): {
    activity: string;
    description: string;
    location: string;
    duration: number;
    category: string;
    suggestedTime: Date;
  } {
    // If we have user data, try to create a more relevant fallback
    if (user) {
      const majors = user.majors.map(m => m.toLowerCase());
      const interests = user.interests.map(i => i.toLowerCase());
      
      // Check for CS/Technology major or interest
      if (majors.some(m => m.includes('computer') || m.includes('cs')) || 
          interests.some(i => i.includes('technology') || i.includes('gaming'))) {
        return {
          activity: 'Tech Study Group',
          description: 'Collaborative coding session focusing on current coursework and tech projects',
          location: 'Purdue CS Building Study Room',
          duration: 150,
          category: 'Study',
          suggestedTime: this.generateSuggestedTime()
        };
      }
      
      // Check for engineering major
      if (majors.some(m => m.includes('engineering'))) {
        return {
          activity: 'Engineering Project Workshop',
          description: 'Hands-on engineering project session with your study group',
          location: 'Purdue Engineering Building',
          duration: 180,
          category: 'Study',
          suggestedTime: this.generateSuggestedTime()
        };
      }
      
      // Check for music interest
      if (interests.some(i => i.includes('music'))) {
        return {
          activity: 'Music Jam Session',
          description: 'Collaborative music making session with friends',
          location: 'Purdue Music Building or Student Union',
          duration: 120,
          category: 'Entertainment',
          suggestedTime: this.generateSuggestedTime()
        };
      }
    }
    
    // Default fallback activities
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
        activity: 'Study Group Session',
        description: 'Collaborative study session with your buddies',
        location: 'Purdue Library',
        duration: 150,
        category: 'Study'
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
