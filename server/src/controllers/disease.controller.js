const mongoose = require('mongoose');

exports.getAllDiseases = async (req, res) => {
  try {
    const diseases = await mongoose.connection.collection('Disease').find().sort({ name: 1 }).toArray();
    return res.status(200).json(diseases);
  } catch (error) {
    console.error('getAllDiseases error', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching diseases.' });
  }
};

exports.getDiseaseById = async (req, res) => {
  try {
    const { id } = req.params; // This is the string from the ML script (e.g., "pneumonia")

    // Clean the string: remove underscores and extra spaces
    const cleanId = id.replace(/_/g, ' ').trim();

    // Create a Case-Insensitive Regex
    // This allows "pneumonia" to match "Pneumonia" in your DB
    const query = { name: { $regex: new RegExp(`^${cleanId}$`, 'i') } };

    let disease = await mongoose.connection.collection('Disease').findOne(query);

    if (!disease) {
      console.error(`ERROR: ML predicted "${id}", but DB search for "${cleanId}" failed.`);
      return res.status(404).json({ 
        success: false, 
        message: `Prediction "${id}" not found in database.` 
      });
    }

    return res.status(200).json(disease);
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
};