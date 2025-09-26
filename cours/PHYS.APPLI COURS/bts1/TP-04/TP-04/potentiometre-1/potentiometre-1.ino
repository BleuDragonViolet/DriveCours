// le potentiomètre, branché sur la broche analogique A0
const int B = 0;
//variable pour stocker la valeur lue après conversion
int valeurLue;

void setup()
{
    //on se contente de démarrer la liaison série
   Serial.begin(9600);
}
 
void loop()
{
    //on convertit en nombre  la tension lue en sortie du potentiomètre
    valeurLue = analogRead(B);
    
    //on affiche la valeur lue sur la liaison série
    Serial.print("valeurLue = ");
    Serial.println(valeurLue);
   
    //on attend une demi-seconde pour que l'affichage ne soit pas trop rapide
    delay(500);
}
