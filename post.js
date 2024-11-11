
// https://docs.bsky.app/docs/get-started
import { RichText } from '@atproto/api';
import assert from 'node:assert';
import { login } from './login.js';

assert(process.env.BLUESKY_POST_RICH_TEXT);

const agent = await login();

const rt = new RichText({
  text: process.env.BLUESKY_POST_RICH_TEXT,
});

await rt.detectFacets(agent); // automatically detects mentions and links

const record = {
  $type: 'app.bsky.feed.post',
  text: rt.text,
  facets: rt.facets,
  createdAt: new Date().toISOString(),
};

console.log('Posting', record);
const res = await agent.post(record);
console.log(res);
