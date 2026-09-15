const commentsList = document.querySelector("#comments-list");
const commentsRefresh = document.querySelector("#comments-refresh");
const COMMENTS_API = "https://api.github.com/repos/ngweichoong/acts/issues/2/comments?per_page=50";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("zh-Hant", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function showEmpty(message) {
  if (!commentsList) return;
  commentsList.replaceChildren();
  const empty = document.createElement("p");
  empty.className = "comments-empty";
  empty.textContent = message;
  commentsList.append(empty);
}

function renderComments(comments) {
  if (!commentsList) return;
  commentsList.replaceChildren();

  if (!comments.length) {
    showEmpty("目前還沒有留言。可以成為第一個留言的人。 ");
    return;
  }

  [...comments].reverse().forEach((comment) => {
    const article = document.createElement("article");
    article.className = "comment-card";

    const header = document.createElement("div");
    header.className = "comment-card-header";

    const identity = document.createElement("div");
    identity.className = "comment-identity";

    const avatar = document.createElement("img");
    avatar.className = "comment-avatar";
    avatar.src = comment.user?.avatar_url || "";
    avatar.alt = "";
    avatar.loading = "lazy";

    const meta = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = comment.user?.login || "GitHub 使用者";

    const time = document.createElement("time");
    time.dateTime = comment.created_at || "";
    time.textContent = formatDate(comment.created_at);

    meta.append(name, time);
    identity.append(avatar, meta);

    const source = document.createElement("a");
    source.className = "comment-source";
    source.href = comment.html_url;
    source.target = "_blank";
    source.rel = "noopener";
    source.textContent = "查看 ↗";

    const body = document.createElement("p");
    body.textContent = comment.body || "";

    header.append(identity, source);
    article.append(header, body);
    commentsList.append(article);
  });
}

async function loadComments() {
  if (!commentsList) return;
  showEmpty("正在載入留言……");
  commentsRefresh?.setAttribute("disabled", "");

  try {
    const response = await fetch(COMMENTS_API, {
      headers: { "Accept": "application/vnd.github+json" },
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`GitHub API ${response.status}`);
    const data = await response.json();
    renderComments(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error(error);
    showEmpty("暫時無法載入留言，請稍後重新整理。 ");
  } finally {
    commentsRefresh?.removeAttribute("disabled");
  }
}

commentsRefresh?.addEventListener("click", loadComments);
loadComments();
