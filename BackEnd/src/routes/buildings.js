const express = require('express');
const router = express.Router();

const { verifyToken, checkRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

const {
  getBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  getRoom,
  addRoom,
  updateRoom,
  deleteRoom,
} = require('../controllers/buildingController');

// ✅ All routes are protected
router.use(verifyToken);

// ============================================================
// BUILDING ROUTES
// ============================================================

// ✅ Get all buildings
router.get('/', getBuildings);

// ✅ Get single building
router.get('/:id', getBuilding);

// ✅ Create building (Admin only)
router.post('/', checkRole(['admin', 'super_admin']), createBuilding);

// ✅ Update building (Admin only)
router.put('/:id', checkRole(['admin', 'super_admin']), updateBuilding);

// ✅ Delete building (Admin only)
router.delete('/:id', checkRole(['admin', 'super_admin']), deleteBuilding);

// ============================================================
// ROOM ROUTES
// ============================================================

// ✅ Get single room
router.get('/:id/rooms/:roomId', getRoom);

// ✅ Add room to building (Admin only) - With file upload
router.post(
  '/:id/rooms',
  checkRole(['admin', 'super_admin']),
  upload.fields([
    { name: 'unitImage', maxCount: 1 },
    { name: 'tenantImage', maxCount: 1 },
    { name: 'agreementFiles', maxCount: 5 },
  ]),
  addRoom
);

// ✅ Update room (Admin only) - With file upload
router.put(
  '/:id/rooms/:roomId',
  checkRole(['admin', 'super_admin']),
  upload.fields([
    { name: 'unitImage', maxCount: 1 },
    { name: 'tenantImage', maxCount: 1 },
    { name: 'agreementFiles', maxCount: 5 },
  ]),
  updateRoom
);

// ✅ Delete room (Admin only)
router.delete('/:id/rooms/:roomId', checkRole(['admin', 'super_admin']), deleteRoom);

module.exports = router;