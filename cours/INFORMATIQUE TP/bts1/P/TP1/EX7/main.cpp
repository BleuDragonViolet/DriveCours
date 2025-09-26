#include <iostream>
#include <iomanip>

using namespace std;

int main() {
    int N;
    cout << "Entrez une valeur pour N : ";
    cin >> N;


    cout << "\n=== Table de multiplication de 0 a " << N << " ===\n" << endl;


    cout << setw(4) << " ";
    for (int j = 0; j <= N; j++) {
        cout << setw(4) << j;
    }
    cout << endl;


    cout << string(4 * (N + 2), '-') << endl;


    for (int i = 0; i <= N; i++) {
        cout << setw(4) << i << "|";
        for (int j = 0; j <= N; j++) {
            cout << setw(4) << i * j;
        }
        cout << endl;
    }

    return 0;
}
