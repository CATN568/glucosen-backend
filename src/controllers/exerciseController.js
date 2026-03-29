const Exercise = require('../models/Exercise');

const createExerciseLog = async (req, res, next) => {
  try {
    const { activityType, durationMinutes, intensity, exerciseTime, caloriesBurned = 0, notes = '' } = req.body;

    if (!activityType || !durationMinutes || !intensity || !exerciseTime) {
      return res.status(400).json({ 
        error: 'Activity type, duration, intensity, and exercise time are required' 
      });
    }

    const log = await Exercise.create(
      req.user.userId,
      activityType,
      durationMinutes,
      intensity,
      exerciseTime,
      caloriesBurned,
      notes
    );

    res.status(201).json({
      message: 'Exercise log created successfully',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseLogs = async (req, res, next) => {
  try {
    const { limit = 30, offset = 0 } = req.query;
    const logs = await Exercise.getByUserId(
      req.user.userId,
      parseInt(limit),
      parseInt(offset)
    );

    res.json({
      data: logs,
      count: logs.length,
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseLogsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const logs = await Exercise.getByDateRange(
      req.user.userId,
      startDate,
      endDate
    );

    res.json({
      data: logs,
      count: logs.length,
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseStatistics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;
    const stats = await Exercise.getStatistics(req.user.userId, parseInt(days));

    res.json({
      statistics: {
        totalDuration: stats.total_duration || 0,
        totalCalories: stats.total_calories || 0,
        totalSessions: stats.total_sessions || 0,
        avgDuration: stats.avg_duration ? parseFloat(stats.avg_duration).toFixed(2) : 0,
        period: `${days} days`,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateExerciseLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await Exercise.update(id, req.user.userId, req.body);

    if (!log) {
      return res.status(404).json({ error: 'Exercise log not found' });
    }

    res.json({
      message: 'Exercise log updated successfully',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

const deleteExerciseLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await Exercise.delete(id, req.user.userId);

    if (!log) {
      return res.status(404).json({ error: 'Exercise log not found' });
    }

    res.json({ message: 'Exercise log deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExerciseLog,
  getExerciseLogs,
  getExerciseLogsByDateRange,
  getExerciseStatistics,
  updateExerciseLog,
  deleteExerciseLog,
};
