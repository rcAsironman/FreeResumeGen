"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import { getCertificationBadgeMatches, type CertificationBadgeId, type CertificationBadgePosition } from "@/engine/certification-badges";
import styles from "./CertificationLogoStrip.module.css";

export function CertificationLogoStrip({ selectedBadges = [], enabled = false, position = { x: 0, y: 0 }, badgeSize = 72, onPositionChange }: { selectedBadges?: CertificationBadgeId[]; enabled?: boolean; position?: CertificationBadgePosition; badgeSize?: number; onPositionChange?: (position: CertificationBadgePosition) => void }) {
  const dragRef = useRef<{ pointerId: number; startClientX: number; startClientY: number; startX: number; startY: number; baseLeft: number; baseTop: number; width: number; height: number; maxLeft: number; maxTop: number } | null>(null);
  if (!enabled) return null;
  const badges = getCertificationBadgeMatches(selectedBadges);
  if (!badges.length) return null;

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    if (!onPositionChange || event.button !== 0) return;
    const root = event.currentTarget.closest<HTMLElement>("[data-resume-paper]");
    if (!root) return;
    event.preventDefault();
    event.stopPropagation();
    const rootRect = root.getBoundingClientRect();
    const badgeRect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: position.x,
      startY: position.y,
      baseLeft: badgeRect.left - rootRect.left - position.x,
      baseTop: badgeRect.top - rootRect.top - position.y,
      width: badgeRect.width,
      height: badgeRect.height,
      maxLeft: rootRect.width,
      maxTop: rootRect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !onPositionChange) return;
    const minX = -drag.baseLeft;
    const maxX = Math.max(minX, drag.maxLeft - drag.baseLeft - drag.width);
    const minY = -drag.baseTop;
    const maxY = Math.max(minY, drag.maxTop - drag.baseTop - drag.height);
    onPositionChange({
      x: Math.round(Math.max(minX, Math.min(maxX, drag.startX + event.clientX - drag.startClientX))),
      y: Math.round(Math.max(minY, Math.min(maxY, drag.startY + event.clientY - drag.startClientY))),
    });
    event.preventDefault();
  }

  function stopDrag(event: PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return <div className={styles.logoStrip} role="list" aria-label="Selected certification badges. Drag to reposition." data-certification-badges onPointerDown={startDrag} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} style={{ transform: `translate(${position.x}px, ${position.y}px)`, "--certification-badge-size": `${badgeSize}px` } as CSSProperties}>
    {badges.map((badge) => <span className={styles.logo} role="listitem" key={badge.id} title={badge.label}>
      <Image src={`/certification-badges/${badge.image}`} alt={badge.label} width={badgeSize} height={badgeSize} unoptimized />
    </span>)}
  </div>;
}
