// Test script to demonstrate chill Gemini suggestions
const { GoogleGenAI } = require('@google/genai');

async function testChillActivities() {
  try {
    const apiKey = 'AIzaSyAWpB-v4CqVry09qCAzn1f-Be4jNhYNW7Q';
    const genAI = new GoogleGenAI({ apiKey });
    
    // Test with chill activity requirements
    const prompt = `You are an AI assistant helping college students at Purdue University find fun hangout activities. 

User Profile:
- Name: Demo User
- Majors: Computer Science
- Interests: Technology, Gaming
- Number of buddies: 2
- Current schedule: 6 classes

CRITICAL REQUIREMENTS - The activity should be chill and fun:

Please suggest ONE chill, fun GROUP HANGOUT ACTIVITY for college students. The activity should:
1. Be a relaxed, social hangout (like "going to a concert together" or "getting coffee together")
2. Be appropriate for Purdue University students in West Lafayette, Indiana
3. Work well for a GROUP of 3 people (including the user)
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
    
    const result = await genAI.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ parts: [{ text: prompt }] }]
    });
    const text = result.candidates[0].content.parts[0].text;
    
    console.log('Chill Gemini Response:');
    console.log('='.repeat(80));
    console.log(text);
    
    // Try to parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('\nParsed Chill Activity:');
      console.log('='.repeat(40));
      console.log(`Activity: ${parsed.activity}`);
      console.log(`Description: ${parsed.description}`);
      console.log(`Location: ${parsed.location}`);
      console.log(`Duration: ${parsed.duration} minutes`);
      console.log(`Category: ${parsed.category}`);
      console.log(`Reasoning: ${parsed.reasoning}`);
    }
    
  } catch (error) {
    console.error('Error testing chill activities:', error);
  }
}

testChillActivities();
