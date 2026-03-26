const Disease = require('../models/Disease');

const DEFAULT_DISEASES = [
  {
    name: 'Allergy',
    slug: 'allergy',
    category: 'Infectious Disease',
    description:
      'Allergies occur when the body reacts to substances such as dust, pollen, food, or animal fur. In children, allergies often affect the skin, nose, eyes, or breathing and are usually not serious, but they can be uncomfortable.',
    severity: 'Moderate',
    summary: 'Most mild allergies can be managed at home, but symptoms should be monitored.',
    commonSymptoms: ['Sneezing or runny nose', 'Itchy or watery eyes', 'Skin rash or itching', 'Mild cough or throat irritation'],
    seekCareWhen: ['Symptoms become severe or persistent', 'Breathing difficulty occurs', 'Swelling of the face, lips, or tongue appears'],
    whatToDo: ['Try to identify and avoid possible triggers (dust, pollen, certain foods)', 'Keep your child\'s environment clean and well-ventilated', 'Ensure your child gets enough rest and fluids', 'Monitor symptoms over time'],
  },
  {
    name: 'Malaria',
    slug: 'malaria',
    category: 'Infectious Disease',
    description: 'Malaria is a mosquito-borne infectious disease.',
    severity: 'High',
    summary: 'Requires prompt medical treatment.',
    commonSymptoms: ['Fever', 'Chills', 'Sweating', 'Headache'],
    seekCareWhen: ['High fever', 'Severe chills', 'Confusion'],
    whatToDo: ['Seek medical care', 'Prevent mosquito bites'],
  },
  {
    name: 'Tuberculosis',
    slug: 'tuberculosis',
    category: 'Infectious Disease',
    description: 'Bacterial infection mainly affecting the lungs.',
    severity: 'High',
    summary: 'Requires long-term treatment.',
    commonSymptoms: ['Cough', 'Fever', 'Weight loss', 'Night sweats'],
    seekCareWhen: ['Coughing blood', 'Severe chest pain', 'Difficulty breathing'],
    whatToDo: ['Complete full course of treatment', 'Avoid spreading to others'],
  },
  {
    name: 'Hypertension',
    slug: 'hypertension',
    category: 'Cardiovascular',
    description: 'High blood pressure condition.',
    severity: 'Moderate',
    summary: 'Manage with lifestyle and medication.',
    commonSymptoms: ['Often no symptoms', 'Headaches', 'Dizziness'],
    seekCareWhen: ['Severe headache', 'Chest pain', 'Shortness of breath'],
    whatToDo: ['Monitor blood pressure', 'Reduce salt intake', 'Exercise regularly'],
  },
  {
    name: 'Type 2 Diabetes',
    slug: 'type-2-diabetes',
    category: 'Metabolic',
    description: 'Chronic condition affecting blood sugar regulation.',
    severity: 'Moderate',
    summary: 'Lifestyle and medication can help manage it.',
    commonSymptoms: ['Increased thirst', 'Frequent urination', 'Fatigue'],
    seekCareWhen: ['Very high or low blood sugar', 'Confusion', 'Fainting'],
    whatToDo: ['Follow diet plan', 'Take medication as prescribed', 'Monitor blood sugar'],
  },
];

exports.getAllDiseases = async (req, res) => {
  try {
    let diseases = await Disease.find().sort({ name: 1 });

    if (!diseases || diseases.length === 0) {
      diseases = await Disease.insertMany(DEFAULT_DISEASES);
    }

    return res.status(200).json(diseases);
  } catch (error) {
    console.error('getAllDiseases error', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching diseases.' });
  }
};

exports.getDiseaseById = async (req, res) => {
  try {
    const { id } = req.params;

    const disease = await Disease.findOne({ slug: id.toLowerCase() }) || await Disease.findById(id);

    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease not found.' });
    }

    return res.status(200).json(disease);
  } catch (error) {
    console.error('getDiseaseById error', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching disease.' });
  }
};
