"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./ProductModal.module.css";

const defaultValues = {
  sku: "",
  productName: "",
  amount: "",
  priceUnit: "Kg",
  status: "Active",
  description: "",
  imageFile: null,
};

export default function ProductModal({
  open,
  mode = "create",
  initialValues,
  onClose,
  onConfirm,
}) {
  const mergedDefaults = useMemo(() => {
    return { ...defaultValues, ...(initialValues || {}) };
  }, [initialValues]);

  const [values, setValues] = useState(mergedDefaults);
  const [errors, setErrors] = useState({});
  const [imageName, setImageName] = useState("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");

  useEffect(() => {
    if (open) {
      setValues(mergedDefaults);
      setErrors({});
      setImageName(mergedDefaults.imageFile?.name || "");
      setImagePreviewUrl("");
    }
  }, [open, mergedDefaults]);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  if (!open) return null;

  const setField = (key, val) => {
    setValues((p) => ({ ...p, [key]: val }));
    setErrors((p) => {
      const n = { ...p };
      delete n[key];
      return n;
    });
  };

  const validate = (v) => {
    const e = {};
    if (!v.productName?.trim()) e.productName = "Product name is required.";
    if (!v.sku?.trim()) e.sku = "SKU is required.";
    if (!v.amount?.trim()) e.amount = "Amount is required.";
    if (v.amount?.trim() && Number(v.amount) < 0) e.amount = "Amount must be ≥ 0.";
    if (!v.priceUnit?.trim()) e.priceUnit = "Price unit is required.";
    if (!v.status?.trim()) e.status = "Status is required.";
    if (!v.description?.trim()) e.description = "Description is required.";
    if (!v.imageFile) e.imageFile = "Image is required.";
    return e;
  };

  const handleConfirm = () => {
    const e = validate(values);
    setErrors(e);
    if (Object.keys(e).length) return;

    console.log("Product Modal Submit:", {
      ...values,
      amount: Number(values.amount),
      imageFileName: values.imageFile?.name || "",
    });

    onConfirm?.(values);
    onClose?.();
  };

  const handleBackdropMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      className={styles.backdrop}
      onMouseDown={handleBackdropMouseDown}
      role="dialog"
      aria-modal="true"
      aria-label={mode === "create" ? "Product Create Modal" : "Product Edit Modal"}
    >
      <div className={styles.modal}>
        <div className={styles.topRow}>
          <div className={styles.iconChip} aria-hidden>
            {/* Lucide-style icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </div>

          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <div className={styles.header}>
          <h2 className={styles.title}>
            {mode === "create" ? "Product Create" : "Product Edit"}
          </h2>
          <p className={styles.subtitle}>Share where you’ve worked on your profile.</p>
        </div>

        {/* Product Name + SKU (same row / same style) */}
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Product Name*</label>
            <input
              className={`${styles.input} ${errors.productName ? styles.inputError : ""}`}
              value={values.productName}
              onChange={(e) => setField("productName", e.target.value)}
              placeholder="Enter product name"
            />
            {errors.productName && <div className={styles.error}>{errors.productName}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>SKU*</label>
            <input
              className={`${styles.input} ${errors.sku ? styles.inputError : ""}`}
              value={values.sku}
              onChange={(e) => setField("sku", e.target.value)}
              placeholder="e.g. RICE-5KG-001"
            />
            {errors.sku && <div className={styles.error}>{errors.sku}</div>}
          </div>
        </div>

        {/* Amount + Price Unit */}
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Amount*</label>
            <div className={`${styles.inputGroup} ${errors.amount ? styles.groupError : ""}`}>
              <span className={styles.prefix}>$$</span>
              <input
                className={styles.inputGroupInput}
                value={values.amount}
                onChange={(e) => setField("amount", e.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal"
                placeholder="0"
              />
            </div>
            {errors.amount && <div className={styles.error}>{errors.amount}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Price Unit*</label>
            <div className={`${styles.inputGroup} ${errors.priceUnit ? styles.groupError : ""}`}>
              <span className={styles.prefix}>Kg</span>
              <input
                className={styles.inputGroupInput}
                value={values.priceUnit}
                onChange={(e) => setField("priceUnit", e.target.value)}
                placeholder="Kg"
              />
            </div>
            {errors.priceUnit && <div className={styles.error}>{errors.priceUnit}</div>}
          </div>
        </div>

        {/* Upload + Status */}
        <div className={styles.grid2}>
          <div className={styles.field}>
            <label className={styles.label}>Upload image*</label>

            <div className={styles.uploadRow}>
              <label className={`${styles.uploadBox} ${errors.imageFile ? styles.groupError : ""}`}>
                <span className={styles.uploadIcon}>↑</span>
                <span className={styles.uploadText}>
                  {imageName ? imageName : "Choose an image"}
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className={styles.hiddenFile}
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;

                    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);

                    setField("imageFile", f);
                    setImageName(f?.name || "");

                    if (f) setImagePreviewUrl(URL.createObjectURL(f));
                    else setImagePreviewUrl("");
                  }}
                />
              </label>

              <div className={styles.thumb}>
                {imagePreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imagePreviewUrl} alt="Preview" className={styles.thumbImg} />
                ) : (
                  <div className={styles.thumbPlaceholder}>IMG</div>
                )}
              </div>
            </div>

            {errors.imageFile && <div className={styles.error}>{errors.imageFile}</div>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Status*</label>
            <select
              className={`${styles.select} ${errors.status ? styles.inputError : ""}`}
              value={values.status}
              onChange={(e) => setField("status", e.target.value)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            {errors.status && <div className={styles.error}>{errors.status}</div>}
          </div>
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label className={styles.label}>Description*</label>
          <textarea
            className={`${styles.textarea} ${errors.description ? styles.inputError : ""}`}
            value={values.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Write a short description..."
          />
          {errors.description && <div className={styles.error}>{errors.description}</div>}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className={styles.confirmBtn} onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
