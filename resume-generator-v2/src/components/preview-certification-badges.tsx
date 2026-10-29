"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import type { ProfileSettings } from "@/types/resume";

type Badge = ProfileSettings["certifications"][number];

export function PreviewCertificationBadges({ badges, onPositionChange }: { badges: Badge[]; onPositionChange: (id: string, position: { x: number; y: number }) => void }) {
  const dragRef = useRef<{ id: string; pointerId: number; startClientX: number; startClientY: number; startX: number; startY: number; baseLeft: number; baseTop: number; width: number; height: number; maxLeft: number; maxTop: number } | null>(null);

  function startDrag(event: PointerEvent<HTMLSpanElement>, badge: Badge) {
    if (event.button !== 0) return;
    const root = event.currentTarget.closest<HTMLElement>("[data-resume-paper]");
    if (!root) return;
    event.preventDefault();
    event.stopPropagation();
    const rootRect = root.getBoundingClientRect();
    const badgeRect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: badge.id, pointerId: event.pointerId, startClientX: event.clientX, startClientY: event.clientY,
      startX: badge.logoPosition?.x ?? 0, startY: badge.logoPosition?.y ?? 0,
      baseLeft: badgeRect.left - rootRect.left - (badge.logoPosition?.x ?? 0),
      baseTop: badgeRect.top - rootRect.top - (badge.logoPosition?.y ?? 0),
      width: badgeRect.width, height: badgeRect.height, maxLeft: rootRect.width, maxTop: rootRect.height,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDrag(event: PointerEvent<HTMLSpanElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const minX = -drag.baseLeft;
    const maxX = Math.max(minX, drag.maxLeft - drag.baseLeft - drag.width);
    const minY = -drag.baseTop;
    const maxY = Math.max(minY, drag.maxTop - drag.baseTop - drag.height);
    onPositionChange(drag.id, {
      x: Math.round(Math.max(minX, Math.min(maxX, drag.startX + event.clientX - drag.startClientX))),
      y: Math.round(Math.max(minY, Math.min(maxY, drag.startY + event.clientY - drag.startClientY))),
    });
    event.preventDefault();
  }

  function stopDrag(event: PointerEvent<HTMLSpanElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return <div className="credential-logos" aria-label="Selected certification badges">
    {badges.map((badge) => {
      const size = badge.logoSize ?? 72;
      return <span className="credential-logo" key={badge.id} title={`${badge.name} badge · drag to move`} onPointerDown={(event) => startDrag(event, badge)} onPointerMove={moveDrag} onPointerUp={stopDrag} onPointerCancel={stopDrag} style={{ width: size, height: size, transform: `translate(${badge.logoPosition?.x ?? 0}px, ${badge.logoPosition?.y ?? 0}px)` }}>
        <Image src={badge.logo!} alt={`${badge.name} certification badge`} width={size} height={size} unoptimized draggable={false}/>
      </span>;
    })}
  </div>;
}
