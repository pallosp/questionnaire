import { Config } from '@/types/config';

export async function getConfig(): Promise<Config> {
  const response = await fetch('http://localhost:3000/api/test-config.json');
  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }
  return response.json();
}
