const Submission = require('../models/Submission');

class SubmissionController {
    async submitForm(req, res) {
        try {
            const { id } = req.params; // formId
            const submissionData = req.body; // Form answers

            const submission = new Submission({
                formId: id,
                data: submissionData
            });

            await submission.save();

            res.status(201).json({
                success: true,
                message: 'Form submitted successfully',
                data: submission
            });
        } catch (error) {
            console.error('Submission error:', error);
            res.status(400).json({
                success: false,
                message: 'Submission failed',
                error: error.message
            });
        }
    }

    async getSubmissionsByFormId(req, res) {
        try {
            const { id } = req.params;
            const submissions = await Submission.find({ formId: id }).sort({ createdAt: -1 });

            res.status(200).json({
                success: true,
                data: submissions
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching submissions',
                error: error.message
            });
        }
    }
}

module.exports = new SubmissionController();
