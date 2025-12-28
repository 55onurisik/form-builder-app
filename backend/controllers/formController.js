const formService = require('../services/formService');

class FormController {
  async createForm(req, res) {
    try {
      const form = await formService.createForm(req.body);
      res.status(201).json({
        success: true,
        message: 'Form created successfully',
        data: form
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllForms(req, res) {
    try {
      const forms = await formService.getAllForms();
      res.status(200).json({
        success: true,
        data: forms
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getFormById(req, res) {
    try {
      const form = await formService.getFormById(req.params.id);
      res.status(200).json({
        success: true,
        data: form
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateForm(req, res) {
    try {
      const form = await formService.updateForm(req.params.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Form updated successfully',
        data: form
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteForm(req, res) {
    try {
      await formService.deleteForm(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Form deleted successfully'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new FormController();
