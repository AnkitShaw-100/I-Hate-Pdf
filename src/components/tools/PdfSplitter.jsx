import { useCallback, useId, useMemo, useState } from "react";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { PDFDocument } from "pdf-lib";
import { zipSync } from "fflate";
import { saveAs } from "file-saver";
import { FileText, X } from "lucide-react";
import { toast } from "sonner";
import DropZone from "@/components/DropZone";
import PrimaryButton from "@/components/PrimaryButton";
import SegmentedControl from "@/components/SegmentedControl";

const isPdf = (file) =>
  file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

const formatSize = (bytes) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const modeOptions = [
  { value: "range", label: "A page range" },
  { value: "each", label: "Every page" },
];

const PageField = ({ label, value, onChange, max }) => {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={1}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-24 rounded-xl border border-hairline bg-surface px-3.5 text-[17px] tabular-nums text-foreground transition-[border-color,box-shadow] focus:border-primary focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--primary)_18%,transparent)] focus:outline-none"
      />
    </div>
  );
};

const PdfSplitter = () => {
  const [pdf, setPdf] = useState(null); // { file, bytes, pageCount }
  const [mode, setMode] = useState("range");
  const [from, setFrom] = useState("1");
  const [to, setTo] = useState("1");
  const [loading, setLoading] = useState(false);

  const baseName = pdf ? pdf.file.name.replace(/\.pdf$/i, "") : "";

  const handleFilesAdded = useCallback(async ([file]) => {
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const doc = await PDFDocument.load(bytes);
      const pageCount = doc.getPageCount();

      setPdf({ file, bytes, pageCount });
      setFrom("1");
      setTo(String(pageCount));
    } catch (error) {
      console.error(error);
      toast.error(
        /encrypt/i.test(error?.message)
          ? "This PDF is password-protected. Remove the password and try again."
          : "This file couldn’t be opened as a PDF. It may be damaged."
      );
    }
  }, []);

  const handleRejected = useCallback(() => {
    toast.error("That file isn’t a PDF. Choose a file ending in .pdf.");
  }, []);

  const range = useMemo(() => {
    if (!pdf) return { valid: false };
    const start = Number(from);
    const end = Number(to);
    const inBounds = (n) => Number.isInteger(n) && n >= 1 && n <= pdf.pageCount;

    if (!inBounds(start) || !inBounds(end)) {
      return { valid: false, message: `Enter pages between 1 and ${pdf.pageCount}.` };
    }
    if (start > end) {
      return { valid: false, message: "The first page needs to come before the last page." };
    }
    return { valid: true, start, end, count: end - start + 1 };
  }, [pdf, from, to]);

  const handleExtractRange = useCallback(async () => {
    if (!range.valid) return;
    setLoading(true);
    try {
      const src = await PDFDocument.load(pdf.bytes);
      const out = await PDFDocument.create();
      const indices = Array.from({ length: range.count }, (_, i) => range.start - 1 + i);
      const pages = await out.copyPages(src, indices);
      pages.forEach((page) => out.addPage(page));

      const name =
        range.count === 1
          ? `${baseName}-page-${range.start}.pdf`
          : `${baseName}-pages-${range.start}-${range.end}.pdf`;
      saveAs(new Blob([await out.save()], { type: "application/pdf" }), name);
      toast.success(`Downloaded ${name}`);
    } catch (error) {
      console.error(error);
      toast.error("Those pages couldn’t be extracted. Try a different range.");
    } finally {
      setLoading(false);
    }
  }, [pdf, range, baseName]);

  // One ZIP instead of many separate downloads, which browsers block.
  const handleExtractEach = useCallback(async () => {
    setLoading(true);
    try {
      const src = await PDFDocument.load(pdf.bytes);
      const pad = String(pdf.pageCount).length;
      const entries = {};

      for (let i = 0; i < pdf.pageCount; i++) {
        const out = await PDFDocument.create();
        const [page] = await out.copyPages(src, [i]);
        out.addPage(page);
        entries[`${baseName}-page-${String(i + 1).padStart(pad, "0")}.pdf`] = [
          await out.save(),
          { level: 0 },
        ];
      }

      const name = `${baseName}-pages.zip`;
      saveAs(new Blob([zipSync(entries)], { type: "application/zip" }), name);
      toast.success(`Downloaded ${name}`);
    } catch (error) {
      console.error(error);
      toast.error("The pages couldn’t be separated. Try again.");
    } finally {
      setLoading(false);
    }
  }, [pdf, baseName]);

  if (!pdf) {
    return (
      <DropZone
        accept="application/pdf,.pdf"
        isAccepted={isPdf}
        onFilesAdded={handleFilesAdded}
        onRejected={handleRejected}
        title="Add a PDF to split"
        activeTitle="Release to open"
        hint="Your file is opened on this device and never uploaded."
      />
    );
  }

  const summary =
    mode === "each"
      ? `You’ll get a ZIP with ${pdf.pageCount} separate PDFs, one per page.`
      : range.valid
        ? range.count === 1
          ? `You’ll get one PDF containing page ${range.start}.`
          : `You’ll get one PDF containing pages ${range.start}–${range.end}.`
        : range.message;

  return (
    <div>
      <div className="flex items-center gap-4 rounded-2xl bg-fill/60 p-3 pr-2 sm:p-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-surface text-[#ff3b30] shadow-[0_1px_2px_rgb(0_0_0/0.06)]">
          <FileText className="size-6" strokeWidth={1.6} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[17px] font-medium" title={pdf.file.name}>
            {pdf.file.name}
          </p>
          <p className="text-[14px] text-muted-foreground">
            {pdf.pageCount} {pdf.pageCount === 1 ? "page" : "pages"} · {formatSize(pdf.file.size)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPdf(null)}
          aria-label="Remove this PDF"
          title="Remove this PDF"
          className="grid size-9 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-hairline/60 hover:text-foreground"
        >
          <X className="size-4.5" />
        </button>
      </div>

      <div className="mt-10 text-center">
        <h3 className="display text-[24px] font-semibold">What do you want to download?</h3>
        <div className="mt-4 flex justify-center">
          <SegmentedControl
            label="Split mode"
            options={modeOptions}
            value={mode}
            onChange={setMode}
          />
        </div>

        <AnimatePresence initial={false}>
          {mode === "range" && (
            <motion.div
              key="range"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="flex items-end justify-center gap-3 pt-6 text-left">
                <PageField label="From page" value={from} onChange={setFrom} max={pdf.pageCount} />
                <span className="pb-3 text-muted-foreground">–</span>
                <PageField label="To page" value={to} onChange={setTo} max={pdf.pageCount} />
                <span className="pb-3 text-[15px] text-muted-foreground">of {pdf.pageCount}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-10 flex flex-col items-center gap-4 border-t border-hairline pt-6 text-center">
        <p
          aria-live="polite"
          className={`text-[15px] ${
            mode === "range" && !range.valid ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {summary}
        </p>

        <PrimaryButton
          loading={loading}
          loadingLabel="Preparing…"
          disabled={mode === "range" && !range.valid}
          onClick={mode === "each" ? handleExtractEach : handleExtractRange}
        >
          {mode === "each" ? "Download ZIP" : "Download PDF"}
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PdfSplitter;
