'use server';

/**
 * @fileOverview A crypto recommendation AI agent.
 *
 * - generateCryptoRecommendation - A function that handles the crypto recommendation process.
 * - GenerateCryptoRecommendationInput - The input type for the generateCryptoRecommendation function.
 * - GenerateCryptoRecommendationOutput - The return type for the generateCryptoRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCryptoRecommendationInputSchema = z.object({
  riskProfile: z
    .string()
    .describe("The user's risk profile (e.g., Very Low, Low, Medium, High, Super High)."),
  investmentHorizon: z
    .string()
    .describe("The user's investment horizon (e.g., Short, Medium, Long)."),
  experienceYears: z
    .number()
    .describe('The number of years of experience the user has in crypto investing.'),
  preferences: z
    .string()
    .describe('The user preferred coins (e.g., BTC, ETH, ...), or other preferences'),
  volumeSpike: z.number().describe('24h volume / 7d avg volume.'),
  momentumScore: z.number().describe('Normalized 7d change + sparkline slope.'),
  volatilityScore: z.number().describe('stddev of last N closes (from sparkline).'),
  marketCapBucket: z
    .string()
    .describe('Market cap bucket: Mega, Large, Mid, Small.'),
  coinId: z.string().describe('The ID of the coin to generate a recommendation for.'),
});
export type GenerateCryptoRecommendationInput = z.infer<typeof GenerateCryptoRecommendationInputSchema>;

const GenerateCryptoRecommendationOutputSchema = z.object({
  riskTier: z.string().describe('The risk tier of the recommended crypto.'),
  confidence: z.number().describe('The confidence level of the recommendation (0-100).'),
  suggestedAllocationPct: z
    .number()
    .describe('The suggested allocation percentage for the crypto in the portfolio.'),
  suggestedHoldDays: z.number().describe('The suggested hold days for the crypto.'),
  reasonSummary: z.string().describe('A summary of the reasons for the recommendation.'),
});
export type GenerateCryptoRecommendationOutput = z.infer<typeof GenerateCryptoRecommendationOutputSchema>;

export async function generateCryptoRecommendation(input: GenerateCryptoRecommendationInput): Promise<GenerateCryptoRecommendationOutput> {
  return generateCryptoRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCryptoRecommendationPrompt',
  input: {schema: GenerateCryptoRecommendationInputSchema},
  output: {schema: GenerateCryptoRecommendationOutputSchema},
  prompt: `You are an AI-powered crypto recommendation engine. You provide personalized crypto recommendations based on user profile, investment horizon, and experience. Use the following information to formulate your recommendation. Always respond in a valid JSON format as described in the output schema.

User Risk Profile: {{{riskProfile}}}
Investment Horizon: {{{investmentHorizon}}}
Experience (Years): {{{experienceYears}}}
Preferences: {{{preferences}}}
\nCoin Id: {{{coinId}}}
Market Cap Bucket: {{{marketCapBucket}}}
24h Volume Spike: {{{volumeSpike}}}
7d Momentum Score: {{{momentumScore}}}
Volatility Score: {{{volatilityScore}}}

Consider these factors when determining the risk tier, confidence, allocation, hold days, and reason summary. Always respond in a valid JSON format.
`,
});

const generateCryptoRecommendationFlow = ai.defineFlow(
  {
    name: 'generateCryptoRecommendationFlow',
    inputSchema: GenerateCryptoRecommendationInputSchema,
    outputSchema: GenerateCryptoRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
