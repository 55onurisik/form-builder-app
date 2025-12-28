const formRepository = require('../repositories/formRepository');

class FormService {
  async createForm(formData) {
    if (!formData.title || !formData.task_data) {
      throw new Error('Title and task_data are required');
    }
    return await formRepository.create(formData);
  }

  async getAllForms() {
    return await formRepository.findAll();
  }

  async getFormById(id) {
    const form = await formRepository.findById(id);
    if (!form) {
      throw new Error('Form not found');
    }
    return form;
  }

  async updateForm(id, formData) {
    const form = await formRepository.update(id, formData);
    if (!form) {
      throw new Error('Form not found');
    }
    return form;
  }

  async deleteForm(id) {
    const form = await formRepository.delete(id);
    if (!form) {
      throw new Error('Form not found');
    }
    return form;
  }
}

module.exports = new FormService();
