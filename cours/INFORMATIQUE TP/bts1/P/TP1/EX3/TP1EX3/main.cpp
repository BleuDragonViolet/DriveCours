#include <iostream>
#include <cstdlib>
#include <cmath>
using namespace std;

// ==================== Fonctions SURFACES ====================
double surfaceCarre(double cote) { return cote * cote; }
double surfaceDisque(double rayon) { return M_PI * rayon * rayon; }
double surfaceRectangle(double L, double l) { return L * l; }
double surfaceTriangle(double b, double h) { return (b * h) / 2.0; }

// ==================== Fonctions VOLUMES ====================
double volumeCube(double cote) { return cote * cote * cote; }
double volumeParallelepipede(double L, double l, double h) { return L * l * h; }
double volumeCylindre(double r, double h) { return M_PI * r * r * h; }
double volumePrisme(double b, double h, double p) { return surfaceTriangle(b, h) * p; }

int main() {
    int choix, quit = 0;

    while (quit != 1) {
        cout << "\n=============================\n";
        cout << " Calcul de Surface ou Volume\n";
        cout << "=============================\n";
        cout << "\n1. Surface\n";
        cout << "2. Volume\n";
        cout << "3. Quitter\n";
        cout << "\nChoix : ";
        cin >> choix;

        system("cls"); // efface l’écran sous Windows

        switch (choix) {
            case 1: {
                int sChoix;
                cout << "\n===== Quels Surfaces =====\n";
                cout << "\n1. Carre\n";
                cout << "2. Disque\n";
                cout << "3. Rectangle\n";
                cout << "4. Triangle\n";
                cout << "\nChoix : ";
                cin >> sChoix;

                switch (sChoix) {
                    case 1: {
                        double cote;
                        cout << "Cote du carre : "; cin >> cote;
                        cout << "Surface = " << surfaceCarre(cote) << endl;
                        break;
                    }
                    case 2: {
                        double r;
                        cout << "Rayon du disque : "; cin >> r;
                        cout << "Surface = " << surfaceDisque(r) << endl;
                        break;
                    }
                    case 3: {
                        double L, l;
                        cout << "Longueur : "; cin >> L;
                        cout << "Largeur : "; cin >> l;
                        cout << "Surface = " << surfaceRectangle(L, l) << endl;
                        break;
                    }
                    case 4: {
                        double b, h;
                        cout << "Base : "; cin >> b;
                        cout << "Hauteur : "; cin >> h;
                        cout << "Surface = " << surfaceTriangle(b, h) << endl;
                        break;
                    }
                    default:
                        cout << "Choix surface invalide !" << endl;
                }
                break;
            }
            case 2: {
                int vChoix;
                cout << "\n===== Quels Volumes =====\n";
                cout << "\n1. Cube\n";
                cout << "2. Parallelepipede rectangle\n";
                cout << "3. Cylindre\n";
                cout << "4. Prisme triangulaire\n";
                cout << "\nChoix : ";
                cin >> vChoix;

                switch (vChoix) {
                    case 1: {
                        double cote;
                        cout << "\nCote du cube : "; cin >> cote;
                        cout << "\nVolume = " << volumeCube(cote) << endl;
                        break;
                    }
                    case 2: {
                        double L, l, h;
                        cout << "\nLongueur : "; cin >> L;
                        cout << "Largeur : "; cin >> l;
                        cout << "Hauteur : "; cin >> h;
                        cout << "\nVolume = " << volumeParallelepipede(L, l, h) << endl;
                        break;
                    }
                    case 3: {
                        double r, h;
                        cout << "\nRayon : "; cin >> r;
                        cout << "Hauteur : "; cin >> h;
                        cout << "\nVolume = " << volumeCylindre(r, h) << endl;
                        break;
                    }
                    case 4: {
                        double b, h, p;
                        cout << "\nBase du triangle : "; cin >> b;
                        cout << "Hauteur du triangle : "; cin >> h;
                        cout << "Profondeur : "; cin >> p;
                        cout << "\nVolume = " << volumePrisme(b, h, p) << endl;
                        break;
                    }
                    default:
                        cout << "Choix volume invalide !" << endl;
                }
                break;
            }
            case 3:
                quit = 1;
                cout << "Au revoir !" << endl;
                break;
            default:
                cout << "Merci de bien mettre 1, 2 ou 3." << endl;
        }
    }

    return 0;
}
