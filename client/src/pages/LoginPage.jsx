import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, ArrowRight, Mail, Lock } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", rememberMe: true });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axiosClient.post("/auth/login", form);
      login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0f0b2e]">
      {/* Full-screen animated mesh gradient background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -left-1/4 -top-1/4 h-[150%] w-[150%]"
          style={{
            background: "conic-gradient(from 0deg at 50% 50%, #7c3aed 0%, #2563eb 25%, #06b6d4 50%, #8b5cf6 75%, #7c3aed 100%)",
            filter: "blur(120px)",
            opacity: 0.3
          }}
        />
      </div>

      {/* Orbiting rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute h-[600px] w-[600px] rounded-full border border-white/[0.06]"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute h-[800px] w-[800px] rounded-full border border-white/[0.04]"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        className="pointer-events-none absolute h-[1000px] w-[1000px] rounded-full border border-dashed border-white/[0.03]"
      />

      {/* Floating orbs on ring paths  */}
      {[
        { size: 600, dur: 30, color: "bg-violet-500", dotSize: "h-3 w-3", startDeg: 0 },
        { size: 600, dur: 30, color: "bg-cyan-400", dotSize: "h-2 w-2", startDeg: 180 },
        { size: 800, dur: 45, color: "bg-blue-400", dotSize: "h-4 w-4", startDeg: 90 },
        { size: 800, dur: 45, color: "bg-pink-400", dotSize: "h-2.5 w-2.5", startDeg: 270 },
        { size: 1000, dur: 55, color: "bg-amber-400", dotSize: "h-2 w-2", startDeg: 45 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute"
          style={{ width: orb.size, height: orb.size }}
        >
          <div
            className={`absolute rounded-full ${orb.color} ${orb.dotSize} shadow-lg blur-[1px]`}
            style={{
              top: "0%",
              left: "50%",
              transform: `rotate(${orb.startDeg}deg) translateY(-50%) rotate(-${orb.startDeg}deg)`
            }}
          />
        </motion.div>
      ))}

      {/* Centered card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-4 w-full max-w-[440px]"
      >
        {/* Glass card */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.07] p-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-10">
          {/* Logo + Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 text-center"
          >
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
              className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 text-2xl font-black text-white shadow-lg shadow-violet-500/30"
              style={{ perspective: 1000 }}
            >
              T
            </motion.div>
            <h1 className="text-3xl font-extrabold text-white">Welcome back</h1>
            <p className="mt-2 text-sm text-slate-400">Sign in to your Team Tasks workspace</p>
          </motion.div>

          <form onSubmit={onSubmit}>
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mb-4"
            >
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Email</label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 transition-all focus-within:border-violet-500/50 focus-within:bg-white/[0.08] focus-within:shadow-lg focus-within:shadow-violet-500/10">
                <Mail size={16} className="text-slate-500" />
                <input
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                  placeholder="you@example.com"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mb-4"
            >
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 transition-all focus-within:border-violet-500/50 focus-within:bg-white/[0.08] focus-within:shadow-lg focus-within:shadow-violet-500/10">
                <Lock size={16} className="text-slate-500" />
                <input
                  className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                  placeholder="Enter your password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={onChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="text-slate-500 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Remember + Forgot */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mb-6 flex items-center justify-between"
            >
              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-400">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-white/10 text-violet-500 focus:ring-violet-500"
                  checked={form.rememberMe}
                  onChange={(e) => setForm((prev) => ({ ...prev, rememberMe: e.target.checked }))}
                />
                Remember me
              </label>
              <button type="button" className="text-sm font-semibold text-violet-400 transition hover:text-violet-300">
                Forgot password?
              </button>
            </motion.div>

            {/* Submit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 p-[1px] transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/25"
              >
                <div className="flex items-center justify-center gap-2 rounded-2xl bg-[#0f0b2e]/80 px-6 py-4 text-base font-bold text-white transition-all group-hover:bg-transparent">
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85 }}
            className="mt-6 text-center text-sm text-slate-500"
          >
            Don&apos;t have an account?{" "}
            <Link className="font-bold text-violet-400 transition hover:text-violet-300" to="/signup">
              Create one free
            </Link>
          </motion.div>
        </div>

        {/* Stats bar under card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-4 flex items-center justify-center gap-8 text-center text-xs text-slate-500"
        >
          {[
            { val: "10K+", label: "Teams" },
            { val: "50K+", label: "Projects" },
            { val: "99.9%", label: "Uptime" }
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-base font-extrabold text-white">{stat.val}</p>
              <p>{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
