#include <iostream>
using namespace std;


int tab_mult(int valeur);


int tab_mult(int valeur) {
    int tableau[10][10];


    for (int i = 1; i <= valeur; i++) {
        for (int j = 1; j <= valeur; j++) {
            tableau[i][j] = i * j;
            cout << tableau[i][j] << "\t";
        }
        cout << endl;
    }
    return 0;
}


int main() {
    int n;
    cout << "Entrez un chiffre entre 1 et 9 : ";
    cin >> n;
    tab_mult(n);
    return 0;
}
