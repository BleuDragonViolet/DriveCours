#include <iostream>
#include <cmath>

using namespace std;

int main() {
int choix=0;
int nombre=0;string chaine="";
int entier=0;
int tabentier[50];
 int taille = chaine.length();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ;

    cout<<"1. binaire>decimal"<<endl;
    cout<<""<<endl;
    cout<<"2. decimal>binaire"<<endl;
    cout<<" "<<endl;
    cin>>choix;


    switch(choix){

        case 1 : cout<<" "<<endl;
        cout<<" Convertion Binaire en decimal"<<endl;
        cout<<" "<<endl;
        cout<<" Entre une somme en binaire "<<endl;
        cin>>chaine;



        cout<<chaine.length();

        for (int i=0; i<24; i++) {
                tabentier[i]=chaine[i] - '0';
           tabentier[i]=tabentier[i]*pow(2,taille-1-i);
        }

    }
}



