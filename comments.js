const commentsForm = document.querySelector("#comments-form");
const commentsList = document.querySelector("#comments-list");
const commentsStatus = document.querySelector("#comments-status");
const commentsSubmit = document.querySelector("#comments-submit");

function setStatus(message, isError = false) {
  if (!commentsStatus) return;
  commentsStatus.textContent = message;
  commentsStatus.classList.toggle("error", isError);
}

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

function renderComments(comments) {
  if (!commentsList) return;
  commentsList.replaceChildren();

  if (!comments.length) {
    const empty = document.createElement("p");
    empty.className = "comments-empty";
    empty.textContent = "目前還沒有留言。成為第一個留下足跡的人。";
    commentsList.append(empty);
    return;
  }

  comments.forEach((comment) => {
    const article = document.createElement("article");
    article.className = "comment-card";

    const header = document.createElement("div");
    header.className = "comment-card-header";

    const name = document.createElement("strong");
    name.textContent = comment.name;

    const time = document.createElement("time");
    time.dateTime = comment.created_at;
    time.textContent = formatDate(comment.created_at);

    const body = document.createElement("p");
    body.textContent = comment.message;

    header.append(name, time);
    article.append(header, body);
    commentsList.append(article);
  });
}

async function loadComments() {
  if (!commentsList) return;
  try {
    const response = await fetch("/api/comments", { cache: "no-store" });
    if (!response.ok) throw new Error("load failed");
    const data = await response.json();
    renderComments(Array.isArray(data.comments) ? data.comments : []);
  } catch {
    setStatus("暫時無法載入留言。", true);
  }
}

commentsForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(commentsForm);
  const name = String(formData.get("name") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !message) {
    setStatus("請填寫暱稱和留言內容。", true);
    return;
  }

  commentsSubmit.disabled = true;
  setStatus("正在送出……");

  try {
    const response = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "留言送出失敗");

    commentsForm.reset();
    setStatus("留言已送出。");
    await loadComments();
  } catch (error) {
    setStatus(error.message || "留言送出失敗。", true);
  } finally {
    commentsSubmit.disabled = false;
  }
});

loadComments();
