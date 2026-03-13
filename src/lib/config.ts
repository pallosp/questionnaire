import { cacheLife } from 'next/cache';

import { Config } from '@/types/config';

import { BASE_PATH } from './config-utils';

const CONFIG_URL =
  process.env.CONFIG_URL ??
  `http://localhost:3000/${BASE_PATH}/api/test-config.json`;

export async function getConfig(): Promise<Config> {
  'use cache';
  cacheLife('minutes');

  const response = await fetch(CONFIG_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch config');
  }

  return response.json();
}
