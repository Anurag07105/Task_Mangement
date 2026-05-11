import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const AppLayout = ({ children, pageTitle }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 md:flex selection:bg-brand-500 selection:text-white">
      <Sidebar />
      <main className="relative flex-1 pb-16">
        <div className="mx-auto w-full max-w-7xl px-4 pt-4 md:px-8">
          <Header pageTitle={pageTitle} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", staggerChildren: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AppLayout;
