import CustomRequest from "../models/CustomRequest.js";

// @desc    Create a new custom request
// @route   POST /api/custom-requests
// @access  Public
export const createCustomRequest = async (req, res) => {
  try {
    const {
      name,
      email,
      shape,
      size,
      measurements,
      length,
      baseColor,
      description,
      referenceImage,
    } = req.body;

    if (!name || !email || !shape || !size || !length || !baseColor || !description) {
      return res.status(400).json({ message: "Please fill in all required fields." });
    }

    const customRequest = new CustomRequest({
      user: req.user ? req.user._id : null,
      name,
      email,
      shape,
      size,
      measurements,
      length,
      baseColor,
      description,
      referenceImage,
    });

    const createdRequest = await customRequest.save();
    return res.status(201).json(createdRequest);
  } catch (error) {
    console.error("Error creating custom request:", error);
    return res.status(500).json({ message: "Failed to submit custom request." });
  }
};

// @desc    Get all custom requests
// @route   GET /api/custom-requests
// @access  Private/Admin
export const getAdminCustomRequests = async (req, res) => {
  try {
    const requests = await CustomRequest.find({}).sort({ createdAt: -1 });
    return res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching custom requests:", error);
    return res.status(500).json({ message: "Failed to fetch custom requests." });
  }
};

// @desc    Update custom request status
// @route   PUT /api/custom-requests/:id
// @access  Private/Admin
export const updateCustomRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const customRequest = await CustomRequest.findById(req.params.id);

    if (!customRequest) {
      return res.status(404).json({ message: "Custom request not found." });
    }

    customRequest.status = status;
    const updatedRequest = await customRequest.save();

    return res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating custom request:", error);
    return res.status(500).json({ message: "Failed to update custom request." });
  }
};
