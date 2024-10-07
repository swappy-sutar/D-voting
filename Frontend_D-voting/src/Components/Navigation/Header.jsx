import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistrationDropdownOpen, setRegistrationDropdownOpen] = useState(false);
  const [isListDropdownOpen, setListDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const closeAllMenus = () => {
    setIsOpen(false);
    setRegistrationDropdownOpen(false);
    setListDropdownOpen(false);
  };

  const handleNavigation = (route) => {
    closeAllMenus();
    navigate(route);
  };

  const toggleRegistrationDropdown = () => {
    setRegistrationDropdownOpen((prev) => !prev);
    if (isListDropdownOpen) setListDropdownOpen(false);
  };

  const toggleListDropdown = () => {
    setListDropdownOpen((prev) => !prev);
    if (isRegistrationDropdownOpen) setRegistrationDropdownOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-indigo-600 shadow-lg">
      <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
        <div className="text-white font-extrabold text-4xl hover:text-black transition-all duration-300">
          <Link to="/" onClick={closeAllMenus}>
            D-Voting
          </Link>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none transition-transform hover:scale-110"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        <div
          className={`${
            isOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-8 absolute lg:static inset-0 lg:inset-auto w-full lg:w-auto bg-indigo-600 lg:bg-transparent transition-all duration-300 lg:flex-row flex flex-col items-center justify-center h-full lg:h-auto`}
        >
          <ul className="lg:flex lg:space-x-8 text-center lg:text-left space-y-4 lg:space-y-0">
            <li className="text-white font-semibold text-lg transition hover:text-black border-b lg:border-none border-white">
              <Link to="/" onClick={() => handleNavigation("/")}>
                Home
              </Link>
            </li>

            <li className="relative">
              <button
                onClick={toggleRegistrationDropdown}
                className="flex items-center justify-between w-full text-white font-semibold text-lg transition hover:text-black border-b lg:border-none border-white"
              >
                Registration
                <svg
                  className="w-2.5 h-2.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {isRegistrationDropdownOpen && (
                <div className="absolute z-20 mt-2 w-44 bg-white rounded-lg shadow-lg">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/register-voter"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleNavigation("/register-voter")}
                      >
                        Register Voter
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register-candidate"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleNavigation("/register-candidate")}
                      >
                        Register Candidate
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            <li className="relative">
              <button
                onClick={toggleListDropdown}
                className="flex items-center justify-between w-full text-white font-semibold text-lg transition hover:text-black border-b lg:border-none border-white"
              >
                View List
                <svg
                  className="w-2.5 h-2.5 ml-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {isListDropdownOpen && (
                <div className="absolute z-20 mt-2 w-44 bg-white rounded-lg shadow-lg">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        to="/get-voter"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleNavigation("/get-voter")}
                      >
                        Voter List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/get-candidate"
                        className="block px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleNavigation("/get-candidate")}
                      >
                        Candidate List
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>

            <li className="text-white font-semibold text-lg hover:text-black border-b lg:border-none border-white">
              <Link to="/voting" onClick={() => handleNavigation("/voting")}>
                Voting
              </Link>
            </li>
            <li className="text-white font-semibold text-lg hover:text-black border-b lg:border-none border-white">
              <Link
                to="/election-commission"
                onClick={() => handleNavigation("/election-commission")}
              >
                Election Commission
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Full-Screen Overlay for Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden">
          <div className="absolute top-0 left-0 w-full h-auto bg-indigo-600 flex flex-col items-center justify-center space-y-4 py-8">
            <ul className="space-y-4 text-center">
              <li>
                <Link to="/" onClick={() => handleNavigation("/")}>
                  <span className="text-white font-semibold text-lg border-b border-white">
                    Home
                  </span>
                </Link>
              </li>
              <li>
                <button
                  onClick={toggleRegistrationDropdown}
                  className="text-white font-semibold text-lg flex items-center justify-center border-b border-white"
                >
                  Registration
                  <svg
                    className="w-2.5 h-2.5 ml-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                {isRegistrationDropdownOpen && (
                  <div className="bg-white rounded-lg shadow-lg mt-2">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link
                          to="/register-voter"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleNavigation("/register-voter")}
                        >
                          Register Voter
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register-candidate"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() =>
                            handleNavigation("/register-candidate")
                          }
                        >
                          Register Candidate
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              <li>
                <button
                  onClick={toggleListDropdown}
                  className="text-white font-semibold text-lg flex items-center justify-center border-b border-white"
                >
                  View List
                  <svg
                    className="w-2.5 h-2.5 ml-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                {isListDropdownOpen && (
                  <div className="bg-white rounded-lg shadow-lg mt-2">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link
                          to="/get-voter"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleNavigation("/get-voter")}
                        >
                          Voter List
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/get-candidate"
                          className="block px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleNavigation("/get-candidate")}
                        >
                          Candidate List
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </li>
              <li>
                <Link to="/voting" onClick={() => handleNavigation("/voting")}>
                  <span className="text-white font-semibold text-lg border-b border-white">
                    Voting
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/election-commission"
                  onClick={() => handleNavigation("/election-commission")}
                >
                  <span className="text-white font-semibold text-lg border-b border-white">
                    Election Commission
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;


// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Header() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isRegistrationDropdownOpen, setRegistrationDropdownOpen] = useState(false);
//   const [isListDropdownOpen, setListDropdownOpen] = useState(false);

//   const navigate = useNavigate();

//   const closeAllMenus = () => {
//     setIsOpen(false);
//     setRegistrationDropdownOpen(false);
//     setListDropdownOpen(false);
//   };

//   const handleNavigation = (route) => {
//     closeAllMenus();
//     navigate(route);
//   };

//   const toggleRegistrationDropdown = () => {
//     setRegistrationDropdownOpen((prev) => !prev);
//     if (isListDropdownOpen) setListDropdownOpen(false);
//   };

//   const toggleListDropdown = () => {
//     setListDropdownOpen((prev) => !prev);
//     if (isRegistrationDropdownOpen) setRegistrationDropdownOpen(false);
//   };

//   return (
//     <nav className="bg-gradient-to-r from-indigo-600 to-indigo-600 shadow-lg">
//       <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
//         <div className="text-white font-extrabold text-4xl hover:text-black transition-all duration-300">
//           <Link to="/" onClick={closeAllMenus}>
//             D-Voting
//           </Link>
//         </div>

//         <div className="lg:hidden">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="text-white focus:outline-none transition-transform hover:scale-110"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
//               />
//             </svg>
//           </button>
//         </div>

//         <div
//           className={`${
//             isOpen ? "block" : "hidden"
//           } lg:flex lg:items-center lg:space-x-8 absolute lg:static inset-0 lg:inset-auto w-full lg:w-auto bg-indigo-600 lg:bg-transparent transition-all duration-300 lg:flex-row flex flex-col items-center justify-center h-full lg:h-auto`}
//         >
//           <ul className="lg:flex lg:space-x-8 text-center lg:text-left space-y-4 lg:space-y-0">
//             <li className="text-white font-semibold text-lg transition hover:text-black">
//               <Link to="/" onClick={() => handleNavigation("/")}>
//                 Home
//               </Link>
//             </li>

//             <li className="relative">
//               <button
//                 onClick={toggleRegistrationDropdown}
//                 className="flex items-center justify-between w-full text-white font-semibold text-lg transition hover:text-black"
//               >
//                 Registration
//                 <svg
//                   className="w-2.5 h-2.5 ml-2"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 10 6"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="m1 1 4 4 4-4"
//                   />
//                 </svg>
//               </button>
//               {isRegistrationDropdownOpen && (
//                 <div className="absolute z-20 mt-2 w-44 bg-white rounded-lg shadow-lg">
//                   <ul className="py-2 text-sm text-gray-700">
//                     <li>
//                       <Link
//                         to="/register-voter"
//                         className="block px-4 py-2 hover:bg-gray-100"
//                         onClick={() => handleNavigation("/register-voter")}
//                       >
//                         Register Voter
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/register-candidate"
//                         className="block px-4 py-2 hover:bg-gray-100"
//                         onClick={() => handleNavigation("/register-candidate")}
//                       >
//                         Register Candidate
//                       </Link>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </li>

