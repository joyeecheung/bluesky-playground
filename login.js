import { AtpAgent } from '@atproto/api';
import assert from 'node:assert';

assert(process.env.BLUESKY_IDENTIFIER);
assert(process.env.BLUESKY_APP_PASSWORD);

export async function login() {
  const agent = new AtpAgent({
    service: 'https://bsky.social'
  });

  await agent.login({
    identifier: process.env.BLUESKY_IDENTIFIER,
    password: process.env.BLUESKY_APP_PASSWORD
  });

  return agent;
};
