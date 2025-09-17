import { config } from 'dotenv';
config();

import '@/ai/flows/generate-tutorials.ts';
import '@/ai/flows/ai-mentor-guidance.ts';
import '@/ai/flows/generate-quiz-questions.ts';
import '@/ai/flows/test-supabase.ts';
