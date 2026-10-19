import { useCallback, useEffect, useRef, useState } from "react";
/* eslint-disable no-unused-vars */
import { AnimatePresence, motion } from "framer-motion";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import DropZone from "@/components/DropZone";
import ImagePreview from "@/components/ImagePreview";
import PrimaryButton from "@/components/PrimaryButton";
import SegmentedControl from "@/components/SegmentedControl";

const A4 = { w: 595.28, h: 841.89 }; // points
const PX_TO_PT = 0.75; // 96 dpi screen pixels → 72 dpi points
const MAX_EDGE = 5000; // keeps canvas memory reasonable on phones

const pageSizeOptions = [
  { value: "fit", label: "Fit to image" },
  { value: "a4", label: "A4" },
];

const isImage = (file) => file.type.startsWith("image/");

const loadImage = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("decode"));
    img.src = url;
  });

// Draws onto white so transparent PNGs don't turn black when encoded as JPEG.
const toJpeg = (img) => {
  const scale = Math.min(1, MAX_EDGE / Math.max(img.naturalWidth, img.naturalHeight));
  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);

  return { data: canvas.toDataURL("image/jpeg", 0.92), width, height };
};

const pdfNameFor = (images) =>
  images.length === 1 ? `${images[0].file.name.replace(/\.[^.]+$/, "")}.pdf` : "images.pdf";

let nextId = 0;

const ImageToPdf = () => {
  const [images, setImages] = useState([]);
  const [pageSize, setPageSize] = useState("fit");
  const [loading, setLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Revoke any object URLs still alive when the tool unmounts.
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(() => () => imagesRef.current.forEach((img) => URL.revokeObjectURL(img.url)), []);

  const handleFilesAdded = useCallback((files) => {
    const added = files.map((file) => ({
      id: ++nextId,
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...added]);
  }, []);

  const handleRejected = useCallback((count) => {
    toast.error(
      count === 1
        ? "That file isn’t an image. Add PNG, JPG, WEBP or GIF files."
        : `${count} files aren’t images and were skipped.`
    );
  }, []);

  const handleRemove = useCallback((index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleMove = useCallback((from, to) => {
    setImages((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const handleClearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.url));
      return [];
    });
  }, []);

  const handleDragOver = useCallback(
    (e, index) => {
      e.preventDefault();
      if (draggedIndex === null || draggedIndex === index) return;
      handleMove(draggedIndex, index);
      setDraggedIndex(index);
    },
    [draggedIndex, handleMove]
  );

  const handleConvert = useCallback(async () => {
    if (!images.length) return;
    setLoading(true);

    try {
      let pdf = null;

      for (const [i, entry] of images.entries()) {
        let img;
        try {
          img = await loadImage(entry.url);
        } catch {
          const error = new Error("decode");
          error.userMessage = `${entry.file.name} couldn’t be read. Remove it and try again.`;
          throw error;
        }

        const { data, width, height } = toJpeg(img);
        const landscape = width > height;
        const orientation = landscape ? "l" : "p";

        let pageW, pageH;
        if (pageSize === "fit") {
          const s = (img.naturalWidth / width) * PX_TO_PT;
          pageW = width * s;
          pageH = height * s;
        } else {
          pageW = landscape ? A4.h : A4.w;
          pageH = landscape ? A4.w : A4.h;
        }

        if (i === 0) {
          pdf = new jsPDF({ unit: "pt", format: [pageW, pageH], orientation, compress: true });
        } else {
          pdf.addPage([pageW, pageH], orientation);
        }

        const ratio = Math.min(pageW / width, pageH / height);
        const w = width * ratio;
        const h = height * ratio;
        pdf.addImage(data, "JPEG", (pageW - w) / 2, (pageH - h) / 2, w, h, undefined, "FAST");
      }

      const name = pdfNameFor(images);
      pdf.save(name);
      toast.success(`Downloaded ${name}`);
    } catch (err) {
      console.error(err);
      toast.error(err.userMessage ?? "The PDF couldn’t be created. Try fewer or smaller images.");
    } finally {
      setLoading(false);
    }
  }, [images, pageSize]);

  if (!images.length) {
    return (
      <DropZone
        accept="image/*"
        multiple
        isAccepted={isImage}
        onFilesAdded={handleFilesAdded}
        onRejected={handleRejected}
        title="Add your images"
        activeTitle="Release to add"
        hint="PNG, JPG, WEBP and GIF. Each image becomes one page."
      />
    );
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 px-1">
        <div>
          <h3 className="display text-[24px] font-semibold">
            {images.length} {images.length === 1 ? "page" : "pages"}
          </h3>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Drag images, or use the arrows, to set the page order.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          className="shrink-0 rounded-full px-3 py-1.5 text-[15px] text-primary transition-colors hover:bg-primary/8"
        >
          Remove all
        </button>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 md:grid-cols-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {images.map((img, i) => (
            <ImagePreview
              key={img.id}
              file={img.file}
              url={img.url}
              index={i}
              total={images.length}
              onRemove={handleRemove}
              onMove={handleMove}
              onDragStart={setDraggedIndex}
              onDragOver={handleDragOver}
              onDragEnd={() => setDraggedIndex(null)}
              isDragging={draggedIndex === i}
            />
          ))}
          <motion.li key="add" layout className="list-none">
            <DropZone
              compact
              accept="image/*"
              multiple
              isAccepted={isImage}
              onFilesAdded={handleFilesAdded}
              onRejected={handleRejected}
            />
          </motion.li>
        </AnimatePresence>
      </ul>

      <div className="mt-10 flex flex-col items-stretch gap-5 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[14px] text-muted-foreground">Page size</span>
          <SegmentedControl
            label="Page size"
            size="sm"
            options={pageSizeOptions}
            value={pageSize}
            onChange={setPageSize}
          />
        </div>

        <PrimaryButton loading={loading} loadingLabel="Creating PDF…" onClick={handleConvert}>
          Create PDF
        </PrimaryButton>
      </div>
    </div>
  );
};

export default ImageToPdf;
