import assert from 'node:assert';
import { loginFromEnv } from './lib/login.js';
import { post } from './lib/posts.js';

assert(process.env.BLUESKY_REPOST_URL);
assert(process.env.BLUESKY_POST_RICH_TEXT);

const agent = await loginFromEnv();

await post(agent, process.env.BLUESKY_POST_RICH_TEXT, { quoting: process.env.BLUESKY_REPOST_URL });