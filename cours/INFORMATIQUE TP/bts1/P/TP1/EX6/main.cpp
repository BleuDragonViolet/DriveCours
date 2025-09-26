#include <iostream>
#include <cstdlib>
#include <ctime>

using namespace std;

// Fonction qui génère un nombre aléatoire entre min et max
int alea(int min, int max) {
    srand(time(NULL)); // initialisation aléatoire à partir de l'horloge
    return (rand() % (max - min + 1)) + min;
}

int main() {
    const int MIN = 0;
    const int MAX = 1000;
    int nombreAleatoire = alea(MIN, MAX);

    int essai = 0;        // valeur saisie par le joueur
    int coups = 0;        // compteur du nombre de tentatives

    cout << "=== Jeu du Juste Prix ===" << endl;
    cout << "Devinez le nombre entre " << MIN << " et " << MAX << " !" << endl;

    do {
        cout << "Votre proposition : ";
        cin >> essai;
        coups++;

        if (essai > nombreAleatoire) {
            cout << "Trop grand !" << endl;
        } else if (essai < nombreAleatoire) {
            cout << "Trop petit !" << endl;
        } else {
            cout << "BRAVO ! Vous avez trouve en " << coups << " coups !" << endl;
        }
    } while (essai != nombreAleatoire);

    return 0;
}
