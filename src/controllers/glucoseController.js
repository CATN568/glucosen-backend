const GlucoseReading = require('../models/GlucoseReading');
const { validateGlucoseReading } = require('../utils/validators');

const createReading = async (req, res, next) => {
  try {
    const { glucoseLevel, readingTime, unit = 'mg/dL', notes = '' } = req.body;

    if (!glucoseLevel || !readingTime) {
      return res.status(400).json({ error: 'Glucose level and reading time are required' });
    }

    validateGlucoseReading(glucoseLevel);

    const reading = await GlucoseReading.create(
      req.user.userId,
      glucoseLevel,
      readingTime,
      unit,
      notes
    );

    res.status(201).json({
      message: 'Glucose reading created successfully',
      data: reading,
    });
  } catch (error) {
    next(error);
  }
};

const getReadings = async (req, res, next) => {
  try {
    const { limit = 30, offset = 0 } = req.query;
    const readings = await GlucoseReading.getByUserId(
      req.user.userId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      data: readings,
      count: readings.length,
    });
  } catch (error) {
    next(error);
  }
};

const getReadingsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const readings = await GlucoseReading.getByDateRange(
      req.user.userId,
      startDate,
      endDate
    );

    res.json({
      data: readings,
      count: readings.length,
    });
  } catch (error) {
    next(error);
  }
};

const getStatistics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const stats = await GlucoseReading.getStatistics(req.user.userId, parseInt(days));

    res.json({
      statistics: {
        averageGlucose: parseFloat(stats.average_glucose).toFixed(2),
        minGlucose: stats.min_glucose,
        maxGlucose: stats.max_glucose,
        stdDev: parseFloat(stats.std_dev).toFixed(2),
        totalReadings: stats.total_readings,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateReading = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { glucoseLevel, readingTime, notes } = req.body;

    if (!glucoseLevel || !readingTime) {
      return res.status(400).json({ error: 'Glucose level and reading time are required' });
    }

    validateGlucoseReading(glucoseLevel);

    const reading = await GlucoseReading.update(id, req.user.userId, glucoseLevel, readingTime, notes);

    if (!reading) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    res.json({
      message: 'Glucose reading updated successfully',
      data: reading,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReading = async (req, res, next) => {
  try {
    const { id } = req.params;

    const reading = await GlucoseReading.delete(id, req.user.userId);

    if (!reading) {
      return res.status(404).json({ error: 'Reading not found' });
    }

    res.json({ message: 'Glucose reading deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReading,
  getReadings,
  getReadingsByDateRange,
  getStatistics,
  updateReading,
  deleteReading,
};
