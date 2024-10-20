import { RouterProvider } from "react-router-dom";
import Web3Provider from "./context/Web3Provider";
import routes from "./Routes/Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
     
      <Web3Provider>
        <RouterProvider router={routes} />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </Web3Provider>
    </>
  );
}

export default App;