// Extract the handle and post ID from the URL
// URL format: https://bsky.app/profile/${handle}/post/${postId}
// https://bsky.app/profile/${did}/post/${postId}
import { RichText } from "@atproto/api";

export async function getPostInfoFromUrl(agent, postUrl) {
  const urlParts = postUrl.split('/');
  const handle = urlParts[urlParts.indexOf('profile') + 1];
  const postId = urlParts[urlParts.indexOf('post') + 1];

  let did;
  if (handle.startsWith('did:')) {
    did = handle;
  } else {
    const profile = await agent.resolveHandle({ handle });
    did = profile.data.did;
  }

  const uri = `at://${did}/app.bsky.feed.post/${postId}`;

  const postView = await agent.getPost({ repo: did, rkey: postId });
  const cid = postView.cid;

  return { uri, cid };
}

export async function post(agent, richText, options = {}) {
  const rt = new RichText({
    text: richText
  });

  await rt.detectFacets(agent); // automatically detects mentions and links

  const record = {
    $type: 'app.bsky.feed.post',
    text: rt.text,
    facets: rt.facets,
    createdAt: new Date().toISOString(),
  };

  // https://docs.bsky.app/docs/tutorials/creating-a-post#quote-posts
  if (options.quoting) {
    const quoted = await getPostInfoFromUrl(agent, options.quoting);
    record.embed = {
      $type: 'app.bsky.embed.record',
      record: quoted
    };
  } else if (options.replying) {
    const root = await getPostInfoFromUrl(agent, options.replying);
    record.reply = {
      root,
      parent: root,
    };
  }
  console.log('Posting', record);
  const res = await agent.post(record);
  console.log('Post result', res);
}
