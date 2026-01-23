import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import NoticesPage from "../pages/NoticesPage";
import Playground from "../pages/Playground";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
