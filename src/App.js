import { useState } from 'react';
import axios from "axios";
import './App.css';

function App() {
  const allSymptoms = [
'itching','skin_rash','nodal_skin_eruptions','continuous_sneezing','shivering','chills','joint_pain',
'stomach_pain','acidity','ulcers_on_tongue','muscle_wasting','vomiting','burning_micturition','spotting_ urination',
'fatigue','weight_gain','anxiety','cold_hands_and_feets','mood_swings','weight_loss','restlessness','lethargy','patches_in_throat',
'irregular_sugar_level','cough','high_fever','sunken_eyes','breathlessness','sweating','dehydration','indigestion','headache',
'yellowish_skin','dark_urine','nausea','loss_of_appetite','pain_behind_the_eyes','back_pain','constipation','abdominal_pain',
'diarrhoea','mild_fever','yellow_urine','yellowing_of_eyes','acute_liver_failure','fluid_overload','swelling_of_stomach',
'swelled_lymph_nodes','malaise','blurred_and_distorted_vision','phlegm','throat_irritation','redness_of_eyes','sinus_pressure',
'runny_nose','congestion','chest_pain','weakness_in_limbs','fast_heart_rate','pain_during_bowel_movements','pain_in_anal_region',
'bloody_stool','irritation_in_anus','neck_pain','dizziness','cramps','bruising','obesity','swollen_legs','swollen_blood_vessels',
'puffy_face_and_eyes','enlarged_thyroid','brittle_nails','swollen_extremeties','excessive_hunger','extra_marital_contacts',
'drying_and_tingling_lips','slurred_speech','knee_pain','hip_joint_pain','muscle_weakness','stiff_neck','swelling_joints',
'movement_stiffness','spinning_movements','loss_of_balance','unsteadiness','weakness_of_one_body_side','loss_of_smell',
'bladder_discomfort','foul_smell_of urine','continuous_feel_of_urine','passage_of_gases','internal_itching','toxic_look_(typhos)','depression',
'irritability','muscle_pain','altered_sensorium','red_spots_over_body','belly_pain','abnormal_menstruation','dischromic _patches','watering_from_eyes',
'increased_appetite','polyuria','family_history','mucoid_sputum','rusty_sputum','lack_of_concentration','visual_disturbances','receiving_blood_transfusion',
'receiving_unsterile_injections','coma','stomach_bleeding','distention_of_abdomen','history_of_alcohol_consumption','fluid_overload.1','blood_in_sputum','prominent_veins_on_calf',
'palpitations','painful_walking','pus_filled_pimples','blackheads','scurring','skin_peeling','silver_like_dusting','small_dents_in_nails','inflammatory_nails','blister','red_sore_around_nose','yellow_crust_ooze'
]

  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState(null);
  const [error, setError] = useState(null);

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms(prev => ({
      ...prev,
      [symptom]: !prev[symptom]
    }));
  };

  const handleSubmit = async () => {
    const symptoms = Object.keys(selectedSymptoms).filter(symptom => selectedSymptoms[symptom]);

    if (symptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("https://herbwise.onrender.com", {
        params: { symptoms: symptoms.join(',') } // Sending symptoms as a query parameter
      });
      setDiagnosis(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms({});
    setDiagnosis(null);
    setError(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Medical Diagnosis System</h1>
        <p>Select your symptoms to get a diagnosis and remedies</p>
      </header>

      <main className="app-main">
        {!diagnosis ? (
          <div className="symptom-selector">
            <h2>Select Symptoms</h2>
            <div className="symptoms-grid">
              {allSymptoms.map(symptom => (
                <div key={symptom} className="symptom-item">
                  <input
                    type="checkbox"
                    id={symptom}
                    checked={!!selectedSymptoms[symptom]}
                    onChange={() => handleSymptomChange(symptom)}
                  />
                  <label htmlFor={symptom}>{symptom.replace(/_/g, ' ')}</label>
                </div>
              ))}
            </div>

            <div className="actions">
              <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Get Diagnosis'}
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>
        ) : (
          <div className="diagnosis-result">
            <h2>Diagnosis Results</h2>
            <div className="result-section">
              <h3>Condition:</h3>
              <p className="diagnosis">{diagnosis.disease?.replace(/_/g, ' ') || 'Unknown'}</p>
            </div>

            <div className="result-section">
              <h3>Recommended Remedies:</h3>
              <ul>
                {diagnosis.remedies?.map((remedy, index) => (
                  <li key={index}>{remedy}</li>
                )) || <li>No Data</li>}
              </ul>
            </div>
            
            <div className="result-section">
              <h3>ingredients required:</h3>
              <ul>
                {diagnosis.herbs?.map((herb, index) => (
                  <li key={index}>{herb}</li>
                )) || <li>No Data</li>}
              </ul>
            </div>

            <div className="result-section">
              <h3>Amazon Links:</h3>
              <ul>
                {diagnosis.amazon_links?.map((link, index) => (
                  <li key={index}><a href={link} target="_blank" rel="noopener noreferrer"> LINK FOR {diagnosis.herbs?.[index] }</a></li>
                )) || <li>No Links Available</li>}
              </ul>
            </div>

            <button onClick={resetForm} className="back-button">Start Over</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;