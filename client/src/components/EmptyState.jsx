import { motion } from "framer-motion";

const EmptyState = ({ title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center"
    >
      <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-100" />
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
    </motion.div>
  );
};

export default EmptyState;
