"use client";

import { useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ── Types ─────────────────────────────────────────────────────── */

interface CategoryTab {
  id: string;
  label: string;
  description: string;
}

/* ── Data ──────────────────────────────────────────────────────── */

const CATEGORIES: CategoryTab[] = [
  {
    id: "business-systems",
    label: "BUSINESS SYSTEMS",
    description:
      "Dashboards, ERPs, and operational platforms that centralize your business data and surface what matters.",
  },
  {
    id: "industry-software",
    label: "INDUSTRY SOFTWARE",
    description:
      "Domain-specific tools built around the workflows, regulations, and language of your industry.",
  },
  {
    id: "automation",
    label: "AUTOMATION",
    description:
      "End-to-end workflows that eliminate manual handoffs, reduce errors, and run without supervision.",
  },
  {
    id: "ai-intelligence",
    label: "AI & INTELLIGENCE",
    description:
      "Data pipelines, classification engines, and intelligent systems that learn from your operations.",
  },
  {
    id: "digital-products",
    label: "DIGITAL PRODUCTS",
    description:
      "Customer-facing applications designed for scale, usability, and seamless multi-platform delivery.",
  },
  {
    id: "infrastructure",
    label: "INFRASTRUCTURE",
    description:
      "Cloud-native architectures, CI/CD pipelines, and monitoring systems that keep everything running.",
  },
];

/* ── Visual Panel: Business Systems (Dashboard) ────────────────── */

function BusinessSystemsVisual() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[var(--color-gray-700)] bg-[var(--color-deep-navy)]">
      {/* Title bar */}
      <div
        className="flex items-center gap-2 border-b border-[var(--color-gray-700)] px-4 py-2.5"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-gray-600)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-gray-600)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-gray-600)]" />
        </div>
        <div className="ml-2 flex-1 rounded bg-[var(--color-gray-700)] px-3 py-1">
          <span
            className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            dashboard.bytebuildit.com
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div
          className="hidden w-40 shrink-0 border-r border-[var(--color-gray-700)] p-3 sm:block"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        >
          <div className="mb-3 space-y-1">
            {["Overview", "Orders", "Customers", "Reports", "Settings"].map(
              (item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded px-2 py-1.5 text-[10px] uppercase tracking-wider"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color:
                      i === 0
                        ? "var(--color-accent)"
                        : "var(--color-muted)",
                    backgroundColor:
                      i === 0
                        ? "rgba(46,74,249,0.1)"
                        : "transparent",
                  }}
                >
                  <span
                    className="h-1 w-1 rounded-full"
                    style={{
                      backgroundColor:
                        i === 0
                          ? "var(--color-accent)"
                          : "var(--color-gray-600)",
                    }}
                  />
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {/* Header row */}
          <div className="mb-3 flex items-center justify-between">
            <span
              className="text-xs uppercase tracking-wider text-[var(--color-light)]"
              style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
            >
              Overview
            </span>
            <div className="flex gap-2">
              <span
                className="rounded border border-[var(--color-gray-700)] px-2 py-1 text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                This Week
              </span>
            </div>
          </div>

          {/* Stat cards */}
          <div className="mb-3 grid grid-cols-3 gap-2">
            {[
              { label: "Revenue", value: "$24.8K", delta: "+12%" },
              { label: "Orders", value: "1,247", delta: "+8%" },
              { label: "Active", value: "892", delta: "+3%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded border border-[var(--color-gray-700)] p-2.5"
                style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
              >
                <div
                  className="text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {stat.label}
                </div>
                <div
                  className="mt-1 text-sm font-semibold text-[var(--color-light)]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
                <div
                  className="mt-0.5 text-[9px] uppercase tracking-wider"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: "#34D399",
                  }}
                >
                  {stat.delta}
                </div>
              </div>
            ))}
          </div>

          {/* Chart area placeholder */}
          <div
            className="flex flex-1 items-end gap-1 rounded border border-[var(--color-gray-700)] p-3"
            style={{ backgroundColor: "rgba(0,0,0,0.15)" }}
          >
            {[40, 55, 35, 70, 60, 85, 75, 90, 65, 80, 70, 95].map(
              (h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all"
                  style={{
                    height: `${h}%`,
                    backgroundColor:
                      i === 11
                        ? "var(--color-accent)"
                        : "rgba(46,74,249,0.2)",
                    border: `1px solid ${i === 11 ? "var(--color-accent)" : "rgba(46,74,249,0.15)"}`,
                    borderBottom: "none",
                  }}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Visual Panel: Industry Software (Form Interface) ──────────── */

function IndustrySoftwareVisual() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-lg border border-[var(--color-gray-700)] bg-[var(--color-deep-navy)]">
      {/* Title bar */}
      <div
        className="flex items-center gap-2 border-b border-[var(--color-gray-700)] px-4 py-2.5"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-gray-600)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-gray-600)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-gray-600)]" />
        </div>
        <span
          className="ml-2 text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          New Compliance Record
        </span>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left nav */}
        <div
          className="hidden w-36 shrink-0 border-r border-[var(--color-gray-700)] p-3 sm:block"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        >
          <div
            className="mb-2 text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Sections
          </div>
          <div className="space-y-0.5">
            {["Identity", "Details", "Compliance", "Attachments", "Review"].map(
              (item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 rounded px-2 py-1 text-[10px] uppercase tracking-wider"
                  style={{
                    fontFamily: "var(--font-mono)",
                    color:
                      i === 1
                        ? "var(--color-accent)"
                        : "var(--color-muted)",
                    backgroundColor:
                      i === 1
                        ? "rgba(46,74,249,0.1)"
                        : "transparent",
                  }}
                >
                  <span
                    className="flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[7px]"
                    style={{
                      borderColor:
                        i < 1
                          ? "var(--color-accent)"
                          : i === 1
                            ? "var(--color-accent)"
                            : "var(--color-gray-600)",
                      backgroundColor:
                        i < 1
                          ? "var(--color-accent)"
                          : "transparent",
                      color: i < 1 ? "#fff" : "var(--color-gray-600)",
                    }}
                  >
                    {i < 1 ? "✓" : i + 1}
                  </span>
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* Form content */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="mb-4">
            <div
              className="text-xs uppercase tracking-wider text-[var(--color-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Step 2 of 5 — Details
            </div>
            <div className="mt-1 h-1 w-full rounded-full bg-[var(--color-gray-700)]">
              <div
                className="h-full rounded-full"
                style={{
                  width: "40%",
                  backgroundColor: "var(--color-accent)",
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {/* Field groups */}
            {[
              {
                label: "Facility Name",
                value: "Metro Manufacturing Plant",
              },
              { label: "License Number", value: "LF-2024-0847" },
            ].map((field) => (
              <div key={field.label}>
                <label
                  className="mb-1 block text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {field.label}
                </label>
                <div
                  className="rounded border border-[var(--color-gray-700)] bg-[rgba(0,0,0,0.2)] px-3 py-2 text-xs text-[var(--color-light)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {field.value}
                </div>
              </div>
            ))}

            {/* Dropdown field */}
            <div>
              <label
                className="mb-1 block text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Industry Category
              </label>
              <div className="flex items-center justify-between rounded border border-[var(--color-gray-700)] bg-[rgba(0,0,0,0.2)] px-3 py-2">
                <span
                  className="text-xs text-[var(--color-light)]"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  Manufacturing
                </span>
                <span className="text-[var(--color-muted)]">▾</span>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label
                className="mb-1 block text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Compliance Notes
              </label>
              <div
                className="h-16 rounded border border-[var(--color-gray-700)] bg-[rgba(0,0,0,0.2)] p-3 text-[10px] leading-relaxed text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Annual inspection scheduled for Q3. Outstanding items from
                previous audit...
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-auto flex items-center justify-between pt-4">
            <span
              className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ← Back
            </span>
            <span
              className="rounded bg-[var(--color-accent)] px-4 py-1.5 text-[10px] uppercase tracking-wider text-white"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Continue →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Visual Panel: Automation (Flow Diagram) ───────────────────── */

function AutomationVisual() {
  const nodes = [
    { label: "TRIGGER", x: 8, y: 50 },
    { label: "VALIDATE", x: 30, y: 25 },
    { label: "PROCESS", x: 30, y: 75 },
    { label: "ROUTE", x: 55, y: 50 },
    { label: "EXECUTE", x: 75, y: 30 },
    { label: "NOTIFY", x: 75, y: 70 },
    { label: "COMPLETE", x: 92, y: 50 },
  ];

  const connections: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
  ];

  return (
    <div className="relative flex h-full w-full overflow-hidden rounded-lg border border-[var(--color-gray-700)] bg-[var(--color-deep-navy)]">
      {/* Header */}
      <div
        className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-[var(--color-gray-700)] px-4 py-2.5"
        style={{ backgroundColor: "rgba(11,20,36,0.95)" }}
      >
        <span
          className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Workflow Engine
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span
            className="text-[9px] uppercase tracking-wider text-emerald-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Active
          </span>
        </div>
      </div>

      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-light) 1px, transparent 1px), linear-gradient(90deg, var(--color-light) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* SVG connections */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {connections.map(([from, to], i) => (
          <line
            key={i}
            x1={`${nodes[from].x}%`}
            y1={`${nodes[from].y}%`}
            x2={`${nodes[to].x}%`}
            y2={`${nodes[to].y}%`}
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            opacity="0.35"
            strokeDasharray="4 4"
          />
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <div
          key={node.label}
          className="absolute flex items-center justify-center"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div
            className="flex flex-col items-center gap-1 rounded-lg border px-3 py-2"
            style={{
              backgroundColor:
                i === 0 || i === 6
                  ? "rgba(46,74,249,0.15)"
                  : "rgba(0,0,0,0.4)",
              borderColor:
                i === 0 || i === 6
                  ? "var(--color-accent)"
                  : "var(--color-gray-700)",
            }}
          >
            <span
              className="text-[9px] font-medium uppercase tracking-wider"
              style={{
                fontFamily: "var(--font-mono)",
                color:
                  i === 0 || i === 6
                    ? "var(--color-accent)"
                    : "var(--color-muted)",
              }}
            >
              {node.label}
            </span>
            <div
              className="h-0.5 w-6 rounded-full"
              style={{
                backgroundColor:
                  i === 0 || i === 6
                    ? "var(--color-accent)"
                    : "var(--color-gray-600)",
                opacity: 0.5,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Visual Panel: AI & Intelligence (Pipeline) ────────────────── */

function AiIntelligenceVisual() {
  const stages = [
    {
      label: "INGEST",
      items: ["API Feed", "CSV Upload", "Webhooks", "Database"],
      color: "var(--color-accent)",
    },
    {
      label: "PROCESS",
      items: ["Tokenize", "Normalize", "Embed", "Validate"],
      color: "#8B5CF6",
    },
    {
      label: "ANALYZE",
      items: ["Classify", "Extract", "Score", "Cluster"],
      color: "#EC4899",
    },
    {
      label: "OUTPUT",
      items: ["Reports", "Alerts", "Dashboard", "API"],
      color: "#34D399",
    },
  ];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-[var(--color-gray-700)] bg-[var(--color-deep-navy)]">
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-[var(--color-gray-700)] px-4 py-2.5"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <span
          className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Data Pipeline
        </span>
        <div className="flex items-center gap-3">
          <span
            className="text-[9px] uppercase tracking-wider text-emerald-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            ● Processing
          </span>
          <span
            className="text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            2.4M records
          </span>
        </div>
      </div>

      {/* Pipeline stages */}
      <div className="flex flex-1 items-stretch p-4 sm:p-5">
        <div className="flex w-full items-stretch gap-2 sm:gap-3">
          {stages.map((stage, stageIdx) => (
            <div key={stage.label} className="flex flex-1 items-stretch gap-2 sm:gap-3">
              {/* Stage column */}
              <div className="flex flex-1 flex-col">
                {/* Stage header */}
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: stage.color }}
                  />
                  <span
                    className="text-[9px] font-medium uppercase tracking-wider"
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: stage.color,
                    }}
                  >
                    {stage.label}
                  </span>
                </div>

                {/* Stage items */}
                <div className="flex flex-1 flex-col gap-1.5">
                  {stage.items.map((item, itemIdx) => (
                    <div
                      key={item}
                      className="flex flex-1 items-center rounded border px-2.5 py-1.5"
                      style={{
                        borderColor: "var(--color-gray-700)",
                        backgroundColor:
                          itemIdx === 0 && stageIdx < stages.length - 1
                            ? "rgba(46,74,249,0.08)"
                            : "rgba(0,0,0,0.2)",
                      }}
                    >
                      <span
                        className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector arrow (except after last stage) */}
              {stageIdx < stages.length - 1 && (
                <div className="flex items-center">
                  <svg
                    width="20"
                    height="12"
                    viewBox="0 0 20 12"
                    fill="none"
                    className="shrink-0"
                    aria-hidden="true"
                  >
                    <path
                      d="M0 6H16M16 6L12 2M16 6L12 10"
                      stroke="var(--color-gray-600)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom status bar */}
      <div
        className="flex items-center justify-between border-t border-[var(--color-gray-700)] px-4 py-2"
        style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
      >
        <div className="flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span
            className="text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Latency: 42ms
          </span>
        </div>
        <span
          className="text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Uptime: 99.97%
        </span>
      </div>
    </div>
  );
}

/* ── Visual Panel: Digital Products (Mobile App) ───────────────── */

function DigitalProductsVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* Phone frame */}
      <div
        className="relative flex w-48 flex-col overflow-hidden rounded-[2rem] border-2 border-[var(--color-gray-700)] sm:w-56"
        style={{
          height: "85%",
          maxHeight: "400px",
          backgroundColor: "var(--color-deep-navy)",
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-5 pt-3 pb-1">
          <span
            className="text-[9px] font-medium text-[var(--color-light)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            9:41
          </span>
          <div className="flex items-center gap-1">
            <span className="h-2 w-3 rounded-sm border border-[var(--color-muted)]">
              <span className="block h-full w-[60%] bg-[var(--color-muted)]" />
            </span>
          </div>
        </div>

        {/* Notch */}
        <div className="absolute left-1/2 top-0 h-5 w-20 -translate-x-1/2 rounded-b-2xl bg-black" />

        {/* App header */}
        <div className="px-4 pb-2 pt-2">
          <div
            className="text-xs font-semibold text-[var(--color-light)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            My Dashboard
          </div>
          <div
            className="text-[9px] text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Welcome back
          </div>
        </div>

        {/* Content cards */}
        <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-2">
          {/* Primary stat card */}
          <div
            className="rounded-xl p-3"
            style={{
              background:
                "linear-gradient(135deg, var(--color-accent), #6366F1)",
            }}
          >
            <div
              className="text-[9px] uppercase tracking-wider text-white/70"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Today&apos;s Revenue
            </div>
            <div
              className="mt-1 text-lg font-bold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              $4,280
            </div>
            <div
              className="text-[9px] text-emerald-200"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              ↑ 18% from yesterday
            </div>
          </div>

          {/* Mini stat row */}
          <div className="grid grid-cols-2 gap-2">
            <div
              className="rounded-lg border border-[var(--color-gray-700)] p-2.5"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              <div
                className="text-[8px] uppercase tracking-wider text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Orders
              </div>
              <div
                className="mt-0.5 text-sm font-semibold text-[var(--color-light)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                127
              </div>
            </div>
            <div
              className="rounded-lg border border-[var(--color-gray-700)] p-2.5"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              <div
                className="text-[8px] uppercase tracking-wider text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Pending
              </div>
              <div
                className="mt-0.5 text-sm font-semibold text-[var(--color-light)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                23
              </div>
            </div>
          </div>

          {/* Activity list */}
          <div
            className="flex-1 rounded-lg border border-[var(--color-gray-700)] p-2.5"
            style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
          >
            <div
              className="mb-2 text-[8px] uppercase tracking-wider text-[var(--color-muted)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Recent Activity
            </div>
            {["Order #1247 completed", "New customer signup", "Payment received"].map(
              (activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 border-b border-[var(--color-gray-700)] py-1.5 last:border-b-0"
                >
                  <span
                    className="h-1 w-1 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        i === 0
                          ? "#34D399"
                          : i === 1
                            ? "var(--color-accent)"
                            : "#F59E0B",
                    }}
                  />
                  <span
                    className="text-[9px] text-[var(--color-muted)]"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {activity}
                  </span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom nav */}
        <div
          className="flex items-center justify-around border-t border-[var(--color-gray-700)] px-2 py-2"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          {["◉", "◈", "◎", "◇"].map((icon, i) => (
            <span
              key={i}
              className="text-sm"
              style={{
                color:
                  i === 0
                    ? "var(--color-accent)"
                    : "var(--color-gray-600)",
              }}
            >
              {icon}
            </span>
          ))}
        </div>

        {/* Home indicator */}
        <div className="flex justify-center pb-1.5 pt-0.5">
          <div className="h-1 w-16 rounded-full bg-[var(--color-gray-600)]" />
        </div>
      </div>
    </div>
  );
}

/* ── Visual Panel: Infrastructure (Architecture Diagram) ────────── */

function InfrastructureVisual() {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-lg border border-[var(--color-gray-700)] bg-[var(--color-deep-navy)]">
      {/* Header */}
      <div
        className="flex items-center justify-between border-b border-[var(--color-gray-700)] px-4 py-2.5"
        style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
      >
        <span
          className="text-[10px] uppercase tracking-wider text-[var(--color-muted)]"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          System Architecture
        </span>
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span
            className="text-[9px] uppercase tracking-wider text-emerald-400"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            All Systems Operational
          </span>
        </div>
      </div>

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-light) 0.5px, transparent 0.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Architecture layers */}
      <div className="relative flex flex-1 flex-col gap-3 p-4 sm:p-5">
        {/* Layer: Client */}
        <div className="flex items-center gap-3">
          <span
            className="w-16 shrink-0 text-right text-[8px] uppercase tracking-wider text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            CLIENT
          </span>
          <div className="flex flex-1 gap-2">
            {["Web App", "Mobile", "API Client"].map((item) => (
              <div
                key={item}
                className="flex flex-1 items-center justify-center rounded border border-[var(--color-gray-700)] py-2"
                style={{ backgroundColor: "rgba(46,74,249,0.06)" }}
              >
                <span
                  className="text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connector lines */}
        <div className="flex justify-center">
          <div className="flex gap-16">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-3 w-px"
                style={{ backgroundColor: "var(--color-gray-600)" }}
              />
            ))}
          </div>
        </div>

        {/* Layer: Gateway */}
        <div className="flex items-center gap-3">
          <span
            className="w-16 shrink-0 text-right text-[8px] uppercase tracking-wider text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            GATEWAY
          </span>
          <div
            className="flex flex-1 items-center justify-center rounded border py-2.5"
            style={{
              borderColor: "var(--color-accent)",
              backgroundColor: "rgba(46,74,249,0.1)",
            }}
          >
            <span
              className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-accent)]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              API Gateway · Load Balancer · Auth
            </span>
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="h-3 w-px" style={{ backgroundColor: "var(--color-gray-600)" }} />
        </div>

        {/* Layer: Services */}
        <div className="flex items-center gap-3">
          <span
            className="w-16 shrink-0 text-right text-[8px] uppercase tracking-wider text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            SERVICES
          </span>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {[
              { name: "Core Engine", status: "active" },
              { name: "AI Pipeline", status: "active" },
              { name: "Scheduler", status: "active" },
            ].map((svc) => (
              <div
                key={svc.name}
                className="flex flex-col items-center rounded border border-[var(--color-gray-700)] px-2 py-2"
                style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
              >
                <span className="mb-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span
                  className="text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {svc.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Connector */}
        <div className="flex justify-center">
          <div className="h-3 w-px" style={{ backgroundColor: "var(--color-gray-600)" }} />
        </div>

        {/* Layer: Data */}
        <div className="flex items-center gap-3">
          <span
            className="w-16 shrink-0 text-right text-[8px] uppercase tracking-wider text-[var(--color-muted)]"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            DATA
          </span>
          <div className="grid flex-1 grid-cols-3 gap-2">
            {["PostgreSQL", "Redis", "S3 Storage"].map((db) => (
              <div
                key={db}
                className="flex items-center justify-center rounded border border-[var(--color-gray-700)] py-2"
                style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
              >
                <span
                  className="text-[9px] uppercase tracking-wider text-[var(--color-muted)]"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {db}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monitoring bar */}
        <div
          className="mt-auto flex items-center justify-between rounded border border-[var(--color-gray-700)] px-3 py-2"
          style={{ backgroundColor: "rgba(0,0,0,0.2)" }}
        >
          {[
            { label: "CPU", value: "34%" },
            { label: "Memory", value: "62%" },
            { label: "Disk", value: "41%" },
            { label: "Network", value: "12ms" },
          ].map((metric) => (
            <div key={metric.label} className="flex items-center gap-1.5">
              <span
                className="text-[8px] uppercase tracking-wider text-[var(--color-muted)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {metric.label}
              </span>
              <span
                className="text-[9px] font-medium text-[var(--color-light)]"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {metric.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Visual Panel Map ──────────────────────────────────────────── */

const VISUAL_PANELS: Record<string, React.FC> = {
  "business-systems": BusinessSystemsVisual,
  "industry-software": IndustrySoftwareVisual,
  automation: AutomationVisual,
  "ai-intelligence": AiIntelligenceVisual,
  "digital-products": DigitalProductsVisual,
  infrastructure: InfrastructureVisual,
};

/* ── Component ─────────────────────────────────────────────────── */

export default function WhatWeBuild() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const tabIndicatorRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const activeCategory = CATEGORIES[activeIndex];

  /* ── Tab selection with GSAP crossfade ─────────────────────────── */

  const handleTabSelect = useCallback(
    (index: number) => {
      if (index === activeIndex || isAnimatingRef.current) return;

      const container = visualRef.current;
      if (!container) return;

      isAnimatingRef.current = true;

      const outTl = gsap.timeline({
        onComplete: () => {
          setActiveIndex(index);
        },
      });

      // Animate current panel out
      outTl.to(container, {
        opacity: 0,
        y: 12,
        duration: 0.25,
        ease: "power2.in",
      });
    },
    [activeIndex]
  );

  /* ── Animate new panel in after state update ──────────────────── */

  useGSAP(
    () => {
      const container = visualRef.current;
      if (!container) return;

      // Animate new panel in
      gsap.fromTo(
        container,
        { opacity: 0, y: -12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power3.out",
          onComplete: () => {
            isAnimatingRef.current = false;
          },
        }
      );
    },
    { scope: sectionRef, dependencies: [activeIndex] }
  );

  /* ── Tab indicator position ───────────────────────────────────── */

  useGSAP(
    () => {
      const indicator = tabIndicatorRef.current;
      const tabsContainer = sectionRef.current?.querySelector(
        "[data-tabs-container]"
      );
      if (!indicator || !tabsContainer) return;

      const tabs = tabsContainer.querySelectorAll<HTMLElement>("[data-tab]");
      const activeTab = tabs[activeIndex];
      if (!activeTab) return;

      gsap.to(indicator, {
        x: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
        duration: 0.35,
        ease: "power3.out",
      });
    },
    { scope: sectionRef, dependencies: [activeIndex] }
  );

  /* ── Scroll-triggered entrance ─────────────────────────────────── */

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // Section number
      const sectionNumber = section.querySelector("[data-section-number]");
      if (sectionNumber) {
        gsap.fromTo(
          sectionNumber,
          { opacity: 0, x: -12 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Headline
      const headline = section.querySelector("[data-headline]");
      if (headline) {
        gsap.fromTo(
          headline,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Tabs
      const tabs = section.querySelectorAll("[data-tab]");
      if (tabs.length) {
        gsap.fromTo(
          tabs,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.05,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Visual container
      const visual = section.querySelector("[data-visual]");
      if (visual) {
        gsap.fromTo(
          visual,
          { opacity: 0, y: 30, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: visual,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Description
      const desc = section.querySelector("[data-description]");
      if (desc) {
        gsap.fromTo(
          desc,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: desc,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  const ActiveVisual = VISUAL_PANELS[activeCategory.id];

  return (
    <section
      ref={sectionRef}
      className="section relative overflow-hidden"
      style={{ backgroundColor: "var(--color-primary)" }}
      aria-label="What We Build"
    >
      {/* Subtle grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--color-light) 0.5px, transparent 0.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-[var(--container-max)] px-6 md:px-8 xl:px-12">
        {/* ── Section Header ──────────────────────────────── */}
        <div className="mb-10 md:mb-14">
          <span
            data-section-number
            className="mb-4 inline-block"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            04
          </span>

          <h2
            data-headline
            className="mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-light)",
              letterSpacing: "-0.03em",
            }}
          >
            FROM WORKFLOW{" "}
            <span style={{ color: "var(--color-accent)" }}>TO SOFTWARE.</span>
          </h2>
        </div>

        {/* ── Tab Bar ─────────────────────────────────────── */}
        <div className="relative mb-8 md:mb-10">
          {/* Scroll container for mobile */}
          <div
            data-tabs-container
            className="no-scrollbar flex gap-1 overflow-x-auto pb-1"
          >
            {/* Animated indicator background */}
            <div
              ref={tabIndicatorRef}
              className="absolute bottom-0 left-0 h-px rounded-full"
              style={{
                backgroundColor: "var(--color-accent)",
              }}
            />

            {CATEGORIES.map((cat, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={cat.id}
                  data-tab
                  type="button"
                  onClick={() => handleTabSelect(i)}
                  className="relative shrink-0 px-4 py-3 text-left transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: isActive
                      ? "var(--color-accent)"
                      : "var(--color-muted)",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-light)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--color-muted)";
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Tab bar bottom border */}
          <div
            className="h-px w-full"
            style={{ backgroundColor: "var(--color-gray-700)" }}
          />
        </div>

        {/* ── Visual Area ─────────────────────────────────── */}
        <div
          ref={visualRef}
          data-visual
          className="relative overflow-hidden rounded-xl border"
          style={{
            height: "clamp(320px, 45vh, 480px)",
            borderColor: "var(--color-gray-700)",
          }}
        >
          <ActiveVisual />
        </div>

        {/* ── Description ─────────────────────────────────── */}
        <div data-description className="mt-6 md:mt-8">
          <p
            className="max-w-2xl text-base leading-relaxed md:text-lg"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--color-muted)",
            }}
          >
            {activeCategory.description}
          </p>
        </div>
      </div>
    </section>
  );
}
