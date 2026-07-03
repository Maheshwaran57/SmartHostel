const MessMenu = require('../models/MessMenu');
const AppError = require('../utils/AppError');

const getTodayMenu = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const menu = await MessMenu.findOne({
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    res.status(200).json({
      success: true,
      menu
    });
  } catch (error) {
    next(error);
  }
};

const getWeekMenu = async (req, res, next) => {
  try {
    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    // Find current Monday
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const menus = await MessMenu.find({
      date: { $gte: startOfWeek, $lt: endOfWeek }
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      menus
    });
  } catch (error) {
    next(error);
  }
};

const getMonthMenu = async (req, res, next) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const menus = await MessMenu.find({
      date: { $gte: startOfMonth, $lt: endOfMonth }
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      menus
    });
  } catch (error) {
    next(error);
  }
};

const createMenu = async (req, res, next) => {
  try {
    const { date, day, breakfast, lunch, dinner, snacks, isHoliday, isSpecial, specialNote } = req.body;
    const formattedDate = new Date(date);
    formattedDate.setHours(0, 0, 0, 0);

    let menu = await MessMenu.findOne({ date: formattedDate });

    if (menu) {
      menu.day = day;
      menu.breakfast = breakfast;
      menu.lunch = lunch;
      menu.dinner = dinner;
      menu.snacks = snacks;
      menu.isHoliday = isHoliday;
      menu.isSpecial = isSpecial;
      menu.specialNote = specialNote;
      await menu.save();
    } else {
      menu = await MessMenu.create({
        date: formattedDate,
        day,
        breakfast,
        lunch,
        dinner,
        snacks,
        isHoliday,
        isSpecial,
        specialNote
      });
    }

    res.status(200).json({
      success: true,
      menu
    });
  } catch (error) {
    next(error);
  }
};

const updateMenu = async (req, res, next) => {
  try {
    const menu = await MessMenu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!menu) {
      return next(new AppError('Menu entry not found', 404));
    }

    res.status(200).json({
      success: true,
      menu
    });
  } catch (error) {
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    const menu = await MessMenu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return next(new AppError('Menu entry not found', 404));
    }
    res.status(200).json({
      success: true,
      message: 'Menu entry deleted'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTodayMenu,
  getWeekMenu,
  getMonthMenu,
  createMenu,
  updateMenu,
  deleteMenu
};