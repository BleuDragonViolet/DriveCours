#include <iostream>
using namespace std;


int vitesse_essuie_glace(int resistance);


int vitesse_essuie_glace(int resistance) {
    if (resistance < 10)
        return 0; // arrêt
    else if (resistance < 50)
        return 2; // m/s
    else if (resistance < 75)
        return 4; // m/s
    else if (resistance < 100)
        return 5; // m/s
    else
        return 10; // m/s
}


int main() {
    int r;
    cout << "Entrez la valeur de la resistance (ohms) : ";
    cin >> r;

    int v = vitesse_essuie_glace(r);

    if (v == 0)
        cout << "Essuie-glaces STOP" << endl;
    else
        cout << "Vitesse essuie-glaces : " << v << " m/s" << endl;

    return 0;
}
