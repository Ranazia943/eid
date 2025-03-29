import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Groups2Icon from '@mui/icons-material/Groups2';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useState ,useEffect} from "react";
import { Link } from "react-router-dom";
import WorkIcon from '@mui/icons-material/Work';
import ForumIcon from '@mui/icons-material/Forum';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { CurrencyExchange, Delete, Edit } from '@mui/icons-material';
import { toast } from "react-hot-toast"; // Import toast for notifications
import { 
  Button, 
  Box, 
  Tooltip, 
  Modal,  
  TextField 
} from '@mui/material';
const All_Plains = () => {
    const [side, setSide] = useState(false)
    const [isactive, setIsactive] = useState(0)
    const [isopentoggle, setIsopentoggle] = useState(false)
    const [plans, setPlans] = useState([]);  // State to store plans
    const [openModal, setOpenModal] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);

    const [formData, setFormData] = useState({
      price: '',
      duration: '',
      dailyProfit: '',
      totalProfit: ''
  });
  const handleOpenUpdate = (plan) => {
    setCurrentPlan(plan);
    setFormData({
        price: plan.price,
        duration: plan.duration,
        dailyProfit: plan.dailyProfit,
        totalProfit: plan.totalProfit
    });
    setOpenModal(true);
};

// Close modal
const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentPlan(null);
};

// Handle form input changes
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: value
    }));
};

