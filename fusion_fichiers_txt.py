import tkinter as tk
from tkinter import filedialog
import os

# --- Fenêtre cachée juste pour ouvrir la boîte de sélection ---
root = tk.Tk()
root.withdraw()

# Sélection multiple de fichiers
file_paths = filedialog.askopenfilenames(title="Sélectionne les fichiers à fusionner")

if not file_paths:
    print("Aucun fichier sélectionné. Arrêt.")
    exit()

# Choisir où sauvegarder le fichier final
output_path = filedialog.asksaveasfilename(
    title="Enregistrer le fichier final",
    defaultextension=".txt",
    filetypes=[("Fichier texte", "*.txt")]
)

if not output_path:
    print("Aucun emplacement choisi. Arrêt.")
    exit()

# --- Lecture et écriture ---
with open(output_path, "w", encoding="utf-8") as outfile:
    for path in file_paths:
        filename = os.path.basename(path)
        outfile.write(f"----- FICHIER : {filename} -----\n")
        try:
            with open(path, "r", encoding="utf-8", errors="replace") as infile:
                content = infile.read()
                outfile.write(content)
        except Exception as e:
            outfile.write(f"[ERREUR DE LECTURE : {e}]\n")
        outfile.write("\n\n")  # saut de ligne après chaque fichier

print(f"Fichier texte généré : {output_path}")
