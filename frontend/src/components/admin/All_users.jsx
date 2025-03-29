import React, { useState, useEffect } from "react";
import axios from "axios"; 
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md"; 
import { toast } from "react-hot-toast"; 
import DashboardIcon from '@mui/icons-material/Dashboard';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Groups2Icon from '@mui/icons-material/Groups2';
import WorkIcon from '@mui/icons-material/Work';
import ForumIcon from '@mui/icons-material/Forum';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { CurrencyExchange } from '@mui/icons-material';
import { Button, Tooltip } from '@mui/material';

const AllUsers = () => {
  const [users, setUsers] = useState([]); 
  const [side, setSide] = useState(false); 
  const [isactive, setIsactive] = useState(0); 
  const [isopentoggle, setIsopentoggle] = useState(false); 
  const [showAssignTaskForm, setShowAssignTaskForm] = useState(false); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [tasks, setTasks] = useState([{ name: "", price: "" }, { name: "", price: "" }, { name: "", price: "" }, { name: "", price: "" }, { name: "", price: "" }]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/userplan/alluser`);
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data); 
        } else {
          toast.error("Unexpected data format.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const isopen = (ind) => {
    setIsactive(ind);
    setIsopentoggle(!isopentoggle);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user and all their associated data?")) {
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.delete(`${baseURL}/api/auth/user/${userId}`);
      
      if (response.status === 200) {
        // Update the UI by removing the deleted user
        setUsers(users.filter((user) => user._id !== userId));
        
        // Check if there was any additional data deleted
        if (response.data.deletedUserPlans || response.data.deletedTasks) {
          toast.success(
            `User deleted successfully. Removed ${response.data.deletedUserPlans || 0} plans and ${response.data.deletedTasks || 0} tasks.`
          );
        } else {
          toast.success("User deleted successfully.");
        }
      } else {
        toast.error("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      
      if (error.response) {
        // Server responded with an error status code
        toast.error(error.response.data.message || "Failed to delete user and associated data.");
      } else if (error.request) {
        // Request was made but no response received
        toast.error("No response from server. Please try again.");
      } else {
        // Something happened in setting up the request
        toast.error("Error in request setup. Please try again.");
      }
    }
  };

  const handleTaskSubmit = async () => {
    if (tasks.some((task) => task.name === "" || task.price === "")) {
      toast.error("All fields are required.");
      return;
    }

    const userId = selectedUser._id;
    const planId = selectedUser.plan ? selectedUser.plan._id : null; 

    if (!planId) {
      toast.error("User does not have an active plan.");
      return;
    }

    try {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const response = await axios.post(`${baseURL}/api/userplan/assign-tasks/${userId}/${planId}`, {
        tasks: tasks.map((task) => ({ name: task.name, price: task.price }))
      });

      if (response.status === 200) {
        toast.success("Tasks assigned successfully.");
        setShowAssignTaskForm(false); 
      } else {
        toast.error("Failed to assign tasks.");
      }
    } catch (error) {
      console.error("Error assigning tasks:", error);
      toast.error("Failed to assign tasks.");
    }
  };

  const handleTaskChange = (index, event) => {
    const newTasks = [...tasks];
    newTasks[index][event.target.name] = event.target.value;
    setTasks(newTasks);
  };

  const handleAssignTaskClick = (user) => {
    if (user.plan && user.plan.status === "active") {
      setSelectedUser(user);
      setShowAssignTaskForm(true);
    } else {
      toast.error("User does not have an active plan.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar Component */}
      <div id="sidebar-wrapper" className={`${side ? "open" : ""}`}>
        <div className="sidebar">
          <div className="close-icon flex justify-start ml-4 mt-4">
            <i onClick={() => setSide(false)} className="fa-solid border-2 px-1 rounded-md fa-xmark text-xl side-menu"></i>
          </div>
          <ul className=" p-2 text-white">
            {/* Menu items */}
            {[{ to: "/admin/dashboard", icon: <DashboardIcon />, label: "Dashboard" },
              { to: "/admin/dashboard/allusers", icon: <WorkIcon />, label: "Users" },
              { to: "/admin/dashboard/allplans", icon: <Groups2Icon />, label: "Plans" },
              { to: "/admin/dashboard/aboutdetail", icon: <WorkspacePremiumIcon />, label: "About" },
              { to: "/admin/dashboard/support", icon: <ForumIcon />, label: "Support" },
              { to: "/admin/dashboard/requests", icon: <SportsKabaddiIcon />, label: "Plan Requests" },
              { to: "/admin/dashboard/withdraw", icon: <CurrencyExchange />, label: "Withdraw Requests" },
              { to: "/admin/dashboard/sendmail", icon: <CurrencyExchange />, label: "Email Setting" }
            ].map((menuItem, index) => (
              <li key={index} className={`flex justify-between p-2 rounded-lg my-2 ${isactive === index ? "activ" : ""}`} onClick={() => isopen(index)}>
                <Link to={menuItem.to}>
                  <div className="flex justify-center space-x-2">
                    {menuItem.icon}
                    <p className="cursor-pointer">{menuItem.label}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-side min-h-screen">
        <div className="close-icon bg-white inline-block">
          <i onClick={() => setSide(true)} className="fa-solid fa-bars m-2 text-lg side-menu"></i>
        </div>
        <div className="m-4">
          <h2 className="text-xl font-bold mb-4">All Users</h2>
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-4 text-center">No users available</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="even:bg-gray-100">
                      <td className="p-4">{user.username}</td>
                      <td className="p-4">{user.email}</td>
                      <td className="p-4">{user.role}</td>
                      <td className="p-4 flex items-center gap-4">
                        <Link to={`/admin/dashboard/userdetail/${user._id}`} className="text-blue-500 hover:underline">
                          Details
                        </Link>
                        <button 
                          onClick={() => handleDelete(user._id)} 
                          className="text-red-500 hover:text-red-700" 
                          title="Delete User and all associated data"
                        >
                          <MdDelete size={20} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;