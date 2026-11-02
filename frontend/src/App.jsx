import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ModelStatusBanner from "./components/ModelStatusBanner";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import ModelInfo from "./pages/ModelInfo";
import About from "./pages/About";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ModelStatusBanner />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/model-info" element={<ModelInfo />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
