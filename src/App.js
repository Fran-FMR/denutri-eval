import React, { useState } from 'react';

function App() {
  const [data, setData] = useState({
    poidsActuel: '',
    poidsHabituel: '',
    taille: '',
    alimentation: 'tout',
    caracteristiquesMedicales: [],
    caracteristiquesPhysiques: [],
    albuminemie: '',
    antecedentsDenutrition: false
  });

  const [resultats, setResultats] = useState(null);

  const evaluer = () => {
    // Calculs de base
    const taille = data.taille / 100;
    const imc = (data.poidsActuel / (taille * taille)).toFixed(1);
    const pertePoids = ((data.poidsHabituel - data.poidsActuel) / data.poidsHabituel * 100).toFixed(1);
    
    // Évaluation des risques
    let facteurs = 0;
    let pointsVigilance = [];
    let niveau = 'normal';

    // Critères phénotypiques
    if (imc < 21) facteurs++;
    if (pertePoids > 5) facteurs++;

    // Critères alimentaires
    if (data.alimentation === 'deux_tiers') facteurs++;
    if (data.alimentation === 'moitie') facteurs += 2;

    // Points de vigilance basés sur les caractéristiques
    if (data.caracteristiquesMedicales.includes('neurodegenerative')) {
      facteurs++;
      pointsVigilance.push("Surveillance accrue : Maladie neurodégénérative");
    }
    if (data.caracteristiquesMedicales.includes('polymedication')) {
      facteurs++;
      pointsVigilance.push("Surveillance des interactions médicamenteuses");
    }
    if (data.caracteristiquesMedicales.includes('troubles_comportement')) {
      facteurs++;
      pointsVigilance.push("Suivi comportemental alimentaire requis");
    }

    if (data.caracteristiquesPhysiques.includes('fatigabilite')) {
      facteurs++;
      pointsVigilance.push("Adapter les temps de repas - Risque de fatigabilité");
    }
    if (data.caracteristiquesPhysiques.includes('manque_force')) {
      facteurs++;
      pointsVigilance.push("Aide au repas nécessaire - Manque de force");
    }
    if (data.caracteristiquesPhysiques.includes('problemes_moteurs')) {
      facteurs++;
      pointsVigilance.push("Adaptation des textures - Problèmes de coordination");
    }

    // Détermination du niveau de risque
    if (facteurs >= 2 && facteurs < 4) niveau = 'modere';
    if (facteurs >= 4 || imc < 18 || pertePoids > 10) niveau = 'severe';

    setResultats({
      imc,
      pertePoids,
      niveau,
      facteurs,
      pointsVigilance
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 my-8">
      <h2 className="text-2xl font-bold mb-6">Évaluation du Risque de Dénutrition</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Poids actuel (kg)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={data.poidsActuel}
              onChange={(e) => setData({...data, poidsActuel: e.target.value})}
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Poids habituel (kg)</label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              value={data.poidsHabituel}
              onChange={(e) => setData({...data, poidsHabituel: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Taille (cm)</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={data.taille}
            onChange={(e) => setData({...data, taille: e.target.value})}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Albuminémie (g/L) - Optionnel</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={data.albuminemie}
            onChange={(e) => setData({...data, albuminemie: e.target.value})}
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.antecedentsDenutrition}
              onChange={(e) => setData({...data, antecedentsDenutrition: e.target.checked})}
              className="rounded"
            />
            <span>Antécédents de dénutrition</span>
          </label>
        </div>

        <div>
          <label className="block mb-2 font-medium">Comportement alimentaire</label>
          <select
            className="w-full p-2 border rounded"
            value={data.alimentation}
            onChange={(e) => setData({...data, alimentation: e.target.value})}
          >
            <option value="tout">Mange tout</option>
            <option value="deux_tiers">Mange les 2/3</option>
            <option value="moitie">Mange moins de la moitié</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">Caractéristiques médicales</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={data.caracteristiquesMedicales.includes('neurodegenerative')}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...data.caracteristiquesMedicales, 'neurodegenerative']
                    : data.caracteristiquesMedicales.filter(c => c !== 'neurodegenerative');
                  setData({...data, caracteristiquesMedicales: newValue});
                }}
              />
              Maladie neurodégénérative
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={data.caracteristiquesMedicales.includes('polymedication')}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...data.caracteristiquesMedicales, 'polymedication']
                    : data.caracteristiquesMedicales.filter(c => c !== 'polymedication');
                  setData({...data, caracteristiquesMedicales: newValue});
                }}
              />
              Polymédication
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={data.caracteristiquesMedicales.includes('troubles_comportement')}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...data.caracteristiquesMedicales, 'troubles_comportement']
                    : data.caracteristiquesMedicales.filter(c => c !== 'troubles_comportement');
                  setData({...data, caracteristiquesMedicales: newValue});
                }}
              />
              Troubles du comportement alimentaire
            </label>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-medium">Caractéristiques physiques</label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={data.caracteristiquesPhysiques.includes('fatigabilite')}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...data.caracteristiquesPhysiques, 'fatigabilite']
                    : data.caracteristiquesPhysiques.filter(c => c !== 'fatigabilite');
                  setData({...data, caracteristiquesPhysiques: newValue});
                }}
              />
              Fatigabilité
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={data.caracteristiquesPhysiques.includes('manque_force')}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...data.caracteristiquesPhysiques, 'manque_force']
                    : data.caracteristiquesPhysiques.filter(c => c !== 'manque_force');
                  setData({...data, caracteristiquesPhysiques: newValue});
                }}
              />
              Manque de force et de tonus
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={data.caracteristiquesPhysiques.includes('problemes_moteurs')}
                onChange={(e) => {
                  const newValue = e.target.checked
                    ? [...data.caracteristiquesPhysiques, 'problemes_moteurs']
                    : data.caracteristiquesPhysiques.filter(c => c !== 'problemes_moteurs');
                  setData({...data, caracteristiquesPhysiques: newValue});
                }}
              />
              Problèmes moteurs et de coordination
            </label>
          </div>
        </div>

        <button
          className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={evaluer}
        >
          Évaluer
        </button>

        {resultats && (
          <div className={`mt-4 space-y-4 ${
            resultats.niveau === 'severe' ? 'bg-red-100' :
            resultats.niveau === 'modere' ? 'bg-orange-100' :
            'bg-green-100'
          } p-4 rounded-lg`}>
            <div className={`text-lg font-bold ${
              resultats.niveau === 'severe' ? 'text-red-700' :
              resultats.niveau === 'modere' ? 'text-orange-700' :
              'text-green-700'
            }`}>
              {resultats.niveau === 'severe' ? '⚠️ RISQUE SÉVÈRE DE DÉNUTRITION' :
               resultats.niveau === 'modere' ? '⚠️ RISQUE MODÉRÉ DE DÉNUTRITION' :
               '✓ RISQUE FAIBLE'}
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="font-medium mb-2">Indicateurs :</div>
              <div className="space-y-3">
                <div>• IMC : {resultats.imc} kg/m²</div>
                <div>• Perte de poids : {resultats.pertePoids}%</div>
                {data.albuminemie && <div>• Albuminémie : {data.albuminemie} g/L</div>}
                
                <div>
                  <div className="mb-1">• Échelle de risque : {resultats.facteurs}/6</div>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        resultats.facteurs <= 2 ? 'bg-green-500' :
                        resultats.facteurs <= 4 ? 'bg-orange-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${(resultats.facteurs / 6) * 100}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-green-500">Faible</span>
                    <span className="text-orange-500">Modéré</span>
                    <span className="text-red-500">Sévère</span>
                  </div>
                </div>
              </div>
            </div>

            {(resultats.niveau === 'severe' || resultats.niveau === 'modere') && (
              <>
                <div className="p-4 bg-red-50 rounded-lg shadow-sm">
                  <div className="font-bold text-red-700 mb-2">Niveau de criticité et surveillance :</div>
                  <div className="space-y-2">
                    {resultats.niveau === 'severe' ? (
                      <div className="font-medium">⚠️ SUIVI PRIORITAIRE - Surveillance quotidienne requise</div>
                    ) : (
                      <div className="font-medium">⚡ Surveillance rapprochée nécessaire</div>
                    )}
                    <div className="pl-4">
                      <div>• Mettre en place la surveillance alimentaire sur 3 jours</div>
                      <div>• Utiliser l'outil "Profil de mangeur" pour évaluer le comportement alimentaire</div>
                      <div>• Réévaluation dans {resultats.niveau === 'severe' ? '15 jours' : '1 mois'}</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg shadow-sm">
                  <div className="font-medium mb-2">Recommandations nutritionnelles :</div>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Enrichissement des repas :</li>
                    <ul className="list-circle pl-6 space-y-1">
                      <li>Se reporter au dossier "Enrichissement" pour les protocoles</li>
                      <li>Adapter selon les préférences du résident</li>
                    </ul>
                    {resultats.niveau === 'severe' && (
                      <>
                        <li className="mt-2">Mesures supplémentaires urgentes :</li>
                        <ul className="list-circle pl-6 space-y-1">
                          <li>Consultation diététique prioritaire</li>
                          <li>Évaluation médicale pour CNO</li>
                          {data.antecedentsDenutrition && !data.albuminemie && (
                            <li>Prévoir un dosage de l'albuminémie</li>
                          )}
                        </ul>
                        </>
                    )}
                  </ul>
                </div>
              </>
            )}

            {resultats.pointsVigilance.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
                <div className="font-medium mb-2">Points de vigilance :</div>
                <ul className="list-disc pl-4 space-y-1">
                  {resultats.pointsVigilance.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;