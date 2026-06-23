import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import WeatherRecord from '../models/WeatherRecord.js';
import logger from '../utils/logger.js';
import { fetchWeatherData } from '../services/weatherService.js';

// Helper validation functions
const isValidDate = (dateString) => {
  const timestamp = Date.parse(dateString);
  return !isNaN(timestamp);
};

// @desc    Create a new weather record
// @route   POST /api/weather
// @access  Public
export const createRecord = async (req, res, next) => {
  try {
    const { 
      location, 
      latitude, 
      longitude, 
      fromDate, 
      toDate, 
      temperature, 
      humidity, 
      windSpeed, 
      condition 
    } = req.body;

    // 1. Validate location
    if (!location || typeof location !== 'string' || location.trim().length === 0) {
      res.status(400);
      throw new Error('Location is required and must be a non-empty string');
    }

    // 2. Validate dates existence and formats
    if (!fromDate || !isValidDate(fromDate)) {
      res.status(400);
      throw new Error('Valid fromDate is required');
    }
    if (!toDate || !isValidDate(toDate)) {
      res.status(400);
      throw new Error('Valid toDate is required');
    }

    // 3. Validate date range
    const start = new Date(fromDate);
    const end = new Date(toDate);
    if (start > end) {
      res.status(400);
      throw new Error('fromDate must be less than or equal to toDate');
    }

    // 4. Create record
    const record = await WeatherRecord.create({
      location: location.trim(),
      latitude,
      longitude,
      fromDate: start,
      toDate: end,
      temperature,
      humidity,
      windSpeed,
      condition
    });

    logger.info(`Created weather record ID: ${record._id} for location: ${record.location}`);
    
    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    // If Mongoose validation fails, return 400
    if (error.name === 'ValidationError') {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Get all weather records (optional filtering by location)
// @route   GET /api/weather
// @access  Public
export const getRecords = async (req, res, next) => {
  try {
    const { location } = req.query;
    let query = {};

    if (location) {
      query.location = { $regex: location, $options: 'i' }; // case-insensitive substring match
    }

    const records = await WeatherRecord.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single weather record by ID
// @route   GET /api/weather/:id
// @access  Public
export const getRecordById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }

    const record = await WeatherRecord.findById(id);

    if (!record) {
      res.status(404);
      throw new Error('Weather record not found');
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a weather record by ID
// @route   PUT /api/weather/:id
// @access  Public
export const updateRecord = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }

    // Find original record
    const record = await WeatherRecord.findById(id);
    if (!record) {
      res.status(404);
      throw new Error('Weather record not found');
    }

    // 1. Validate location if being updated
    if ('location' in updates) {
      if (!updates.location || typeof updates.location !== 'string' || updates.location.trim().length === 0) {
        res.status(400);
        throw new Error('Location cannot be empty');
      }
      updates.location = updates.location.trim();
    }

    // 2. Validate dates if either is updated
    const finalFromDate = updates.fromDate ? updates.fromDate : record.fromDate;
    const finalToDate = updates.toDate ? updates.toDate : record.toDate;

    if (updates.fromDate && !isValidDate(updates.fromDate)) {
      res.status(400);
      throw new Error('Invalid fromDate value');
    }
    if (updates.toDate && !isValidDate(updates.toDate)) {
      res.status(400);
      throw new Error('Invalid toDate value');
    }

    const start = new Date(finalFromDate);
    const end = new Date(finalToDate);
    if (start > end) {
      res.status(400);
      throw new Error('fromDate must be less than or equal to toDate');
    }

    // Update fields on instance (so pre-validate middleware runs correctly)
    Object.keys(updates).forEach(key => {
      record[key] = updates[key];
    });

    const updatedRecord = await record.save();
    logger.info(`Updated weather record ID: ${id}`);

    res.status(200).json({
      success: true,
      data: updatedRecord
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400);
    }
    next(error);
  }
};

// @desc    Delete a weather record by ID
// @route   DELETE /api/weather/:id
// @access  Public
export const deleteRecord = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error('Invalid ID format');
    }

    const record = await WeatherRecord.findById(id);

    if (!record) {
      res.status(404);
      throw new Error('Weather record not found');
    }

    await record.deleteOne();
    logger.info(`Deleted weather record ID: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Weather record deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export weather records as JSON
// @route   GET /api/export/json
// @access  Public
export const exportJSON = async (req, res, next) => {
  try {
    const records = await WeatherRecord.find({}).sort({ createdAt: -1 });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=weather_history.json');
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

// @desc    Export weather records as CSV
// @route   GET /api/export/csv
// @access  Public
export const exportCSV = async (req, res, next) => {
  try {
    const records = await WeatherRecord.find({}).sort({ createdAt: -1 });

    let csvContent = 'Location,Latitude,Longitude,Temperature (C),Humidity (%),Wind Speed (m/s),Condition,Search Date\n';

    records.forEach(r => {
      const escapedLocation = `"${r.location.replace(/"/g, '""')}"`;
      const dateStr = new Date(r.createdAt).toISOString();
      csvContent += `${escapedLocation},${r.latitude},${r.longitude},${r.temperature},${r.humidity},${r.windSpeed},"${r.condition}",${dateStr}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=weather_history.csv');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Export weather records as PDF
// @route   GET /api/export/pdf
// @access  Public
export const exportPDF = async (req, res, next) => {
  try {
    const records = await WeatherRecord.find({}).sort({ createdAt: -1 });

    const doc = new PDFDocument({ margin: 30 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=weather_history.pdf');

    doc.pipe(res);

    // Title
    doc.fontSize(22).fillColor('#1e293b').text('NimbusWeather - Search History Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#64748b').text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' });
    doc.moveDown(1.5);

    // Table Header
    doc.fontSize(10).fillColor('#475569');
    const startY = doc.y;
    doc.text('Location', 30, startY, { width: 140 });
    doc.text('Temp', 170, startY, { width: 40 });
    doc.text('Humidity', 210, startY, { width: 50 });
    doc.text('Wind', 260, startY, { width: 60 });
    doc.text('Condition', 320, startY, { width: 80 });
    doc.text('Search Date', 400, startY, { width: 180 });
    doc.moveDown(0.5);

    // Draw horizontal line under header
    doc.moveTo(30, doc.y).lineTo(580, doc.y).strokeColor('#cbd5e1').stroke();
    doc.moveDown(0.5);

    // Rows
    records.forEach((record, index) => {
      // Check page break: if space is tight, add a page
      if (doc.y > 700) {
        doc.addPage({ margin: 30 });
        // Redraw headers on new page
        doc.fontSize(10).fillColor('#475569');
        const pageStartY = doc.y;
        doc.text('Location', 30, pageStartY, { width: 140 });
        doc.text('Temp', 170, pageStartY, { width: 40 });
        doc.text('Humidity', 210, pageStartY, { width: 50 });
        doc.text('Wind', 260, pageStartY, { width: 60 });
        doc.text('Condition', 320, pageStartY, { width: 80 });
        doc.text('Search Date', 400, pageStartY, { width: 180 });
        doc.moveDown(0.5);
        doc.moveTo(30, doc.y).lineTo(580, doc.y).strokeColor('#cbd5e1').stroke();
        doc.moveDown(0.5);
      }

      const rowY = doc.y;
      doc.fontSize(9).fillColor('#334155');
      doc.text(record.location, 30, rowY, { width: 140 });
      doc.text(`${Math.round(record.temperature)}°C`, 170, rowY, { width: 40 });
      doc.text(`${record.humidity}%`, 210, rowY, { width: 50 });
      doc.text(`${record.windSpeed} m/s`, 260, rowY, { width: 60 });
      doc.text(record.condition, 320, rowY, { width: 80 });
      doc.text(new Date(record.createdAt).toLocaleString(), 400, rowY, { width: 180 });
      
      doc.moveDown(0.6);
      
      // Draw subtle row separator line
      doc.moveTo(30, doc.y).lineTo(580, doc.y).strokeColor('#f1f5f9').stroke();
      doc.moveDown(0.4);
    });

    doc.end();
  } catch (error) {
    next(error);
  }
};

// @desc    Get live or mock weather for queries, and write search logs to MongoDB
// @route   GET /api/weather/search
// @access  Public
export const searchWeather = async (req, res, next) => {
  try {
    const { type, query, lat, lon } = req.query;

    if (!type) {
      res.status(400);
      throw new Error('searchType is required');
    }

    // 1. Fetch live or mock weather data
    const weatherData = await fetchWeatherData(type, query, lat, lon);

    const today = new Date();
    const toDate = new Date();
    toDate.setDate(today.getDate() + 5);

    // 2. Automatically log the search in the database history
    await WeatherRecord.create({
      location: weatherData.current.name,
      latitude: weatherData.current.lat,
      longitude: weatherData.current.lon,
      fromDate: today,
      toDate: toDate,
      temperature: weatherData.current.temp,
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.windSpeed,
      condition: weatherData.current.condition
    });

    res.status(200).json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    next(error);
  }
};
