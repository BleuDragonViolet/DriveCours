#include <iostream>
#include <string>
using namespace std;

int main() {
    int choix = 0;
    int age = 0;
    string nom = "";

    cout << "Menu :" << endl;
    cout << "1. Entrez votre age" << endl;
    cout << "2. Entrez votre nom" << endl;
    cout << "3. Quitter" << endl;

    cout << "Votre choix : ";
    cin >> choix;

    switch (choix) {
        case 1:
            cout << "Entrez votre age : ";
            cin >> age;
            cout << "Votre age est : " << age << endl;
            break;

        case 2:
            cout << "Entrez votre nom : ";
            cin >> nom;
            cout << "Votre nom est : " << nom << endl;
            break;

        case 3:
            cout << "Au revoir" << endl;
            break;

        default:
            cout << "Choix invalide" << endl;
            break;
    }

    return 0;
}
