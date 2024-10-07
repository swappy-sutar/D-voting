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



const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Wallet />
      </Layout>
    ),
  },
  {
    path: "/select",
    element: (
      <Layout>
        <Header />
        <Home />
        <Footer />
      </Layout>
    ),
  },
  {
    path: "/register-voter",
    element: (
      <Layout>
        <Header />
        <RegisterVoter />
        <Footer />
      </Layout>
    ),
  },
  {
    path: "/get-voter",
    element: (
      <Layout>
        <Header />
        <GetVoter />
        <Footer />
      </Layout>
    ),
  },
  {
    path: "/register-candidate",
    element: (
      <Layout>
        <Header />
        <RegisterCandidate />
        <Footer />
      </Layout>
    ),
  },
  {
    path: "/get-candidate",
    element: (
      <Layout>
        <Header />
        <GetCandidateList />
        <Footer />
      </Layout>
    ),
  },
  {
    path: "/election-commission",
    element: (
      <Layout>
        <Header />
        <ElectionCommision />
        <Footer />
      </Layout>
    ),
  },
  {
    path: "/voting",
    element: (
      <Layout>
        <Header />
        <Vote />
        <Footer />
      </Layout>
    ),
  },
  {
    path: "/voting-status",
    element: (
      <Layout>
        <Header />
        <VotingStatus />
        <Footer />
      </Layout>
    ),
  },
  {
    path: "/get-winner",
    element: (
      <Layout>
        <Header />
        <Winner />
        <Footer />
      </Layout>
    ),
  },
]);

export default routes;
