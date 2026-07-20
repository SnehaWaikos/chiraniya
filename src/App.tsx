/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  Search,
  ArrowRight,
  Compass,
  Layers,
  Hexagon,
  Quote,
  X,
  Grid,
  Sun,
  Moon,
  Eye,
  Check,
  Loader2,
  Building2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import CausticsBackground from "./components/CausticsBackground";
import PanoramaViewer from "./components/PanoramaViewer";
import { servicesData, projectsData, testimonialsData } from "./data";
import { Project, Inquiry } from "./types";

export default function App() {
  // Navigation & UI States
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Gallery Active Project
  const [activeProject, setActiveProject] = useState<Project>(projectsData[0]);
  
  // Interactive Customizer Settings
  const [blueprintOverlay, setBlueprintOverlay] = useState(false);
  const [lightingMode, setLightingMode] = useState<"day" | "night" | "blueprint">("day");
  const [focalLength, setFocalLength] = useState<number>(35); // simulated camera lens zoom

  // Selected Service Detail Modal
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

  // Inquiry Submission States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [projectVision, setProjectVision] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Local storage for persistent inquiries
  useEffect(() => {
    const saved = localStorage.getItem("chiraniya_inquiries");
    if (saved) {
      try {
        setInquiries(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveInquiries = (updated: Inquiry[]) => {
    setInquiries(updated);
    localStorage.setItem("chiraniya_inquiries", JSON.stringify(updated));
  };

  // Handle Form Submission
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !projectVision) return;

    setIsSubmitting(true);

    // Simulate high-tech caustic spatial simulation
    setTimeout(() => {
      const newInquiry: Inquiry = {
        id: "inq_" + Date.now(),
        fullName,
        email,
        projectVision,
        submittedAt: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "Pending Review",
        estimatedCompletion: "24-48 Hours",
      };

      const updated = [newInquiry, ...inquiries];
      saveInquiries(updated);

      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Reset form fields
      setFullName("");
      setEmail("");
      setProjectVision("");

      // Automatically transition back after some time
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 2400);
  };

  const deleteInquiry = (id: string) => {
    const filtered = inquiries.filter((inq) => inq.id !== id);
    saveInquiries(filtered);
  };

  const simulateUpdate = (id: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        const statuses: Inquiry["status"][] = [
          "Pending Review",
          "Under Simulation",
          "Consultation Scheduled",
        ];
        const nextIndex = (statuses.indexOf(inq.status) + 1) % statuses.length;
        return {
          ...inq,
          status: statuses[nextIndex],
          estimatedCompletion: nextIndex === 2 ? "Scheduled Match" : "12-24 Hours",
        };
      }
      return inq;
    });
    saveInquiries(updated);
  };

  // Scroll Helper
  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  // Filtered projects for search
  const filteredProjects = projectsData.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface text-on-background font-sans selection:bg-secondary-container selection:text-on-secondary-container relative overflow-x-hidden">
      {/* WebGL Caustic/Blueprint Interactive Background */}
      <CausticsBackground />

      {/* Floating Island Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 px-6 md:px-12 bg-white/40 backdrop-blur-2xl border-b border-white/20 shadow-[0_10px_40px_rgba(0,103,125,0.06)] flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 -ml-2 rounded-full hover:bg-white/50 active:scale-95 transition-all text-primary"
            aria-label="Open Navigation Menu"
            id="menu-toggle-btn"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <span 
            onClick={() => scrollToId("hero")}
            className="font-serif text-2xl md:text-3xl font-bold tracking-tighter text-primary cursor-pointer hover:opacity-80 transition-opacity"
            id="brand-logo"
          >
            CHIRANIYA
          </span>
        </div>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToId("projects-section")}
            className="font-label text-xs uppercase tracking-widest text-secondary font-semibold hover:text-primary transition-colors cursor-pointer"
          >
            Walkthroughs
          </button>
          <button
            onClick={() => scrollToId("services-section")}
            className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Spatial Design
          </button>
          <button
            onClick={() => scrollToId("contact-section")}
            className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            Inquire
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-full hover:bg-white/50 active:scale-95 transition-all text-primary"
            aria-label="Search projects"
            id="search-toggle-btn"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Off-canvas Side Drawer (Menu) */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="fixed top-0 bottom-0 left-0 w-80 bg-white/95 backdrop-blur-2xl border-r border-white/20 shadow-2xl p-8 flex flex-col justify-between z-50"
              id="side-drawer"
            >
              <div>
                <div className="flex justify-between items-center mb-12">
                  <span className="font-serif text-2xl font-bold tracking-tight text-primary">CHIRANIYA</span>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-full hover:bg-surface-container transition-colors"
                  >
                    <X className="w-5 h-5 text-on-surface-variant" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="font-label text-[10px] text-secondary tracking-widest uppercase mb-2">Navigation</p>
                    <button
                      onClick={() => scrollToId("hero")}
                      className="w-full text-left py-2 font-serif text-xl hover:text-secondary transition-colors"
                    >
                      Step Into Future
                    </button>
                    <button
                      onClick={() => scrollToId("services-section")}
                      className="w-full text-left py-2 font-serif text-xl hover:text-secondary transition-colors"
                    >
                      Hallway of Expertise
                    </button>
                    <button
                      onClick={() => scrollToId("projects-section")}
                      className="w-full text-left py-2 font-serif text-xl hover:text-secondary transition-colors"
                    >
                      Gallery Walkthroughs
                    </button>
                    <button
                      onClick={() => scrollToId("testimonials-section")}
                      className="w-full text-left py-2 font-serif text-xl hover:text-secondary transition-colors"
                    >
                      Inhabitant Voices
                    </button>
                    <button
                      onClick={() => scrollToId("contact-section")}
                      className="w-full text-left py-2 font-serif text-xl hover:text-secondary transition-colors"
                    >
                      Desk of Possibility
                    </button>
                  </div>

                  {inquiries.length > 0 && (
                    <div className="border-t border-outline-variant/30 pt-6">
                      <p className="font-label text-[10px] text-secondary tracking-widest uppercase mb-3">Your Simulations</p>
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {inquiries.map((inq) => (
                          <div key={inq.id} className="p-3 rounded-lg bg-surface-container-low border border-white/40 text-xs">
                            <div className="flex justify-between font-semibold text-primary truncate">
                              <span>Simulation #{inq.id.split("_")[1].slice(-4)}</span>
                              <span className="text-[10px] text-secondary px-1.5 py-0.5 rounded-full bg-secondary-container/40">
                                {inq.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-on-surface-variant mt-1 italic truncate">
                              "{inq.projectVision}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-outline-variant/30 pt-6">
                <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest">Chiraniya Consultancy</p>
                <p className="text-xs text-on-surface-variant/70 mt-1">Experience architecture before a single brick is laid.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Interactive Global Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-xl bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl overflow-hidden border border-white/50"
              id="search-dialog"
            >
              <div className="p-4 border-b border-outline-variant/30 flex items-center gap-3">
                <Search className="w-5 h-5 text-secondary" />
                <input
                  type="text"
                  placeholder="Search spatial categories, materials, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-0 outline-none text-on-background placeholder-on-surface-variant/60 focus:ring-0 text-sm py-1"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-1 rounded-full hover:bg-surface-container-high transition-colors"
                >
                  <X className="w-5 h-5 text-on-surface-variant" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto p-4 space-y-3">
                {searchQuery === "" ? (
                  <div className="text-center py-6 text-xs text-on-surface-variant">
                    <p className="font-semibold mb-1 text-secondary">Looking for something specific?</p>
                    <p>Try searching "Concrete", "Bedroom", "Duplex", "Vastu" or "Wood"</p>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-8 text-xs text-on-surface-variant">
                    No matching spatial walkthroughs found.
                  </div>
                ) : (
                  filteredProjects.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveProject(p);
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        scrollToId("projects-section");
                      }}
                      className="p-3 rounded-xl hover:bg-secondary-container/20 border border-transparent hover:border-secondary/20 transition-all flex gap-3 items-center cursor-pointer"
                    >
                      <img src={p.imageUrl} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt={p.title} />
                      <div>
                        <h5 className="font-semibold text-xs text-primary">{p.title}</h5>
                        <p className="text-[10px] text-secondary font-medium uppercase tracking-wider">{p.category}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 ml-auto text-secondary/60" />
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="pt-20">
        {/* HERO SECTION */}
        <section
          id="hero"
          className="relative min-h-[90vh] flex flex-col justify-center items-center px-6 md:px-12 py-16 overflow-hidden"
        >
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left: Text Showcase */}
            <div className="lg:col-span-5 space-y-6 md:space-y-8 relative z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary bg-secondary-container/30 px-3.5 py-1.5 rounded-full border border-secondary-container/50">
                  Precision Eng. Meets Glass
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.1]"
              >
                Step Into Your <br />
                <span className="italic font-normal text-secondary drop-shadow-[0_2px_15px_rgba(154,229,254,0.4)]">
                  Future Space
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base md:text-lg text-on-surface-variant max-w-lg leading-relaxed font-sans"
              >
                Experience precision architecture before a single brick is laid. Our high-refraction spatial walkthroughs merge liquid-glass clarity with perfect structural integrity.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <button
                  onClick={() => scrollToId("projects-section")}
                  className="glass-refraction px-8 py-4 rounded-full font-label text-xs uppercase tracking-widest text-secondary font-bold flex items-center gap-2 hover:bg-secondary-container/50 hover:border-secondary/40 transition-all active:scale-95 shadow-lg group border border-white/60"
                >
                  EXPLORE PROJECTS{" "}
                  <ArrowRight className="w-4 h-4 text-secondary group-hover:translate-x-1.5 transition-transform" />
                </button>
                <button
                  onClick={() => scrollToId("contact-section")}
                  className="px-8 py-4 rounded-full font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary font-bold flex items-center transition-all hover:bg-white/40 border border-transparent hover:border-white/40"
                >
                  INQUIRE NOW
                </button>
              </motion.div>
            </div>

            {/* Hero Right: Isometric 3D Layered Mockup */}
            <div className="lg:col-span-7 perspective-container relative flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                animate={{ opacity: 1, scale: 1, rotateY: -10 }}
                transition={{ duration: 1, type: "spring", stiffness: 45 }}
                className="door-panel relative w-full max-w-xl aspect-[4/3] rounded-3xl overflow-hidden glass-refraction p-2 shadow-[0_50px_100px_rgba(0,103,125,0.18)] border border-white/60 group"
              >
                {/* Simulated Glass Refraction Caustic Glint */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/40 pointer-events-none z-10" />

                {/* Hyper realistic image */}
                <img
                  className="w-full h-full object-cover rounded-2xl shadow-inner transition-transform duration-700 group-hover:scale-105"
                  alt="A hyper-realistic architectural rendering of a minimalist modern living room with floor-to-ceiling windows. The scene features a cyan accent chair and a large navy rug. Transparent digital blueprint lines and measurement markers are overlaid on the furniture to simulate an interactive architectural walkthrough. High-end lighting and soft shadows create a premium aquatic spatial atmosphere."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDav7zcsxskO5woP5C7M_uqII5o-S-n2QAE1AlonMbj77_93R7dxPsJSPDFIM6nR5dLJ6gJPkqrTg02z9wrg8bzpNj-1a4qPUThH7Ea6lekm_FJqBcfOZQwh4iKoaUAMMmzEGq8L7wIDcryh_qCLv2RNMZKFqPEQBXz1HmmHGfiBWtsVn5ReYYnQHCO-Xwr8ro3IzSUpwY4z9L5-je0yJ_FhH4sKspV3Q2M1Y_ysYt4lDQieAgkd3aKRv74Eh4UdtSi-k7zeQ2wcig"
                />

                {/* Dynamic holographic overlay annotations */}
                <div className="absolute top-4 left-4 glass-refraction border border-white/40 px-3 py-1.5 rounded-full text-[10px] font-mono text-secondary flex items-center gap-1.5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  <span>ACTIVE SPATIAL CAMERA 01</span>
                </div>

                <div className="absolute bottom-6 right-6 bg-primary/80 backdrop-blur-md border border-white/10 text-[9px] font-mono text-white/95 px-3 py-1.5 rounded-lg flex flex-col gap-0.5 shadow-md">
                  <span>FOV: 84°</span>
                  <span>FOCAL: 28mm</span>
                  <span>GLASS INDEX: 1.54 Refraction</span>
                </div>

                {/* Floating Metrics (Glass Panels with 3D Offset) */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute -bottom-6 -left-6 md:-left-12 glass-refraction p-6 rounded-2xl border border-white/80 shadow-[0_20px_50px_rgba(0,103,125,0.15)] flex flex-col justify-center cursor-help z-20"
                  title="Over two decades of structural rendering research and delivery."
                >
                  <span className="text-secondary font-serif text-3xl md:text-4xl font-extrabold tracking-tighter">
                    22+
                  </span>
                  <span className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                    Years Expertise
                  </span>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="absolute -top-6 -right-6 glass-refraction p-5 rounded-2xl border border-white/80 shadow-[0_20px_50px_rgba(0,103,125,0.15)] flex flex-col justify-center cursor-help z-20"
                  title="Over nine hundred high fidelity spatial blueprints deployed."
                >
                  <span className="text-primary font-serif text-3xl font-extrabold tracking-tighter leading-none">
                    900+
                  </span>
                  <span className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mt-1">
                    Completed Projects
                  </span>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </section>

        {/* SERVICES: THE PASSAGE / HALLWAY OF EXPERTISE */}
        <section
          id="services-section"
          className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-low/40 border-y border-white/20 relative"
        >
          <div className="max-w-7xl mx-auto">
            <header className="mb-16 md:mb-20 text-center space-y-3">
              <span className="font-label text-xs font-bold text-secondary tracking-[0.3em] uppercase">
                The Passage
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                Hallway of Expertise
              </h2>
              <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                Explore our three guiding disciplines. Click any discipline panel below to unveil custom case structures and detailed spatial approaches.
              </p>
            </header>

            {/* 3D Column Grid of Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 perspective-container">
              {servicesData.map((service, index) => {
                // Pick appropriate icon based on service type
                const IconComponent =
                  service.id === "architecture"
                    ? Compass
                    : service.id === "interior"
                    ? Layers
                    : Hexagon;

                return (
                  <motion.div
                    key={service.id}
                    onClick={() => setSelectedServiceId(selectedServiceId === service.id ? null : service.id)}
                    whileHover={{ y: -8, rotateY: -3 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className={`door-panel flex flex-col justify-between rounded-3xl p-8 md:p-10 min-h-[380px] relative overflow-hidden group cursor-pointer transition-all duration-300 border ${
                      selectedServiceId === service.id
                        ? "bg-white/80 border-secondary shadow-[0_30px_70px_rgba(1,103,125,0.15)] ring-1 ring-secondary/30"
                        : "glass-refraction border-white/60 hover:bg-white/60 hover:border-secondary/20 shadow-lg"
                    }`}
                  >
                    {/* Icon placement */}
                    <div className="flex justify-between items-start mb-12">
                      <div className="p-3.5 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary group-hover:scale-110 transition-transform">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      
                      {/* Technical Blueprint Tag */}
                      <span className="text-[9px] font-mono text-secondary/60 tracking-wider">
                        CH_EP_0{index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-primary mb-3">
                        {service.title}
                      </h3>
                      
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                        {service.summary}
                      </p>

                      {/* Animated expandable panel details */}
                      <AnimatePresence initial={false}>
                        {selectedServiceId === service.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="text-xs text-secondary font-medium pt-3 border-t border-secondary/10 leading-relaxed">
                              {service.details}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant/20">
                      <span className="text-[10px] font-label font-bold text-secondary uppercase tracking-widest">
                        {selectedServiceId === service.id ? "Minimize Info" : "Expand Details"}
                      </span>
                      <ArrowRight className={`w-4 h-4 text-secondary/60 group-hover:text-secondary group-hover:translate-x-1 transition-all ${
                        selectedServiceId === service.id ? "rotate-90 text-secondary" : ""
                      }`} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PORTFOLIO: GALLERY LIVING SPACE */}
        <section
          id="projects-section"
          className="py-24 md:py-32 px-6 md:px-12 overflow-hidden relative"
        >
          <div className="max-w-7xl mx-auto">
            
            {/* Gallery Section Header */}
            <div className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <span className="font-label text-xs font-bold text-secondary tracking-widest uppercase mb-2 block">
                  A Curated Walkthrough
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                  {activeProject.title}
                </h2>
              </div>

              {/* Camera focal controls & view modes for this render */}
              <div className="glass-refraction rounded-2xl p-2 flex flex-wrap gap-2 items-center border border-white/60 shadow-md">
                <button
                  onClick={() => setBlueprintOverlay(!blueprintOverlay)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-label font-bold flex items-center gap-1.5 transition-all ${
                    blueprintOverlay 
                      ? "bg-secondary text-white shadow-sm" 
                      : "text-on-surface-variant hover:bg-white/50"
                  }`}
                  title="Toggle spatial grid blueprint coordinates"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Blueprint Overlay</span>
                </button>

                {/* Day/Night/Blueprint filters */}
                <div className="h-4 w-[1px] bg-outline-variant/30 hidden sm:block" />

                <div className="flex items-center bg-white/20 rounded-xl p-1">
                  <button
                    onClick={() => setLightingMode("day")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      lightingMode === "day"
                        ? "bg-white text-secondary shadow-xs font-bold"
                        : "text-on-surface-variant/80 hover:text-primary"
                    }`}
                  >
                    <Sun className="w-3 h-3" />
                    <span className="hidden sm:inline">Fresh Day</span>
                  </button>
                  <button
                    onClick={() => setLightingMode("night")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      lightingMode === "night"
                        ? "bg-black/90 text-sky-200 shadow-xs font-bold"
                        : "text-on-surface-variant/80 hover:text-primary"
                    }`}
                  >
                    <Moon className="w-3 h-3" />
                    <span className="hidden sm:inline">Twilight</span>
                  </button>
                  <button
                    onClick={() => setLightingMode("blueprint")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                      lightingMode === "blueprint"
                        ? "bg-secondary text-cyan-200 shadow-xs font-bold"
                        : "text-on-surface-variant/80 hover:text-primary"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span className="hidden sm:inline">Caustics Only</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Immersive Gallery Display Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Feature Display Area */}
              <div className="lg:col-span-8 space-y-6">
                {activeProject.id === "gallery-living" ? (
                  <PanoramaViewer
                    imageUrl={activeProject.imageUrl}
                    title={activeProject.title}
                    blueprintOverlay={blueprintOverlay}
                  />
                ) : (
                  <>
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border border-white/60 p-2 bg-slate-100 group">
                      
                      {/* Overlay Filter states for lighting Mode */}
                      <AnimatePresence mode="wait">
                        {lightingMode === "night" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.55 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 bg-blue-950/40 mix-blend-color-burn pointer-events-none z-10"
                          />
                        )}
                        {lightingMode === "blueprint" && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.7 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0 bg-[#004e5f]/50 mix-blend-color pointer-events-none z-10"
                          />
                        )}
                      </AnimatePresence>

                      {/* Blueprint Grid Lines Overlay */}
                      {blueprintOverlay && (
                        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
                          {/* SVG grid lines to draw real blueprint annotations */}
                          <svg className="w-full h-full opacity-70 stroke-secondary/40 stroke-[0.5]" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                              <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(1, 103, 125, 0.25)" strokeWidth="0.25" />
                              </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#gridPattern)" />
                            
                            {/* Dynamic diagonal specs */}
                            <line x1="5" y1="5" x2="95" y2="5" stroke="#01677d" strokeWidth="0.1" strokeDasharray="1,1" />
                            <line x1="10" y1="15" x2="10" y2="85" stroke="#01677d" strokeWidth="0.1" strokeDasharray="1,1" />
                            
                            {/* Blueprint measurement rings */}
                            <circle cx="50" cy="55" r="12" fill="none" stroke="#00b4d8" strokeWidth="0.15" strokeDasharray="2,2" />
                            <circle cx="50" cy="55" r="28" fill="none" stroke="#01677d" strokeWidth="0.1" strokeDasharray="3,3" />

                            {/* Alignment cursors */}
                            <path d="M48 55 L52 55 M50 53 L50 57" stroke="#ba1a1a" strokeWidth="0.3" />
                          </svg>

                          {/* Technical Annotation Badges */}
                          <div className="absolute top-[20%] left-[25%] bg-black/60 backdrop-blur-md text-[9px] text-white/90 px-2 py-1 rounded border border-white/20 font-mono flex items-center gap-1">
                            <span>L: 4.85m</span>
                          </div>
                          <div className="absolute top-[48%] right-[20%] bg-black/60 backdrop-blur-md text-[9px] text-white/90 px-2 py-1 rounded border border-white/20 font-mono flex items-center gap-1">
                            <span>W: 5.64m</span>
                          </div>
                          <div className="absolute bottom-[25%] left-[45%] bg-[#01677d]/90 text-[9px] text-white px-2 py-1 rounded border border-white/30 font-mono">
                            <span>Vastu: North-East Entry</span>
                          </div>
                        </div>
                      )}

                      {/* Simulated Zoom Lens Effect */}
                      <div
                        className="w-full h-full overflow-hidden rounded-2xl relative"
                        style={{
                          transform: `scale(${1 + (35 - focalLength) * -0.015})`,
                          transition: "transform 0.4s ease-out"
                        }}
                      >
                        <img
                          className="w-full h-full object-cover transition-all duration-700"
                          src={activeProject.imageUrl}
                          alt={activeProject.title}
                        />
                      </div>

                      {/* Focal Length indicator badge */}
                      <div className="absolute bottom-4 left-4 glass-refraction border border-white/50 px-3 py-1 rounded-full text-[10px] font-mono text-secondary z-30">
                        LENS: {focalLength}mm Focal
                      </div>

                      {/* Overlay Specifications */}
                      {activeProject.overlayData && (
                        <div className="absolute top-4 right-4 bg-primary/75 backdrop-blur-md text-[9px] font-mono text-white/95 px-3 py-2 rounded-xl flex flex-col gap-0.5 shadow-md border border-white/10 z-30">
                          <span className="font-semibold text-[10px] text-secondary-container mb-1 border-b border-white/10 pb-1">
                            WALKTHROUGH SPECS
                          </span>
                          <span>DATUM: {activeProject.overlayData.datum}</span>
                          <span>HEIGHT: {activeProject.overlayData.level}</span>
                          <span>FINISH: {activeProject.overlayData.materials}</span>
                          <span>RENDER_YEAR: {activeProject.overlayData.completed}</span>
                        </div>
                      )}
                    </div>

                    {/* Simulated Lens Control Slider */}
                    <div className="glass-refraction p-4 rounded-2xl border border-white/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                      <div className="space-y-1">
                        <p className="font-semibold text-xs text-primary">Inter-Spatial Focal Zoom</p>
                        <p className="text-[10px] text-on-surface-variant">Adjust simulated camera lens (18mm Wide to 50mm Telephoto)</p>
                      </div>
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <span className="font-mono text-xs text-secondary font-bold">18mm</span>
                        <input
                          type="range"
                          min="18"
                          max="50"
                          value={focalLength}
                          onChange={(e) => setFocalLength(parseInt(e.target.value))}
                          className="w-full sm:w-32 accent-secondary bg-outline-variant/30 h-1.5 rounded-full outline-none"
                        />
                        <span className="font-mono text-xs text-secondary font-bold">50mm</span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Sidebar/Thumbnails Area */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Active Category Meta */}
                <div className="glass-refraction p-6 rounded-2xl border border-white/60 shadow-lg space-y-4">
                  <span className="font-label text-[10px] text-secondary tracking-widest font-bold uppercase bg-secondary-container/30 px-2.5 py-1 rounded-full">
                    {activeProject.category}
                  </span>
                  
                  <h4 className="font-serif text-xl font-bold text-primary">
                    Spatial Concept Overview
                  </h4>
                  
                  <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
                    {activeProject.description}
                  </p>

                  <div className="border-t border-outline-variant/30 pt-4 space-y-2.5 text-xs text-on-surface-variant">
                    <div className="flex justify-between">
                      <span className="font-medium">Curator:</span>
                      <span className="text-primary font-semibold">Chiraniya Consultancy</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Resolution Preset:</span>
                      <span className="text-secondary font-mono font-bold">3D Liquid-Glass Ultra</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sightlines Validation:</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 inline" strokeWidth={3} /> Certified Pass
                      </span>
                    </div>
                  </div>
                </div>

                {/* Thumbnails Showcase Slider */}
                <div className="space-y-3">
                  <p className="font-label text-[10px] text-on-surface-variant font-bold tracking-wider uppercase pl-1">
                    Select Walkthrough Viewport
                  </p>

                  <div className="grid grid-cols-3 gap-3">
                    {projectsData.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setActiveProject(project);
                          // Reset focal lens matching defaults
                          setFocalLength(project.id === "gallery-living" ? 35 : project.id === "pinnacle-tower" ? 28 : 45);
                        }}
                        className={`group relative aspect-square rounded-xl overflow-hidden border transition-all duration-300 ${
                          activeProject.id === project.id
                            ? "border-secondary ring-2 ring-secondary/30 scale-95 shadow-md"
                            : "border-white/60 opacity-65 hover:opacity-100 hover:scale-102 hover:border-secondary/20"
                        }`}
                      >
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Eye className="w-4 h-4 text-white drop-shadow-sm" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* TESTIMONIALS: VOICE OF THE INHABITANTS */}
        <section
          id="testimonials-section"
          className="py-24 md:py-32 px-6 md:px-12 bg-secondary/5 relative overflow-hidden"
        >
          {/* Abstract background blur bubbles for caustics refraction */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-tertiary-fixed/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <header className="text-center mb-16 md:mb-20 space-y-3">
              <span className="font-label text-xs font-bold text-secondary tracking-widest uppercase">
                Reviews & Success
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-primary">
                Voice of the Inhabitants
              </h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
              {testimonialsData.map((t, index) => (
                <motion.div
                  key={t.id}
                  whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? -1 : 1 }}
                  className={`p-8 md:p-10 rounded-2xl shadow-lg border relative group cursor-default transition-all duration-300 ${
                    index === 1
                      ? "bg-white/80 border-secondary/20 hover:border-secondary"
                      : "glass-refraction border-white/60 hover:bg-white/60"
                  }`}
                  style={{
                    // subtle offset rotators for natural physical cards as pictured
                    transform: `rotate(${index === 0 ? -2 : index === 1 ? 2 : -1}deg)`,
                  }}
                >
                  <Quote className="w-10 h-10 text-secondary/30 mb-6 group-hover:scale-110 group-hover:text-secondary/60 transition-all" />
                  
                  <p className="font-sans text-sm text-on-surface leading-relaxed mb-8 italic">
                    "{t.quote}"
                  </p>

                  <div className="border-t border-outline-variant/30 pt-4 flex flex-col">
                    <span className="font-label text-xs font-bold text-secondary tracking-wider uppercase">
                      {t.author}
                    </span>
                    <span className="text-[10px] text-on-surface-variant mt-0.5">
                      {t.role}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT: DESK OF POSSIBILITY */}
        <section
          id="contact-section"
          className="py-24 md:py-32 px-6 md:px-12 relative overflow-hidden"
        >
          <div className="max-w-3xl mx-auto glass-refraction p-8 md:p-16 lg:p-20 rounded-[3rem] etched-border relative z-20 shadow-2xl border border-white/80 bg-white/30">
            
            <header className="mb-10 text-center md:text-left space-y-2">
              <span className="font-label text-xs font-bold text-secondary tracking-[0.4em] uppercase">
                Desk of Possibility
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                Inquire About Your Project
              </h2>
              <p className="text-xs text-on-surface-variant max-w-md">
                Initiate a high-resolution 3D spatial simulation. Submit your architectural vision and review custom caustics results instantly.
              </p>
            </header>

            <form onSubmit={handleInquirySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1">
                  <label className="font-label text-[10px] text-on-surface-variant font-bold uppercase tracking-widest pl-1">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/20 border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 transition-all py-3.5 px-2 text-sm text-on-background placeholder-on-surface-variant/40"
                    placeholder="Johnathan Doe"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-label text-[10px] text-on-surface-variant font-bold uppercase tracking-widest pl-1">
                    Email Address
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/20 border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 transition-all py-3.5 px-2 text-sm text-on-background placeholder-on-surface-variant/40"
                    placeholder="design@future.com"
                  />
                </div>

              </div>

              <div className="space-y-1">
                <label className="font-label text-[10px] text-on-surface-variant font-bold uppercase tracking-widest pl-1">
                  Project Vision
                </label>
                <textarea
                  required
                  rows={4}
                  value={projectVision}
                  onChange={(e) => setProjectVision(e.target.value)}
                  className="w-full bg-white/20 border-0 border-b-2 border-outline-variant focus:border-secondary focus:ring-0 transition-all py-3.5 px-2 text-sm text-on-background placeholder-on-surface-variant/40 resize-none"
                  placeholder="Describe the atmosphere of your space, desired materials, Vastu constraints..."
                />
              </div>

              {/* Submit Buttons / Feedback state */}
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className={`w-full py-5 rounded-2xl bg-secondary text-white font-label text-xs uppercase tracking-[0.2em] font-bold hover:bg-on-secondary-container transition-all active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Engaging Spatial Engine...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    <span>Simulation Registered</span>
                  </>
                ) : (
                  "INITIATE CONSULTATION"
                )}
              </button>
            </form>

            {/* Success Micro-feedback */}
            <AnimatePresence>
              {submitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex gap-2 items-start"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                  <div>
                    <p className="font-bold">Project profile submitted successfully!</p>
                    <p className="mt-0.5 text-[11px] text-emerald-700">
                      We have queued your vision in our 3D Liquid-Glass spatial simulator. Check your pending items listed below to watch live rendering statuses.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Persistent user inquires showcase panel */}
          {inquiries.length > 0 && (
            <div className="max-w-3xl mx-auto mt-12 space-y-4 relative z-20">
              <div className="flex justify-between items-center pl-4">
                <h4 className="font-label text-xs font-bold uppercase tracking-wider text-secondary">
                  Your Submissions ({inquiries.length})
                </h4>
                <span className="text-[10px] text-on-surface-variant/60">
                  Click 'Status Trigger' to simulate draft progress stages.
                </span>
              </div>

              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <motion.div
                    key={inq.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl glass-refraction border border-white/60 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-serif text-sm font-bold text-primary">
                          Spatial Proposal #{inq.id.split("_")[1].slice(-4)}
                        </span>
                        <span className="text-[9px] font-mono text-on-surface-variant/60">
                          {inq.submittedAt}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant line-clamp-2">
                        "{inq.projectVision}"
                      </p>
                      <div className="text-[10px] text-on-surface-variant/80 flex flex-wrap gap-x-4 gap-y-1">
                        <span>Client: <strong className="text-primary">{inq.fullName}</strong></span>
                        <span>Email: <strong className="text-primary">{inq.email}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-outline-variant/30 justify-between md:justify-end">
                      <div className="text-right">
                        <button
                          onClick={() => simulateUpdate(inq.id)}
                          className="text-[9px] font-mono text-secondary bg-secondary-container/40 hover:bg-secondary-container/80 px-2 py-1 rounded-full font-bold transition-all block mb-1 text-left md:text-right"
                          title="Simulate rendering progress lifecycle"
                        >
                          Status Trigger ↻
                        </button>
                        <span
                          className={`text-xs font-label font-bold uppercase tracking-wider block ${
                            inq.status === "Pending Review"
                              ? "text-amber-700"
                              : inq.status === "Under Simulation"
                              ? "text-blue-700 animate-pulse"
                              : "text-emerald-700"
                          }`}
                        >
                          ● {inq.status}
                        </span>
                      </div>

                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all"
                        title="Delete project draft"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Abstract background shape */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] caustic-bg -z-10 animate-pulse duration-[6000ms]" />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-surface-container-lowest border-t border-outline-variant/30 w-full relative overflow-hidden py-20 mt-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="font-serif text-5xl md:text-7xl font-bold text-primary opacity-10 leading-none tracking-tighter cursor-default">
              CHIRANIYA
            </div>
            <p className="font-label text-[10px] text-on-surface-variant max-w-sm leading-relaxed">
              © {new Date().getFullYear()} CHIRANIYA CONSULTANCY. ALL RIGHTS RESERVED.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-12 md:justify-end items-start md:items-center">
            
            <div className="space-y-4">
              <h5 className="font-label text-[10px] font-bold text-secondary tracking-widest uppercase">
                Explore
              </h5>
              <ul className="space-y-2 text-xs text-on-surface-variant font-medium">
                <li>
                  <button onClick={() => scrollToId("projects-section")} className="hover:text-primary transition-colors">
                    Portfolio Walkthroughs
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToId("services-section")} className="hover:text-primary transition-colors">
                    Spatial Design Panels
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToId("contact-section")} className="hover:text-primary transition-colors">
                    Inquire Consultation
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-label text-[10px] font-bold text-secondary tracking-widest uppercase">
                Legal
              </h5>
              <ul className="space-y-2 text-xs text-on-surface-variant font-medium">
                <li>
                  <a href="#hero" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#hero" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#hero" className="hover:text-primary transition-colors">
                    Workspace Integration
                  </a>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </footer>
    </div>
  );
}
