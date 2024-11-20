import { login } from './login.js';
import assert from 'node:assert';

assert(process.env.BLUESKY_FEED_HANDLE);

const agent = await login();

const profile = await agent.resolveHandle({ handle: process.env.BLUESKY_FEED_HANDLE });
const did = profile.data.did;

const res = await agent.getAuthorFeed({
  actor: did,
  filter: 'posts_and_author_threads',
  limit: 30,
});

console.dir(res.data.feed, { depth: 20 });
