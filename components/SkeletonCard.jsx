/* SkeletonCard.jsx — Loading skeleton that mimics project/certificate cards */
"use client";

export default function SkeletonCard({ variant = "project" }) {
  const isProject = variant === "project";

  return (
    <article className="skeleton-card" aria-hidden="true">
      {/* Image / header area */}
      {isProject ? (
        <div className="skeleton-image">
          <div className="skeleton-circle" />
          <div className="skeleton-corner tl" />
          <div className="skeleton-corner br" />
        </div>
      ) : (
        <div className="skeleton-seal">
          <div className="skeleton-seal-circle" />
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton-corner-ornament"
              style={{
                top: i < 2 ? 14 : undefined,
                bottom: i >= 2 ? 14 : undefined,
                left: i % 2 === 0 ? 14 : undefined,
                right: i % 2 === 1 ? 14 : undefined,
              }}
            />
          ))}
        </div>
      )}

      {/* Content area */}
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-badge" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-subtitle" />
        <div className="skeleton-line skeleton-text" />
        <div className="skeleton-line skeleton-text short" />

        {/* Tech chips */}
        <div className="skeleton-chips">
          <div className="skeleton-chip" />
          <div className="skeleton-chip" />
          <div className="skeleton-chip" />
        </div>

        {/* Actions */}
        <div className="skeleton-actions">
          <div className="skeleton-action-btn" />
          <div className="skeleton-action-btn" />
        </div>
      </div>
    </article>
  );
}
