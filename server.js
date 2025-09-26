const express = require("express");
const fs = require("fs");
const path = require("path");


const app = express();
const PORT = 3000;


// Dossier racine où tu mets tes cours
const ROOT = path.join(__dirname, "cours");


// ✅ Sert index.html, style.css, script.js, img/, etc.
app.use(express.static(__dirname));


// ✅ Sert le dossier des cours à l’URL /cours
app.use("/cours", express.static(ROOT));


// Route qui retourne l'arborescence des cours
app.get("/api/cours", (req, res) => {
function getDirTree(dir) {
let tree = {};
const files = fs.readdirSync(dir);


files.forEach(file => {
const fullPath = path.join(dir, file);
const stats = fs.statSync(fullPath);


if (stats.isDirectory()) {
tree[file] = getDirTree(fullPath);
} else {
if (!tree["files"]) tree["files"] = [];
tree["files"].push(file);
}
});


return tree;
}


const tree = getDirTree(ROOT);
res.json(tree);
});


// Sert la page d’accueil
app.get("/", (req, res) => {
res.sendFile(path.join(__dirname, "index.html"));
});


app.listen(PORT, () => {
console.log(`Serveur lancé sur http://localhost:${PORT}`);
});