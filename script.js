/* script.js — explorateur avec preview + auto-refresh */
let fullTree = {};
let currentPath = [];

/* ---------------- utilitaires ---------------- */
function formatTitle(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

const TEXT_MAX_BYTES = 300 * 1024;
const PRINTABLE_RATIO_THRESHOLD = 0.5;

function buildFileUrl(pathArray, file) {
  const segments = ["cours", ...pathArray, file].map(encodeURIComponent);
  return "/" + segments.join("/");
}

function extOf(filename) {
  return filename.toLowerCase().split(".").pop() || "";
}

function createIconFor(file) {
  const ext = extOf(file);
  if (ext === "pdf") return "img/pdf.png";
  if (ext === "html" || ext === "htm") return "img/html.png";
  if (ext === "php") return "img/php.png";
  if (ext === "css") return "img/css.png";
  if (ext === "js") return "img/js.png";
  if (["cpp", "c", "h"].includes(ext)) return "img/cpp.png";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "img/image.png";
  if (["txt", "md"].includes(ext)) return "img/txt.png";
  if (["mp3", "wav", "ogg"].includes(ext)) return "img/song.png";
  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) return "img/video.png";
  return "img/file.png";
}

async function tryFetchAsText(url, maxBytes = TEXT_MAX_BYTES) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = (res.headers.get("content-type") || "").toLowerCase();
    if (ct.startsWith("text/") || ct.includes("javascript") || ct.includes("json")) {
      const text = await res.text();
      return { ok: true, text };
    }
    const blob = await res.blob();
    if (blob.size > maxBytes) return { ok: false, reason: "trop volumineux" };
    const text = await blob.text();
    const ratio = text.replace(/[^\x20-\x7E\r\n\t]/g, "").length / text.length;
    if (ratio < PRINTABLE_RATIO_THRESHOLD) return { ok: false, reason: "contenu non lisible" };
    return { ok: true, text };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

function isViewable(file) {
  const ext = file.toLowerCase();
  return (
    ext.endsWith(".pdf") ||
    ext.endsWith(".png") ||
    ext.endsWith(".jpg") ||
    ext.endsWith(".jpeg") ||
    ext.endsWith(".gif") ||
    ext.endsWith(".txt") ||
    ext.endsWith(".md") ||
    ext.endsWith(".html") ||
    ext.endsWith(".htm") ||
    ext.endsWith(".php") ||
    ext.endsWith(".mp3") ||
    ext.endsWith(".mp4") ||
    ext.endsWith(".wav") ||
    ext.endsWith(".css") ||
    ext.endsWith(".js") ||
    ext.endsWith(".cpp")
  );
}

/* ---------------- modal preview ---------------- */
const modal = {
  el: null,
  body: null,
  title: null,
  downloadBtn: null,
  openBtn: null,
  init() {
    this.el = document.getElementById("previewModal");
    this.body = document.getElementById("modalBody");
    this.title = document.getElementById("modalTitle");
    this.downloadBtn = document.getElementById("modalDownload");
    this.openBtn = document.getElementById("modalOpen");
    document.getElementById("modalClose").addEventListener("click", () => this.close());
    document.getElementById("modalOverlay").addEventListener("click", () => this.close());
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") this.close(); });
  },
  async open(file, fileUrl) {
    this.title.textContent = formatTitle(file);
    this.body.innerHTML = "<p>Chargement…</p>";
    this.downloadBtn.href = fileUrl;
    this.downloadBtn.setAttribute("download", file);
    this.openBtn.onclick = () => window.open(fileUrl, "_blank");

    const lower = file.toLowerCase();
    try {
      if (lower.endsWith(".pdf")) {
        this.body.innerHTML = `<iframe src="${fileUrl}" style="width:100%;height:70vh;border:0"></iframe>`;
      } else if (/\.(png|jpe?g|gif)$/i.test(lower)) {
        this.body.innerHTML = `<img src="${fileUrl}" alt="${file}" style="max-width:100%;height:auto;display:block;margin:0 auto" />`;
      } else if (lower.endsWith(".txt") || lower.endsWith(".md")) {
        const res = await fetch(fileUrl); const text = await res.text();
        const pre = document.createElement("pre");
        pre.textContent = text; pre.style.whiteSpace = "pre-wrap";
        pre.style.maxHeight = "60vh"; pre.style.overflow = "auto";
        this.body.innerHTML = ""; this.body.appendChild(pre);
      } else if (lower.endsWith(".html") || lower.endsWith(".htm") || lower.endsWith(".php")) {
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%"; iframe.style.height = "70vh";
        iframe.setAttribute("sandbox", "allow-same-origin allow-scripts allow-forms");
        iframe.src = fileUrl;
        this.body.innerHTML = ""; this.body.appendChild(iframe);
      } else if (/\.(mp3|wav|ogg)$/i.test(lower)) {
        this.body.innerHTML = `<audio controls src="${fileUrl}" style="width:100%"></audio>`;
      } else if (/\.(mp4|mkv|avi|mov|webm)$/i.test(lower)) {
        this.body.innerHTML = `<video controls src="${fileUrl}" style="width:100%;max-height:70vh"></video>`;
      } else if (lower.endsWith(".css") || lower.endsWith(".js") || lower.endsWith(".cpp")) {
        const attempt = await tryFetchAsText(fileUrl);
        if (attempt.ok) {
          const pre = document.createElement("pre");
          pre.textContent = attempt.text; pre.style.whiteSpace = "pre-wrap";
          pre.style.maxHeight = "60vh"; pre.style.overflow = "auto";
          this.body.innerHTML = ""; this.body.appendChild(pre);
        } else {
          this.body.innerHTML = `<img src="${createIconFor(file)}" style="display:block;margin:0 auto;width:120px"><p style="text-align:center">Aperçu non disponible : ${attempt.reason}</p>`;
        }
      } else {
        this.body.innerHTML = `<p>Aperçu non disponible pour ce type de fichier.</p>`;
      }
    } catch (err) {
      this.body.innerHTML = `<p>Erreur : ${err.message}</p>`;
    }
    this.el.classList.remove("hidden");
  },
  close() {
    if (!this.el) return;
    this.body.innerHTML = "";
    this.el.classList.add("hidden");
  }
};

