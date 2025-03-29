import Plan from '../models/plan.model.js';
import mongoose from 'mongoose';
// Check if plan already exists
export const checkPlanExistence = async (req, res) => {
  const { name } = req.params;

  try {
    const existingPlan = await Plan.findOne({ name });

    if (existingPlan) {
      return res.status(400).json({
        message: `The plan '${name}' already exists in the database.`,
      });
    }

    return res.status(200).json({
      message: `The plan '${name}' can be created.`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error checking plan existence.",
      error: error.message,
    });
  }
};

export const addPlan = async (req, res) => {
  const { name, price, duration, dailyProfit, totalProfit } = req.body;

  try {
    // Validate if the plan name is one of the predefined options (from enum)
    const validPlanNames = [
      'Start',
      'Basic',
      'Gold',
      'Platinum',
      'Diamond',
    ];

    if (!validPlanNames.includes(name)) {
      return res.status(400).json({
        message: "Invalid plan name. Please select a valid plan.",
      });
    }

    // Create the new plan with the selected plan's details (from the form)
    const newPlan = new Plan({
      name: name, // Plan name from the frontend
      price: price, // Provided price
      duration: duration, // Provided duration
      dailyProfit: dailyProfit, // Provided daily profit
      totalProfit: totalProfit, // Provided total profit
    });

    await newPlan.save();

    res.status(201).json({
      message: "Plan added successfully.",
      plan: newPlan,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding plan.",
      error: error.message,
    });
  }
};
// Fetch all plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find(); // Fetch all plans from the database
    res.status(200).json(plans); // Return all plans as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching plans.",
      error: error.message,
    });
  }
};
// Delete plan by ID
export const updatePlanById = async (req, res) => {
  const { id } = req.params;
  const { price, duration, dailyProfit, totalProfit } = req.body;

  try {
    // Validate the plan ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid plan ID" });
    }

    // Check if the plan exists
    const existingPlan = await Plan.findById(id);
    if (!existingPlan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Explicitly prevent name updates
    if (req.body.name && req.body.name !== existingPlan.name) {
      return res.status(400).json({
        message: "Plan name cannot be modified after creation"
      });
    }

    // Prepare update object with only the allowed fields
    const updateData = {};
    if (price) updateData.price = price;
    if (duration) updateData.duration = duration;
    if (dailyProfit) updateData.dailyProfit = dailyProfit;
    if (totalProfit) updateData.totalProfit = totalProfit;

    // Update the plan
    const updatedPlan = await Plan.findByIdAndUpdate(
      id,
      updateData,
      { 
        new: true,         // Return the updated document
        runValidators: true // Run schema validations
      }
    );

    res.status(200).json({
      message: "Plan updated successfully",
      plan: updatedPlan
    });

  } catch (error) {
    console.error("Error updating plan:", error);
    res.status(500).json({
      message: "Error updating plan",
      error: error.message
    });
  }
};