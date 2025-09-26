#include <iostream>
#include <string>
using namespace std;

int main() {
    const int N = 48;
    float temp[N];


    for (int i = 0; i < N; i++) temp[i] = 24;


    temp[5]  = 35;
    temp[15] = 17;
    temp[24] = 28;
    temp[34] = 23;


    float somme = 0;
    for (int i = 0; i < N; i++) somme += temp[i];
    float moyenne = somme / N;

    cout << "Moyenne journaliere : " << moyenne << " degres" << endl;
    cout << "Somme de toutes les cases : " << somme << endl;


    string jours[7] = {"lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"};
    string tableau[2][21];

    for (int i = 0; i < 21; i++) {
        tableau[0][i] = jours[i % 7];
    }

    for (int i = 0; i < 21; i++) {
        tableau[1][i] = to_string(moyenne);
    }


    cout << "\nTableau 2x21 :\n";
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 21; j++) {
            cout << tableau[i][j] << "\t";
        }
        cout << endl;
    }

    return 0;
}
