import RequireAuth from "@/components/RequireAuth";
import RequireAdmin from "@/components/RequireAdmin";
import Billing from "@/pages/billing";
import BillingSuccess from "@/pages/billing-success";
import Chat from "@/pages/chat";
import Dashboard from "@/pages/dashboard";
import Home from "@/pages/home";
import SignIn from "@/pages/sign-in";
import SignUp from "@/pages/sign-up";
import News from "@/pages/news";
import Catalog from "@/pages/catalog";
import FAQ from "@/pages/faq";
import DIY from "@/pages/diy";
import Meetup from "@/pages/meetup";
import AdminDashboard from "@/pages/admin/index";
import AdminNews from "@/pages/admin/news";
import { BrowserRouter, Route, Routes } from "react-router-dom";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Authentication routes */}
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Content routes */}
        <Route path="/news" element={<News />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/diy" element={<DIY />} />
        <Route path="/meetup" element={<Meetup />} />

        {/* Billing routes */}
        <Route
          path="/billing"
          element={
            <RequireAuth>
              <Billing />
            </RequireAuth>
          }
        />
        <Route
          path="/billing/success"
          element={
            <RequireAuth>
              <BillingSuccess />
            </RequireAuth>
          }
        />

        {/* Chat routes */}
        <Route
          path="/chat"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/news"
          element={
            <RequireAdmin>
              <AdminNews />
            </RequireAdmin>
          }
        />
        <Route
          path="/dashboard"
          element={
            <RequireAdmin>
              <Dashboard />
            </RequireAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
