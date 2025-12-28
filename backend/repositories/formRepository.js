const Form = require('../models/Form');

class FormRepository {
  async create(formData) {
    const form = new Form(formData);
    return await form.save();
  }

  async findAll() {
    return await Form.find();
  }

  async findById(id) {
    return await Form.findById(id);
  }

  async update(id, formData) {
    return await Form.findByIdAndUpdate(id, formData, { new: true });
  }

  async delete(id) {
    return await Form.findByIdAndDelete(id);
  }
}

module.exports = new FormRepository();
