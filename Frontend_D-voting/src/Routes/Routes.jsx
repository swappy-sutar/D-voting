import React from "react";
import { createBrowserRouter } from "react-router-dom";
import GetCandidateList from "../pages/Candidate/GetCandidateList";
import RegisterCandidate from "../pages/Candidate/RegisterCandidate";
import ElectionCommision from "../pages/ElectionCommision/ElectionCommision";
import GetVoter from "../pages/Voter/GetVoterList";
import RegisterVoter from "../pages/Voter/RegisterVoter";
import Home from "../pages/Home";
import Header from "../Components/Navigation/Header";
import Footer from "../Components/Navigation/Footer";
import Wallet from "../Components/Wallet/Wallet";
import Vote from "../pages/Voting/Vote";
import VotingStatus from "../Components/ElectionCommision/VotingStatus";
import Layout from "../Components/Layout";
import Winner from "../pages/Winner";
import Login from "../Components/admin/Login";



const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Wallet />
      </>
    ),
  },
  {
    path: "/select",
    element: (
      <>
        <Header />
        <Home />
        <Footer />
      </>
    ),
  },
  {
    path: "/register-voter",
    element: (
      <>
        <Header />
        <RegisterVoter />
        <Footer />
      </>
    ),
  },
  {
    path: "/get-voter",
    element: (
      <>
        <Header />
        <GetVoter />
        <Footer />
      </>
    ),
  },
  {
    path: "/register-candidate",
    element: (
      <>
        <Header />
        <RegisterCandidate />
        <Footer />
      </>
    ),
  },
  {
    path: "/get-candidate",
    element: (
      <>
        <Header />
        <GetCandidateList />
        <Footer />
      </>
    ),
  },
  {
    path: "/election-commission",
    element: (
      <>
        <Header />
        <ElectionCommision />
        <Footer />
      </>
    ),
  },
  {
    path: "/voting",
    element: (
      <>
        <Header />
        <Vote />
        <Footer />
      </>
    ),
  },
  {
    path: "/voting-status",
    element: (
      <>
        <Header />
        <VotingStatus />
        <Footer />
      </>
    ),
  },
  {
    path: "/get-winner",
    element: (
      <>
        <Header />
        <Winner />
        <Footer />
      </>
    ),
  },
  {
    path: "/login-election-commision",
    element: (
      <>
        <Header />
        <Login />
        <Footer />
      </>
    ),
  },
]);

export default routes;
