
const int B = 0;
int valeurLue;
float tension;

 
void setup()
{
    //on se contente de démarrer la liaison série
    Serial.begin(9600);
}

 
void loop()
{
    valeurLue = analogRead(B);
    tension = (valeurLue * 5.0 / 1023);
    
    Serial.print("valeurLue = ");
    Serial.println(valeurLue);
   
   
    Serial.print("Tension U = ");
    Serial.print(tension,1);
    Serial.println(" V");
    Serial.println();
  
    delay(500);
}
