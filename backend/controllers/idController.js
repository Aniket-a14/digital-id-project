// backend/controllers/idController.js

const mockVerification = async (touristData) => {
  // In real implementation, this would call DigiLocker or other verification API
  // For prototype, just return success
  return { success: true, message: "Mock verification passed", verified: true };
};

// Example endpoint
const registerTourist = async (req, res) => {
  try {
    const { address, name, dob, aadhaarHash, itinerary, emergencyContact, metadata } = req.body;

    // 1️⃣ Perform mock verification
    const verificationResult = await mockVerification({ address, name, dob, aadhaarHash, itinerary, emergencyContact });

    if (!verificationResult.verified) {
      return res.status(400).json({ success: false, message: "Verification failed" });
    }

    // 2️⃣ Upload metadata to IPFS (using ipfsService)
    const ipfsCid = await ipfsService.uploadJSON(metadata);

    // 3️⃣ Push to DigiLocker (mock)
    const digilockerResult = await digilockerService.pushToDigilocker(address, ipfsCid);

    // 4️⃣ Store in smart contract (via contractService)
    const tx = await contractService.registerID(address, name, dob, aadhaarHash, itinerary, emergencyContact, ipfsCid);

    res.json({
      success: true,
      message: "Tourist registered successfully (mock verification)",
      ipfsCid,
      digilocker: digilockerResult,
      txHash: tx.hash
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed", error: err.message });
  }
};

const contractService = require("../services/contractService");

const getID = async (req, res) => {
  try {
    const { address } = req.params;
    if (!address) return res.status(400).json({ success: false, message: "Address required" });
    const id = await contractService.getID(address);
    if (!id.exists) return res.status(404).json({ success: false, message: "No digital ID found for this address" });
    res.json({ success: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch digital ID", error: err.message });
  }
};

module.exports = { registerTourist, getID };
