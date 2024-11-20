
// https://docs.bsky.app/docs/get-started
import assert from 'node:assert';
import { loginFromEnv } from './lib/login.js';
import { getPostInfoFromUrl } from './lib/posts.js';

assert(process.env.BLUESKY_REPOST_URL);

const agent = await loginFromEnv();

const result = await getPostInfoFromUrl(agent, process.env.BLUESKY_REPOST_URL);
console.log('Post info', result);

const { uri, cid } = result;
const res = await agent.repost(uri, cid)
console.log('Repost result', res);
