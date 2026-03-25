export type StressInputs = {
  sleepHours: number; // 0-12
  screenTimeHours: number; // 0-24
  moodScore: number; // 1-5 (Sad to Stressed)
  activityMinutes: number; // 0-300
};

export type StressResult = {
  score: number;
  status: 'Calm' | 'Moderate' | 'High' | 'Crisis';
  insights: string[];
  suggestedAction: string;
};

export const calculateStressScore = (inputs: StressInputs): StressResult => {
  let score = 50; // Base score

  // Sleep effect (Less sleep = more stress)
  if (inputs.sleepHours < 6) score += 20;
  else if (inputs.sleepHours > 8) score -= 10;

  // Screen time effect (More screen time = more stress)
  if (inputs.screenTimeHours > 8) score += 15;
  else if (inputs.screenTimeHours < 4) score -= 5;

  // Mood effect
  if (inputs.moodScore === 5) score += 25; // Stressed
  else if (inputs.moodScore === 4) score += 10; // Great (might be high energy)
  else if (inputs.moodScore === 1) score += 15; // Sad

  // Activity effect (Exercise reduces stress)
  if (inputs.activityMinutes > 30) score -= 15;
  else if (inputs.activityMinutes === 0) score += 5;

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  let status: StressResult['status'] = 'Moderate';
  let suggestedAction = 'Try a 1-min breathing exercise.';
  const insights: string[] = [];

  if (score < 30) {
    status = 'Calm';
    suggestedAction = 'Keep maintaining this balance!';
    insights.push("Your routine is highly effective.");
  } else if (score >= 30 && score < 70) {
    status = 'Moderate';
    suggestedAction = 'A quick walk might help you reset.';
    insights.push("Increased screen time might be affecting your focus.");
  } else if (score >= 70 && score < 90) {
    status = 'High';
    suggestedAction = 'We recommend a deep-focus meditation session.';
    insights.push("Significant lack of sleep is driving your stress response.");
  } else {
    status = 'Crisis';
    suggestedAction = 'Consider taking the rest of the day off and talking to someone.';
    insights.push("Your indicators suggest extreme burnout risk.");
  }

  return { score, status, insights, suggestedAction };
};

export const detectCrisis = (text: string): boolean => {
  const crisisKeywords = ['self-harm', 'don\'t want to live', 'suicide', 'hurt myself', 'ending it'];
  return crisisKeywords.some(keyword => text.toLowerCase().includes(keyword));
};
