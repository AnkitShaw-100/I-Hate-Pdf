import { useState } from "react";
/* eslint-disable no-unused-vars */
import { Images, Lock, Scissors, Gift, Zap } from "lucide-react";

import ImageToPdf from "@/components/tools/ImageToPdf";
import PdfSplitter from "@/components/tools/PdfSplitter";
import SegmentedControl from "@/components/SegmentedControl";
import Navbar from "@/components/Navbar";

// Tools share the brand colour for their icon and drop-zone illustration.
const tools = [
  {
    value: "img2pdf",
    label: "Images to PDF",
    icon: Images,
    color: "var(--primary)",
    component: ImageToPdf,
  },
  {
    value: "split",
    label: "Split PDF",
    icon: Scissors,
    color: "var(--primary)",
    component: PdfSplitter,
  },
];

const facts = [
  {
    icon: Lock,
    title: "Stays on your device",
    body: "Files are processed in your browser. Nothing is uploaded to a server.",
  },
  {
    icon: Gift,
    title: "Free, without the catch",
    body: "No account, no watermark and no daily limit on how many files you convert.",
  },
  {
    icon: Zap,
    title: "Done in seconds",
    body: "There’s no upload queue, so your PDF is ready as soon as you press the button.",
  },
];

export default function Index() {
  const [activeTool, setActiveTool] = useState("img2pdf");
  const tool = tools.find((t) => t.value === activeTool) ?? tools[0];


  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <Navbar />

      <main className="mx-auto w-full max-w-245 flex-1 px-4 sm:px-6">
        <section className="pt-10 pb-8 text-center sm:pt-14 sm:pb-10">
          <h1 className="display mx-auto max-w-[14ch] pb-1 text-[40px] font-semibold text-balance sm:text-[56px] md:text-[64px]">
            PDF tools that stay out of your way.
          </h1>
          <p className="mx-auto mt-4 max-w-[34rem] text-[17px] leading-[1.47] text-muted-foreground sm:text-[19px]">
            Turn images into a PDF or split one into pages. Everything happens in your browser, so
            your files never leave this device.
          </p>
        </section>

        <div style={{ "--tool": tool.color }}>
          <div className="flex justify-center">
            <SegmentedControl
              label="Choose a tool"
              options={tools}
              value={activeTool}
              onChange={setActiveTool}
            />
          </div>

          <div className="mt-6 sm:mt-8">
            <section
              aria-label={tool.label}
              className="panel rounded-[28px] p-4 sm:p-8 md:p-10"
            >
              {/* Both tools stay mounted so switching keeps your files in place. */}
              {tools.map(({ value, component: Tool }) => (
                <div key={value} id={`tool-${value}`} hidden={activeTool !== value}>
                  <Tool />
                </div>
              ))}
            </section>
          </div>
        </div>

        <section aria-label="Why I Hate PDF" className="grid gap-10 py-20 sm:grid-cols-3 sm:gap-8 sm:py-28">
          {facts.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <span
                className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary"
              >
                <Icon className="size-5.5" strokeWidth={2} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-[19px] font-semibold tracking-[-0.02em]">{title}</h2>
              <p className="mt-1.5 max-w-[30ch] text-[15px] leading-normal text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t border-hairline/60">
        <div className="mx-auto flex max-w-245 flex-col gap-1 px-4 py-6 text-[12px] text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>Copyright © {new Date().getFullYear()} I Hate PDF.</p>
          <p>Your files are processed locally and never stored.</p>
        </div>
      </footer>
    </div>
  );
}
