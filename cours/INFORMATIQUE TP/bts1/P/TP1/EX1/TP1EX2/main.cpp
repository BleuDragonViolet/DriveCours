#include <iostream>
#include <cstdlib>//bibliothèque permettant d'utiliser la fonction « system()>>

using namespace std;

int main()
{
int choix, quit=0;

while (quit!=1){

//affichage des choix possibles

cout << "1. choix1"<<endl;
cout << "2. choix2"<<endl;
cout << "3. choix3"<<endl;
cout << "4. Pour quitter"<<endl;
cout << "Faites votre choix :";

cin >> choix;

system("cls"); //effacement de l'écran

//le choix parmi
switch(choix){//selon le choix de l'utilisateur (entré au clavier avec cin)
//dans le cas où on choisit 1
case 1: cout << "vous avez fait le choix 1"<<endl;
break;

//dans le cas où on choisit 2
case 2: cout <<"vous avez fait le choix 2"<<endl;
break;

//dans le cas ou on choisit 3
case3: cout <<"vous avez fait le choix 3"<<endl;
break;

//dans le cas ou on choisit 4, on quitte le programme
case 4: quit=1;//on passe la variable quit à 1 et on quitte la boucle while

//dans tous les autres cas
default : cout << "vous avez fait le mauvais choix"<<endl;

}
}

return 0;
}
