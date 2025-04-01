import { useEffect, useState } from "react";
import { useAuthContext } from "../authcontext/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from 'axios';
import Loading from "./Loading";

const Home = () => {
  const { setAuthUser } = useAuthContext();
  const [Teamdata, setTeamData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const [totalDeposit, setTotalDeposit] = useState(0); // Added state for total deposit

  const navigate = useNavigate();

  const logout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setAuthUser(null);
      toast.success("Logout successful!", { duration: 1000 });
      navigate("/login");
    } catch (error) {
      toast.error("An error occurred during logout.");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false); // Simulating data load completion after 3 seconds
    }, 1000);
  }, []);
  useEffect(() => {
    if (authUser) {
      const fetchTotalDeposit = async () => {
        try {
          const token = authUser.token || localStorage.getItem("token");
          if (!token) throw new Error("No token found, authorization denied.");
          const baseURL = import.meta.env.VITE_API_BASE_URL;
  
          // Update the URL to match the backend route
          const response = await axios.get(`${baseURL}/api/userplan/user/${authUser._id}/total-deposit`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
  
          if (response.status === 200) {
            setTotalDeposit(response.data.totalDeposit);
          } else {
            console.error("Failed to fetch total deposit");
          }
        } catch (error) {
          console.error("Error fetching total deposit:", error);
        setTotalDeposit(0); // Set to 0 in case of any error
        }
      };
  
      fetchTotalDeposit();
    }
  }, [authUser]);
  useEffect(() => {
    if (authUser) {
      const fetchTeamData = async () => {
        try {
          const token = authUser.token || localStorage.getItem("token");
          if (!token) throw new Error("No token found, authorization denied.");
          const baseURL = import.meta.env.VITE_API_BASE_URL;

          const response = await fetch(`${baseURL}/api/userplan/user/${authUser._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (response.ok) {
            if (!data) {
              setError("User data is not available.");
              setTeamData(null);
            } else {
              setTeamData(data);
              setLoading(false);
            }
          } else {
            throw new Error(data.message || "Failed to fetch team data.");
          }
        } catch (error) {
          console.error("Error fetching team data:", error);
          setError("Failed to load user data. Please try again later.");
          setLoading(false);
          setTeamData(null);
        }
      };

      fetchTeamData();
    }
  }, [authUser]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.get(`${baseURL}/api/plan/all`);

        if (response.status === 200) {
          const plansData = response.data;
          if (Array.isArray(plansData)) {
            setPlans(plansData); 
          } else {
            console.warn("Unexpected response format:", plansData);
            setPlans([]); 
          }
        } else {
          throw new Error("Failed to fetch plans");
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
        setPlans([]);
        setError("Failed to load plans. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  useEffect(() => {
    if (authUser) {
      const fetchWithdrawalHistory = async () => {
        try {
          const token = authUser.token || localStorage.getItem("token");
          if (!token) throw new Error("No token found, authorization denied.");
          const baseURL = import.meta.env.VITE_API_BASE_URL;

          const response = await axios.get(`${baseURL}/api/withdrawl/${authUser._id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data && response.data.data) {
            setWithdrawalHistory(response.data.data);
          } else {
            setWithdrawalHistory([]); 
          }

          setLoading(false);
        } catch (error) {
          console.error("Error fetching withdrawal history:", error);
          setWithdrawalHistory([]); 
          setLoading(false);
        }
      };

      fetchWithdrawalHistory();
    }
  }, [authUser]);

  const totalWithdrawn = withdrawalHistory
    .filter((withdrawal) => withdrawal.status === "completed")
    .reduce((total, withdrawal) => total + withdrawal.amount, 0);

  if (loading) {
    return <div><Loading/></div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!Teamdata) {
    return <div>No user data available. Please contact support.</div>;
  }

  const { totalBalance, user } = Teamdata;

  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="bg-[#ffffff] min-h-screen">
          <div className="wrapper">
            <div className="banner relative w-full">
              <img
                src="/images/background.jpg"
                className="h-[200px] md:h-[300px] object-cover w-full  "
                alt="Banner"
              />
              <div className="tir bg-black shadow-sm rounded-lg md:p-4 p-2">
                {/* show profile of user  */}
                <div className="pb-2 flex justify-between items-center">
                  {/* Left Section (Welcome message) */}
                  <div className="flex items-center">
                    <p className="text-lg  mr-4">Welcome {user.username}!</p> {/* Updated to use dynamic username */}
                  </div>

                  {/* Right Section (Profile Picture) */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <img
                        src={user.image || "/images/default-profile.png"} // Default image if no user image available
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-white" // Circular profile picture with white border
                      />
                    </div>
                  </div>
                </div>
                <br />
          
  


            <div className="pb-2 flex justify-between items-center">
              <div>
                <p className="text-lg">Your Earning</p>
                <span className="text-xl font-[500]">
                      Rs.{totalBalance || "0.00"}
                    </span>
                </div>
              <div>
              <p className="text-base text-end">Total Deposit </p>
                    <h2>
                      <span className="text-xl font-[500]">💰Rs. {totalDeposit.toFixed(2)}</span>
                    </h2>
              </div>
            </div>
            <div className="flex items-center border-t p-4 justify-between">
              <Link to="/addamount">
                <div
                  data-aos="zoom-in"
                  data-aos-duration="1500"
                  className="text-center hover:-translate-y-1 duration-300"
                >
                  <img
                    src="/images/wallet.png"
                    className="w-8 h-8 md:w-10 md:h-10 m-auto"
                    alt="Recharge"
                  />
                  <p className="font-[400]  md:text-base text-sm lg:text-lg">Deposit</p>
                </div>
              </Link>
              <Link to="/withdraw/request">
                <div
                  data-aos="zoom-in"
                  data-aos-duration="1500"
                  data-aos-delay="100"
                  className="text-center hover:-translate-y-1 duration-300"
                >
                  <img
                    src="/images/withdraw.png"
                    className="w-8 h-8 md:w-10 md:h-10 m-auto"
                    alt="/withdraw/request"
                  />
                  <p className="font-[400]  md:text-base text-sm lg:text-lg">Withdraw</p>
                </div>
              </Link>
              <Link to="/team">
                <div
                  data-aos="zoom-in"
                  data-aos-duration="1500"
                  data-aos-delay="200"
                  className="text-center hover:-translate-y-1 duration-300"
                >
                  <img
                    src="/images/teams.png"
                    className="w-8 h-8 md:w-10 md:h-10 m-auto"
                    alt="Team"
                  />
                  <p className="font-[400]  md:text-base text-sm lg:text-lg">Team</p>
                </div>

              </Link>
              
              
            </div>
            
          </div>
          
        </div>

      
     
         <div className=" max-sm:mx-2">
         <div className="services max-[400px]:w-full w-[350px] sm:w-[420px] md:w-[600px] mx-auto mt-16 lg:mt-28">

                <h2 className=' md:text-2xl font-[700] text-start ml-6 md:ml-4 my-4'>Our Services Plan</h2>
                <div className="wrapper grid grid-cols-3 gap-2 md:gap-4 mx-2 md:mx-4 mt-4">
                   <Link to="/usertask">
                   <div data-aos="zoom-in" data-aos-duration="1500" className=" text-center hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/account.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm  md:text-base font-[400] mt-1">Task</p>
                    </div>
                   </Link>
                    <Link to="/invite">
                    <div data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="100" className=" text-center  hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/invitee.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm  md:text-base font-[400] mt-1">Invite</p>
                    </div>
                    </Link>
                   <Link to="/plan">
                   <div data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="200" className=" text-center  hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/plans.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm  md:text-base font-[400] mt-1">My Palns</p>
                    </div>
                   </Link>
                  
                  <Link to="/about">
                  <div data-aos="zoom-in" data-aos-duration="1500" data-aos-delay="0" className=" text-center  hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/about.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm  md:text-base font-[400] mt-1">About</p>
                    </div>
                  </Link>
                    <Link to="/support">
                    <div data-aos="zoom-in" data-aos-delay="100" data-aos-duration="1500" className=" text-center  hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/support.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm md:text-base font-[400] mt-1">Support</p>
                    </div>
                    </Link>
                    <Link to="/support">
                    <div data-aos="zoom-in" data-aos-delay="100" data-aos-duration="1500" className=" text-center  hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
                        <img src="/images/youtube.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto " alt="" />
                        <p className="text-sm  md:text-base font-[400] ">Youtube </p>
                    </div>
                    </Link>
                    <Link to="https://chat.whatsapp.com/KSXZMQc7ZOi6BTu1zeYzJQ" target="_blank" rel="noopener noreferrer">
    <div data-aos="zoom-in" data-aos-delay="100" data-aos-duration="1500" className="text-center hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
        <img src="/images/whatsapp.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto" alt="WhatsApp Group" />
        <p className="text-sm md:text-base font-[400]">Group</p>
    </div>
</Link>
<Link to="https://wa.me/qr/NR7EWTRWJA2WO1" target="_blank" rel="noopener noreferrer">
    <div data-aos="zoom-in" data-aos-delay="100" data-aos-duration="1500" className="text-center hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4">
        <img src="/images/whatsapp.png" className="sm:w-10 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto" alt="WhatsApp Contact" />
        <p className="text-sm md:text-base font-[400] mt-1">Whatsapp</p>
    </div>
</Link>

                    <div
          data-aos="zoom-in"
          data-aos-duration="1500"
          data-aos-delay="300"
          className="text-center  hover:-translate-y-1 duration-300 border py-2 w-[80px] sm:w-[100px] rounded-lg m-auto mb-4"
          onClick={logout}
        >
          <img
            src="/images/logout.png"
            className="sm:w-1 sm:h-10 w-8 h-8 md:w-12 md:h-12 m-auto"
            alt="Logout"
          />
          <p
            className="text-sm md:text-base font-[400] mt-1 cursor-pointer"
           
          >
            Logout
          </p>
        </div>
                   
            </div>
            </div>
         </div>
         <div className="investment mt-10 mx-4 md:mx-10 lg:mx-16 pb-28">
            <h2 className="text-center my-8 text-3xl font-[600] font-sans">Investment Plans</h2>
            <div className="wrapper grid grid-cols-1 min-[700px]:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
              {plans.length > 0 ? (
                plans.map((plan) => (
                  <div
                    key={plan._id}
                    data-aos="zoom-in"
                    data-aos-duration="1000"
                    className="p-4 border max-[700px]:w-[400px] max-[700px]:mx-auto max-[500px]:w-full group rounded-lg hover:-translate-y-2 duration-300 overflow-hidden"
                  >
                    <h2 className="text-center font-[700] text-xl my-2 rounded-lg">{plan.name}</h2>
                    <div className="wrapp flex justify-between items-end">
                      <div>
                        <p><span className="text-lg font-[500]">Price: </span><span className="font-[350] text-base">Rs. {plan.price}</span></p>
                        <p><span className="text-lg font-[500]">Duration: </span><span className="font-[350] text-base">{plan.duration} Days</span></p>
                        <p><span className="text-lg font-[500]">Daily Profit: </span><span className="font-[350] text-base">Rs. {plan.dailyProfit}</span></p>
                        <p><span className="text-lg font-[500]">Total Profit: </span><span className="font-[350] text-base">Rs. {plan.totalProfit}</span></p>
                      </div>
                      <div>
                        <Link to="/addamount">
                          <button className='px-4 py-2 text-lg font-[500] bg-green-500 rounded-md text-white group-hover:bg-green-700 duration-300'>
                            Buy Plan
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div>No plans available at the moment</div>
              )}
            </div>
          </div>
        </div>
    </div>
      )}
    </div>
  )
}

export default Home