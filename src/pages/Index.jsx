import { useState } from "react";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "framer-motion";
import { FileImage, Scissors, Sparkles, FileText } from "lucide-react";

import ImageToPdf from "@/components/tools/ImageToPdf";
import PdfSplitter from "@/components/tools/PdfSplitter";
import ThemeToggle from "@/components/ThemeToggle";

const tools = [
  {
    id: "img2pdf",
    label: "Image → PDF",
    icon: FileImage,
    component: ImageToPdf,
  },
  { id: "split", label: "Split PDF", icon: Scissors, component: PdfSplitter },
];

export default function Index() {
  const [activeTool, setActiveTool] = useState("img2pdf");

  const ActiveComponent =
    tools.find((tool) => tool.id === activeTool)?.component ?? ImageToPdf;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/50 glass sticky top-0 z-50">
        <div className="container max-w-5xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-lg bg-destructive/10 border border-destructive/20 shrink-0">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
            </div>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-heading font-bold tracking-tight">
                IHate<span className="text-destructive">PDF</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <div className="hidden xs:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Free & Private</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 container max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-10"
        >
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-heading font-bold tracking-tight leading-tight">
            Every PDF Tool You{" "}
            <span className="text-destructive glow-text">Hate</span> to Need
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-3 sm:mt-4 max-w-lg mx-auto px-2">
            Convert, split, and transform your files — entirely in your browser.
            No uploads, no servers, no BS.
          </p>
        </motion.div>

        {/* Tool Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10 px-1"
        >
          {tools.map((tool) => {
            const Icon = tool.icon;
            const isActive = activeTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-heading font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden xs:inline">{tool.label}</span>
                <span className="inline xs:hidden">
                  {tool.label.split("→")[0]}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Active Tool */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="mb-8 sm:mb-12"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 sm:mt-16 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
        >
          {[
            { title: "100% Private", desc: "Files never leave your browser" },
            { title: "No Limits", desc: "Convert unlimited files" },
            { title: "Instant Results", desc: "Get files in seconds" },
          ].map((item) => (
            <div
              key={item.title}
              className="glass rounded-lg sm:rounded-xl p-4 sm:p-5 text-center glow-border hover:bg-secondary/30 transition-colors"
            >
              <h3 className="font-heading font-semibold text-xs sm:text-sm">
                {item.title}
              </h3>
              <p className="text-[10px] xs:text-xs sm:text-xs text-muted-foreground mt-1 sm:mt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}