/* ---------------- chargement et rendu ---------------- */
async function loadTree() {
  try {
    const res = await fetch("/api/cours");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    fullTree = await res.json();
    render();
  } catch (err) {
    console.error("Erreur fetch /api/cours :", err);
    const list = document.getElementById("list");
    if (list) list.innerHTML = `<p class="error">Impossible de charger l'arborescence</p>`;
  }
}

function getNodeFromPath(path) {
  let node = fullTree;
  for (const part of path) {
    if (!node) return {};
    node = node[part];
  }
  return node || {};
}

function render() {
  if (!fullTree || Object.keys(fullTree).length === 0) return;
  const list = document.getElementById("list");
  const pathDiv = document.getElementById("path");
  list.innerHTML = "";
  pathDiv.innerHTML = "";

  if (currentPath.length > 0) {
    const back = document.createElement("div");
    back.className = "back";
    back.textContent = "⬅️ Retour";
    back.onclick = () => { currentPath.pop(); render(); };
    pathDiv.appendChild(back);

    const crumb = document.createElement("span");
    crumb.className = "crumb";
    crumb.textContent = "/" + currentPath.join("/");
    pathDiv.appendChild(crumb);
  }

  const node = getNodeFromPath(currentPath);

  for (const key in node) {
    if (key === "files") continue;
    const item = document.createElement("div");
    item.className = "item folder";
    item.innerHTML = `<img src="img/dossier.png" alt="dossier"><div class="title">${key}</div><div class="subtitle">dossier</div>`;
    item.onclick = () => { currentPath.push(key); render(); };
    list.appendChild(item);
  }

  if (node.files && node.files.length > 0) {
    node.files.forEach(file => {
      const fileUrl = buildFileUrl(currentPath, file);
      const item = document.createElement("div");
      item.className = "item file";
      item.innerHTML = `
        <img src="${createIconFor(file)}" alt="fichier">
        <div class="title">${formatTitle(file)}</div>
        <div class="subtitle">${extOf(file).toUpperCase()}</div>
        <div class="actions"></div>`;
      const actions = item.querySelector(".actions");

      const viewBtn = document.createElement("button");
      viewBtn.className = "btn"; viewBtn.textContent = "Aperçu";
      if (isViewable(file)) {
        viewBtn.onclick = (e) => { e.stopPropagation(); modal.open(file, fileUrl); };
      } else { viewBtn.disabled = true; }
      actions.appendChild(viewBtn);

      const openBtn = document.createElement("button");
      openBtn.className = "btn"; openBtn.textContent = "Ouvrir";
      openBtn.onclick = (e) => { e.stopPropagation(); window.open(fileUrl, "_blank"); };
      actions.appendChild(openBtn);

      const dl = document.createElement("a");
      dl.className = "btn"; dl.textContent = "Télécharger";
      dl.href = fileUrl; dl.setAttribute("download", file);
      dl.onclick = (e) => e.stopPropagation();
      actions.appendChild(dl);

      list.appendChild(item);
    });
  } else if (Object.keys(node).length === 0) {
    list.innerHTML = "<p>Aucun fichier dans ce dossier.</p>";
  }
}

/* ---------------- auto-refresh ---------------- */
let lastTree = "";
async function refreshTree() {
  try {
    const res = await fetch("/api/cours");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const tree = await res.json();
    const newTree = JSON.stringify(tree);
    if (newTree !== lastTree) {
      lastTree = newTree;
      fullTree = tree;
      render();
    }
  } catch (err) {
    console.error("Erreur refresh:", err.message);
  }
}
setInterval(refreshTree, 5000);

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", async () => {
  modal.init();
  await loadTree();
});
