import React, { useState } from 'react';

const DenutritionEval = () => {
  const [data, setData] = useState({
    poidsActuel: '',
    poidsHabituel: '',
    taille: '',
    albuminemie: '',
    antecedentsDenutrition: false,
    typeConsommateur: 'tout',
    profilConsommateur: 'tout',
    caracteristiquesMedicales: [],
    caracteristiquesPhysiques: [],
    rythmePrise: 'normale'
  });

  const [resultats, setResultats] = useState(null);

  // Codes couleur pour la sévérité de dénutrition
  const severiteColors = {
    faible: 'bg-green-500 text-white',
    modere: 'bg-yellow-500 text-black',
    severe: 'bg-red-500 text-white'
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCheckboxChange = (field, value) => {
    setData(prevData => {
      const currentValues = prevData[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prevData, [field]: newValues };
    });
  };

  const evaluer = () => {
    // Conversion des valeurs en nombres
    const taille = parseFloat(data.taille) / 100;
    const poidsActuel = parseFloat(data.poidsActuel);
    const poidsHabituel = parseFloat(data.poidsHabituel);
    
    // Calcul de l'IMC et perte de poids
    const imc = (poidsActuel / (taille * taille)).toFixed(1);
    const pertePoids = ((poidsHabituel - poidsActuel) / poidsHabituel * 100).toFixed(1);
    
    // Initialisation des variables d'évaluation
    let facteurs = 0;
    let pointsVigilance = [];
    let niveau = 'faible';
    let recommendations = [];
    let actionsPrioritaires = [];

    // Détermination du niveau de sévérité
    if (parseFloat(imc) < 18 || parseFloat(pertePoids) > 10) {
      niveau = 'severe';
    } else if (parseFloat(imc) < 21 || parseFloat(pertePoids) > 5) {
      niveau = 'modere';
    }

    // Calcul des facteurs de risque
    if (data.caracteristiquesMedicales.length > 2) {
      facteurs += 3;
    } else if (data.caracteristiquesMedicales.length > 0) {
      facteurs += 2;
    }

    data.caracteristiquesMedicales.forEach(carac => {
      pointsVigilance.push(`Caractéristique médicale : ${carac}`);
    });

    data.caracteristiquesPhysiques.forEach(carac => {
      facteurs++;
      pointsVigilance.push(`Caractéristique physique : ${carac}`);
    });

    // Recommandations et actions prioritaires
    recommendations = [
      "Utiliser la fiche d'évaluation du profil de mangeur",
      "Utiliser la fiche d'évaluation du comportement alimentaire",
      "Évaluer l'environnement des repas"
    ];

    if (niveau === 'modere') {
      actionsPrioritaires = [
        "Enrichissement naturel des plats appréciés",
        "Surveillance alimentaire rapprochée sur 3 jours"
      ];
    } else if (niveau === 'severe') {
      actionsPrioritaires = [
        "Consultation médicale urgente",
        "Enrichissement des plats et prescription de compléments nutritionnels oraux (CNO)",
        "Suivi quotidien de l'alimentation"
      ];
    }

    // Mise à jour des résultats
    setResultats({
      imc,
      pertePoids,
      niveau,
      facteurs,
      pointsVigilance,
      recommendations,
      actionsPrioritaires,
      severiteColor: severiteColors[niveau]
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
        Évaluation du Risque de Dénutrition
      </h2>
      
      <form className="space-y-6">
        {/* Formulaire de saisie des données */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Poids actuel (kg)</label>
            <input
              type="number"
              name="poidsActuel"
              value={data.poidsActuel}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Poids habituel (kg)</label>
            <input
              type="number"
              name="poidsHabituel"
              value={data.poidsHabituel}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Taille (cm)</label>
            <input
              type="number"
              name="taille"
              value={data.taille}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-300"
            />
          </div>
        </div>

        {/* Caractéristiques médicales et physiques */}
        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Caractéristiques médicales</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['maladie_neurodegenerative', 'polymedication', 'troubles_comportement', 'insuffisance_renale', 
                'cancer', 'maladie_inflammatoire', 'depression'].map(carac => (
                <label key={carac} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.caracteristiquesMedicales.includes(carac)}
                    onChange={() => handleCheckboxChange('caracteristiquesMedicales', carac)}
                    className="mr-2"
                  />
                  {carac === 'maladie_neurodegenerative' ? 'Maladie neurodégénérative' : carac.replace('_', ' ')}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Caractéristiques physiques</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['fatigabilite', 'manque_force', 'troubles_moteurs', 'perte_appetit', 
                'troubles_mastication', 'troubles_deglutition', 'troubles_sensoriels'].map(carac => (
                <label key={carac} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={data.caracteristiquesPhysiques.includes(carac)}
                    onChange={() => handleCheckboxChange('caracteristiquesPhysiques', carac)}
                    className="mr-2"
                  />
                  {carac.replace('_', ' ')}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton d'évaluation */}
        <button
          type="button"
          onClick={evaluer}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out text-lg font-semibold"
        >
          Évaluer le Risque de Dénutrition
        </button>
      </form>

      {/* Résultats */}
      {resultats && (
        <div className="mt-8 space-y-6 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-2xl font-bold text-center text-blue-700">
            Résultats de l'Évaluation
          </h3>

          {/* Synthèse du risque */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Données Anthropométriques</h4>
              <p>IMC : {resultats.imc} kg/m²</p>
              <p>Perte de poids : {resultats.pertePoids}%</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold mb-2">Niveau de Risque</h4>
              <p className={`inline-block px-3 py-1 rounded ${resultats.severiteColor}`}>
                {resultats.niveau.toUpperCase()}
              </p>
              <p>Facteurs de risque : {resultats.facteurs}</p>
            </div>
          </div>

          {/* Points de vigilance */}
          <div className="bg-blue-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-blue-800">Points de Vigilance</h4>
            <ul className="list-disc list-inside">
              {resultats.pointsVigilance.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          {/* Recommandations */}
          <div className="bg-green-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-green-800">Recommandations</h4>
            <ul className="list-disc list-inside">
              {resultats.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Actions prioritaires */}
          <div className="bg-red-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-red-800">Actions Prioritaires</h4>
            <ul className="list-disc list-inside">
              {resultats.actionsPrioritaires.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default DenutritionEval;