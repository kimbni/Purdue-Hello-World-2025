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
    
    return `You are an AI assistant helping college students at Purdue University find fun hangout activities. 

User Profile:
- Name: ${user.name}
- Majors: ${majors}
- Interests: ${interests}
- Number of buddies: ${buddyCount}
- Current schedule: ${user.schedule.length} classes

${usedActivitiesText}

CRITICAL REQUIREMENTS - The activity should be chill and fun:

Please suggest ONE chill, fun GROUP HANGOUT ACTIVITY for college students. The activity should:
1. Be a relaxed, social hangout (like "going to a concert together" or "getting coffee together")
2. Be appropriate for Purdue University students in West Lafayette, Indiana
3. Work well for a GROUP of ${buddyCount + 1} people (including the user)
4. Be feasible and accessible for college students
5. Be fun and social - no need to be educational or academic
6. **CRITICAL: This must be a GROUP ACTIVITY/HANGOUT, NOT a solo project or individual work**
7. **VARY THE ACTIVITY TYPE** - don't always suggest the same type of activity

Respond in this EXACT JSON format:
{
  "activity": "Activity Name",
  "description": "Brief, chill description of what you'll do together",
  "location": "Specific location in West Lafayette/Purdue area",
  "duration": 120,
  "category": "Category (Entertainment, Food, Outdoor, Sports, Arts, Social, etc.)",
  "reasoning": "Why this is a fun group activity"
}

Make sure the activity is:
- Appropriate for college students
- Feasible in the West Lafayette/Purdue area
- Not already suggested (avoid: ${usedActivities.join(', ')})
- **CHILL AND RELAXED** - like hanging out with friends
- **A GROUP HANGOUT ACTIVITY** - NOT a solo project, individual assignment, or personal work
- **SOCIAL** - involves interaction between group members
- **VARIED** - try different types of activities (food, entertainment, outdoor, etc.)

**GOOD EXAMPLES OF CHILL ACTIVITIES:**
- Going to a concert together
- Getting coffee and chatting
- Playing board games at a cafe
- Going to a food truck festival
- Watching a movie together
- Going bowling
- Having a picnic in the park
- Going to a farmers market
- Playing mini golf
- Going to a local brewery/restaurant

**FORBIDDEN ACTIVITIES:**
- Solo projects or individual work
- Personal assignments or homework
- Activities that can be done alone
- Individual study sessions
- Academic or educational activities
- Work-related activities

**REQUIRED ACTIVITIES:**
- Group hangouts and social activities
- Relaxed, fun activities
- Social bonding activities
- Activities that friends do together

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
      
      // Generate a suggested time (next 1-14 days, avoiding class conflicts)
      const suggestedTime = this.generateSuggestedTime(user);
      
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

  private generateSuggestedTime(user?: User): Date {
    // Generate random time in the next 2 weeks
    const randomDays = Math.floor(Math.random() * 14) + 1;
    
    const suggestedTime = new Date();
    suggestedTime.setDate(suggestedTime.getDate() + randomDays);
    
    // Try to find a good time that doesn't conflict with classes
    let attempts = 0;
    let goodTime = false;
    
    while (!goodTime && attempts < 10) {
      // Generate random time between 10 AM and 8 PM
      const randomHours = Math.floor(Math.random() * 10) + 10; // Between 10 AM and 8 PM
      const randomMinutes = Math.random() < 0.5 ? 0 : 30; // Either on the hour or half hour
      
      suggestedTime.setHours(randomHours, randomMinutes, 0, 0);
      
      // Check if this time conflicts with any classes
      if (user && user.schedule) {
        const conflictsWithClass = this.hasClassConflict(suggestedTime, user.schedule);
        if (!conflictsWithClass) {
          goodTime = true;
        }
      } else {
        goodTime = true; // If no schedule info, just use the time
      }
      
      attempts++;
    }
    
    // If we couldn't find a good time, use evening hours (6-8 PM) which are less likely to conflict
    if (!goodTime) {
      const eveningHours = Math.floor(Math.random() * 3) + 18; // 6-8 PM
      suggestedTime.setHours(eveningHours, 0, 0, 0);
    }
    
    return suggestedTime;
  }

  private hasClassConflict(suggestedTime: Date, schedule: any[]): boolean {
    const dayOfWeek = suggestedTime.getDay();
    const suggestedHour = suggestedTime.getHours();
    const suggestedMinute = suggestedTime.getMinutes();
    const suggestedTimeMinutes = suggestedHour * 60 + suggestedMinute;
    
    // Check each class for conflicts
    for (const classItem of schedule) {
      if (classItem.dayOfWeek === dayOfWeek) {
        const startTime = this.parseTimeToMinutes(classItem.startTime);
        const endTime = this.parseTimeToMinutes(classItem.endTime);
        
        // Check if suggested time overlaps with class time (with 30 min buffer)
        if (suggestedTimeMinutes >= (startTime - 30) && suggestedTimeMinutes <= (endTime + 30)) {
          return true;
        }
      }
    }
    
    return false;
  }

  private parseTimeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private getFallbackSuggestion(user?: User): {
    activity: string;
    description: string;
    location: string;
    duration: number;
    category: string;
    suggestedTime: Date;
  } {
    // If we have user data, create chill fallback activities
    if (user) {
      
      // Random chill fallback activities
      const chillActivities = [
        {
          activity: 'Coffee Hangout',
          description: 'Grab coffee and chat with your friends at a local cafe',
          location: 'Local Coffee Shop',
          duration: 90,
          category: 'Food'
        },
        {
          activity: 'Movie Night',
          description: 'Watch a movie together at home or at the cinema',
          location: 'Home or Cinema',
          duration: 150,
          category: 'Entertainment'
        },
        {
          activity: 'Bowling Night',
          description: 'Go bowling together and have some fun',
          location: 'Local Bowling Alley',
          duration: 120,
          category: 'Sports'
        },
        {
          activity: 'Food Truck Festival',
          description: 'Check out local food trucks and try different cuisines together',
          location: 'Downtown Food Truck Park',
          duration: 120,
          category: 'Food'
        },
        {
          activity: 'Picnic in the Park',
          description: 'Have a relaxing picnic together in a local park',
          location: 'Local Park',
          duration: 120,
          category: 'Outdoor'
        }
      ];
      
      const randomActivity = chillActivities[Math.floor(Math.random() * chillActivities.length)];
      return {
        ...randomActivity,
        suggestedTime: this.generateSuggestedTime(user)
      };
    }
    
    // Default fallback activities - all chill group activities
    const fallbackActivities = [
      {
        activity: 'Coffee Hangout',
        description: 'Grab coffee and chat with your friends at a local cafe',
        location: 'Local Coffee Shop',
        duration: 90,
        category: 'Food'
      },
      {
        activity: 'Campus Walk',
        description: 'Take a relaxing walk around campus and discover new spots together',
        location: 'Purdue Campus',
        duration: 90,
        category: 'Outdoor'
      },
      {
        activity: 'Game Night',
        description: 'Play board games or video games together',
        location: 'Home or Game Cafe',
        duration: 120,
        category: 'Entertainment'
      }
    ];
    
    const randomActivity = fallbackActivities[Math.floor(Math.random() * fallbackActivities.length)];
    
    return {
      ...randomActivity,
      suggestedTime: this.generateSuggestedTime(user)
    };
  }
}

export const geminiService = new GeminiService();
