const Contact = require("../models/contact");

const { HttpError } = require("../helpers");
const { controllerWrap } = require("../decorators");

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(req.query);
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, null, {
    skip,
    limit,
  }).populate("owner", "email name");
  res.json(result);
};

const getOneById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);

  if (!result) {
    throw HttpError(404, `Contact with id "${contactId}" not found`);
  }

  res.json(result);
};

const addToContacts = async (req, res, next) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);

  if (!result) {
    throw HttpError(404, `Contact with id "${contactId}" not found`);
  }

  res.json({
    message: "contact deleted",
  });
};

const updateContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, `Contact with id "${contactId}" not found`);
  }

  res.json(result);
};

const updateFavorite = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!result) {
    throw HttpError(404, `Contact with id "${contactId}" not found`);
  }

  res.json(result);
};

module.exports = {
  getAllContacts: controllerWrap(getAllContacts),
  getOneById: controllerWrap(getOneById),
  addToContacts: controllerWrap(addToContacts),
  deleteContact: controllerWrap(deleteContact),
  updateContact: controllerWrap(updateContact),
  updateFavorite: controllerWrap(updateFavorite),
};
