import sys
import time
import re
import difflib
import unicodedata
import threading

import pytesseract
import pygetwindow as gw
import pyautogui
import keyboard  # 🔥 nouvelle lib
from PyQt5 import QtWidgets, QtCore
from PyQt5.QtGui import QColor, QPalette
from PIL import Image, ImageEnhance

# ⚠️ Mets le chemin correct vers Tesseract.exe
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


class OCRWorker(QtCore.QThread):
    log = QtCore.pyqtSignal(str)
    finished = QtCore.pyqtSignal()

    def __init__(self, window, preproc=True, delay=50, tol=0.7, debug=False):
        super().__init__()
        self.window = window
        self.preproc = preproc
        self.delay = delay / 1000.0  # ms → sec
        self.tol = tol
        self.debug = debug
        self.running = True

    def stop(self):
        self.running = False

    def normalize(self, s: str) -> str:
        s = (s or "").lower()
        s = unicodedata.normalize("NFD", s)
        s = "".join(ch for ch in s if not unicodedata.combining(ch))
        s = re.sub(r"[^a-z0-9\s]", " ", s)
        s = re.sub(r"\s+", " ", s).strip()
        return s

    def ocr_match(self, mot, cible) -> bool:
        if not mot or not cible:
            return False
        mot_norm = self.normalize(mot)
        cible_norm = self.normalize(cible)
        if mot_norm in cible_norm or cible_norm in mot_norm:
            return True
        return difflib.get_close_matches(mot_norm, [cible_norm], n=1, cutoff=self.tol) != []

    def group_blocks(self, ocr_data):
        blocs = {}
        for i, word in enumerate(ocr_data["text"]):
            if not word.strip():
                continue
            bnum = ocr_data["block_num"][i]
            if bnum not in blocs:
                blocs[bnum] = {
                    "words": [],
                    "x_min": ocr_data["left"][i],
                    "y_min": ocr_data["top"][i],
                    "x_max": ocr_data["left"][i] + ocr_data["width"][i],
                    "y_max": ocr_data["top"][i] + ocr_data["height"][i],
                }
            else:
                blocs[bnum]["x_min"] = min(blocs[bnum]["x_min"], ocr_data["left"][i])
                blocs[bnum]["y_min"] = min(blocs[bnum]["y_min"], ocr_data["top"][i])
                blocs[bnum]["x_max"] = max(blocs[bnum]["x_max"], ocr_data["left"][i] + ocr_data["width"][i])
                blocs[bnum]["y_max"] = max(blocs[bnum]["y_max"], ocr_data["top"][i] + ocr_data["height"][i])
            blocs[bnum]["words"].append(word)

        cartes = []
        for b in blocs.values():
            texte = " ".join(b["words"])
            cartes.append({
                "texte": texte,
                "norm": self.normalize(texte),
                "x": (b["x_min"] + b["x_max"]) // 2,
                "y": (b["y_min"] + b["y_max"]) // 2,
            })
        return cartes

    def run(self):
        left, top, width, height = self.window.left, self.window.top, self.window.width, self.window.height

        correspondances = {
            "Système d'exploitation": "Operating System",
            "Traitement de texte": "word processor",
            "Tableur": "spreadsheet",
            "Dossier": "folder",
            "Fichier": "file",
            "Police de caractère": "font",
            "Données": "data",
            "Stockage de données": "storage",
            "Mise à jour": "update",
            "Allumer l'ordinateur": "to turn on the computer",
            "Éteindre l'ordinateur": "to turn off the computer",
            "Redémarrer": "to reboot",
            "Copier": "to copy",
            "Coller": "to paste",
            "Glisser-déposer": "drag and drop",
            "Installer": "to install",
            "Désinstaller": "to uninstall",
            "Se connecter": "to log in",
            "Se déconnecter": "to log out",
            "Taper au clavier": "to type",
            "Sauvegarder": "to save",
            "Imprimer": "to print",
            "Informatique": "computing",
            "Ordinateur": "computer",
            "Ordinateur de bureau": "desktop",
            "Numérique": "digital",
            "Internet": "the internet",
            "Un navigateur": "a browser",
            "Une fenêtre": "a window",
            "Un compte": "an account",
            "Un utilisateur": "a user",
            "Un identifiant": "a username",
            "Créer un compte": "to sign up",
            "Paramètres": "settings",
            "Adresse mail": "email address",
            "Boîte mail": "mail box",
            "Un site web": "a website",
            "Faire suivre": "to forward",
            "Un lien": "a link",
            "Une publicité": "an advertisement",
            "S'abonner à une newsletter": "to subscribe to a newsletter",
            "Accueil": "home",
            "Outil": "tool",
            "Enregistrer": "to save",
            "Télécharger (faire venir sur votre ordinateur)": "to download",
            "Télécharger (depuis votre ordinateur vers un serveur)": "to upload",
            "Un mot de passe": "a password",
            "Définir un nouveau mot de passe": "to set a new password",
            "Confidentialité": "privacy",
            "Un clavier": "a keyboard",
            "Un écran": "a screen",
            "Une imprimante": "a printer",
            "Une discussion": "a chat",
            "Message privé": "private message",
            "Statut": "status",
            "Histoire (Instagram, etc.)": "story"
        }

        while self.running:
            try:
                screenshot = pyautogui.screenshot(region=(left, top, width, height))
                img = screenshot

                if self.preproc:
                    img = screenshot.convert("L")
                    img = ImageEnhance.Contrast(img).enhance(1.6)
                    img = img.point(lambda p: 255 if p > 140 else 0)

                ocr_data = pytesseract.image_to_data(img, lang="fra+eng", output_type=pytesseract.Output.DICT)
                cartes = self.group_blocks(ocr_data)

                for fr, en in correspondances.items():
                    pos_fr = [c for c in cartes if self.ocr_match(c["norm"], self.normalize(fr))]
                    pos_en = [c for c in cartes if self.ocr_match(c["norm"], self.normalize(en))]

                    if pos_fr and pos_en:
                        pyautogui.click(left + pos_fr[0]["x"], top + pos_fr[0]["y"])
                        self.log.emit(f"[CLIC] {fr} ({pos_fr[0]['texte']})")
                        time.sleep(self.delay)

                        pyautogui.click(left + pos_en[0]["x"], top + pos_en[0]["y"])
                        self.log.emit(f"[CLIC] {en} ({pos_en[0]['texte']})")
                        time.sleep(self.delay)

            except Exception as e:
                self.log.emit(f"[ERREUR OCR] {e}")

        self.finished.emit()


