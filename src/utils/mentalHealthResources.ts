interface MentalHealthTip {
  category: string;
  tips: string[];
}

export const mentalHealthResources: { [key: string]: MentalHealthTip } = {
  anxiety: {
    category: "Anxiety",
    tips: [
      "Practice deep breathing exercises: Inhale for 4 counts, hold for 4, exhale for 4",
      "Challenge negative thoughts with evidence-based thinking",
      "Use grounding techniques like the 5-4-3-2-1 method (name 5 things you see, 4 you feel, etc.)",
      "Maintain a regular sleep schedule",
      "Limit caffeine and alcohol intake",
      "Consider talking to a mental health professional for Cognitive Behavioral Therapy (CBT)"
    ]
  },
  depression: {
    category: "Depression",
    tips: [
      "Set small, achievable daily goals",
      "Try to maintain a regular daily routine",
      "Exercise, even if it's just a short walk",
      "Reach out to friends or family members",
      "Practice self-care activities you usually enjoy",
      "Consider speaking with a mental health professional about therapy or medication options"
    ]
  },
  stress: {
    category: "Stress Management",
    tips: [
      "Break large tasks into smaller, manageable steps",
      "Practice mindfulness or meditation",
      "Exercise regularly to release endorphins",
      "Maintain a healthy work-life balance",
      "Set boundaries with work and relationships",
      "Use time management techniques like the Pomodoro method"
    ]
  },
  sleep: {
    category: "Sleep Issues",
    tips: [
      "Maintain a consistent sleep schedule",
      "Create a relaxing bedtime routine",
      "Avoid screens for an hour before bed",
      "Keep your bedroom cool, dark, and quiet",
      "Limit caffeine after noon",
      "Consider speaking with a healthcare provider if sleep problems persist"
    ]
  },
  relationships: {
    category: "Relationship Concerns",
    tips: [
      "Practice active listening",
      "Express feelings using 'I' statements",
      "Set and maintain healthy boundaries",
      "Take time for self-reflection",
      "Consider couples counseling for ongoing issues",
      "Focus on open and honest communication"
    ]
  },
  selfEsteem: {
    category: "Self-Esteem",
    tips: [
      "Practice positive self-talk",
      "Set realistic goals and celebrate achievements",
      "Focus on your strengths and accomplishments",
      "Challenge negative self-perceptions",
      "Surround yourself with supportive people",
      "Consider working with a therapist on self-worth issues"
    ]
  }
};

export function getRelevantTips(message: string): string[] {
  message = message.toLowerCase();
  let relevantTips: string[] = [];

  // Check for anxiety-related keywords
  if (message.match(/anxious|anxiety|worry|panic|stress|overwhelm/)) {
    relevantTips = relevantTips.concat(mentalHealthResources.anxiety.tips);
  }

  // Check for depression-related keywords
  if (message.match(/depress|sad|hopeless|unmotivated|tired|exhausted/)) {
    relevantTips = relevantTips.concat(mentalHealthResources.depression.tips);
  }

  // Check for stress-related keywords
  if (message.match(/stress|busy|workload|pressure|deadline|overwhelm/)) {
    relevantTips = relevantTips.concat(mentalHealthResources.stress.tips);
  }

  // Check for sleep-related keywords
  if (message.match(/sleep|insomnia|tired|rest|fatigue|exhausted/)) {
    relevantTips = relevantTips.concat(mentalHealthResources.sleep.tips);
  }

  // Check for relationship-related keywords
  if (message.match(/relationship|partner|friend|family|conflict|argument/)) {
    relevantTips = relevantTips.concat(mentalHealthResources.relationships.tips);
  }

  // Check for self-esteem-related keywords
  if (message.match(/confidence|self-esteem|worth|value|hate myself|not good enough/)) {
    relevantTips = relevantTips.concat(mentalHealthResources.selfEsteem.tips);
  }

  // If no specific category matches, return general wellness tips
  if (relevantTips.length === 0) {
    relevantTips = [
      "Practice self-care activities that you enjoy",
      "Maintain a balanced daily routine",
      "Stay connected with supportive people",
      "Consider talking to a mental health professional",
      "Remember that seeking help is a sign of strength"
    ];
  }

  // Randomize and limit the number of tips
  return relevantTips
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
}

export const emergencyResources = [
  "If you're having thoughts of suicide or experiencing a mental health crisis, please:",
  "- Call 988 for the Suicide and Crisis Lifeline (US)",
  "- Call 911 or go to the nearest emergency room if you're in immediate danger",
  "- Text HOME to 741741 to connect with a Crisis Counselor",
  "Remember: You're not alone, and help is available 24/7."
];
