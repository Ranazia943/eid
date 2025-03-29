import express from 'express';
import { getPlans, addPlan, checkPlanExistence, updatePlanById } from '../controllers/plans.controller.js';

const router = express.Router();

// Route for checking plan existence
router.get('/check/:name', checkPlanExistence);

// Route for adding a new plan
router.post('/add', addPlan);

// Route for getting all plans
router.get('/all', getPlans);
router.patch('/update/:id', updatePlanById);

// Route for deleting a plan by ID

export default router;
