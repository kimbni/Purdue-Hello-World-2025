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

Please suggest ONE creative, personalized GROUP HANGOUT ACTIVITY that DIRECTLY connects to their academic and personal interests. The activity should:
1. DIRECTLY relate to their major(s): ${majors}
2. DIRECTLY relate to their interests: ${interests}
3. Be appropriate for Purdue University students in West Lafayette, Indiana
4. Work well for a GROUP of ${buddyCount + 1} people (including the user)
5. Be feasible and accessible for college students
6. Be engaging and educational/fun
7. **CRITICAL: This must be a GROUP ACTIVITY/HANGOUT, NOT a solo project or individual work**

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
- **A GROUP HANGOUT ACTIVITY** - NOT a solo project, individual assignment, or personal work
- **COLLABORATIVE** - requires multiple people working together
- **SOCIAL** - involves interaction and teamwork between group members

**FORBIDDEN ACTIVITIES:**
- Solo projects or individual work
- Personal assignments or homework
- Activities that can be done alone
- Individual study sessions
- Solo coding projects
- Personal research

**REQUIRED ACTIVITIES:**
- Group hangouts and social activities
- Collaborative projects requiring teamwork
- Interactive group experiences
- Social bonding activities
- Team-based challenges or competitions

Duration should be in minutes (60-300 range).`;
  }

  private getMajorSpecificGuidance(majors: string[]): string {
    const guidance: string[] = [];
    
    majors.forEach(major => {
      const lowerMajor = major.toLowerCase();
      
      if (lowerMajor.includes('computer') || lowerMajor.includes('cs') || lowerMajor.includes('software')) {
        guidance.push(`- For Computer Science/Software Engineering: Suggest GROUP tech activities like collaborative coding challenges, team hackathons, group programming workshops, multiplayer game development sessions, or group tech meetups`);
      } else if (lowerMajor.includes('engineering')) {
        guidance.push(`- For Engineering: Suggest GROUP engineering activities like team building projects, collaborative engineering competitions, group maker space sessions, team robotics challenges, or group engineering workshops`);
      } else if (lowerMajor.includes('business') || lowerMajor.includes('management')) {
        guidance.push(`- For Business/Management: Suggest GROUP business activities like team case study competitions, group networking events, collaborative startup workshops, or team business simulations`);
      } else if (lowerMajor.includes('math') || lowerMajor.includes('mathematics')) {
        guidance.push(`- For Mathematics: Suggest GROUP math activities like team puzzle competitions, collaborative mathematical modeling, group statistics projects, or team math games`);
      } else if (lowerMajor.includes('physics')) {
        guidance.push(`- For Physics: Suggest GROUP physics activities like collaborative science experiments, team physics demonstrations, group astronomy sessions, or team science museum visits`);
      } else if (lowerMajor.includes('biology') || lowerMajor.includes('life')) {
        guidance.push(`- For Biology/Life Sciences: Suggest GROUP biology activities like collaborative nature walks, team lab experiments, group biology competitions, or team science outreach`);
      } else if (lowerMajor.includes('chemistry')) {
        guidance.push(`- For Chemistry: Suggest GROUP chemistry activities like collaborative chemistry experiments, team lab tours, group chemistry competitions, or team science demonstrations`);
      } else if (lowerMajor.includes('english') || lowerMajor.includes('literature')) {
        guidance.push(`- For English/Literature: Suggest GROUP literature activities like collaborative book clubs, team writing workshops, group poetry readings, or team literary discussions`);
      } else if (lowerMajor.includes('psychology')) {
        guidance.push(`- For Psychology: Suggest GROUP psychology activities like collaborative psychology experiments, team mental health awareness events, or group psychology discussions`);
      } else if (lowerMajor.includes('communication')) {
        guidance.push(`- For Communication: Suggest GROUP communication activities like collaborative public speaking practice, team media production, or group communication workshops`);
      } else {
        guidance.push(`- For ${major}: Suggest GROUP activities that relate to ${major} field of study, such as collaborative professional development, team field-specific projects, or group academic competitions`);
      }
    });
    
    return guidance.length > 0 ? `MAJOR-SPECIFIC GUIDANCE:\n${guidance.join('\n')}` : '';
  }

  private getInterestSpecificGuidance(interests: string[]): string {
    const guidance: string[] = [];
    
    interests.forEach(interest => {
      const lowerInterest = interest.toLowerCase();
      
      if (lowerInterest.includes('technology') || lowerInterest.includes('tech')) {
        guidance.push(`- For Technology interest: Include GROUP tech elements like collaborative coding, team AI projects, group gadget exploration, team tech talks, or collaborative digital projects`);
      } else if (lowerInterest.includes('gaming') || lowerInterest.includes('game')) {
        guidance.push(`- For Gaming interest: Include GROUP gaming elements like collaborative game development, team gaming tournaments, group esports, or group gaming cafe visits`);
      } else if (lowerInterest.includes('music')) {
        guidance.push(`- For Music interest: Include GROUP music elements like collaborative concerts, team music production, group jam sessions, or group music events`);
      } else if (lowerInterest.includes('sports') || lowerInterest.includes('athletic')) {
        guidance.push(`- For Sports interest: Include GROUP sports elements like team sports, group fitness activities, team sports events, or group athletic competitions`);
      } else if (lowerInterest.includes('art') || lowerInterest.includes('creative')) {
        guidance.push(`- For Art/Creative interest: Include GROUP creative elements like collaborative art projects, group creative workshops, team gallery visits, or group artistic activities`);
      } else if (lowerInterest.includes('science') || lowerInterest.includes('research')) {
        guidance.push(`- For Science/Research interest: Include GROUP scientific elements like collaborative experiments, team research projects, group science talks, or group lab activities`);
      } else if (lowerInterest.includes('reading') || lowerInterest.includes('books')) {
        guidance.push(`- For Reading/Books interest: Include GROUP literary elements like collaborative book clubs, group reading sessions, team literary events, or group library activities`);
      } else if (lowerInterest.includes('outdoor') || lowerInterest.includes('nature')) {
        guidance.push(`- For Outdoor/Nature interest: Include GROUP outdoor elements like group hiking, team nature walks, group outdoor sports, or team environmental activities`);
      } else if (lowerInterest.includes('food') || lowerInterest.includes('cooking')) {
        guidance.push(`- For Food/Cooking interest: Include GROUP culinary elements like collaborative cooking classes, group food tours, team restaurant visits, or group culinary experiments`);
      } else if (lowerInterest.includes('travel') || lowerInterest.includes('adventure')) {
        guidance.push(`- For Travel/Adventure interest: Include GROUP adventure elements like collaborative exploration, group adventure activities, or team travel planning`);
      } else {
        guidance.push(`- For ${interest} interest: Include GROUP elements related to ${interest}, such as collaborative ${interest}-focused activities, group workshops, or team events`);
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
          activity: 'Group Tech Study Session',
          description: 'Collaborative coding session with your study group focusing on current coursework and tech projects',
          location: 'Purdue CS Building Study Room',
          duration: 150,
          category: 'Study',
          suggestedTime: this.generateSuggestedTime()
        };
      }
      
      // Check for engineering major
      if (majors.some(m => m.includes('engineering'))) {
        return {
          activity: 'Team Engineering Project Workshop',
          description: 'Collaborative hands-on engineering project session with your study group',
          location: 'Purdue Engineering Building',
          duration: 180,
          category: 'Study',
          suggestedTime: this.generateSuggestedTime()
        };
      }
      
      // Check for music interest
      if (interests.some(i => i.includes('music'))) {
        return {
          activity: 'Group Music Jam Session',
          description: 'Collaborative music making session with friends - bring instruments and create together',
          location: 'Purdue Music Building or Student Union',
          duration: 120,
          category: 'Entertainment',
          suggestedTime: this.generateSuggestedTime()
        };
      }
    }
    
    // Default fallback activities - all group activities
    const fallbackActivities = [
      {
        activity: 'Group Coffee & Study Session',
        description: 'Grab coffee and study together as a group at a local cafe',
        location: 'Local Coffee Shop',
        duration: 120,
        category: 'Study'
      },
      {
        activity: 'Group Campus Exploration',
        description: 'Take a group walk around campus and discover new spots together',
        location: 'Purdue Campus',
        duration: 90,
        category: 'Outdoor'
      },
      {
        activity: 'Collaborative Study Group Session',
        description: 'Team study session with your buddies - work on assignments together',
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
