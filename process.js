import fs from 'node:fs';
import assert from 'node:assert';
import process from 'node:process';
import path from 'node:path';
import { login } from './actions/lib/login.js';
import { getPostInfoFromUrl, post } from './actions/lib/posts.js';

assert(process.argv[2], `Usage: node process.js /path/to.json`);
const requestFilePath = path.resolve(process.argv[2]);
const request = JSON.parse(fs.readFileSync(requestFilePath, 'utf8'));

assert(request.account, 'JSON must contain "account" field');
const identifierKey = `BLUESKY_IDENTIFIER_${account}`;
const passwordKey = `BLUESKY_APP_PASSWORD_${account}`;
assert(process.env[identifierKey], `Must provide ${identifierKey} in the environment variable.`);
assert(process.env[passwordKey], `Must provide ${passwordKey} in the environment variable.`);

const agent = await login(process.env[identifierKey], process.env[passwordKey]);
assert(request.action, 'JSON must contain "action" field');

let result;
switch(request.action) {
  case 'post': {
    assert(request.richText, 'JSON must contain "richText" field');
    console.log(`Posting...`, request.richText);
    result = await post(agent, request.richText);
    break;
  };
  case 'repost': {
    assert(request.repostURL, 'JSON must contain "repostURL" field');
    console.log('Get post info', request.repostURL);
    const postInfo = await getPostInfoFromUrl(agent, request.repostURL);
    console.log('Reposting', postInfo);
    result = await agent.repost(postInfo.uri, postInfo.cid);
    break;
  }
  case 'quote-post': {
    assert(request.richText, 'JSON must contain "richText" field');
    assert(request.repostURL, 'JSON must contain "repostURL" field');
    console.log(`Quote posting...`, request.repostURL, request.richText);
    result = await post(agent, request.richText, { quoting: request.repostURL });
    break;
  }
  case 'reply': {
    assert(request.richText, 'JSON must contain "richText" field');
    assert(request.replyURL, 'JSON must contain "replyURL" field');
    console.log(`Replying...`, request.replyURL, request.richText);
    result = await post(agent, request.richText, { quoting: request.replyURL });
    break;
  }
  default:
    assert.fail('Unknown action ' + request.action);
}

console.log(result);
const date = (new Date()).toISOString().split('T')[0];

// Make sure records/processed directory exists.
const processedDir = path.join('records', 'processed');
if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir, { recursive: true });
}

// Find all processed files for the current date.
const filesForDate = fs.readdirSync(processedDir).filter(
  (file) => file.startsWith(date) && file.endsWith('.json')
);

// Generate the next incremental ID.
const nextId = filesForDate.length;

// Construct the new file path as records/processed/YYYY-MM-DD-ID.json
const newFileName = `${date}-${nextId}.json`;
const newFilePath = path.join(processedDir, newFileName);

request.result = result;
fs.writeFileSync(requestFilePath, JSON.stringify(request, null, 2), 'utf8');
fs.renameSync(requestFilePath, newFilePath);
console.log(`Processed and moved file: ${requestFilePath} -> ${newFilePath}`);
