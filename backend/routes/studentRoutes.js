const express = require('express');
const { protect, authorize } = require('../middlewares/auth');
const { uploadSingle } = require('../middlewares/upload');
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  bulkUpload,
  exportStudents
} = require('../controllers/studentController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', getStudents);
router.get('/export/csv', exportStudents);
router.get('/:id', getStudent);
router.post('/', createStudent);
router.put('/:id', updateStudent);
router.delete('/:id', deleteStudent);
router.post('/bulk-upload', uploadSingle, bulkUpload);

module.exports = router;