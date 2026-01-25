import React, { useState, useMemo } from 'react';
import '../styles/DogForm.css';
import logo from '../assets/DAP.png';

/**
 * DogForm Component
 * A full-featured, 3-step diagnostic form for canine health assessment.
 * Includes complete breed database and medical condition library.
 */
const DogForm = ({ onSubmit }) => {
  // --- Form State ---
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    dogName: '', birthMonth: '', birthYear: '', breedState: '',
    breed: '', primaryBreed: '', secondaryBreed: '', weight: '', sex: '',
    dailyActiveHours: 1.0, activityLevel: '', activityIntensity: '', primaryDiet: '', appetiteLevel: '',
    fearOfNoises: '', aggressionOnLeash: '', homeType: '', homeArea: '',
    leadPresent: '', annualIncome: '',
    spayedNeutered: '', vaccinationStatus: '', insurance: '',
    diseaseOrgan: '', disease: ''
  });

  // --- Complete Breed Database ---
  const breedOptions = useMemo(() => [
    "Affenpinscher", "Afghan Hound", "African Village Dog", "Africanis", "Airedale Terrier", "Akbash", "Akita", "Alaskan Husky", "Alaskan Klee Kai", "Alaskan Malamute", "American Bulldog", "American Bully", "American English Coonhound", "American Eskimo Dog", "American Foxhound", "American Hairless Terrier", "American Indian Dog", "American Pitbull Terrier", "American Staffordshire Terrier", "American Water Spaniel", "Anatolian Shepherd Dog", "Appenzeller Sennenhund", "Australian Cattle Dog", "Australian Kelpie", "Australian Koolie", "Australian Labradoodle", "Australian Shepherd", "Australian Terrier", "Azawakh", "Barbet", "Basenji", "Basset Hound", "Beagle", "Bearded Collie", "Beauceron", "Bedlington Terrier", "Belgian Malinois", "Belgian Sheepdog", "Bernese Mountain Dog", "Bichon Frise", "Bloodhound", "Border Collie", "Border Terrier", "Borzoi", "Boston Terrier", "Boxer", "Brittany", "Brussels Griffon", "Bull Terrier", "Bulldog", "Bullmastiff", "Cairn Terrier", "Cane Corso", "Cardigan Welsh Corgi", "Cavalier King Charles Spaniel", "Chesapeake Bay Retriever", "Chihuahua", "Chinese Shar-Pei", "Chow Chow", "Cocker Spaniel", "Collie", "Dachshund", "Dalmatian", "Doberman Pinscher", "English Bulldog", "English Setter", "English Springer Spaniel", "French Bulldog", "German Shepherd Dog", "German Shorthaired Pointer", "Giant Schnauzer", "Golden Retriever", "Great Dane", "Great Pyrenees", "Greyhound", "Havanese", "Irish Setter", "Irish Wolfhound", "Italian Greyhound", "Jack Russell Terrier", "Japanese Chin", "Labrador Retriever", "Lhasa Apso", "Maltese", "Mastiff", "Miniature Pinscher", "Newfoundland", "Norwegian Elkhound", "Old English Sheepdog", "Papillon", "Pembroke Welsh Corgi", "Pomeranian", "Poodle", "Portuguese Water Dog", "Pug", "Rhodesian Ridgeback", "Rottweiler", "Saint Bernard", "Samoyed", "Schipperke", "Scottish Terrier", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Siberian Husky", "Staffordshire Bull Terrier", "Vizsla", "Weimaraner", "Welsh Terrier", "West Highland White Terrier", "Whippet", "Yorkshire Terrier"
  ], []);

  // --- Complete 19-Category Medical Library ---
  const diseaseData = {
    "Eye": ["Blindness", "Cataracts", "Glaucoma", "Keratoconjunctivitis sicca (KCS)", "Persistent pupillary membrane (PPM)", "Missing one or both eyes", "Third eyelid prolapse (cherry eye)", "Conjunctivitis", "Corneal ulcer", "Distichia", "Ectropion", "Entropion", "Imperforate lacrimal punctum", "Iris cyst", "Juvenile cataracts", "Nuclear sclerosis", "Pigmentary uveitis", "Progressive retinal atrophy", "Retinal detachment", "Uveitis"],
    "Ear/Nose/Throat": ["Deafness", "Ear Infection", "Ear Mites", "Epistaxis", "Hearing loss", "Hematoma", "Pharyngitis", "Rhinitis", "Tonsillitis"],
    "Mouth/Dental/Oral": ["Cleft lip", "Cleft palate", "Missing teeth", "Dental calculus", "Extracted teeth", "Fractured teeth", "Gingivitis", "Masticatory myositis", "Oronasal fistula", "Overbite", "Retained deciduous teeth", "Sialocele", "Underbite"],
    "Skin": ["Dermoid cysts", "Spina bifida", "Umbilical hernia (Skin)", "Alopecia", "Atopic dermatitis", "Chronic hot spots", "Skin infections", "Contact dermatitis", "Discoid lupus erythematosus (DLE)", "Flea allergy dermatitis", "Fleas", "Food/Medicine allergies", "Ichthyosis", "Lick granuloma", "Pemphigus", "Pododermatitis", "Pruritis", "Sarcoptic mange", "Seasonal allergies", "Sebaceous adenitis", "Sebaceous cysts", "Seborrhea", "Ticks"],
    "Cardiac": ["Aortic/Subaortic stenosis", "Atrial septal defects", "Mitral dysplasia", "Murmur", "Patent ductus arteriosus (PDA)", "Pulmonic stenosis", "Arrhythmia", "Cardiomyopathy", "Congestive heart failure", "Endocarditis", "Hypertension", "Valve disease"],
    "Respiratory": ["Stenotic nares", "Tracheal stenosis", "ARDS", "Bronchitis", "Chronic cough", "Elongated soft palate", "Laryngeal paralysis", "Pneumonia", "Tracheal collapse"],
    "Gastrointestinal": ["Atresia ani", "Megaesophagus", "Umbilical hernia", "Anal sac impaction", "Bilious vomiting syndrome", "Bloat (GDV)", "Chronic diarrhea", "Chronic vomiting", "Constipation", "Fecal incontinence", "Foreign body ingestion", "HGE/Stress colitis", "IBS/IBD", "Lymphangiectasia", "Protein-losing enteropathy (PLE)"],
    "Liver/Pancreas": ["Portosystemic shunt", "Biliary obstruction", "Chronic liver disease", "EPI", "Gall bladder mucocele", "Microvascular dysplasia", "Pancreatitis"],
    "Kidney/Urinary": ["Born with one kidney", "Ectopic ureter", "Renal dysplasia", "Acute kidney failure", "Bladder prolapse", "Chronic kidney disease", "Pyelonephritis", "Kidney stones", "Urinary incontinence", "UTI"],
    "Reproductive": ["Cryptorchid", "Hermaphroditism", "Prostatic hyperplasia", "Dystocia", "Mastitis", "Pyometra", "Testicular atrophy", "Vaginitis"],
    "Bone/Orthopedic": ["Missing limb", "Valgus deformity", "Cruciate ligament rupture", "Degenerative joint disease", "Dwarfism", "Elbow dysplasia", "Hip dysplasia", "IVDD (Orthopedic)", "Osteoarthritis", "OCD", "Panosteitis", "Patellar luxation", "Spondylosis"],
    "Brain/Neurologic": ["Hydrocephalus", "Cauda equina syndrome", "Degenerative myelopathy", "Dementia/Senility", "Fibrocartilaginous embolism (FCE)", "Horner's syndrome", "IVDD (Neurologic)", "Limb paralysis", "Myasthenia gravis", "Seizures/Epilepsy", "Vestibular disease", "Wobbler syndrome"],
    "Endocrine": ["Congenital hypothyroidism", "Addison's disease", "Cushing's disease", "Diabetes insipidus", "Diabetes mellitus", "Hypercalcemia", "Hyperthyroidism", "Hypothyroidism"],
    "Hematopoietic": ["Anemia", "Factor I deficiency", "Hemophilia", "Polycythemia", "Splenic hematoma", "Thrombocytopenia", "Von Willebrand's disease"],
    "Other Congenital Disorder": ["Other congenital disorder"],
    "Infection/Parasites": ["Anaplasmosis", "Bordetella (Kennel cough)", "Brucellosis", "Coccidia", "Distemper", "Ehrlichiosis", "Giardia", "Heartworm", "Lyme disease", "Parvovirus", "Ringworm", "Tapeworms", "Whipworms"],
    "Toxin Consumption": ["Chocolate", "Antifreeze", "Grapes/Raisins", "Human medications", "Rodenticide", "Recreational drugs"],
    "Trauma": ["Dog bite", "Fall from height", "Bone fracture", "Head trauma", "Hit by vehicle", "Snakebite", "Tail injury"],
    "Immune-mediated": ["Autoimmune thyroiditis", "IMT / ITP", "IMHA / AIHA", "Polyarthritis (IMPA)", "Systemic lupus erythematosus (SLE)"]
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 31 }, (_, i) => 2026 - i);

  // --- Handlers ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validate = () => {
    const required = {
      1: ['dogName', 'birthMonth', 'birthYear', 'breedState', 'weight', 'sex'],
      2: ['activityLevel', 'activityIntensity', 'primaryDiet', 'appetiteLevel', 'fearOfNoises', 'aggressionOnLeash', 'homeType', 'homeArea', 'leadPresent', 'annualIncome'],
      3: ['spayedNeutered', 'vaccinationStatus', 'insurance']
    };
    const breedCheck = formData.breedState === 'Pure' ? ['breed'] : step === 1 ? ['primaryBreed', 'secondaryBreed'] : [];
    const missing = [...required[step], ...breedCheck].filter(f => !formData[f]);
    if (missing.length > 0) {
      alert("Please complete the following fields: " + missing.join(", "));
      return false;
    }
    return true;
  };

  return (
    <div className="fintech-viewport">
      <div className="mesh-background"></div>
      <div className="fintech-card">
        <header className="card-header">
          <div className="header-top">
            <img 
              src={logo} 
              alt="DAP Logo" 
              className="brand-logo" 
              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
            />
            <div className="title-group">
              <h1 className="brand-title">Health Predictor</h1>
              <p className="step-label">
                {step === 1 && "Step 1: Basic Information"}
                {step === 2 && "Step 2: Lifestyle & Habits"}
                {step === 3 && "Step 3: Medical History"}
              </p>
            </div>
          </div>
          <div className="progress-pill-wrap">
            <div className="progress-pill-fill" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </header>

        <div className="form-content">
          {step === 1 && (
            <div className="fade-in-up">
              <div className="field-group full"><label>DOG NAME</label><input type="text" name="dogName" value={formData.dogName} onChange={handleChange} placeholder="e.g. Max" /></div>
              <div className="grid-2">
                <div className="field-group">
                  <label>BIRTH DATE</label>
                  <div className="flex-row">
                    <select name="birthMonth" value={formData.birthMonth} onChange={handleChange}><option value="">Month</option>{months.map(m => <option key={m} value={m}>{m}</option>)}</select>
                    <select name="birthYear" value={formData.birthYear} onChange={handleChange}><option value="">Year</option>{years.map(y => <option key={y} value={y}>{y}</option>)}</select>
                  </div>
                </div>
                <div className="field-group"><label>SEX</label><select name="sex" value={formData.sex} onChange={handleChange}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option></select></div>
              </div>
              <div className="grid-2">
                <div className="field-group"><label>WEIGHT (KG)</label><input type="number" step="0.1" name="weight" value={formData.weight} onChange={handleChange} placeholder="0.0" /></div>
                <div className="field-group"><label>BREED STATE</label><select name="breedState" value={formData.breedState} onChange={handleChange}><option value="">Select</option><option value="Pure">Pure Breed</option><option value="Mixed">Mixed Breed</option></select></div>
              </div>
              {formData.breedState === 'Pure' ? (
                <div className="field-group pop-up full"><label>BREED</label><input list="breeds" name="breed" value={formData.breed} onChange={handleChange} placeholder="Search Breed..." /></div>
              ) : formData.breedState === 'Mixed' && (
                <div className="grid-2 pop-up">
                  <div className="field-group"><label>PRIMARY BREED</label><input list="breeds" name="primaryBreed" value={formData.primaryBreed} onChange={handleChange} /></div>
                  <div className="field-group"><label>SECONDARY BREED</label><input list="breeds" name="secondaryBreed" value={formData.secondaryBreed} onChange={handleChange} /></div>
                </div>
              )}
              <datalist id="breeds">{breedOptions.map(b => <option key={b} value={b} />)}</datalist>
              <div className="btn-container single-right">
                <button className="btn-solid-pill" onClick={() => validate() && setStep(2)}>Continue →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="fade-in-up">
              <div className="field-group full">
                <label>DAILY ACTIVE HOURS: <span className="blue">{formData.dailyActiveHours}h</span></label>
                <input type="range" name="dailyActiveHours" min="0" max="6" step="0.5" value={formData.dailyActiveHours} onChange={handleChange} className="slider-blue" />
              </div>
              <div className="grid-2">
                <div className="field-group"><label>ACTIVITY LEVEL</label><select name="activityLevel" value={formData.activityLevel} onChange={handleChange}><option value="">Select</option><option value="Low">Low</option><option value="Moderate">Moderate</option><option value="High">High</option><option value="Very High">Very High</option></select></div>
                <div className="field-group"><label>ACTIVITY INTENSITY</label><select name="activityIntensity" value={formData.activityIntensity} onChange={handleChange}><option value="">Select</option><option value="Light">Light</option><option value="Moderate">Moderate</option><option value="Intense">Intense</option></select></div>
              </div>
              <div className="grid-2">
                <div className="field-group"><label>PRIMARY DIET</label><select name="primaryDiet" value={formData.primaryDiet} onChange={handleChange}><option value="">Select</option><option value="Commercial Kibble">Commercial Kibble</option><option value="Commercial Wet">Commercial Wet</option><option value="Freeze-dried">Freeze-dried</option><option value="Home Cooked">Home Cooked</option><option value="Raw">Raw</option><option value="Other">Other</option></select></div>
                <div className="field-group"><label>APPETITE LEVEL</label><select name="appetiteLevel" value={formData.appetiteLevel} onChange={handleChange}><option value="">Select</option><option value="Poor">Poor</option><option value="Normal">Normal</option><option value="Excellent">Excellent</option></select></div>
              </div>
              <div className="grid-2">
                <div className="field-group"><label>FEAR OF NOISES</label><select name="fearOfNoises" value={formData.fearOfNoises} onChange={handleChange}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
                <div className="field-group"><label>AGGRESSION ON LEASH</label><select name="aggressionOnLeash" value={formData.aggressionOnLeash} onChange={handleChange}><option value="">Select</option><option value="None">None</option><option value="Mild">Mild</option><option value="Moderate">Moderate</option><option value="Severe">Severe</option></select></div>
              </div>
              <div className="grid-2">
                <div className="field-group"><label>HOME TYPE</label><select name="homeType" value={formData.homeType} onChange={handleChange}><option value="">Select</option><option value="House">House</option><option value="Apartment">Apartment</option><option value="Condo">Condo</option></select></div>
                <div className="field-group"><label>HOME AREA</label><select name="homeArea" value={formData.homeArea} onChange={handleChange}><option value="">Select</option><option value="Urban">Urban</option><option value="Suburban">Suburban</option><option value="Rural">Rural</option></select></div>
              </div>
              <div className="grid-2">
                <div className="field-group"><label>LEAD PRESENT</label><select name="leadPresent" value={formData.leadPresent} onChange={handleChange}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
                <div className="field-group"><label>ANNUAL INCOME</label><select name="annualIncome" value={formData.annualIncome} onChange={handleChange}><option value="">Select</option>{Array.from({ length: 10 }, (_, i) => `$${i * 25000} - $${(i + 1) * 25000}`).map(opt => <option key={opt} value={opt}>{opt}</option>)}<option value="250000+">$250,000+</option></select></div>
              </div>
              <div className="btn-container split">
                <button className="btn-outline-pill" onClick={() => setStep(1)}>Back</button>
                <button className="btn-solid-pill" onClick={() => validate() && setStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-in-up">
              <div className="grid-2">
                <div className="field-group"><label>SPAYED/NEUTERED</label><select name="spayedNeutered" value={formData.spayedNeutered} onChange={handleChange}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
                <div className="field-group"><label>VACCINATION STATUS</label><select name="vaccinationStatus" value={formData.vaccinationStatus} onChange={handleChange}><option value="">Select</option><option value="Current">Current</option><option value="Not Current">Not Current</option></select></div>
              </div>
              <div className="field-group full"><label>INSURANCE</label><select name="insurance" value={formData.insurance} onChange={handleChange}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></select></div>
              <div className="field-group full"><label>DISEASE CATEGORY</label><select name="diseaseOrgan" value={formData.diseaseOrgan} onChange={handleChange}><option value="">Healthy / No Issues</option>{Object.keys(diseaseData).map(o => <option key={o} value={o}>{o}</option>)}</select></div>
              {formData.diseaseOrgan && (
                <div className="field-group pop-up full"><label>SPECIFIC CONDITION</label><select name="disease" value={formData.disease} onChange={handleChange}><option value="">Select Condition</option>{diseaseData[formData.diseaseOrgan].map(d => <option key={d} value={d}>{d}</option>)}</select></div>
              )}
              <div className="btn-container split">
                <button className="btn-outline-pill" onClick={() => setStep(2)}>Back</button>
                <button className="btn-solid-pill" onClick={() => validate() && onSubmit(formData)}>Complete ✓</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DogForm;