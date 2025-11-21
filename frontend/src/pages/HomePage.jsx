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
} from "react-icons/fa";

import accessControllImg from "/src/assets/access-control.png"
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
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pt-14 bg-white text-green-900 dark:bg-black dark:text-white flex flex-col transition-colors duration-300">
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden bg-gradient-to-b from-green-900 to-green-800 text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-extrabold mb-4 tracking-tight"
        >
          Collabix
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg max-w-2xl mb-10 leading-relaxed text-green-100"
        >
          The ultimate space for teams to plan, collaborate, and deliver
          together — smarter and faster.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStarted}
          className="bg-white text-green-900 px-10 py-3 rounded-full font-semibold shadow-lg transition z-10"
        >
          {user ? "Go to Dashboard" : "Get Started Free"}
        </motion.button>

        <motion.img
          src={heroImg}
          alt="Collaboration illustration"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />

        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-green-500/30 rounded-full blur-3xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-green-400/30 rounded-full blur-3xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </section>

      <section className="py-24 px-6 md:px-16 lg:px-28 bg-white dark:bg-zinc-900">
        <FadeInSection>
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything your team needs to stay in sync
          </h2>
        </FadeInSection>

        {[
          {
            title: "Collaborate Effortlessly",
            desc: "From brainstorming to execution, Collabix brings your entire team together in one place. Share ideas, assign tasks, and stay updated instantly.",
            img: teamWorkImg,
            reverse: false,
          },
          {
            title: "Visual Project Boards",
            desc: "Manage projects the way your team works best — with flexible boards, timelines, and real-time progress tracking.",
            img: dashboardimg,
            reverse: true,
          },
          {
            title: "Stay in Control",
            desc: "Assign roles, manage permissions, and ensure every team member has the right access. Collabix scales with your team.",
            img: accessControllImg,
            reverse: false,
          },
        ].map((item, i) => (
          <FadeInSection key={i} delay={i * 0.2}>
            <div
              className={`flex flex-col md:flex-row items-center gap-10 mb-20 ${
                item.reverse ? "md:flex-row-reverse" : ""
              }`}
            >
              <motion.img
                src={item.img}
                alt={item.title}
                className="w-full md:w-1/2 rounded-2xl shadow-lg"
                whileHover={{ scale: 1.02 }}
              />
              <div className="md:w-1/2 text-center md:text-left">
                <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
              </div>
            </div>
          </FadeInSection>
        ))}
      </section>

      <section className="py-20 px-2 bg-green-50 dark:bg-zinc-950 text-center">
        <FadeInSection>
          <h2 className="text-3xl font-bold mb-6">
            Works seamlessly with your favorite tools
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-12 max-w-xl mx-auto">
            Collabix integrates smoothly with the apps your team already uses.
          </p>
          <div className="flex flex-wrap justify-center gap-10 text-5xl text-green-700 dark:text-green-300">
            {[FaSlack, FaGithub, FaGoogleDrive, FaTrello, FaFigma].map(
              (Icon, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className="transition-transform"
                >
                  <Icon />
                </motion.div>
              )
            )}
          </div>
        </FadeInSection>
      </section>

      <section className="py-24 px-6 md:px-16 bg-white dark:bg-zinc-900 text-center">
        <FadeInSection>
          <h2 className="text-4xl font-bold mb-12">Loved by teams everywhere</h2>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Product Manager",
              quote:
                "Collabix keeps our remote team perfectly aligned — we can’t imagine working without it!",
              img: user3Img,
            },
            {
              name: "James Carter",
              role: "Developer",
              quote:
                "Tasks, boards, chat — everything’s in one place. It’s simple and powerful.",
              img: user2Img,
            },
            {
              name: "Priya Mehta",
              role: "Designer",
              quote:
                "Our collaboration flow feels so natural now. It just fits how teams work today.",
              img: user1Img,
            },
          ].map((t, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="p-8 bg-gray-50 dark:bg-zinc-800 rounded-2xl shadow-md"
              >
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <p className="italic mb-4 text-gray-700 dark:text-gray-300">
                  “{t.quote}”
                </p>
                <h4 className="font-semibold">{t.name}</h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>


      <section className="relative py-24 px-4  text-center bg-gradient-to-r from-green-800 to-green-600 text-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-4xl font-bold mb-6">
            Start collaborating with your team today
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-10">
            Collabix helps teams of all sizes move faster, stay organized, and
            collaborate better.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetStarted}
            className="bg-white text-green-900 px-10 py-4 rounded-full font-semibold shadow-lg"
          >
            {user ? "Go to Dashboard" : "Get Started for Free"}
          </motion.button>
        </motion.div>

        <motion.div
          className="absolute top-10 left-20 w-60 h-60 bg-green-300/20 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 right-10 w-72 h-72 bg-green-400/20 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </section>

      <footer className="bg-green-900 text-white py-6 text-center text-sm dark:bg-black">
        © {new Date().getFullYear()} Collabix — All Rights Reserved
      </footer>
    </div>
  );
};

export default HomePage;
