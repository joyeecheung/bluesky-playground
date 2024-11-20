import assert from 'node:assert';
import { login } from './login.js';
import { post } from './lib/posts.js';

assert(process.env.BLUESKY_REPLY_URL);
assert(process.env.BLUESKY_POST_RICH_TEXT);

const agent = await login();

await post(agent, process.env.BLUESKY_POST_RICH_TEXT, { replying: process.env.BLUESKY_REPLY_URL });
