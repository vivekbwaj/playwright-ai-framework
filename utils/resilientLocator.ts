import { Page, Locator } from '@playwright/test';

export interface ResilientLocatorOptions {
  description: string;
  primary: Locator;
  fallbacks?: Locator[];
}

export async function resilientClick(options: ResilientLocatorOptions): Promise<void> {
  const { description, primary, fallbacks = [] } = options;
  const all = [primary, ...fallbacks];

  for (let i = 0; i < all.length; i++) {
    const locator = all[i];
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      await locator.click();
      if (i > 0) {
        console.log(`[HEALED] "${description}" — primary failed, used fallback #${i}`);
      }
      return;
    } catch {
      console.log(
        `[RETRY] "${description}" — locator ${i + 1}/${all.length} failed, trying next...`,
      );
    }
  }

  throw new Error(`[FAILED] "${description}" — all ${all.length} locators exhausted`);
}

export async function resilientFill(
  options: ResilientLocatorOptions,
  value: string,
): Promise<Locator> {
  const { description, primary, fallbacks = [] } = options;
  const all = [primary, ...fallbacks];

  for (let i = 0; i < all.length; i++) {
    const locator = all[i];
    try {
      await locator.waitFor({ state: 'visible', timeout: 5000 });
      await locator.fill(value);
      if (i > 0) {
        console.log(`[HEALED] "${description}" — primary failed, used fallback #${i}`);
      }
      return locator;
    } catch {
      console.log(
        `[RETRY] "${description}" — locator ${i + 1}/${all.length} failed, trying next...`,
      );
    }
  }

  throw new Error(`[FAILED] "${description}" — all ${all.length} locators exhausted`);
}
