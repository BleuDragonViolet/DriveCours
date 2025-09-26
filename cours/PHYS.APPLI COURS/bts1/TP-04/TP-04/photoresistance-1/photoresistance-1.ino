
const char led = 3;            
const char capteur = 0; 
float tension = 0;             
float seuilObscurite = 2.5;    // à modifier éventuellement

void setup()
{
    pinMode(led, OUTPUT);
    Serial.begin(9600); 
}
void loop()
{
    tension = (analogRead(capteur) * 5.0) / 1023;  // à justifier
    if(tension >= seuilObscurite)
    {
        digitalWrite(led, HIGH); // à compléter
    }
    else
    {
        digitalWrite(led,    LOW); // à compléter
    }
    Serial.print("Tension = ");
    Serial.print(tension);
    Serial.println(" V");
    delay(500);
    }
    
    
