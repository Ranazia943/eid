import express from 'express';
import { 
  purchasePlan, 
  getUserProfitAndPlans,
  getUserDetails,
  getReferralDetails,getAllUsers,getUserPlansWithTasks,getTotalDepositOfUserPlans,getUserById,getAllPurchasedPlans,updatePlanState
} from '../controllers/purchase.controller.js';
import protect from '../utils/protectroute.js';

const router = express.Router();

router.get('/referral-details/:id', protect, getReferralDetails);
// Assuming you have this route file
router.get('/user/:userId/total-deposit', getTotalDepositOfUserPlans);

// Updated route without authentication check
router.post('/purchase/:userId', purchasePlan);
router.post('/userplanswithtasks/:userId', getUserPlansWithTasks)
router.get('/profits-plans',protect, getUserProfitAndPlans);

router.get("/user/:id", getUserDetails);
router.get("/alluser", getAllUsers); // Fetch all users
router.get("/:id", getUserById); // Fetch user details by ID
router.get('/users/plans', getAllPurchasedPlans);
router.patch('/updateState', updatePlanState);

export default router;
