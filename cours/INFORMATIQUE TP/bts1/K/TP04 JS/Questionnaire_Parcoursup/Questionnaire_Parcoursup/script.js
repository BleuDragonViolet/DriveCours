function init () {
  // La fonction résultat() est exécutée lors de la soumission du formulaire
  // Indiquer l'identité du formulaire et l'évenement correspondant à la soumission du formulaire
document.getElementById("orientation").onsubmit = resultat;

  //Récupération des variables et de leurs valeurs dans l'URL :
  // ex : //formulaire.html?prenom=Albert&nom=Dupond&classe=TSTI2D&CPGE=GPGE&BTS_CIEL_ER=BTS+CIEL.ER
  // sReq =
  var sReq = window.location.search.substring(1);
  // Observer dans la console Javascript du navigateur
  console.log("sReq = "+ sReq);


  // Compléter le test
  // si sReq n'est pas une chaine vide
  if(sReq !="" )
  {
      const good = "BTS_CIEL_IR";
      // La fonction split découpe une chaine de caractères (string) et retourne un tableau (array)
      // Quel caractère sépare les ensemble variable=valeur ?
      // Utiliser ce caractère pour découper la chaine sReq
      var aReq = sReq.split("&");
      var mess = "";
      // Boucle sur les variables
      var aVar = [];
      for (var i=0;i<aReq.length;i++) {
        // Quel caractère sépare une variable de sa valeur ?
        // Utiliser ce caractère pour découper la chaine aReq[i]
        aVar[i] = aReq[i].split("=");
        // Observer dans la console
        console.log("aVar["+i+"][0] = "+aVar[i][0]+"   "+"aVar["+i+"][1] = "+aVar[i][1]);
      }
      //Construire la chaine suivante en utilisant les valeurs récupérées
      // mess = valeur_du prenom + " " + valeur_du_nom + " " + valeur_de_classe + " : "
      mess = aVar[0][1] + " " + aVar[1][1] + " de " + aVar[2][1] + " : ";

      //Si au moins un des voeux est = "BTS_CIEL_IR"
      // Ajouter à mess "Bon choix !"
      // Sinon ajouter à mess "Mauvais choix !"
      if(aVar[3][0] == good || aVar[4][0] == good)
      {
        mess += "Bon choix !" ;
      }
      else {
        mess += "Mauvais choix !" ;
      }

      // Ajouter le code HTML mess à l'élément d'ID='resultat'
      document.getElementById('resultat').innerHTML = mess;
  }
}

// Analyser le fonctionnement de la fonction resultat()
// et ajouter les commentaires utiles marqués par un ?
function resultat() {
  // f est un raccourci qui évite de réécrire document.forms["orientation"]
  var f = document.forms["orientation"];

  // initialisation de la variable message
  var message = "Compléter les champs :";

  // Vérifier si le prénom a été saisie. Si non (chaine vide), ajouter "\n - Prénom" à message
  if(f.elements["prenom"].value == "")  {
    message += "\n- Prénom";
  }

  // ?
  if(f.elements["nom"].value == "")  {
    message += "\n- Nom";
  }

  // ?
  if(!f.elements[2].checked && !f.elements[3].checked && !f.elements[4].checked){
    message += "\n- Classe";
  }

  var cpt = 0;
  // Les éléments du formulaire 5 à 12 sont les cases à cocher du choix de spécialités
  // ?
  for (var i=5; i < 13; i++)  {
    if(f.elements[i].checked){
      cpt++;
    }
  }

  // ?
  if(cpt!=2){
    message += "\n- Deux voeux d'orientation";
  }

  // ?
  if(message != "Compléter les champs :"){
    alert(message);
    // Mettre fin à lexécution de la fonction
    return 0;
  }

  // Préparer le message à afficher
  message = f.elements["prenom"].value + " " +
            f.elements["nom"].value + " de " +
            f.elements["classe"].value;

  // ?
  if(f.elements["BTS_CIEL_IR"].checked){
    message += "\n-Tu fais le bon choix !";
  }
  else {
    message += "\n-Es-tu sûr de ton choix ? !";
  }

  alert(message);
}

// Exécuert init() au chargement de la page
window.onload = init;