//             <li className="relative">
//               <button
//                 onClick={toggleListDropdown}
//                 className="flex items-center justify-between w-full text-white font-semibold text-lg transition hover:text-black"
//               >
//                 View List
//                 <svg
//                   className="w-2.5 h-2.5 ml-2"
//                   aria-hidden="true"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 10 6"
//                 >
//                   <path
//                     stroke="currentColor"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="m1 1 4 4 4-4"
//                   />
//                 </svg>
//               </button>
//               {isListDropdownOpen && (
//                 <div className="absolute z-20 mt-2 w-44 bg-white rounded-lg shadow-lg">
//                   <ul className="py-2 text-sm text-gray-700">
//                     <li>
//                       <Link
//                         to="/get-voter"
//                         className="block px-4 py-2 hover:bg-gray-100"
//                         onClick={() => handleNavigation("/get-voter")}
//                       >
//                         Voter List
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/get-candidate"
//                         className="block px-4 py-2 hover:bg-gray-100"
//                         onClick={() => handleNavigation("/get-candidate")}
//                       >
//                         Candidate List
//                       </Link>
//                     </li>
//                   </ul>
//                 </div>
//               )}
//             </li>

//             <li className="text-white z-20 font-semibold text-lg hover:text-black">
//               <Link to="/voting" onClick={() => handleNavigation("/voting")}>
//                 Voting
//               </Link>
//             </li>
//             <li className="text-white z-20 font-semibold text-lg hover:text-black">
//               <Link
//                 to="/election-commission"
//                 onClick={() => handleNavigation("/election-commission")}
//               >
//                 Election Commission
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>

//       {/* Full-Screen Overlay for Mobile Menu */}
//       {isOpen && (
//         <div className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" onClick={closeAllMenus}>
//           <div className="absolute top-0 left-0 w-full h-full bg-indigo-600 flex flex-col items-center justify-center space-y-4">
//             <ul className="space-y-4 text-center">
//               <li>
//                 <Link to="/" onClick={() => handleNavigation("/")}>
//                   <span className="text-white font-semibold text-lg">Home</span>
//                 </Link>
//               </li>
//               <li>
//                 <button onClick={toggleRegistrationDropdown} className="text-white font-semibold text-lg flex items-center justify-center">
//                   Registration
//                   <svg
//                     className="w-2.5 h-2.5 ml-2"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 10 6"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="m1 1 4 4 4-4"
//                     />
//                   </svg>
//                 </button>
//                 {isRegistrationDropdownOpen && (
//                   <div className="bg-white rounded-lg shadow-lg mt-2">
//                     <ul className="py-2 text-sm text-gray-700">
//                       <li>
//                         <Link
//                           to="/register-voter"
//                           className="block px-4 py-2 hover:bg-gray-100"
//                           onClick={() => handleNavigation("/register-voter")}
//                         >
//                           Register Voter
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/register-candidate"
//                           className="block px-4 py-2 hover:bg-gray-100"
//                           onClick={() => handleNavigation("/register-candidate")}
//                         >
//                           Register Candidate
//                         </Link>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </li>
//               <li>
//                 <button onClick={toggleListDropdown} className="text-white font-semibold text-lg flex items-center justify-center">
//                   View List
//                   <svg
//                     className="w-2.5 h-2.5 ml-2"
//                     aria-hidden="true"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 10 6"
//                   >
//                     <path
//                       stroke="currentColor"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="2"
//                       d="m1 1 4 4 4-4"
//                     />
//                   </svg>
//                 </button>
//                 {isListDropdownOpen && (
//                   <div className="bg-white rounded-lg shadow-lg mt-2">
//                     <ul className="py-2 text-sm text-gray-700">
//                       <li>
//                         <Link
//                           to="/get-voter"
//                           className="block px-4 py-2 hover:bg-gray-100"
//                           onClick={() => handleNavigation("/get-voter")}
//                         >
//                           Voter List
//                         </Link>
//                       </li>
//                       <li>
//                         <Link
//                           to="/get-candidate"
//                           className="block px-4 py-2 hover:bg-gray-100"
//                           onClick={() => handleNavigation("/get-candidate")}
//                         >
//                           Candidate List
//                         </Link>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </li>
//               <li>
//                 <Link to="/voting" onClick={() => handleNavigation("/voting")}>
//                   <span className="text-white font-semibold text-lg">Voting</span>
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/election-commission" onClick={() => handleNavigation("/election-commission")}>
//                   <span className="text-white font-semibold text-lg">Election Commission</span>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Header;
