import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.js";
import Login from "./views/Login.js";
import SignUp from "./views/Signup.js";
import UserProfile from "./views/UserProfile.js"
import Homepage from "./views/Home.js";
import PrivateRoute from "./security/SecuredRoutes.js";
import Error403 from "./views/errorMessages/403/403error.js";
import Error404 from "./views/errorMessages/404/404error.js";
import IndMovie from "./views/IndFilm.js";
import IndPerson from "./views/IndPerson.js";
import MovieListPage from "./views/MovieList.js";
import ConfirmEmailForPwdReset from "./views/SendResetPwdEmail.js";
import ResetPassword from "./views/ResetPassword.js";
import AccountVerification from "./views/AccountVerification.js"
import WatchList from "./views/Watchlist.js";
import ResetEmail from "./views/ResetEmail.js"
import PricingPage from "./views/CritixUltimate.js"
import Recommendations from "./components/Recommendations/Recommendations.js";
import DiscoverMovies from "./views/Discover.js";
import CritixHomepage from "./views/CritixHomepage.js"
import MovieSceneViewer from "./components/AR/MovieSceneViewer.js"
import Subscription from "./views/Subscription.js"
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<CritixHomepage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/ultimate"
          element={<PrivateRoute><PricingPage /></PrivateRoute>}></Route>
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Homepage />
            </PrivateRoute>
          }
        />
        <Route
          path="/popular"
          element={<PrivateRoute><MovieListPage endpointName="popular" /></PrivateRoute>}
        />
        <Route
          path="/upcoming"
          element={<PrivateRoute><MovieListPage endpointName="upcoming" /></PrivateRoute>}
        />
        <Route
          path="/now_playing"
          element={<PrivateRoute><MovieListPage endpointName="now_playing" /></PrivateRoute>}
        />
        <Route
          path="/watchlist"
          element={<PrivateRoute><WatchList endpointName="watchlist" /></PrivateRoute>}
        />
        <Route
          path="/recommendations"
          element={<Recommendations />}>
        </Route>
        <Route
          path="/discover-movies"
          element={<DiscoverMovies />}>
        </Route>
        <Route path="/movies/:endpoint/:id" element={<PrivateRoute><IndMovie /></PrivateRoute>} />
        <Route path="/ar/:movieName" element={<PrivateRoute><MovieSceneViewer /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/movies/movie/:id" element={<PrivateRoute><IndMovie /></PrivateRoute>} />
        <Route path="/person/:id" element={<PrivateRoute><IndPerson /></PrivateRoute>} />
        <Route path="/subscription/" element={<PrivateRoute><Subscription /></PrivateRoute>} />
        <Route path="/forgot-password" element={<ConfirmEmailForPwdReset />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/reset-email/:id" element={<ResetEmail />} />
        <Route path="/activate-account/:token" element={<AccountVerification />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="*" element={<Error404 />} />
        <Route component={<Navigate replace to="/404" />} />
      </Routes>
    </Router>
  );
}
