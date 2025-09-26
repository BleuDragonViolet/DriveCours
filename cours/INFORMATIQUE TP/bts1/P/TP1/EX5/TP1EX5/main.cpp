#include <iostream>
#include <cstdlib>
#include <cmath>
using namespace std;

int main() {
    int choix;
    double a, b, resultat;
    bool continuer = true;

    while (continuer) {
        cout << "==============================" << endl;
        cout << "       CALCULATRICE           " << endl;
        cout << "==============================" << endl;
        cout << " Choisissez une operation :   " << endl;
        cout << "   1. Addition (+)" << endl;
        cout << "   2. Soustraction (-)" << endl;
        cout << "   3. Multiplication (x)" << endl;
        cout << "   4. Division (/)" << endl;
        cout << "   5. Quitter" << endl;
        cout << "==============================" << endl;

        cout << "Votre choix : ";
        cin >> choix;

        if (choix == 5) {
            cout << "Fermeture de la calculatrice..." << endl;
            break;
        }

        cout << "Entrez le premier nombre : ";
        cin >> a;
        cout << "Entrez le deuxieme nombre : ";
        cin >> b;

        cout << "------------------------------" << endl;

        switch (choix) {
            case 1:
                resultat = a + b;
                cout << a << " + " << b << " = " << resultat << endl;
                break;
            case 2:
                resultat = a - b;
                cout << a << " - " << b << " = " << resultat << endl;
                break;
            case 3:
                resultat = a * b;
                cout << a << " × " << b << " = " << resultat << endl;
                break;
            case 4:
                if (b != 0) {
                    resultat = a / b;
                    cout << a << " / " << b << " = " << resultat << endl;
                } else {
                    cout << "Erreur : division par zero impossible !" << endl;
                }
                break;
            default:
                cout << "Choix invalide !" << endl;
        }

        cout << "==============================" << endl;
        cout << "Voulez-vous faire un autre calcul ? (1 = Oui / 0 = Non) : ";
        cin >> continuer;
        cout << endl;
    }

    cout << "+=============================+" << endl;
    cout << "                               " << endl;
    cout << " Fin du programme Calculatrice " << endl;
    cout << "                               " << endl;
    cout << "+=============================+" << endl;

    return 0;
}
