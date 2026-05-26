import { Page } from '@playwright/test';

export interface HealingResult {
  healed: boolean;
  suggestedLocator?: string;
  reason?: string;
}

export async function aiHeal(
  page: Page,
  elementDescription: string
): Promise<HealingResult> {
  try {
    // Capture current DOM snapshot
    const dom = await page.evaluate(() => document.body.innerHTML);
    const trimmedDom = dom.substring(0, 3000); // keep token cost low

    const prompt = `You are a Playwright test automation expert.
A locator has failed during a test run. Your job is to suggest a replacement.

Element I was looking for: "${elementDescription}"

Current page DOM (truncated):
${trimmedDom}

Respond in JSON only. No explanation. Format:
{
  "locator": "page.getByRole(...) or page.getByPlaceholder(...) etc",
  "reason": "one sentence explanation"
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data?.content?.[0]?.text || '';
    const parsed = JSON.parse(text);

    console.log(`[AI HEALER] Suggested locator: ${parsed.locator}`);
    console.log(`[AI HEALER] Reason: ${parsed.reason}`);

    return {
      healed: true,
      suggestedLocator: parsed.locator,
      reason: parsed.reason,
    };
  } catch (error) {
    console.log(`[AI HEALER] Failed to get suggestion: ${error}`);
    return { healed: false };
  }
}