import { AtpAgent } from '@atproto/api';
import assert from 'node:assert';

export async function login(identifier, password) {
  const agent = new AtpAgent({
    service: 'https://bsky.social'
  });

  await agent.login({
    identifier,
    password
  });

  return agent;
};

export async function loginFromEnv() {
  assert(process.env.BLUESKY_IDENTIFIER);
  assert(process.env.BLUESKY_APP_PASSWORD);
  return login(process.env.BLUESKY_IDENTIFIER, process.env.BLUESKY_APP_PASSWORD);
}
