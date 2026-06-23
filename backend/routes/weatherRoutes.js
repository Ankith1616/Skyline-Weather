import express from 'express';
import {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  exportJSON,
  exportCSV,
  exportPDF,
  searchWeather
} from '../controllers/weatherController.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Weather search endpoint
router.route('/weather/search').get(searchWeather);

// CRUD operations on WeatherRecords
router.route('/weather')
  .post(apiLimiter, createRecord)
  .get(getRecords);

router.route('/weather/:id')
  .get(getRecordById)
  .put(apiLimiter, updateRecord)
  .delete(deleteRecord);

// Export operations
router.route('/export/json').get(exportJSON);
router.route('/export/csv').get(exportCSV);
router.route('/export/pdf').get(exportPDF);

export default router;
