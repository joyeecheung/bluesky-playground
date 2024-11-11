// Extract the handle and post ID from the URL
// URL format: https://bsky.app/profile/${handle}/post/${postId}
export async function getPostInfoFromUrl(agent, postUrl) {
  const urlParts = postUrl.split('/');
  const handle = urlParts[urlParts.indexOf('profile') + 1];
  const postId = urlParts[urlParts.indexOf('post') + 1];

  const profile = await agent.resolveHandle({ handle });
  const did = profile.data.did;

  const uri = `at://${did}/app.bsky.feed.post/${postId}`;
  
  const postView = await agent.getPost({ repo: did, rkey: postId });
  const cid = postView.cid;
  
  return { uri, cid };
}
