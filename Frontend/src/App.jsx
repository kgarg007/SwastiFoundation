import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import PageLoader from "./components/ui/PageLoader";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const ImpactPage = lazy(() => import("./pages/ImpactPage"));
const VolunteerPage = lazy(() => import("./pages/VolunteerPage"));
const DonatePage = lazy(() => import("./pages/DonatePage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));

const CMSPage = lazy(() => import("./pages/CMSPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const AdminLogin = lazy(() => import("./pages/Admin/Login"));
const AdminDashboard = lazy(() => import("./pages/Admin/Dashboard"));
const ProtectedRoute = lazy(() => import("./components/layout/ProtectedRoute"));

const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Pages with Header/Footer */}
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />

          {/* CMS Legal & Informational Routes */}
          <Route path="privacy-policy" element={<CMSPage slug="privacy-policy" />} />
          <Route path="terms" element={<CMSPage slug="terms" />} />
          <Route path="terms-and-conditions" element={<CMSPage slug="terms-and-conditions" />} />
          <Route path="refund-policy" element={<CMSPage slug="refund-policy" />} />
          <Route path="donation-refund-policy" element={<CMSPage slug="donation-refund-policy" />} />
          <Route path="disclaimer" element={<CMSPage slug="disclaimer" />} />
          <Route path="page/:slug" element={<CMSPage />} />

          <Route path="programs" element={<ProgramsPage />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="impact" element={<ImpactPage />} />
          <Route path="volunteer" element={<VolunteerPage />} />
          <Route path="donate" element={<DonatePage />} />
          <Route path="stories" element={<BlogPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Pages (Separate Layout without visitor Header/Footer) */}
        <Route path="admin/login" element={<AdminLogin />} />
        <Route element={<ProtectedRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
