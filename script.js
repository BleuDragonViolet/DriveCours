/* script.js — version corrigée + aperçu modal */
let fullTree = {};
let currentPath = [];

/* ---------------- utilitaires ---------------- */
function formatTitle(filename) {
  return filename.replace(/\.[^/.]+$/, "");
}

function buildFileUrl(pathArray, file) {
  // Encode chaque segment pour gérer espaces / caractères spéciaux
  const segments = ["cours", ...pathArray, file].map(encodeURIComponent);
  return "/" + segments.join("/");
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
    ext.endsWith(".mp3") ||
    ext.endsWith(".mp4") ||
    ext.endsWith(".wav")
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

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.close();
    });
  },
  async open(file, fileUrl) {
    this.title.textContent = formatTitle(file);
    this.body.innerHTML = "<p>Chargement…</p>";

    // actions
    this.downloadBtn.href = fileUrl;
    this.downloadBtn.setAttribute("download", file);
    this.openBtn.onclick = () => window.open(fileUrl, "_blank");

    // choisir le rendu selon extension
    const lower = file.toLowerCase();
    try {
      if (lower.endsWith(".pdf")) {
        // iframe pour pdf
        this.body.innerHTML = `<iframe src="${fileUrl}" frameborder="0" style="width:100%;height:70vh"></iframe>`;
      } else if (/\.(png|jpe?g|gif)$/i.test(lower)) {
        this.body.innerHTML = `<div class="img-wrap"><img src="${fileUrl}" alt="${file}" style="max-width:100%;height:auto;display:block;margin:0 auto" /></div>`;
      } else if (lower.endsWith(".txt") || lower.endsWith(".md")) {
        const res = await fetch(fileUrl);
        const text = await res.text();
        const pre = document.createElement("pre");
        pre.textContent = text;
        pre.style.whiteSpace = "pre-wrap";
        pre.style.maxHeight = "60vh";
        pre.style.overflow = "auto";
        this.body.innerHTML = "";
        this.body.appendChild(pre);
      } else if (lower.endsWith(".html") || lower.endsWith(".htm")) {
        // fetch then put in sandboxed iframe to avoid scripts running
        const res = await fetch(fileUrl);
        const html = await res.text();
        const iframe = document.createElement("iframe");
        iframe.style.width = "100%";
        iframe.style.height = "70vh";
        // sandbox: no scripts, but allow same-origin so relative resources load only on same origin
        iframe.setAttribute("sandbox", "allow-same-origin");
        iframe.srcdoc = html;
        this.body.innerHTML = "";
        this.body.appendChild(iframe);
      } else if (lower.endsWith(".mp3") || lower.endsWith(".wav")) {
        this.body.innerHTML = `<audio controls src="${fileUrl}" style="width:100%"></audio>`;
      } else if (lower.endsWith(".mp4")) {
        this.body.innerHTML = `<video controls src="${fileUrl}" style="width:100%;max-height:70vh"></video>`;
      } else {
        // type non prévisualisable (docx, etc.)
        this.body.innerHTML = `<p>Aperçu non disponible pour ce type de fichier.</p>`;
      }
    } catch (err) {
      this.body.innerHTML = `<p>Erreur lors du chargement : ${err.message}</p>`;
    }

    this.el.classList.remove("hidden");
    this.el.setAttribute("aria-hidden", "false");
  },
  close() {
    if (!this.el) return;
    this.body.innerHTML = "";
    this.el.classList.add("hidden");
    this.el.setAttribute("aria-hidden", "true");
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
    if (list) list.innerHTML = `<p class="error">Impossible de charger l'arborescence — as-tu lancé le serveur ? (voir console)</p>`;
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

function createIconFor(file) {
  const ext = file.toLowerCase();
  if (ext.endsWith(".pdf")) return "img/pdf.png";
  if (ext.endsWith(".html") || ext.endsWith(".htm")) return "img/html.png";
  if (ext.endsWith(".doc") || ext.endsWith(".docx")) return "img/word.png";
  if (/\.(png|jpe?g|gif|webp|svg)$/i.test(ext)) return "img/image.png";
  if (ext.endsWith(".txt") || ext.endsWith(".md")) return "img/txt.png";
  if (/\.(mp3|wav|ogg)$/i.test(ext)) return "img/song.png";     // 🎵 audio
  if (/\.(mp4|mkv|avi|mov|webm)$/i.test(ext)) return "img/video.png"; // 🎬 vidéo
  return "img/file.png"; // fallback générique
}


function render() {
  if (!fullTree || Object.keys(fullTree).length === 0) {
    console.warn("Arbre vide ou non chargé");
    return;
  }

  const list = document.getElementById("list");
  const pathDiv = document.getElementById("path");
  list.innerHTML = "";
  pathDiv.innerHTML = "";

  if (currentPath.length > 0) {
    const back = document.createElement("div");
    back.className = "back";
    back.textContent = "⬅️ Retour";
    back.onclick = () => {
      currentPath.pop();
      render();
    };
    pathDiv.appendChild(back);

    // affichage chemin
    const crumb = document.createElement("span");
    crumb.className = "crumb";
    crumb.textContent = "/" + currentPath.join("/");
    pathDiv.appendChild(crumb);
  }

  const node = getNodeFromPath(currentPath);

  // dossiers
  for (const key in node) {
    if (key === "files") continue;
    const item = document.createElement("div");
    item.className = "item folder";

    const icon = document.createElement("img");
    icon.src = "img/dossier.png";
    icon.alt = "dossier";
    item.appendChild(icon);

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = key;
    item.appendChild(title);

    const subtitle = document.createElement("div");
    subtitle.className = "subtitle";
    subtitle.textContent = "dossier";
    item.appendChild(subtitle);

    item.onclick = () => {
      currentPath.push(key);
      render();
    };

    list.appendChild(item);
  }

  // --- fichiers ---
  if (node.files && node.files.length > 0) {
    node.files.forEach(file => {
      const item = document.createElement("div");
      item.className = "item file";

      const icon = document.createElement("img");
      icon.src = createIconFor(file);
      icon.alt = "fichier";
      item.appendChild(icon);

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = formatTitle(file);
      item.appendChild(title);

      // sous-titre selon extension
      const subtitle = document.createElement("div");
      subtitle.className = "subtitle";
      if (file.toLowerCase().endsWith(".pdf")) {
        subtitle.textContent = "PDF";
      } else if (file.toLowerCase().endsWith(".doc") || file.toLowerCase().endsWith(".docx")) {
        subtitle.textContent = "Word";
      } else if (/\.(png|jpe?g|gif)$/i.test(file)) {
        subtitle.textContent = "Image";
      } else if (file.toLowerCase().endsWith(".txt") || file.toLowerCase().endsWith(".md")) {
        subtitle.textContent = "Texte";
      } else if (/\.(mp3|wav)$/i.test(file)) {
        subtitle.textContent = "Audio";
      } else if (file.toLowerCase().endsWith(".mp4")) {
        subtitle.textContent = "Vidéo";
      } else {
        subtitle.textContent = "Fichier";
      }
      item.appendChild(subtitle);

      // actions (aperçu, ouvrir, télécharger)
      const actions = document.createElement("div");
      actions.className = "actions";

      const fileUrl = buildFileUrl(currentPath, file);

      const viewBtn = document.createElement("button");
      viewBtn.className = "btn";
      viewBtn.textContent = "Aperçu";
      if (isViewable(file)) {
        viewBtn.onclick = (e) => {
          e.stopPropagation();
          modal.open(file, fileUrl);
        };
      } else {
        viewBtn.disabled = true;
        viewBtn.title = "Aperçu non disponible";
      }
      actions.appendChild(viewBtn);

      const openBtn = document.createElement("button");
      openBtn.className = "btn";
      openBtn.textContent = "Ouvrir";
      openBtn.onclick = (e) => {
        e.stopPropagation();
        window.open(fileUrl, "_blank");
      };
      actions.appendChild(openBtn);

      const dl = document.createElement("a");
      dl.className = "btn";
      dl.textContent = "Télécharger";
      dl.href = fileUrl;
      dl.setAttribute("download", file);
      dl.onclick = (e) => e.stopPropagation();
      actions.appendChild(dl);

      item.appendChild(actions);
      list.appendChild(item);
    });
  } else {
    // si pas de fichiers et aucun dossier
    if (Object.keys(node).length === 0) {
      list.innerHTML = "<p>Aucun fichier dans ce dossier.</p>";
    }
  }
}

/* ---------------- init ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  modal.init();
  loadTree();
});
