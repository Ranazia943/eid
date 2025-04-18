import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Groups2Icon from '@mui/icons-material/Groups2';
// import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useState ,useEffect} from "react";
import { Link ,useParams,useNavigate} from "react-router-dom";
import WorkIcon from '@mui/icons-material/Work';
import ForumIcon from '@mui/icons-material/Forum';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { CurrencyExchange, Delete, Edit } from '@mui/icons-material';
import { Button,Box ,TextField, Tooltip } from '@mui/material';
import { toast } from "react-hot-toast"; // Import toast for notifications
import axios from 'axios';

const AssignTask = () => {
  const { planId } = useParams();
  const [side, setSide] = useState(false)
      const [isactive, setIsactive] = useState(0)
      const [isopentoggle, setIsopentoggle] = useState(false) // Retrieve planId from the URL
  const [taskDetails, setTaskDetails] = useState({
    planId: planId,  // Initial planId from URL
    type: '',  
    price: '',  
    url: '',  
  });
  const [loading, setLoading] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const navigate = useNavigate();

  // Log the planId to check if it's correctly passed from the URL
  useEffect(() => {
    console.log('Plan ID from URL:', planId);
  }, [planId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails({
      ...taskDetails,
      [name]: name === 'price' ? parseFloat(value) : value,  // Ensure price is a number
    });
  };

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    // Validate task details before sending the request
    if (!taskDetails.type || !taskDetails.price || !taskDetails.url) {
      toast.error('All fields are required!');
      setLoading(false);
      return;
    }
  
    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
  
      // Send the POST request to the server first
      const response = await axios.post(`${baseURL}/api/tasks/create`, {
        planId: taskDetails.planId,
        type: taskDetails.type,
        price: taskDetails.price,
        url: taskDetails.url,
      });
  
      // Check if the response is successful
      if (response.status === 201) {
        setTaskCreated(true);
        toast.success("Task assigned successfully!");
        // Only navigate after successful submission
        setTimeout(() => {
          navigate(`/admin/dashboard/allplans`);
        }, 1500); // Short delay to show success message
      }
    } catch (error) {
      console.error('Error creating task:', error.response ? error.response.data : error.message);
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };
  const isopen = (ind)=>{
    setIsactive(ind)
    setIsopentoggle(!isopentoggle)
}
  return (
    <div><div id="sidebar-wrapper" className={`${side ? "open":""}`}>
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
           <h2 className="text-2xl font-extrabold bg-gradient-to-tr from-cyan-300 via-cyan-100 inline-block px-16 rounded-full text-gray-600 py-4">Assign Task to Plan</h2>
           </div>

         
           <div className="plan-wrapper">
        <div className="investment mt-20 mx-4 md:mx-10 lg:mx-16 pb-28">
  <div className="wrapper grid grid-cols-1 min-[700px]:grid-cols-1 gap-4 md:gap-6 lg:gap-8">
              <form onSubmit={handleSubmit}>
                <TextField
                  name="type"
                  label="Task Name"
                  variant="outlined"
                  fullWidth
                  value={taskDetails.type}
                  onChange={handleChange}
                  required
                />

                <TextField
                  name="price"
                  label="Task Price"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={taskDetails.price}
                  onChange={handleChange}
                  required
                />

                <TextField
                  name="url"
                  label="Task URL"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={taskDetails.url}
                  onChange={handleChange}
                  required
                />

                <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
                  {loading ? <CircularProgress size={24} /> : 'Assign Task'}
                </Button>
              </form>

              {taskCreated && (
                <Typography variant="h6" color="green" mt={2}>
                  Task assigned successfully! Redirecting...
                </Typography>
              )}
            </div>
          </div>
          </div>
        </div>
      
    </div>

  );
};

export default AssignTask;
