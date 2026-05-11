import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Loader2, ArrowRight, Sparkles, Zap, Shield, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  })
};

const perks = [
  { icon: Zap, text: "Set up in under 2 minutes" },
  { icon: Shield, text: "Role-based access control" },
  { icon: Rocket, text: "Real-time task updates" }
];

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member"
  });
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axiosClient.post("/auth/signup", form);
      login(data);
      toast.success("Account created successfully.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Animated blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-teal-200/40 to-cyan-200/40 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-violet-200/30 to-pink-200/30 blur-3xl"
      />

      {/* Left form panel */}
      <section className="flex w-full items-center justify-center p-6 lg:w-[45%]">
        <motion.form
          initial="hidden"
          animate="visible"
          onSubmit={onSubmit}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div variants={fadeUp} custom={0} className="mb-10 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-extrabold text-white shadow-lg shadow-emerald-500/30">
              T
            </div>
            <span className="text-xl font-extrabold text-slate-900">Team Tasks</span>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <h2 className="text-3xl font-extrabold text-slate-900">Create your account</h2>
            <p className="mt-2 text-base text-slate-500">Start organizing your team&apos;s work in minutes.</p>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Jane Doe"
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Role</label>
              <select
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all duration-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                name="role"
                value={form.role}
                onChange={onChange}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={3} className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="you@example.com"
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
            <input
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 shadow-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="Choose a strong password"
              name="password"
              type="password"
              value={form.password}
              onChange={onChange}
              required
            />
          </motion.div>

          <motion.div variants={fadeUp} custom={5} className="mt-8">
            <button
              type="submit"
              disabled={submitting}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </motion.div>

          <motion.p variants={fadeUp} custom={6} className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link className="font-bold text-emerald-600 transition hover:text-emerald-700" to="/login">
              Sign in
            </Link>
          </motion.p>
        </motion.form>
      </section>

      {/* Right hero panel */}
      <section className="hidden w-[55%] p-8 lg:flex">
        <div className="relative flex w-full flex-col justify-between overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 p-10 text-white shadow-2xl shadow-teal-500/25">
          {/* Pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "28px 28px" }}
          />

          <motion.div initial="hidden" animate="visible" className="relative z-10">
            <motion.div variants={fadeUp} custom={0} className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
              <Sparkles size={14} />
              Join thousands of productive teams
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="mt-4 text-5xl font-extrabold leading-tight tracking-tight">
              Your team&apos;s
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">productivity</span>
              <br />
              starts here.
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-4 max-w-md text-lg text-teal-100">
              Create projects, assign tasks, and watch your team deliver results like never before.
            </motion.p>
          </motion.div>

          {/* Perks list */}
          <motion.div initial="hidden" animate="visible" className="relative z-10 mt-8 space-y-3">
            {perks.map((perk, i) => {
              const Icon = perk.icon;
              return (
                <motion.div
                  key={perk.text}
                  variants={fadeUp}
                  custom={i + 3}
                  className="flex items-center gap-3 text-lg"
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/20">
                    <Icon size={16} />
                  </div>
                  <span className="font-medium text-white/90">{perk.text}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Floating image */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 mt-8"
          >
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-2xl shadow-black/20 backdrop-blur-md">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
                alt="Team collaborating around a table"
                className="h-52 w-full object-cover"
              />
              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm font-medium text-white/90">Teams actively collaborating</span>
                </div>
                <div className="flex -space-x-2">
                  {["K", "A", "M", "S"].map((letter) => (
                    <div key={letter} className="grid h-7 w-7 place-items-center rounded-full border-2 border-teal-600 bg-white/25 text-xs font-bold backdrop-blur-sm">
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SignupPage;
