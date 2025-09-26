#include <iostream>
using namespace std;

int main() {
    float Vmax, Vautre, Vcourante, d;

    cout << "Vitesse max du regulateur (Vmax) : ";
    cin >> Vmax;

    while (1) {
        cout << "\nEntrez Vcourante (999 pour quitter): ";
        cin >> Vcourante;
        if (Vcourante == 999) break;

        cout << "Entrez la vitesse du vehicule devant (Vautre): ";
        cin >> Vautre;
        cout << "Entrez la distance avec le vehicule devant (d): ";
        cin >> d;


        if (Vcourante < Vmax && d >= 15) {
            Vcourante = Vmax;
        }
        else if (Vcourante > Vmax && d >= 15) {
            Vcourante = Vmax;
        }
        else if (Vcourante >= Vmax && d < 15) {
            Vcourante = Vautre;
            d = 15;
        }
        else if (Vcourante < Vmax && d < 15) {
            Vcourante = Vautre;
            d = 15;
        }

        cout << "Nouvelle vitesse courante: " << Vcourante << endl;
        cout << "Distance de securite: " << d << " m" << endl;
    }

    return 0;
}
