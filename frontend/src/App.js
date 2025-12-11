import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./index.js";
import PrivateRoute from "./security/SecuredRoutes.js";

// Lazy load all your routes
const Login = lazy(() => import("./views/Login.js"));
const SignUp = lazy(() => import("./views/Signup.js"));
const UserProfile = lazy(() => import("./views/UserProfile.js"));
const Homepage = lazy(() => import("./views/Home.js"));
const Error403 = lazy(() => import("./views/errorMessages/403/403error.js"));
const Error404 = lazy(() => import("./views/errorMessages/404/404error.js"));
const IndMovie = lazy(() => import("./views/IndFilm.js"));
const IndPerson = lazy(() => import("./views/IndPerson.js"));
const MovieListPage = lazy(() => import("./views/MovieList.js"));
const ConfirmEmailForPwdReset = lazy(() => import("./views/SendResetPwdEmail.js"));
const ResetPassword = lazy(() => import("./views/ResetPassword.js"));
const AccountVerification = lazy(() => import("./views/AccountVerification.js"));
const WatchList = lazy(() => import("./views/Watchlist.js"));
const ResetEmail = lazy(() => import("./views/ResetEmail.js"));
const PricingPage = lazy(() => import("./views/CritixUltimate.js"));
const Recommendations = lazy(() => import("./components/Recommendations/Recommendations.js"));
const DiscoverMovies = lazy(() => import("./views/Discover.js"));
const CritixHomepage = lazy(() => import("./views/CritixHomepage.js"));
const MovieSceneViewer = lazy(() => import("./components/AR/MovieSceneViewer.js"));
const Subscription = lazy(() => import("./views/Subscription.js"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#000',
        color: '#fff'
      }}>Loading...</div>}>
        <Routes>
          <Route path='/' element={<CritixHomepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/ultimate"
            element={<PrivateRoute><PricingPage /></PrivateRoute>}
          />
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
            element={<Recommendations />}
          />
          <Route
            path="/discover-movies"
            element={<DiscoverMovies />}
          />
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
      </Suspense>
    </Router>
  );
}