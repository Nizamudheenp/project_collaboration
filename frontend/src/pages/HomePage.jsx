import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaSlack,
  FaGithub,
  FaGoogleDrive,
  FaTrello,
  FaFigma,
  FaCheck,
  FaPlus,
  FaChevronDown,
  FaRocket,
  FaShieldAlt,
  FaBolt,
  FaLightbulb,
  FaMobileAlt,
} from "react-icons/fa";

import accessControllImg from "/src/assets/access-control.jpg"
import dashboardimg from "/src/assets/dashboard.jpg"
import heroImg from "/src/assets/hero-bg.jpg"
import teamWorkImg from "/src/assets/teamwork.jpg"
import user1Img from "/src/assets/user1.jpg"
import user2Img from "/src/assets/user2.jpg"
import user3Img from "/src/assets/user3.jpg"

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleGetStarted = () => {
    navigate(user ? "/dashboard" : "/register");
  };

  const FadeInSection = ({ children, delay = 0 }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pt-14 bg-white text-green-900 dark:bg-black dark:text-white flex flex-col transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-32 md:py-48 overflow-hidden bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="text-7xl md:text-9xl font-black mb-6 tracking-tighter leading-none"
          >
            {["C", "o", "l", "l", "a", "b", "i", "x"].map((letter, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                className="inline-block"
              >
                {letter}
              </motion.span>
            ))}
            <motion.span
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: { opacity: 1, scale: 1 },
              }}
              className="text-green-400 inline-block"
            >
              .
            </motion.span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl max-w-3xl mb-12 leading-relaxed text-green-50 mx-auto font-medium"
          >
            Empower your team with a unified workspace built for high-velocity collaboration.
            Plan, track, and deliver extraordinary results together — without the chaos.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="bg-white text-green-900 px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all"
            >
              {user ? "Go to Dashboard" : "Start Collaborating — It's Free"}
            </motion.button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50"
          >
            <span className="text-sm font-semibold uppercase tracking-widest text-green-300/60">Trusted by</span>
            <div className="flex gap-6 text-2xl">
              <FaSlack /> <FaGithub /> <FaTrello /> <FaFigma />
            </div>
          </motion.div>
        </div>

        <motion.img
          src={heroImg}
          alt="Collaboration illustration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-green-500/20 rounded-full blur-[100px]"
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-400/20 rounded-full blur-[120px]"
          animate={{
            x: [0, -60, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-32 h-32 bg-green-300/10 rounded-full blur-[60px]"
          animate={{
            y: [0, 100, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-900 text-white border-y border-green-800/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Active Teams", val: 15 },
            { label: "Tasks Completed", val: 500 },
            { label: "User Rating", val: 4.9 },
            { label: "Daily Users", val: 100 },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col"
            >
              <span className="text-4xl md:text-5xl font-black mb-1">
                {stat.val}{stat.label !== "User Rating" ? "k+" : "/5"}
              </span>
              <span className="text-green-300 text-sm uppercase tracking-widest font-semibold">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 md:px-16 lg:px-28 bg-white dark:bg-zinc-900">
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center mb-24">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">
              Master your workflow, <br /><span className="text-green-600">master your time.</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Collabix isn't just a tool, it's your team's command center. We've optimized every interaction
              to ensure you spend less time managing and more time doing.
            </p>
          </div>
        </FadeInSection>

        {[
          {
            title: "Real-time Collaboration",
            desc: "Break down silos with instant updates and seamless communication. Whether you're in the same room or across the globe, Collabix keeps everyone on the same page with live sync and threaded discussions.",
            points: ["Instant Updates", "Threaded Comments", "Live Cursors"],
            img: teamWorkImg,
            reverse: false,
          },
          {
            title: "Dynamic Project Boards",
            desc: "Visualize your progress like never before. Switch between Kanban, Gantt, and Calendar views to tailor your workspace to your team's specific needs. Managing complex projects has never been this intuitive.",
            points: ["Kanban Boards", "Gantt Charts", "Custom Workflows"],
            img: dashboardimg,
            reverse: true,
          },
          {
            title: "Enterprise-grade Control",
            desc: "Security and organization at scale. Manage permissions with surgical precision, ensuring that the right people have access to exactly what they need. Your data, protected and perfectly organized.",
            points: ["Role-based Access", "SSO Integration", "Data Encryption"],
            img: accessControllImg,
            reverse: false,
          },
        ].map((item, i) => (
          <FadeInSection key={i} delay={0.1}>
            <div
              className={`flex flex-col md:flex-row items-center gap-16 mb-32 ${item.reverse ? "md:flex-row-reverse" : ""
                }`}
            >
              <div className="w-full md:w-3/5 group">
                <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-video">
                  <motion.img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-green-900/10 group-hover:bg-transparent transition-all" />
                </div>
              </div>
              <div className="md:w-2/5 text-left">
                <h3 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">{item.title}</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">{item.desc}</p>
                <div className="grid grid-cols-1 gap-3">
                  {item.points.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="font-semibold text-green-800 dark:text-green-400">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        ))}
      </section>

      {/* Feature Grid Section */}
      <section className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-4">Everything you need to <span className="text-green-600">scale.</span></h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Focus on what matters. We've built the tools to handle the rest.</p>
            </div>
          </FadeInSection>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              { icon: FaRocket, title: "Fast Setup", desc: "Get your team up and running in under 5 minutes with our intuitive onboarding." },
              { icon: FaShieldAlt, title: "Secure Data", desc: "Enterprise-grade encryption and regular backups keep your information safe." },
              { icon: FaBolt, title: "Live Sync", desc: "Experience zero-latency updates across all devices, keeping everyone in sync." },
              { icon: FaLightbulb, title: "Smart Insights", desc: "AI-driven analytics help you identify bottlenecks and optimize your workflow." },
              { icon: FaMobileAlt, title: "Mobile Ready", desc: "Stay connected on the go with our fully responsive web and mobile experience." },
              { icon: FaTrello, title: "Kanban View", desc: "Organize tasks visually and move them through your custom workflow easily." },
              { icon: FaSlack, title: "Integrations", desc: "Connect with Slack, Github, and more to keep all your tools in one place." },
              { icon: FaPlus, title: "Custom Fields", desc: "Tailor your tasks and boards with custom data fields to fit your unique needs." },
            ].map((feature, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{
                  y: -10,
                  boxShadow: "0 20px 40px -10px rgba(22, 163, 74, 0.1)",
                  borderColor: "rgba(22, 163, 74, 0.5)"
                }}
                className="p-8 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-colors group cursor-default"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform group-hover:bg-green-600 group-hover:text-white">
                  <feature.icon className="text-2xl" />
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950">
        <FadeInSection>
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">How Collabix works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">Three simple steps to team excellence.</p>
          </div>
        </FadeInSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.2 } }
          }}
          className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12"
        >
          {[
            { step: "01", title: "Plan", desc: "Define your goals and break them down into actionable tasks within minutes." },
            { step: "02", title: "Collaborate", desc: "Assign owners, set deadlines, and discuss progress in a unified environment." },
            { step: "03", title: "Deliver", desc: "Track milestones and cross the finish line together, right on schedule." },
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 30 },
                visible: { opacity: 1, scale: 1, y: 0 }
              }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="p-10 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800 h-full transition-shadow hover:shadow-xl"
            >
              <span className="text-6xl font-black text-green-600/20 dark:text-green-400/10 block mb-6">{step.step}</span>
              <h4 className="text-3xl font-bold mb-4">{step.title}</h4>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Integrations */}
      <section className="py-24 px-6 bg-green-50/50 dark:bg-zinc-900 text-center border-y border-zinc-100 dark:border-zinc-800">
        <FadeInSection>
          <h2 className="text-4xl md:text-5xl font-black mb-8 tracking-tight">Connect with your stack</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-16 max-w-2xl mx-auto">
            Collabix integrates seamlessly with the software ecosystem you already know and love.
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 text-6xl text-green-700/80 dark:text-green-400/80">
            {[FaSlack, FaGithub, FaGoogleDrive, FaTrello, FaFigma].map(
              (Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.15, color: "#166534" }}
                  className="transition-all cursor-pointer"
                >
                  <Icon />
                </motion.div>
              )
            )}
          </div>
        </FadeInSection>
      </section>


      {/* Testimonials */}
      <section className="py-32 px-6 md:px-16 bg-white dark:bg-zinc-900 text-center">
        <FadeInSection>
          <h2 className="text-5xl md:text-7xl font-black mb-20 tracking-tight">Join thousands of <br /><span className="text-green-600">high-performing teams.</span></h2>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {[
            {
              name: "Sarah Johnson",
              role: "Product Manager @ Nexa",
              quote: "Collabix keeps our remote team perfectly aligned — we can't imagine working without it! The interface is incredibly intuitive.",
              img: user3Img,
            },
            {
              name: "James Carter",
              role: "Lead Developer @ TechFlow",
              quote: "Tasks, boards, chat — everything's in one place. It's simple yet powerful enough for our entire engineering org.",
              img: user2Img,
            },
            {
              name: "Priya Mehta",
              role: "Design Director @ CreativeCo",
              quote: "Our collaboration flow feels so natural now. It just fits how creative teams work today. Highly recommended!",
              img: user1Img,
            },
          ].map((t, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -10 }}
                className="p-10 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl shadow-xl shadow-green-900/5 text-left flex flex-col h-full"
              >
                <div className="mb-8 text-green-600 text-5xl font-serif">“</div>
                <p className="text-xl italic mb-10 text-gray-800 dark:text-gray-200 flex-grow">
                  {t.quote}
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-green-500/20"
                  />
                  <div>
                    <h4 className="font-bold text-lg leading-none mb-1">{t.name}</h4>
                    <p className="text-sm text-gray-500 font-medium">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto">
          <FadeInSection>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Frequently asked questions</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Everything you need to know about Collabix.</p>
            </div>
          </FadeInSection>

          <div className="space-y-4">
            {[
              { q: "Is there a limit to how many collaborators I can invite?", a: "No, you can invite as many team members as you need. Collabix is built for teams of all sizes, and everything is completely free." },
              { q: "Can I import my data from Trello or Jira?", a: "Yes! Collabix has a one-click import tool that allows you to bring your existing projects over from most major project management tools seamlessly." },
              { q: "How secure is my team's data?", a: "Security is our top priority. We use AES-256 encryption for data at rest and TLS 1.2+ for data in transit. We also perform regular third-party security audits." },
              { q: "What kind of support can I expect?", a: "All our users have access to our community forum, help center, and email support. We're here to help you and your team succeed." }
            ].map((faq, i) => (
              <FadeInSection key={i} delay={i * 0.1}>
                <details className="group bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden transition-all">
                  <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-bold text-lg">
                    {faq.q}
                    <FaChevronDown className="text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 border-t border-zinc-100 dark:border-zinc-800">
                    {faq.a}
                  </div>
                </details>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>


      {/* Final CTA */}
      <section className="relative py-40 px-6 text-center bg-green-900 text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"> Ready to transform <br />your team?</h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-12 text-green-100/80">
            Join the thousand of companies that rely on Collabix to ship their best work, faster.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-white text-green-900 px-16 py-5 rounded-full font-black text-xl shadow-2xl transition hover:bg-green-50"
          >
            {user ? "Go to Dashboard" : "Get Started Now — It's Free"}
          </motion.button>
        </motion.div>

        {/* Background art */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-500/10 to-transparent" />
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-green-400/10 to-transparent" />
        </div>
      </section>

      <footer className="bg-zinc-950 text-white py-12 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-black">Collabix<span className="text-green-500">.</span></div>
          <div className="flex gap-8 text-zinc-400 font-medium">
            <a href="#" className="hover:text-white transition">Features</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Collabix. Built for the modern team.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;