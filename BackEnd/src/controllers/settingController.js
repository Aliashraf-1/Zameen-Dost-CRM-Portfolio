const Setting = require('../models/Setting');

// ✅ Get settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create({});
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update settings
exports.updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    
    let settings = await Setting.findOne();
    
    if (!settings) {
      settings = await Setting.create(updates);
    } else {
      // Deep merge updates
      Object.keys(updates).forEach(category => {
        if (settings[category] && typeof settings[category] === 'object') {
          Object.keys(updates[category]).forEach(key => {
            settings[category][key] = updates[category][key];
          });
        }
      });
      settings.updatedAt = new Date();
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Reset to default settings
exports.resetSettings = async (req, res) => {
  try {
    await Setting.deleteMany({});
    const settings = await Setting.create({});
    
    res.status(200).json({
      success: true,
      message: 'Settings reset to default.',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};