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
    const { id } = req.params;
    const normalized = id.replace(/[-_]/g, ' ').trim();
    const nameMatcher = new RegExp(`^${normalized}$`, 'i');

    let disease = await mongoose.connection.collection('Disease').findOne({ name: nameMatcher });

    if (!disease && mongoose.Types.ObjectId.isValid(id)) {
      disease = await mongoose.connection.collection('Disease').findOne({ _id: mongoose.Types.ObjectId(id) });
    }

    if (!disease) {
      return res.status(404).json({ success: false, message: 'Disease not found.' });
    }

    return res.status(200).json(disease);
  } catch (error) {
    console.error('getDiseaseById error', error);
    return res.status(500).json({ success: false, message: 'Server error while fetching disease.' });
  }
};
