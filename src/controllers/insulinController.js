const Insulin = require('../models/Insulin');

const createInsulinLog = async (req, res, next) => {
  try {
    const { insulinType, units, administrationTime, notes = '' } = req.body;

    if (!insulinType || !units || !administrationTime) {
      return res.status(400).json({ error: 'Insulin type, units, and administration time are required' });
    }

    const log = await Insulin.create(
      req.user.userId,
      insulinType,
      units,
      administrationTime,
      notes
    );

    res.status(201).json({
      message: 'Insulin log created successfully',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

const getInsulinLogs = async (req, res, next) => {
  try {
    const { limit = 30, offset = 0 } = req.query;
    const logs = await Insulin.getByUserId(
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

const getInsulinLogsByDateRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    const logs = await Insulin.getByDateRange(
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

const getTotalUnitsDaily = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }

    const totalUnits = await Insulin.getTotalUnitsDaily(req.user.userId, date);

    res.json({
      date,
      totalUnits,
    });
  } catch (error) {
    next(error);
  }
};

const updateInsulinLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await Insulin.update(id, req.user.userId, req.body);

    if (!log) {
      return res.status(404).json({ error: 'Insulin log not found' });
    }

    res.json({
      message: 'Insulin log updated successfully',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

const deleteInsulinLog = async (req, res, next) => {
  try {
    const { id } = req.params;

    const log = await Insulin.delete(id, req.user.userId);

    if (!log) {
      return res.status(404).json({ error: 'Insulin log not found' });
    }

    res.json({ message: 'Insulin log deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInsulinLog,
  getInsulinLogs,
  getInsulinLogsByDateRange,
  getTotalUnitsDaily,
  updateInsulinLog,
  deleteInsulinLog,
};