class WindowSelector(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Bot Quizlet - OCR AutoClick (FR ↔ EN)")
        self.setGeometry(200, 200, 700, 550)

        layout = QtWidgets.QVBoxLayout()

        # Liste des fenêtres
        self.windowList = QtWidgets.QComboBox()
        self.refreshWindowList()
        layout.addWidget(self.windowList)

        # Options
        self.preprocCheckbox = QtWidgets.QCheckBox("Améliorer OCR (prétraitement)")
        self.preprocCheckbox.setChecked(True)
        layout.addWidget(self.preprocCheckbox)

        self.debugCheckbox = QtWidgets.QCheckBox("Afficher OCR détecté (debug)")
        layout.addWidget(self.debugCheckbox)

        self.delaySlider = QtWidgets.QSlider(QtCore.Qt.Horizontal)
        self.delaySlider.setMinimum(5)
        self.delaySlider.setMaximum(500)
        self.delaySlider.setValue(50)
        layout.addWidget(QtWidgets.QLabel("Délai entre clics (ms)"))
        layout.addWidget(self.delaySlider)

        self.tolSlider = QtWidgets.QSlider(QtCore.Qt.Horizontal)
        self.tolSlider.setMinimum(50)
        self.tolSlider.setMaximum(100)
        self.tolSlider.setValue(70)
        layout.addWidget(QtWidgets.QLabel("Tolérance OCR (%)"))
        layout.addWidget(self.tolSlider)

        # Hotkey
        layout.addWidget(QtWidgets.QLabel("Touche raccourci pour ON/OFF"))
        self.hotkeyEdit = QtWidgets.QLineEdit("8")  # 🔥 touche par défaut
        layout.addWidget(self.hotkeyEdit)

        # Boutons
        btn_layout = QtWidgets.QHBoxLayout()
        self.startBtn = QtWidgets.QPushButton("▶ Start")
        self.stopBtn = QtWidgets.QPushButton("⏹ Stop")
        self.refreshBtn = QtWidgets.QPushButton("🔄 Rafraîchir")
        btn_layout.addWidget(self.startBtn)
        btn_layout.addWidget(self.stopBtn)
        btn_layout.addWidget(self.refreshBtn)
        layout.addLayout(btn_layout)

        self.startBtn.clicked.connect(self.startBot)
        self.stopBtn.clicked.connect(self.stopBot)
        self.refreshBtn.clicked.connect(self.refreshWindowList)

        # Zone de logs
        self.logBox = QtWidgets.QTextEdit()
        self.logBox.setReadOnly(True)
        layout.addWidget(self.logBox)

        self.setLayout(layout)

        self.worker = None
        self.applyDarkTheme()

        # 🔥 Gestion du hotkey global
        threading.Thread(target=self.listenHotkey, daemon=True).start()

    def applyDarkTheme(self):
        darkPalette = QPalette()
        darkPalette.setColor(QPalette.Window, QColor(13, 27, 42))
        darkPalette.setColor(QPalette.WindowText, QColor(230, 230, 230))
        darkPalette.setColor(QPalette.Base, QColor(20, 33, 61))
        darkPalette.setColor(QPalette.AlternateBase, QColor(13, 27, 42))
        darkPalette.setColor(QPalette.Text, QColor(220, 220, 220))
        darkPalette.setColor(QPalette.Button, QColor(33, 50, 89))
        darkPalette.setColor(QPalette.ButtonText, QColor(220, 220, 220))
        darkPalette.setColor(QPalette.Highlight, QColor(50, 100, 200))
        darkPalette.setColor(QPalette.HighlightedText, QColor(255, 255, 255))
        self.setPalette(darkPalette)

    def listenHotkey(self):
        """Écoute la touche choisie et bascule Start/Stop."""
        while True:
            key = self.hotkeyEdit.text().strip()
            if key and keyboard.is_pressed(key):
                QtCore.QMetaObject.invokeMethod(self, "toggleBot", QtCore.Qt.QueuedConnection)
                time.sleep(0.5)  # évite spam

    @QtCore.pyqtSlot()
    def toggleBot(self):
        if self.worker and self.worker.isRunning():
            self.stopBot()
        else:
            self.startBot()

    def refreshWindowList(self):
        self.windowList.clear()
        try:
            titles = [t for t in gw.getAllTitles() if t and t.strip()]
            self.windowList.addItems(titles)
        except Exception as e:
            self.logBox.append(f"[ERREUR] {e}")

    def startBot(self):
        if self.worker and self.worker.isRunning():
            self.logBox.append("[INFO] Bot déjà en cours.")
            return

        win_title = self.windowList.currentText()
        if not win_title:
            self.logBox.append("[ERREUR] Aucune fenêtre sélectionnée.")
            return

        gwindows = gw.getWindowsWithTitle(win_title)
        if not gwindows:
            self.logBox.append("[ERREUR] Fenêtre introuvable.")
            return

        window = gwindows[0]
        self.worker = OCRWorker(
            window,
            preproc=self.preprocCheckbox.isChecked(),
            delay=self.delaySlider.value(),
            tol=self.tolSlider.value() / 100.0,
            debug=self.debugCheckbox.isChecked(),
        )
        self.worker.log.connect(self.logBox.append)
        self.worker.finished.connect(lambda: self.logBox.append("[INFO] Bot arrêté."))
        self.worker.start()
        self.logBox.append(f"[INFO] Bot démarré sur '{win_title}'.")

    def stopBot(self):
        if self.worker:
            self.worker.stop()
            self.worker = None
            self.logBox.append("[INFO] Arrêt demandé.")


if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    window = WindowSelector()
    window.show()
    sys.exit(app.exec_())
