# Publishing through official APIs

Every channel follows the same five steps, and only step 5 makes a post published.

1. **Approval.** The approver saw the copy and picture exactly as each channel will carry them: the LinkedIn post, the X text (or thread) and whether a picture rides it, the Instagram caption. A go covers only what was shown.
2. **Identity.** Ask the platform who the token posts as, and refuse when it is not the account the instance names. An OAuth sign-in captures whichever account the browser had open, not the app owner.
3. **Picture.** The file is the approved one, proved by its SHA-256, with its alt text.
4. **Post.** One call, or the platform's two-step container flow.
5. **Read back.** Fetch the post by the id the platform returned. Record the URL in the send log. No read-back, no "published".

## LinkedIn (Posts API)

- Routes: `POST /rest/images?action=initializeUpload`, then `PUT` the bytes to the returned upload URL; `POST /rest/posts`; `GET /rest/posts/{encoded urn}` to read back. Host `api.linkedin.com`.
- Headers on every call: `LinkedIn-Version: YYYYMM` and `X-Restli-Protocol-Version: 2.0.0`. LinkedIn retires a version about a year after release and then answers 426 `NONEXISTENT_VERSION`; keep the version a setting and move it forward before it lapses.
- Scopes: `w_member_social` posts as the signed-in member; `w_organization_social` posts as a company page the member administers (author `urn:li:organization:<id>`). Each is a separate app product with its own review.
- The post URN comes back in the `x-restli-id` response header, not the body.
- **The trap that costs most: little text.** The commentary field is LinkedIn "little text". An unescaped `( ) [ ] < > _ * ~ | { }` or backslash, or a plain `@` before a letter, does not fail the call: LinkedIn answers 201 and silently drops everything after it. Escape every post (the tool does), then read it back and check the live text still ends the way the sent text ends.
- A company named in the text is tagged with a mention annotation carrying its organisation URN; a name the text does not contain cannot be tagged.
- There is no API route to read a member's home feed or most personal-post metrics without restricted scopes. Comments and reactions on other people's posts stay a human task.
- Long-form articles have no publishing API. Draft them; a person publishes in the UI.

## X (API v2, OAuth 2.0 user token with PKCE)

- Routes: `POST /2/media/upload` (multipart: `media`, `media_category=tweet_image`), `POST /2/media/metadata` for alt text (up to 1,000 characters), `POST /2/tweets` with `media.media_ids`, `GET /2/tweets/:id` to read back. Host `api.x.com`.
- Scopes: `tweet.read tweet.write users.read offline.access`, plus `media.write` for pictures. A token granted without `media.write` posts text and cannot upload; re-run the consent with the scope added. On a host with no browser, print the consent link, let the account holder approve, and redeem the address their browser lands on (the PKCE verifier stays on the host, owner-readable only, and expires).
- Pay-per-use prices change; read the developer console. In October 2026: a post $0.015, a post carrying a URL $0.200, alt text $0.005, picture upload no listed charge. So a link goes in a reply to the post, not in the post.
- Count length as X does: every URL is 23 characters. Mirror a long LinkedIn post as a thread with 1/N counters, or as a short version written for X.
- Refresh tokens rotate on every refresh. Two processes refreshing at once leave one holding a dead token: serialise refreshes with a file lock and write the token file atomically.

## Instagram (Instagram API with Instagram Login)

- Account: a professional (Business or Creator) Instagram account. Instagram Login needs no Facebook Page.
- Scopes: `instagram_business_basic`, `instagram_business_content_publish`, granted to the app through Meta App Review before anyone but the app's testers can post.
- Two steps on `graph.instagram.com`: `POST /{ig-user-id}/media` with `image_url`, `caption` and `alt_text` returns a container; poll `GET /{container}?fields=status_code` (about once a minute, at most five minutes) until `FINISHED`; `POST /{ig-user-id}/media_publish` with `creation_id`; read back `GET /{media}?fields=permalink`.
- Meta fetches the picture itself: it must be a public HTTPS URL of a JPEG at the time of the call. Host the approved file somewhere public first and pass that URL; the file's hash should still match the approved one.
- Limits: 100 API posts per account per rolling 24 hours (`content_publishing_limit` reports the quota), caption 2,200 characters, at most 30 hashtags and 20 mentions.

## Threads

- Scopes: `threads_basic`, `threads_content_publish`, through Meta App Review.
- Two steps on `graph.threads.net`: `POST /{user-id}/threads` with `media_type=TEXT` or `IMAGE`, `text`, `image_url`, `alt_text`; wait about 30 seconds and check `GET /{container}?fields=status`; `POST /{user-id}/threads_publish`; read back the `permalink`.
- Text is at most 500 characters, and an emoji counts as its UTF-8 byte length.

## Bluesky (AT Protocol)

- Sign in with an app password made in the account's settings, never the account password: `com.atproto.server.createSession` on the account's server (`bsky.social` for most).
- `com.atproto.repo.uploadBlob` (a picture of at most 1,000,000 bytes), then `com.atproto.repo.createRecord` with an `app.bsky.feed.post` record; read back with `app.bsky.feed.getPosts`.
- A post is at most 300 graphemes. Links only become clickable through facets whose offsets are UTF-8 byte offsets, not character offsets.
- No app review and no paid tier.

## Mirrors and pictures

- A mirror carries the approved words for that channel. When the approval request showed a channel as text only, the unit stays text only on that channel even after pictures are switched on: record the hash of the picture the request drew for each channel, and attach only that file.
- A picture whose credit lives in the main post's text (a news photograph, say) stays off a mirror that cannot carry the credit.
- A film is not a picture. Mirror its still, or post text, but never upload a different file than the one approved.

## What not to use

- Browser extensions and desktop tools that type into a platform's web composer and click Post. They return no post id (so nothing can be read back), break when the UI changes, breach the platforms' automation rules, and some accept remote "publish now" commands from their vendor's server.
- Third-party schedulers that hold your tokens unless the instance has approved that vendor and its data handling.
- Any route that needs a stored account password.