// Update plan function
const updatePlan = async () => {
    try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/plan/update/${currentPlan._id}`, {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (response.ok) {
            toast.success('Plan updated successfully!');
            fetchPlans(); // Refresh the plans list
            handleCloseModal();
        } else {
            throw new Error(data.message || 'Failed to update plan');
        }
    } catch (error) {
        toast.error(error.message);
    }
};

    const fetchPlans = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL; // Ensure this is correct
        console.log("API URL:", `${baseURL}/api/plan/all`); // Log the full API URL to check if it's correct
        const response = await fetch(`${baseURL}/api/plan/all`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        
        const data = await response.json();
        console.log("Fetched plans:", data); // Log the fetched data
        
        if (data && data.length > 0) {
          setPlans(data);  // Update the state with the fetched plans
        } else {
          toast.error('No plans available');
        }
      } catch (error) {
        toast.error('Error fetching plans: ' + error.message);
      }
    };
    


    
    const isopen = (ind)=>{
        setIsactive(ind)
        setIsopentoggle(!isopentoggle)
    }
    useEffect(() => {
        fetchPlans();
      }, []);
  return (
   <div>
     <div className="dashboard-wrapper">
     <div id="sidebar-wrapper" className={`${side ? "open":""}`}>
            <div className="sidebar">
            <div className="close-icon flex justify-start ml-4  mt-4">
             <i onClick={()=>setSide(false)} className="fa-solid border-2 px-1 rounded-md fa-xmark text-xl side-menu"></i>
            </div>
            <ul className=" p-2 text-white">
                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard'>
                  <div className=" flex justify-center space-x-2">
                        <DashboardIcon/> <p className=" cursor-pointer">DashBoard</p>
                    </div>
                  </Link>
                    {/* <div className="arrow">
                        <KeyboardArrowRightIcon/>
                    </div> */}
                </li>
                <li className=" my-2">
                   <div id="cc" className={`flex justify-between p-2 rounded-lg ${isactive===1 ? "activ" : ""}`} onClick={()=>isopen(1)}>
                   <div className=" flex justify-center  space-x-2">
                        <WorkIcon/> <p className=" cursor-pointer">users</p>
                    </div>
                    <div className="arrow">
                        {isopentoggle && isactive===1 ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
                    </div>
                   </div>
                    <div className={`submenu-wrapper ${isactive===1 && isopentoggle===true ? "colaps":"colapsd"}`}>
                        <ul className="submenu text-start pl-8 border-l-2 mt-2">
                        <li className="my-2"><Link to="/admin/dashboard/allusers">ALL users</Link></li>
                        <li className="my-2"><Link to="/admin/dashboard/adduser">Update Profile</Link></li>
                        </ul>
                    </div>
                </li>
                <li className=" my-2">
                   <div id="cc" className={`flex justify-between p-2 rounded-lg ${isactive===2 ? "activ" : ""}`} onClick={()=>isopen(2)}>
                   <div className=" flex justify-center  space-x-2">
                        <Groups2Icon/> <p className=" cursor-pointer">Plans</p>
                    </div>
                    <div className="arrow">
                    {isopentoggle && isactive===2 ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
                    </div>
                   </div>
                    <div className={`submenu-wrapper ${isactive===2 && isopentoggle===true ? "colaps":"colapsd"}`}>
                        <ul className="submenu text-start pl-8 border-l-2 mt-2">
                        <li className="my-2"><Link to="/admin/dashboard/allplans">All Plans</Link></li>
                        <li className="my-2"><Link to="/admin/dashboard/addplan">Add Plan</Link></li>
                        </ul>
                    </div>
                </li>
                <li className=" my-2">
                   <div id="cc" className={`flex justify-between p-2 rounded-lg ${isactive===3 ? "activ" : ""}`} onClick={()=>isopen(3)}>
                   <div className=" flex justify-center  space-x-2">
                        <WorkspacePremiumIcon/> <p className=" cursor-pointer">About</p>
                    </div>
                    <div className="arrow">
                    {isopentoggle && isactive===3 ? <KeyboardArrowDownIcon/> : <KeyboardArrowRightIcon/>}
                    </div>
                   </div>
                    <div className={`submenu-wrapper ${isactive===3 && isopentoggle===true ? "colaps":"colapsd"}`}>
                        <ul className="submenu text-start pl-8 border-l-2 mt-2">
                        <li className="my-2"><Link to="/admin/dashboard/aboutdetail">About Details</Link></li>
                        <li className="my-2"><Link to="/admin/dashboard/add_aboutdetail">Add Detail</Link></li>
                        </ul>
                    </div>
                </li>
              
                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard/support'>
                  <div className=" flex justify-center space-x-2">
                        <ForumIcon/> <p className=" cursor-pointer">Support</p>
                    </div>
                  </Link>
                    {/* <div className="arrow">
                        <KeyboardArrowRightIcon/>
                    </div> */}
                </li>
                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard/requests'>
                  <div className=" flex justify-center space-x-2">
                        <SportsKabaddiIcon/> <p className=" cursor-pointer">Plan Requests</p>
                    </div>
                  </Link>
                    {/* <div className="arrow">
                        <KeyboardArrowRightIcon/>
                    </div> */}
                </li>
                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard/withdraw'>
                  <div className=" flex justify-center space-x-2">
                        <CurrencyExchange/> <p className=" cursor-pointer">Withraw Rquests</p>
                    </div>
                  </Link>
                </li>


                <li id="cc" className={`flex justify-between p-2 rounded-lg my-2 ${isactive===0 ? "activ" : ""}`} onClick={()=>isopen(0)}>
                  <Link to='/admin/dashboard/sendmail'>
                  <div className=" flex justify-center space-x-2">
                        <CurrencyExchange/> <p className=" cursor-pointer">Email Setting</p>
                    </div>
                  </Link>
                </li>
            </ul>
            </div>
        </div>
      <div className="dashboard-side min-h-screen ">
            <div className="close-icon bg-white inline-block">
             <i onClick={()=>setSide(true)} className="fa-solid fa-bars m-2 text-lg side-menu"></i>
            </div>
       <div className=" text-center" data-aos="fade-right"  data-aos-easing="linear" data-aos-duration="1800">
       <h2 className="text-2xl font-extrabold bg-gradient-to-tr from-cyan-300 via-cyan-100 inline-block px-16 rounded-full text-gray-600 py-4">Plans</h2>
       </div>
        <div>
        <div className="plan-wrapper">
        <div className="investment mt-20 mx-4 md:mx-10 lg:mx-16 pb-28">
  <div className="wrapper grid grid-cols-1 min-[700px]:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
    {/* Dynamically render each plan */}
    {plans.map(plan => (
      <div key={plan._id} data-aos="zoom-in" data-aos-duration="1000" className="p-4 border max-[700px]:w-[400px] max-[700px]:mx-auto max-[500px]:w-full group relative rounded-lg hover:-translate-y-2 duration-300 overflow-hidden bg-white">
        <h2 className="text-center font-[700] text-xl my-2 rounded-lg text-black">{plan.name}</h2>
        <div className="wrapp flex justify-between items-end">
          <div>
            <p><span className="text-lg text-black font-[500]">Price : </span><span className="text-black font-[350] text-base">Rs. {plan.price}</span></p>
            <p><span className="text-lg text-black font-[500]">Duration : </span><span className="text-black font-[350] text-base">{plan.duration} Days</span></p>
            <p><span className="text-lg text-black font-[500]">Daily Profit : </span><span className="text-black font-[350] text-base">Rs. {plan.dailyProfit}</span></p>
            <p><span className="text-lg text-black font-[500]">Total Profit : </span><span className="text-black font-[350] text-base">Rs. {plan.totalProfit}</span></p>
          </div>
          
    <Box 
      display="flex" 
      flexDirection={{ xs: 'column', sm: 'row' }} 
      gap={2} 
      alignItems="center"
    >
      {/* Assign Task Button */}
      <Link to={`/admin/dashboard/assignTask/${plan._id}`}>
        <Button 
          variant="contained"
          sx={{
            background: "#4ade80",
            width: { xs: '100%', sm: 'auto' },  // Full width on small screens
            marginTop: { xs: 2, sm: 0 },  // Add top margin for small screens to separate buttons
            fontSize: '0.8rem', // Smaller text
            padding: '6px 12px', // Smaller padding
          }}
        >
          Add Task
        </Button>
      </Link>

      {/* All Task Button */}
      <Link to={`/admin/dashboard/alltask/${plan._id}`}>
  <Button 
    variant="contained" 
    sx={{ 
      backgroundColor: '#primary', // Apply orange color
      width: { xs: '100%', sm: 'auto' }, // Full width on small screens
      fontSize: '0.8rem', // Smaller text
     
    }}
  >
    All Task
  </Button>
</Link>

      {/* Delete Button */}
      <Tooltip title="Update Plan" placement="top">
    <Button
        variant="contained"
        sx={{
            background: "#1976d2", // Blue color for update
            width: { xs: '100%', sm: 'auto' },
            marginTop: { xs: 2, sm: 0 },
            fontSize: '0.8rem',
            padding: '6px 12px',
        }}
        onClick={() => handleOpenUpdate(plan)} // Pass the plan data
    >
        <Edit fontSize="small" /> {/* Edit icon instead of Delete */}
    </Button>
</Tooltip>
    </Box>
        </div>
      </div>
    ))}
  </div>


  <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="update-plan-modal"
                aria-describedby="update-plan-form"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    <h2 className="text-xl font-bold mb-4">Update {currentPlan?.name} Plan</h2>
                    
                    <div className="space-y-4">
                        <TextField
                            fullWidth
                            label="Price"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Duration (Days)"
                            name="duration"
                            type="number"
                            value={formData.duration}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Daily Profit"
                            name="dailyProfit"
                            type="number"
                            value={formData.dailyProfit}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            label="Total Profit"
                            name="totalProfit"
                            type="number"
                            value={formData.totalProfit}
                            onChange={handleInputChange}
                            variant="outlined"
                        />
                    </div>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                        <Button 
                            onClick={handleCloseModal} 
                            sx={{ mr: 2 }}
                            variant="outlined"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={updatePlan}
                            variant="contained"
                            color="primary"
                        >
                            Update Plan
                        </Button>
                    </Box>
                </Box>
            </Modal>

</div>

            </div>
        </div>
        </div>
    </div>
   </div>
   
  )
}

export default All_Plains