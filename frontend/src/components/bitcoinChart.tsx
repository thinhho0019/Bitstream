"use client";
import React, { memo, useEffect, useRef } from "react";
import { Bitcoin } from "../types/bitcoins";

function BitcoinChart({containerRef}: {containerRef: React.RefObject<HTMLDivElement>}) {
  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div id="tradingview_1" />
    </div>
  );
}

export default memo(BitcoinChart);