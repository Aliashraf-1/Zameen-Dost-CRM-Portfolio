const Lead = require('../models/Lead');
const mongoose = require('mongoose');

// ✅ Helper: Convert to ObjectId if valid, else return as-is
const toObjectId = (value) => {
  if (!value) return null;
  if (mongoose.Types.ObjectId.isValid(value)) {
    return new mongoose.Types.ObjectId(value);
  }
  return value;
};

// ✅ Get all leads
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().populate('assignedTo', 'name email phone designation');
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get single lead
exports.getLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id).populate('assignedTo', 'name email phone designation');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get leads by employee - Support both ObjectId and Number
exports.getLeadsByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    
    let query;
    if (mongoose.Types.ObjectId.isValid(employeeId)) {
      query = { assignedTo: new mongoose.Types.ObjectId(employeeId) };
    } else if (!isNaN(employeeId)) {
      query = { assignedTo: Number(employeeId) };
    } else {
      query = { assignedTo: employeeId };
    }
    
    const leads = await Lead.find(query).populate('assignedTo', 'name email phone designation');
    
    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error('Get leads by employee error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Create lead - Clean data and handle ObjectId
exports.createLead = async (req, res) => {
  try {
    const leadData = req.body;

    // ✅ Remove empty strings
    Object.keys(leadData).forEach(key => {
      if (leadData[key] === "" || leadData[key] === null || leadData[key] === undefined) {
        delete leadData[key];
      }
    });

    // ✅ Convert assignedTo and createdBy to ObjectId if valid
    if (leadData.assignedTo) {
      if (mongoose.Types.ObjectId.isValid(leadData.assignedTo)) {
        leadData.assignedTo = new mongoose.Types.ObjectId(leadData.assignedTo);
      } else if (!isNaN(leadData.assignedTo)) {
        // Keep as number for legacy support
        leadData.assignedTo = Number(leadData.assignedTo);
      }
    }

    if (leadData.createdBy) {
      if (mongoose.Types.ObjectId.isValid(leadData.createdBy)) {
        leadData.createdBy = new mongoose.Types.ObjectId(leadData.createdBy);
      } else if (!isNaN(leadData.createdBy)) {
        leadData.createdBy = Number(leadData.createdBy);
      }
    }

    const lead = await Lead.create(leadData);
    const populatedLead = await Lead.findById(lead._id).populate('assignedTo', 'name email phone designation');

    res.status(201).json({
      success: true,
      message: 'Lead created successfully.',
      data: populatedLead,
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update lead
exports.updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // ✅ Remove empty strings
    Object.keys(updates).forEach(key => {
      if (updates[key] === "" || updates[key] === null || updates[key] === undefined) {
        delete updates[key];
      }
    });

    // ✅ Convert ObjectId fields
    if (updates.assignedTo) {
      if (mongoose.Types.ObjectId.isValid(updates.assignedTo)) {
        updates.assignedTo = new mongoose.Types.ObjectId(updates.assignedTo);
      }
    }

    if (updates.createdBy) {
      if (mongoose.Types.ObjectId.isValid(updates.createdBy)) {
        updates.createdBy = new mongoose.Types.ObjectId(updates.createdBy);
      }
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email phone designation');

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully.',
      data: lead,
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Add note to lead
exports.addNote = async (req, res) => {
  try {
    const { id } = req.params;
    const noteData = req.body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    // ✅ Clean note data
    if (noteData.createdBy && mongoose.Types.ObjectId.isValid(noteData.createdBy)) {
      noteData.createdBy = new mongoose.Types.ObjectId(noteData.createdBy);
    }

    lead.notes.push(noteData);
    await lead.save();

    const populatedLead = await Lead.findById(lead._id).populate('assignedTo', 'name email phone designation');

    res.status(200).json({
      success: true,
      message: 'Note added successfully.',
      data: populatedLead,
    });
  } catch (error) {
    console.error('Add note error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
    });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};