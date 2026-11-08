/**
 * SCOUT-JS - CommonJS Distribution Build
 * Generated automatically. Do not edit manually.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

// Pre-inlined UI Assets
const cssContent = "/**\n * SCOUT-JS - Perk Theme\n * Electric Lime on Warm Parchment Paper\n * Editorial product design feel. Single chromatic charge (#beff50) against parchment & off-black.\n */\n\n:root {\n  /* Perk Color Tokens */\n  --color-electric-lime: #beff50;\n  --color-off-black-ink: #14140f;\n  --color-off-white-canvas: #f5f5eb;\n  --color-pure-white: #ffffff;\n  --color-ash: #d2d2c8;\n  --color-graphite: #6e6e64;\n  --color-deep-charcoal: #30302a;\n  --color-stone: #919183;\n  --color-smoke: #b9b9b7;\n\n  /* Typography */\n  --font-otsono: 'OTSono', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace;\n\n  /* Theme mappings (Light - Primary Perk) */\n  --bg-page: var(--color-pure-white);\n  --bg-parchment: var(--color-off-white-canvas);\n  --bg-card: var(--color-pure-white);\n  --bg-topbar: var(--color-off-black-ink);\n  --text-topbar: var(--color-off-white-canvas);\n  --text-primary: var(--color-off-black-ink);\n  --text-secondary: var(--color-graphite);\n  --text-muted: var(--color-stone);\n  --border-color: var(--color-ash);\n  --border-subtle: #e5e5dc;\n  \n  --accent-lime: var(--color-electric-lime);\n  --accent-lime-hover: #b0f53d;\n  --dark-island: var(--color-deep-charcoal);\n\n  /* Radii */\n  --radius-tags: 9999px;\n  --radius-cards: 28px;\n  --radius-inner: 18px;\n  --radius-pills: 9999px;\n  --radius-inputs: 8px;\n  --radius-buttons: 28px;\n}\n\n[data-theme=\"dark\"] {\n  --bg-page: #12120e;\n  --bg-parchment: var(--color-deep-charcoal);\n  --bg-card: #22221c;\n  --bg-topbar: #0a0a07;\n  --text-topbar: var(--color-off-white-canvas);\n  --text-primary: var(--color-off-white-canvas);\n  --text-secondary: #a8a89c;\n  --text-muted: #78786c;\n  --border-color: #3d3d34;\n  --border-subtle: #2b2b24;\n  \n  --dark-island: #0a0a08;\n}\n\n* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n\nbody {\n  font-family: var(--font-otsono);\n  background-color: var(--bg-page);\n  color: var(--text-primary);\n  line-height: 1.5;\n  min-height: 100vh;\n  -webkit-font-smoothing: antialiased;\n}\n\n/* Topbar Header */\n.topbar {\n  background-color: var(--bg-topbar);\n  color: var(--text-topbar);\n  padding: 0.85rem 2rem;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  position: sticky;\n  top: 0;\n  z-index: 50;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n}\n\n.topbar-brand {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  font-size: 1.15rem;\n  font-weight: 500;\n  letter-spacing: -0.02em;\n}\n\n.topbar-brand-pill {\n  background-color: var(--accent-lime);\n  color: var(--color-off-black-ink);\n  font-size: 0.75rem;\n  font-weight: 500;\n  padding: 0.2rem 0.65rem;\n  border-radius: var(--radius-pills);\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n}\n\n.topbar-actions {\n  display: flex;\n  align-items: center;\n  gap: 0.85rem;\n}\n\n.topbar-btn {\n  background: transparent;\n  color: var(--text-topbar);\n  border: 1px solid var(--border-color);\n  padding: 0.4rem 1rem;\n  border-radius: var(--radius-buttons);\n  font-size: 0.85rem;\n  font-weight: 500;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  gap: 0.4rem;\n  transition: all 0.15s ease;\n  text-decoration: none;\n}\n.topbar-btn:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: #ffffff;\n}\n\n.btn-authorize {\n  background-color: var(--accent-lime);\n  color: var(--color-off-black-ink);\n  border: none;\n  font-weight: 500;\n  padding: 0.45rem 1.25rem;\n}\n.btn-authorize:hover {\n  background-color: var(--accent-lime-hover);\n  border-color: transparent;\n}\n\n/* Page Layout */\n.container {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 3rem 1.5rem 6rem;\n}\n\n/* Info Banner - Warm Parchment Card */\n.info-banner {\n  background: var(--bg-parchment);\n  border-radius: var(--radius-cards);\n  padding: 2.5rem 3rem;\n  margin-bottom: 2.5rem;\n  border: 1px solid var(--border-color);\n}\n\n.info-eyebrow {\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-weight: 500;\n  color: var(--text-secondary);\n  margin-bottom: 0.75rem;\n}\n\n.info-title-row {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n\n.info-title {\n  font-size: 40px;\n  font-weight: 500;\n  line-height: 1;\n  letter-spacing: -0.03em;\n  color: var(--text-primary);\n}\n\n.version-chip {\n  background: var(--accent-lime);\n  color: var(--color-off-black-ink);\n  font-size: 12px;\n  font-weight: 500;\n  padding: 0.3rem 0.8rem;\n  border-radius: var(--radius-pills);\n  letter-spacing: 0.05em;\n}\n\n.oas-chip {\n  font-size: 11px;\n  font-family: var(--font-mono);\n  background: var(--color-pure-white);\n  color: var(--text-secondary);\n  border: 1px solid var(--border-color);\n  padding: 0.25rem 0.6rem;\n  border-radius: var(--radius-pills);\n}\n\n.spec-link {\n  color: var(--text-primary);\n  text-decoration: none;\n  font-size: 14px;\n  font-weight: 500;\n  border-bottom: 1px solid var(--text-primary);\n  padding-bottom: 1px;\n  transition: opacity 0.15s;\n}\n.spec-link:hover {\n  opacity: 0.7;\n}\n\n.info-description {\n  margin-top: 1.25rem;\n  color: var(--text-secondary);\n  font-size: 16px;\n  line-height: 1.5;\n  max-width: 800px;\n}\n\n.server-selector {\n  margin-top: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  font-size: 14px;\n}\n\n.server-select {\n  padding: 0.5rem 1rem;\n  border: 1px solid var(--border-color);\n  background: var(--color-pure-white);\n  color: var(--text-primary);\n  border-radius: var(--radius-inputs);\n  font-family: var(--font-otsono);\n  font-size: 14px;\n  outline: none;\n}\n\n/* Filter Bar */\n.filter-container {\n  margin-bottom: 2rem;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n\n.filter-input {\n  flex: 1;\n  min-width: 280px;\n  max-width: 440px;\n  padding: 0.75rem 1.25rem;\n  border: 1px solid var(--border-color);\n  background: var(--color-pure-white);\n  color: var(--text-primary);\n  border-radius: var(--radius-buttons);\n  font-family: var(--font-otsono);\n  font-size: 14px;\n  outline: none;\n  transition: border-color 0.15s;\n}\n.filter-input:focus {\n  border-color: var(--color-off-black-ink);\n}\n\n.filter-controls {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n}\n\n.filter-btn {\n  background: var(--color-pure-white);\n  border: 1px solid var(--border-color);\n  color: var(--text-secondary);\n  font-family: var(--font-otsono);\n  font-size: 13px;\n  font-weight: 500;\n  padding: 0.6rem 1.1rem;\n  border-radius: var(--radius-buttons);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.filter-btn:hover {\n  background: var(--bg-parchment);\n  color: var(--text-primary);\n  border-color: var(--color-off-black-ink);\n}\n\n.op-anchor {\n  color: var(--text-muted);\n  text-decoration: none;\n  font-family: var(--font-mono);\n  font-weight: 600;\n  font-size: 14px;\n  opacity: 0.4;\n  margin-right: 0.35rem;\n  transition: opacity 0.15s, color 0.15s;\n}\n.op-anchor:hover {\n  opacity: 1;\n  color: var(--text-primary);\n}\n\n/* Tag Section - Parchment Surface */\n.tag-section {\n  background: var(--bg-parchment);\n  border-radius: var(--radius-cards);\n  border: 1px solid var(--border-color);\n  padding: 1.75rem 2rem;\n  margin-bottom: 2rem;\n}\n\n.tag-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  cursor: pointer;\n  user-select: none;\n  padding-bottom: 0.75rem;\n}\n\n.tag-title-wrap {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n}\n\n.tag-title {\n  font-size: 24px;\n  font-weight: 500;\n  letter-spacing: -0.02em;\n  color: var(--text-primary);\n}\n\n.tag-count {\n  font-size: 11px;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  font-weight: 500;\n  background: var(--color-pure-white);\n  border: 1px solid var(--border-color);\n  padding: 0.2rem 0.65rem;\n  border-radius: var(--radius-pills);\n  color: var(--text-secondary);\n}\n\n.tag-chevron {\n  font-size: 14px;\n  color: var(--text-secondary);\n  transition: transform 0.2s ease;\n}\n\n.tag-section.collapsed .tag-chevron {\n  transform: rotate(-90deg);\n}\n\n.tag-section.collapsed .operations-list {\n  display: none;\n}\n\n.operations-list {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n\n/* Operation Card (Pure White Surface Card with 18px radius) */\n.op-card {\n  background: var(--color-pure-white);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-inner);\n  overflow: hidden;\n  transition: border-color 0.15s ease;\n}\n.op-card:hover {\n  border-color: var(--color-off-black-ink);\n}\n\n/* Method Accent Indicators - Editorial Minimalist */\n.op-header {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0.85rem 1.25rem;\n  cursor: pointer;\n  user-select: none;\n}\n\n.op-header-left {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  flex: 1;\n}\n\n/* Method Badges - Pill Treatment */\n.op-badge {\n  font-size: 11px;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  padding: 0.3rem 0.85rem;\n  border-radius: var(--radius-pills);\n  min-width: 65px;\n  text-align: center;\n  background: var(--bg-parchment);\n  color: var(--color-off-black-ink);\n  border: 1px solid var(--border-color);\n}\n\n/* Subtle chromatic accents on methods */\n.op-get .op-badge {\n  background: #eef4ff;\n  border-color: #c7d9fc;\n  color: #1e40af;\n}\n.op-post .op-badge {\n  background: #f0fdf4;\n  border-color: #bbf7d0;\n  color: #15803d;\n}\n.op-put .op-badge {\n  background: #fffbeb;\n  border-color: #fde68a;\n  color: #b45309;\n}\n.op-delete .op-badge {\n  background: #fef2f2;\n  border-color: #fecaca;\n  color: #b91c1c;\n}\n.op-patch .op-badge {\n  background: #faf5ff;\n  border-color: #e9d5ff;\n  color: #7e22ce;\n}\n\n.op-path {\n  font-family: var(--font-mono);\n  font-size: 15px;\n  font-weight: 500;\n  color: var(--text-primary);\n}\n\n.op-summary {\n  font-size: 14px;\n  color: var(--text-secondary);\n  margin-left: 0.5rem;\n}\n\n.op-chevron {\n  font-size: 12px;\n  color: var(--text-muted);\n  transition: transform 0.2s ease;\n}\n\n.op-card:not(.expanded) .op-chevron {\n  transform: rotate(-90deg);\n}\n\n.op-card:not(.expanded) .op-content {\n  display: none;\n}\n\n/* Expanded Operation Details */\n.op-content {\n  border-top: 1px solid var(--border-subtle);\n  padding: 1.5rem 1.75rem;\n  background: var(--color-pure-white);\n}\n\n.op-action-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 1.5rem;\n  padding-bottom: 1rem;\n  border-bottom: 1px solid var(--border-subtle);\n}\n\n.op-desc {\n  font-size: 14px;\n  color: var(--text-secondary);\n  line-height: 1.5;\n}\n\n/* Ghost Pill Button for \"Try it out\" */\n.btn-try {\n  background: var(--bg-parchment);\n  border: 1px solid var(--border-color);\n  color: var(--text-primary);\n  font-family: var(--font-otsono);\n  font-size: 13px;\n  font-weight: 500;\n  padding: 0.45rem 1.25rem;\n  border-radius: var(--radius-buttons);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.btn-try:hover {\n  background: var(--color-pure-white);\n  border-color: var(--color-off-black-ink);\n}\n.btn-try.active {\n  background: var(--color-off-black-ink);\n  color: var(--color-off-white-canvas);\n  border-color: var(--color-off-black-ink);\n}\n\n.op-section-title {\n  font-size: 11px;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  color: var(--text-secondary);\n  margin-bottom: 0.85rem;\n}\n\n/* Editorial Parameters Table */\n.swagger-table {\n  width: 100%;\n  border-collapse: collapse;\n  margin-bottom: 1.75rem;\n}\n\n.swagger-table th {\n  text-align: left;\n  font-size: 11px;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  color: var(--text-muted);\n  border-bottom: 1px solid var(--border-color);\n  padding: 0.6rem 0.75rem;\n}\n\n.swagger-table td {\n  padding: 0.85rem 0.75rem;\n  border-bottom: 1px solid var(--border-subtle);\n  vertical-align: top;\n  font-size: 14px;\n}\n\n.param-col-name {\n  width: 30%;\n}\n\n.param-name-txt {\n  font-family: var(--font-mono);\n  font-weight: 500;\n  color: var(--text-primary);\n  font-size: 13px;\n}\n\n.param-required-tag {\n  color: #b91c1c;\n  font-size: 11px;\n  margin-left: 0.35rem;\n  font-family: var(--font-otsono);\n}\n\n.param-meta {\n  font-size: 12px;\n  color: var(--text-muted);\n  margin-top: 0.25rem;\n}\n\n.param-col-val {\n  width: 70%;\n}\n\n/* Form Inputs */\n.param-input-field {\n  width: 100%;\n  max-width: 440px;\n  padding: 0.55rem 0.85rem;\n  border: 1px solid var(--border-color);\n  background: var(--color-pure-white);\n  color: var(--text-primary);\n  border-radius: var(--radius-inputs);\n  font-family: var(--font-mono);\n  font-size: 13px;\n  outline: none;\n  transition: border-color 0.15s ease;\n}\n.param-input-field:focus {\n  border-color: var(--color-off-black-ink);\n}\n.param-input-field:disabled {\n  background: var(--bg-parchment);\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n\n/* Request Body Textarea */\n.body-container {\n  margin-bottom: 1.75rem;\n}\n\n.body-textarea {\n  width: 100%;\n  min-height: 120px;\n  padding: 0.85rem;\n  font-family: var(--font-mono);\n  font-size: 13px;\n  border: 1px solid var(--border-color);\n  background: var(--color-pure-white);\n  color: var(--text-primary);\n  border-radius: var(--radius-inputs);\n  outline: none;\n  resize: vertical;\n}\n.body-textarea:focus {\n  border-color: var(--color-off-black-ink);\n}\n.body-textarea:disabled {\n  background: var(--bg-parchment);\n  cursor: not-allowed;\n  opacity: 0.7;\n}\n\n/* Execute Button Bar (Primary Lime Action) */\n.execute-bar {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n  margin: 1.5rem 0;\n}\n\n.btn-execute {\n  background: var(--accent-lime);\n  color: var(--color-off-black-ink);\n  border: none;\n  padding: 0.65rem 2.25rem;\n  border-radius: var(--radius-buttons);\n  font-family: var(--font-otsono);\n  font-weight: 500;\n  font-size: 15px;\n  cursor: pointer;\n  transition: background 0.15s ease;\n}\n.btn-execute:hover {\n  background: var(--accent-lime-hover);\n}\n.btn-execute:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.btn-clear {\n  background: transparent;\n  border: 1px solid var(--border-color);\n  color: var(--text-secondary);\n  padding: 0.65rem 1.25rem;\n  border-radius: var(--radius-buttons);\n  font-family: var(--font-otsono);\n  font-size: 14px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.btn-clear:hover {\n  border-color: var(--color-off-black-ink);\n  color: var(--text-primary);\n}\n\n/* Dark Island Box for Live Execution Responses */\n.live-response-box {\n  background: var(--dark-island);\n  color: var(--color-off-white-canvas);\n  border-radius: var(--radius-inner);\n  padding: 1.5rem;\n  margin-top: 1.5rem;\n}\n\n.live-response-title {\n  font-weight: 500;\n  font-size: 14px;\n  letter-spacing: -0.01em;\n  margin-bottom: 0.75rem;\n  color: var(--accent-lime);\n}\n\n.live-code-block {\n  background: #14140f;\n  color: var(--color-off-white-canvas);\n  padding: 1rem;\n  border-radius: var(--radius-inputs);\n  font-family: var(--font-mono);\n  font-size: 12px;\n  overflow-x: auto;\n  white-space: pre;\n  position: relative;\n  margin-bottom: 1rem;\n  border: 1px solid rgba(255, 255, 255, 0.08);\n}\n\n.copy-btn {\n  position: absolute;\n  top: 0.65rem;\n  right: 0.65rem;\n  background: rgba(255, 255, 255, 0.1);\n  color: var(--color-off-white-canvas);\n  border: none;\n  padding: 0.25rem 0.6rem;\n  border-radius: var(--radius-pills);\n  font-size: 11px;\n  font-family: var(--font-otsono);\n  cursor: pointer;\n}\n.copy-btn:hover {\n  background: rgba(255, 255, 255, 0.2);\n}\n\n/* Multi-Language Code Snippets */\n.snippets-section {\n  margin-top: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n\n.snippet-lang-tabs {\n  display: flex;\n  gap: 0.35rem;\n  background: var(--bg-parchment);\n  padding: 0.25rem;\n  border-radius: var(--radius-buttons);\n  border: 1px solid var(--border-color);\n}\n\n.snippet-tab-btn {\n  background: transparent;\n  border: none;\n  font-family: var(--font-otsono);\n  font-size: 12px;\n  font-weight: 500;\n  color: var(--text-secondary);\n  padding: 0.35rem 0.75rem;\n  border-radius: var(--radius-buttons);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n\n.snippet-tab-btn:hover {\n  color: var(--text-primary);\n}\n\n.snippet-tab-btn.active {\n  background: var(--color-pure-white);\n  color: var(--text-primary);\n  font-weight: 600;\n  border: 1px solid var(--border-color);\n}\n\n[data-theme=\"dark\"] .snippet-tab-btn.active {\n  background: #2b2b24;\n  color: var(--color-off-white-canvas);\n}\n\n.snippet-block {\n  min-height: 80px;\n}\n\n.snippet-code-content {\n  font-family: var(--font-mono);\n  font-size: 12.5px;\n  line-height: 1.5;\n  white-space: pre-wrap;\n  word-break: break-all;\n  color: var(--color-off-white-canvas);\n}\n\n.status-indicator {\n  display: inline-block;\n  font-weight: 500;\n  font-size: 12px;\n  padding: 0.25rem 0.75rem;\n  border-radius: var(--radius-pills);\n  margin-bottom: 0.75rem;\n}\n.status-2xx {\n  background: var(--accent-lime);\n  color: var(--color-off-black-ink);\n}\n.status-4xx, .status-5xx {\n  background: #fecaca;\n  color: #991b1b;\n}\n\n/* Schemas Accordion (Parchment Card) */\n.schemas-container {\n  margin-top: 3.5rem;\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-cards);\n  background: var(--bg-parchment);\n  overflow: hidden;\n}\n\n.schemas-header {\n  padding: 1.25rem 2rem;\n  font-weight: 500;\n  font-size: 18px;\n  letter-spacing: -0.02em;\n  cursor: pointer;\n  user-select: none;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  border-bottom: 1px solid var(--border-color);\n}\n\n.schemas-content {\n  padding: 1.5rem 2rem;\n}\n.schemas-container.collapsed .schemas-content {\n  display: none;\n}\n\n/* Authorize Modal - Dark Island Treatment */\n.modal-overlay {\n  display: none;\n  position: fixed;\n  inset: 0;\n  background: rgba(20, 20, 15, 0.7);\n  z-index: 100;\n  align-items: center;\n  justify-content: center;\n}\n.modal-overlay.open {\n  display: flex;\n}\n\n.modal-card {\n  background: var(--color-pure-white);\n  border: 1px solid var(--border-color);\n  border-radius: var(--radius-cards);\n  width: 90%;\n  max-width: 520px;\n  overflow: hidden;\n}\n\n.modal-header {\n  padding: 1.25rem 1.75rem;\n  border-bottom: 1px solid var(--border-color);\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-weight: 500;\n  font-size: 18px;\n}\n\n.modal-body {\n  padding: 1.75rem;\n}\n\n.modal-footer {\n  padding: 1rem 1.75rem;\n  background: var(--bg-parchment);\n  border-top: 1px solid var(--border-color);\n  display: flex;\n  justify-content: flex-end;\n  gap: 0.75rem;\n}\n\n/* Secured Badge */\n.sec-badge {\n  font-size: 10px;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.1em;\n  padding: 0.2rem 0.55rem;\n  border-radius: var(--radius-pills);\n  background: var(--color-deep-charcoal);\n  color: var(--color-electric-lime);\n  margin-left: 0.35rem;\n}\n\n/* Tabs: Example Value vs Schema */\n.tab-header {\n  display: flex;\n  gap: 0.35rem;\n  background: var(--bg-parchment);\n  padding: 0.2rem;\n  border-radius: var(--radius-pills);\n  border: 1px solid var(--border-color);\n}\n\n.tab-btn {\n  background: transparent;\n  border: none;\n  font-family: var(--font-otsono);\n  font-size: 11px;\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.05em;\n  padding: 0.25rem 0.75rem;\n  border-radius: var(--radius-pills);\n  color: var(--text-secondary);\n  cursor: pointer;\n  transition: all 0.15s ease;\n}\n.tab-btn.active {\n  background: var(--color-pure-white);\n  color: var(--color-off-black-ink);\n}\n\n/* Schema Code Block */\n.schema-code-block {\n  background: var(--bg-parchment);\n  color: var(--color-off-black-ink);\n  padding: 0.85rem 1rem;\n  border-radius: var(--radius-inputs);\n  font-family: var(--font-mono);\n  font-size: 13px;\n  line-height: 1.5;\n  border: 1px solid var(--border-color);\n  overflow-x: auto;\n  white-space: pre-wrap;\n}\n\n/* Status Pill in Responses Table */\n.status-pill {\n  display: inline-block;\n  font-family: var(--font-mono);\n  font-size: 12px;\n  font-weight: 500;\n  padding: 0.25rem 0.65rem;\n  border-radius: var(--radius-pills);\n}\n.status-pill-2xx {\n  background: #f0fdf4;\n  color: #15803d;\n  border: 1px solid #bbf7d0;\n}\n.status-pill-err {\n  background: #fef2f2;\n  color: #b91c1c;\n  border: 1px solid #fecaca;\n}\n";
const jsContent = "/**\n * FastAPI / Swagger UI Interactive Engine for SCOUT-JS.\n * Pure Vanilla JavaScript. Zero external CDNs.\n */\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  // Global auth state\n  let globalAuthToken = localStorage.getItem('scout_auth_token') || '';\n\n  // 1. Theme Management (Light / Dark)\n  const themeToggle = document.getElementById('theme-toggle');\n  const storedTheme = localStorage.getItem('scout_theme') || 'light';\n  document.documentElement.setAttribute('data-theme', storedTheme);\n  if (themeToggle) {\n    themeToggle.textContent = 'Theme: ' + (storedTheme === 'dark' ? 'Light' : 'Dark');\n    themeToggle.addEventListener('click', () => {\n      const current = document.documentElement.getAttribute('data-theme');\n      const next = current === 'dark' ? 'light' : 'dark';\n      document.documentElement.setAttribute('data-theme', next);\n      localStorage.setItem('scout_theme', next);\n      themeToggle.textContent = 'Theme: ' + (next === 'dark' ? 'Light' : 'Dark');\n    });\n  }\n\n  // 2. Authorize Modal\n  const authModal = document.getElementById('auth-modal');\n  const authBtn = document.getElementById('btn-authorize');\n  const authClose = document.getElementById('auth-close');\n  const authSave = document.getElementById('auth-save');\n  const authInput = document.getElementById('auth-token-input');\n\n  if (authInput && globalAuthToken) {\n    authInput.value = globalAuthToken;\n    if (authBtn) authBtn.textContent = 'Authorized';\n  }\n\n  if (authBtn && authModal) {\n    authBtn.addEventListener('click', () => {\n      authModal.classList.add('open');\n    });\n  }\n\n  if (authClose && authModal) {\n    authClose.addEventListener('click', () => {\n      authModal.classList.remove('open');\n    });\n  }\n\n  if (authSave && authModal && authInput) {\n    authSave.addEventListener('click', () => {\n      globalAuthToken = authInput.value.trim();\n      localStorage.setItem('scout_auth_token', globalAuthToken);\n      authModal.classList.remove('open');\n      if (authBtn) {\n        authBtn.textContent = globalAuthToken ? 'Authorized' : 'Authorize';\n      }\n      if (typeof updateAllSnippets === 'function') {\n        updateAllSnippets();\n      }\n    });\n  }\n\n  // 3. Tag Section Expand / Collapse\n  document.querySelectorAll('.tag-header').forEach(header => {\n    header.addEventListener('click', () => {\n      const section = header.closest('.tag-section');\n      if (section) {\n        section.classList.toggle('collapsed');\n      }\n    });\n  });\n\n  // 4. Operation Card Expand / Collapse\n  document.querySelectorAll('.op-header').forEach(header => {\n    header.addEventListener('click', (e) => {\n      if (e.target.closest('.op-anchor')) return; // Don't toggle on anchor click\n      const card = header.closest('.op-card');\n      if (card) {\n        card.classList.toggle('expanded');\n      }\n    });\n  });\n\n  // 4b. Global Expand All / Collapse All Controls\n  const btnExpandAll = document.getElementById('btn-expand-all');\n  const btnCollapseAll = document.getElementById('btn-collapse-all');\n\n  if (btnExpandAll) {\n    btnExpandAll.addEventListener('click', () => {\n      document.querySelectorAll('.tag-section').forEach(s => s.classList.remove('collapsed'));\n      document.querySelectorAll('.op-card').forEach(c => c.classList.add('expanded'));\n    });\n  }\n\n  if (btnCollapseAll) {\n    btnCollapseAll.addEventListener('click', () => {\n      document.querySelectorAll('.op-card').forEach(c => c.classList.remove('expanded'));\n    });\n  }\n\n  // 4c. Deep Linking / Hash Navigation\n  function handleHashNavigation() {\n    const hash = window.location.hash.replace('#', '');\n    if (!hash) return;\n    const targetCard = document.getElementById(hash);\n    if (targetCard && targetCard.classList.contains('op-card')) {\n      const parentSection = targetCard.closest('.tag-section');\n      if (parentSection) parentSection.classList.remove('collapsed');\n      targetCard.classList.add('expanded');\n      targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });\n    }\n  }\n\n  window.addEventListener('hashchange', handleHashNavigation);\n  setTimeout(handleHashNavigation, 100);\n\n  // 5. Schemas Section Toggle\n  const schemasHeader = document.querySelector('.schemas-header');\n  if (schemasHeader) {\n    schemasHeader.addEventListener('click', () => {\n      const container = schemasHeader.closest('.schemas-container');\n      if (container) {\n        container.classList.toggle('collapsed');\n      }\n    });\n  }\n\n  // 6. Fast Real-Time Filter\n  const filterInput = document.getElementById('filter-input');\n  if (filterInput) {\n    filterInput.addEventListener('input', (e) => {\n      const query = e.target.value.toLowerCase().trim();\n      const sections = document.querySelectorAll('.tag-section');\n\n      sections.forEach(section => {\n        let visibleOps = 0;\n        const ops = section.querySelectorAll('.op-card');\n\n        ops.forEach(op => {\n          const path = (op.getAttribute('data-path') || '').toLowerCase();\n          const method = (op.getAttribute('data-method') || '').toLowerCase();\n          const summary = (op.getAttribute('data-summary') || '').toLowerCase();\n\n          const matches = path.includes(query) || method.includes(query) || summary.includes(query);\n          op.style.display = matches ? 'block' : 'none';\n          if (matches) visibleOps++;\n        });\n\n        section.style.display = visibleOps > 0 ? 'block' : 'none';\n      });\n    });\n  }\n\n  // 7. \"Try it out\" / \"Cancel\" Handler\n  document.querySelectorAll('.btn-try').forEach(btn => {\n    btn.addEventListener('click', (e) => {\n      e.stopPropagation();\n      const card = btn.closest('.op-card');\n      if (!card) return;\n\n      const isTrying = btn.classList.toggle('active');\n      btn.textContent = isTrying ? 'Cancel' : 'Try it out';\n\n      // Toggle input fields\n      const inputs = card.querySelectorAll('.param-input-field, .body-textarea');\n      inputs.forEach(input => {\n        input.disabled = !isTrying;\n      });\n\n      // Pre-fill body textarea with placeholder JSON if empty\n      const bodyTextarea = card.querySelector('.body-textarea');\n      if (isTrying && bodyTextarea && !bodyTextarea.value.trim()) {\n        const ph = bodyTextarea.getAttribute('placeholder');\n        if (ph && ph !== '{}') {\n          bodyTextarea.value = ph;\n        }\n      }\n\n      // Show/hide execute bar\n      const executeBar = card.querySelector('.execute-bar');\n      if (executeBar) {\n        executeBar.style.display = isTrying ? 'flex' : 'none';\n      }\n    });\n  });\n\n  // 8. Execute Request (Playground Execution)\n  document.querySelectorAll('.btn-execute').forEach(btn => {\n    btn.addEventListener('click', async () => {\n      const card = btn.closest('.op-card');\n      if (!card) return;\n\n      const method = card.getAttribute('data-method').toUpperCase();\n      let rawPath = card.getAttribute('data-path');\n\n      // Security Warning on non-localhost for mutating methods\n      const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';\n      if (isProduction && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {\n        const proceed = confirm(`Warning: You are about to send a mutating ${method} request to ${window.location.host}. Do you want to continue?`);\n        if (!proceed) return;\n      }\n\n      // Check required path parameters\n      let missingParam = false;\n      const pathInputs = card.querySelectorAll('.param-input-path');\n      pathInputs.forEach(input => {\n        const paramName = input.getAttribute('data-param');\n        const val = input.value.trim();\n        if (!val) {\n          input.style.borderColor = '#f93e3e';\n          missingParam = true;\n        } else {\n          input.style.borderColor = '';\n          rawPath = rawPath.replace(`{${paramName}}`, encodeURIComponent(val));\n        }\n      });\n\n      if (missingParam) {\n        alert('Please fill in all required path parameters before executing.');\n        return;\n      }\n\n      // Query parameters\n      const queryInputs = card.querySelectorAll('.param-input-query');\n      const queryParams = new URLSearchParams();\n      queryInputs.forEach(input => {\n        const paramName = input.getAttribute('data-param');\n        const val = input.value.trim();\n        if (val) queryParams.append(paramName, val);\n      });\n      const queryString = queryParams.toString();\n      const finalUrl = rawPath + (queryString ? `?${queryString}` : '');\n\n      // Headers\n      const headers = { 'Accept': 'application/json' };\n      if (globalAuthToken) {\n        headers['Authorization'] = globalAuthToken.startsWith('Bearer ') || globalAuthToken.startsWith('Basic ')\n          ? globalAuthToken \n          : `Bearer ${globalAuthToken}`;\n      }\n\n      // Endpoint-specific Header parameters\n      const headerInputs = card.querySelectorAll('.param-input-header');\n      headerInputs.forEach(input => {\n        const paramName = input.getAttribute('data-param');\n        const val = input.value.trim();\n        if (val) headers[paramName] = val;\n      });\n\n      // Body\n      const bodyInput = card.querySelector('.body-textarea');\n      let bodyData = undefined;\n      if (bodyInput && ['POST', 'PUT', 'PATCH'].includes(method)) {\n        headers['Content-Type'] = 'application/json';\n        bodyData = bodyInput.value.trim();\n      }\n\n      // Resolve Base Server URL\n      const serverSelect = document.querySelector('.server-select');\n      const selectedServerUrl = (serverSelect && serverSelect.value) ? serverSelect.value.trim() : window.location.origin;\n      const targetOrigin = selectedServerUrl.startsWith('http') ? selectedServerUrl.replace(/\\/+$/, '') : window.location.origin;\n      const fullExecutionUrl = selectedServerUrl.startsWith('http') ? `${targetOrigin}${finalUrl}` : finalUrl;\n\n      // Generate cURL\n      let curlCmd = `curl -X '${method}' \\\\\\n  '${targetOrigin}${finalUrl}'`;\n      for (const [k, v] of Object.entries(headers)) {\n        curlCmd += ` \\\\\\n  -H '${k}: ${v}'`;\n      }\n      if (bodyData) {\n        curlCmd += ` \\\\\\n  -d '${bodyData.replace(/'/g, \"'\\\\''\")}'`;\n      }\n\n      // Update Live Response UI\n      const liveBox = card.querySelector('.live-response-box');\n      const curlBox = card.querySelector('.live-curl');\n      const urlBox = card.querySelector('.live-url');\n      const statusBadge = card.querySelector('.live-status-badge');\n      const bodyBox = card.querySelector('.live-body');\n      const headersBox = card.querySelector('.live-headers');\n      const durationBadge = card.querySelector('.live-duration');\n\n      if (liveBox) liveBox.style.display = 'block';\n      if (curlBox) curlBox.textContent = curlCmd;\n      if (urlBox) urlBox.textContent = `${targetOrigin}${finalUrl}`;\n\n      btn.textContent = 'Executing...';\n      btn.disabled = true;\n      const startTime = performance.now();\n\n      try {\n        const res = await fetch(fullExecutionUrl, {\n          method,\n          headers,\n          body: bodyData || undefined\n        });\n\n        const duration = Math.round(performance.now() - startTime);\n        if (durationBadge) durationBadge.textContent = `${duration} ms`;\n\n        if (statusBadge) {\n          statusBadge.textContent = `${res.status} ${res.statusText}`;\n          statusBadge.className = 'status-indicator ' + (res.ok ? 'status-2xx' : 'status-4xx');\n        }\n\n        const contentType = res.headers.get('content-type') || '';\n        let resBody = '';\n        if (contentType.includes('application/json')) {\n          const json = await res.json();\n          resBody = JSON.stringify(json, null, 2);\n        } else {\n          resBody = await res.text();\n        }\n\n        if (bodyBox) bodyBox.textContent = resBody || '(Empty response body)';\n\n        // Format headers\n        if (headersBox) {\n          let hText = '';\n          res.headers.forEach((v, k) => {\n            hText += `${k}: ${v}\\n`;\n          });\n          headersBox.textContent = hText.trim() || '(No headers)';\n        }\n      } catch (err) {\n        if (statusBadge) {\n          statusBadge.textContent = 'Network Error';\n          statusBadge.className = 'status-indicator status-5xx';\n        }\n        if (bodyBox) {\n          bodyBox.textContent = `Fetch Failed: ${err.message}`;\n        }\n      } finally {\n        btn.textContent = 'Execute';\n        btn.disabled = false;\n      }\n    });\n  });\n\n  // 9. Clear Response Handler\n  document.querySelectorAll('.btn-clear').forEach(btn => {\n    btn.addEventListener('click', () => {\n      const card = btn.closest('.op-card');\n      if (!card) return;\n      const liveBox = card.querySelector('.live-response-box');\n      if (liveBox) liveBox.style.display = 'none';\n    });\n  });\n\n  // 10. Copy cURL Helper\n  document.querySelectorAll('.copy-btn').forEach(btn => {\n    btn.addEventListener('click', (e) => {\n      e.stopPropagation();\n      const codeBlock = btn.closest('.live-code-block');\n      if (!codeBlock) return;\n      const text = codeBlock.textContent.replace('Copy', '').trim();\n      navigator.clipboard.writeText(text).then(() => {\n        btn.textContent = 'Copied!';\n        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);\n      });\n    });\n  });\n\n  // 11. Schema / Example Value Tab Switcher\n  document.querySelectorAll('.tab-btn').forEach(tab => {\n    tab.addEventListener('click', (e) => {\n      e.stopPropagation();\n      const wrapper = tab.closest('.tab-wrapper');\n      if (!wrapper) return;\n      wrapper.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));\n      wrapper.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');\n      tab.classList.add('active');\n      const targetId = tab.getAttribute('data-target');\n      const targetPane = wrapper.querySelector(targetId);\n      if (targetPane) targetPane.style.display = 'block';\n    });\n  });\n\n  // 12. Multi-Language Code Snippet Generator (Phase 2)\n  let activeSnippetLang = localStorage.getItem('scout_snippet_lang') || 'curl';\n\n  function generateSnippet(lang, method, url, headers = {}, body = '') {\n    const methodUpper = method.toUpperCase();\n    const methodLower = method.toLowerCase();\n    const hasBody = Boolean(body && ['POST', 'PUT', 'PATCH'].includes(methodUpper));\n\n    switch (lang) {\n      case 'curl': {\n        let cmd = `curl -X '${methodUpper}' \\\\\\n  '${url}'`;\n        for (const [k, v] of Object.entries(headers)) {\n          cmd += ` \\\\\\n  -H '${k}: ${v}'`;\n        }\n        if (hasBody) {\n          cmd += ` \\\\\\n  -d '${body.replace(/'/g, \"'\\\\''\")}'`;\n        }\n        return cmd;\n      }\n\n      case 'fetch': {\n        const headerEntries = Object.entries(headers);\n        let headerLines = headerEntries.length\n          ? '  headers: {\\n' + headerEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\\n') + '\\n  }'\n          : '';\n\n        let options = `  method: '${methodUpper}'`;\n        if (headerLines) options += `,\\n${headerLines}`;\n        if (hasBody) {\n          let parsed = null;\n          try { parsed = JSON.parse(body); } catch (_) {}\n          const bodyFormatted = parsed\n            ? JSON.stringify(parsed, null, 2).split('\\n').map((line, idx) => idx === 0 ? line : '    ' + line).join('\\n')\n            : JSON.stringify(body);\n          options += `,\\n  body: JSON.stringify(${bodyFormatted})`;\n        }\n\n        return `const response = await fetch('${url}', {\\n${options}\\n});\\nconst data = await response.json();\\nconsole.log(data);`;\n      }\n\n      case 'axios': {\n        const headerEntries = Object.entries(headers);\n        let headerLines = headerEntries.length\n          ? '  headers: {\\n' + headerEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\\n') + '\\n  }'\n          : '';\n\n        let config = `  method: '${methodLower}',\\n  url: '${url}'`;\n        if (headerLines) config += `,\\n${headerLines}`;\n        if (hasBody) {\n          let parsed = null;\n          try { parsed = JSON.parse(body); } catch (_) {}\n          const dataFormatted = parsed\n            ? JSON.stringify(parsed, null, 2).split('\\n').map((line, idx) => idx === 0 ? line : '  ' + line).join('\\n')\n            : JSON.stringify(body);\n          config += `,\\n  data: ${dataFormatted}`;\n        }\n\n        return `import axios from 'axios';\\n\\nconst response = await axios({\\n${config}\\n});\\nconsole.log(response.data);`;\n      }\n\n      case 'python': {\n        const headerEntries = Object.entries(headers);\n        let headerBlock = headerEntries.length\n          ? 'headers = {\\n' + headerEntries.map(([k, v]) => `    \"${k}\": \"${v}\"`).join(',\\n') + '\\n}\\n'\n          : '';\n\n        let code = `import requests\\n\\nurl = \"${url}\"\\n${headerBlock}`;\n        if (hasBody) {\n          let parsed = null;\n          try { parsed = JSON.parse(body); } catch (_) {}\n          const payloadFormatted = parsed ? JSON.stringify(parsed, null, 4) : JSON.stringify(body);\n          code += `payload = ${payloadFormatted}\\n\\n`;\n          code += `response = requests.${methodLower}(url, ${headerEntries.length ? 'headers=headers, ' : ''}json=payload)\\nprint(response.json())`;\n        } else {\n          code += `\\nresponse = requests.${methodLower}(url${headerEntries.length ? ', headers=headers' : ''})\\nprint(response.json())`;\n        }\n        return code;\n      }\n\n      case 'go': {\n        const headerLines = Object.entries(headers)\n          .map(([k, v]) => `\\treq.Header.Set(\"${k}\", \"${v}\")`)\n          .join('\\n');\n\n        let bodySetup = `\\tvar reqBody io.Reader = nil\\n`;\n        if (hasBody) {\n          bodySetup = `\\treqBody := bytes.NewBuffer([]byte(\\`${body}\\`))\\n`;\n        }\n\n        return `package main\\n\\nimport (\\n\\t\"bytes\"\\n\\t\"fmt\"\\n\\t\"io\"\\n\\t\"net/http\"\\n)\\n\\nfunc main() {\\n\\turl := \"${url}\"\\n${bodySetup}\\n\\treq, err := http.NewRequest(\"${methodUpper}\", url, ${hasBody ? 'reqBody' : 'nil'})\\n\\tif err != nil {\\n\\t\\tpanic(err)\\n\\t}\\n${headerLines ? '\\n' + headerLines + '\\n' : ''}\\n\\tclient := &http.Client{}\\n\\tresp, err := client.Do(req)\\n\\tif err != nil {\\n\\t\\tpanic(err)\\n\\t}\\n\\tdefer resp.Body.Close()\\n\\n\\tbody, _ := io.ReadAll(resp.Body)\\n\\tfmt.Println(string(body))\\n}`;\n      }\n\n      default:\n        return '';\n    }\n  }\n\n  function updateCardSnippet(card) {\n    if (!card) return;\n    const method = card.getAttribute('data-method').toUpperCase();\n    let rawPath = card.getAttribute('data-path') || '';\n\n    // Interpolate path parameters\n    const pathInputs = card.querySelectorAll('.param-input-path');\n    pathInputs.forEach(input => {\n      const paramName = input.getAttribute('data-param');\n      const val = input.value.trim() || input.getAttribute('placeholder') || `{${paramName}}`;\n      const cleanVal = val.replace(' (required)', '');\n      rawPath = rawPath.replace(`{${paramName}}`, encodeURIComponent(cleanVal));\n    });\n\n    // Query parameters\n    const queryInputs = card.querySelectorAll('.param-input-query');\n    const queryParams = new URLSearchParams();\n    queryInputs.forEach(input => {\n      const paramName = input.getAttribute('data-param');\n      const val = input.value.trim();\n      if (val) queryParams.append(paramName, val);\n    });\n    const queryString = queryParams.toString();\n    const finalPath = rawPath + (queryString ? `?${queryString}` : '');\n\n    // Server origin\n    const serverSelect = document.querySelector('.server-select');\n    const selectedServerUrl = (serverSelect && serverSelect.value) ? serverSelect.value.trim() : window.location.origin;\n    const targetOrigin = selectedServerUrl.startsWith('http') ? selectedServerUrl.replace(/\\/+$/, '') : window.location.origin;\n    const fullUrl = `${targetOrigin}${finalPath}`;\n\n    // Headers\n    const headers = { 'Accept': 'application/json' };\n    if (globalAuthToken) {\n      headers['Authorization'] = globalAuthToken.startsWith('Bearer ') || globalAuthToken.startsWith('Basic ')\n        ? globalAuthToken \n        : `Bearer ${globalAuthToken}`;\n    }\n\n    const headerInputs = card.querySelectorAll('.param-input-header');\n    headerInputs.forEach(input => {\n      const paramName = input.getAttribute('data-param');\n      const val = input.value.trim();\n      if (val) headers[paramName] = val;\n    });\n\n    // Body\n    const bodyInput = card.querySelector('.body-textarea');\n    let bodyData = '';\n    if (bodyInput && ['POST', 'PUT', 'PATCH'].includes(method)) {\n      headers['Content-Type'] = 'application/json';\n      bodyData = bodyInput.value.trim() || bodyInput.getAttribute('placeholder') || '{}';\n      if (bodyData === '{}') bodyData = '';\n    }\n\n    // Set active tab styling\n    card.querySelectorAll('.snippet-tab-btn').forEach(btn => {\n      const lang = btn.getAttribute('data-lang');\n      btn.classList.toggle('active', lang === activeSnippetLang);\n    });\n\n    // Render snippet\n    const codePre = card.querySelector('.snippet-code-content');\n    if (codePre) {\n      codePre.textContent = generateSnippet(activeSnippetLang, method, fullUrl, headers, bodyData);\n    }\n  }\n\n  function updateAllSnippets() {\n    document.querySelectorAll('.op-card').forEach(updateCardSnippet);\n  }\n\n  // Snippet Tab Clicks\n  document.querySelectorAll('.snippet-tab-btn').forEach(btn => {\n    btn.addEventListener('click', (e) => {\n      e.stopPropagation();\n      const lang = btn.getAttribute('data-lang');\n      if (!lang) return;\n      activeSnippetLang = lang;\n      localStorage.setItem('scout_snippet_lang', lang);\n      updateAllSnippets();\n    });\n  });\n\n  // Dynamic updates on user input\n  document.querySelectorAll('.param-input-field, .body-textarea').forEach(input => {\n    input.addEventListener('input', () => {\n      const card = input.closest('.op-card');\n      if (card) updateCardSnippet(card);\n    });\n    input.addEventListener('change', () => {\n      const card = input.closest('.op-card');\n      if (card) updateCardSnippet(card);\n    });\n  });\n\n  const serverSelectElem = document.querySelector('.server-select');\n  if (serverSelectElem) {\n    serverSelectElem.addEventListener('change', updateAllSnippets);\n  }\n\n  // Initialize all snippets on load\n  updateAllSnippets();\n});\n";

// --- Module: lib/discovery/params.js ---
/**
 * Path and parameter normalization utilities for SCOUT-JS.
 */

/**
 * Normalizes an Express path into an OpenAPI 3.1 path.
 * Converts `:param` into `{param}`, removes trailing slashes, ensures leading slash.
 * 
 * @param {string} path - Express path, e.g. "/users/:id/posts/:postId?"
 * @returns {{ openApiPath: string, pathParams: Array<{ name: string, in: string, required: boolean, schema: { type: string } }>, isSupported: boolean, warnings: string[] }}
 */
function normalizeExpressPath(path) {
  const warnings = [];
  let isSupported = true;

  if (typeof path !== 'string') {
    return {
      openApiPath: String(path || '/'),
      pathParams: [],
      isSupported: false,
      warnings: ['Path is not a string (e.g. RegExp or Array). Marked as unsupported for automatic OpenAPI path conversion.']
    };
  }

  // Ensure path starts with a slash
  let cleanPath = path.trim();
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }

  // Deduplicate redundant slashes, except keeping single '/'
  cleanPath = cleanPath.replace(/\/+/g, '/');
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  const pathParams = [];
  const paramNames = new Set();

  // Match :paramName with optional ? or custom regex like :id(\\d+)
  const openApiPath = cleanPath.replace(/:([a-zA-Z0-9_]+)(\([^)]+\))?(\?)?/g, (match, paramName, customRegex, isOptional) => {
    if (paramNames.has(paramName)) {
      warnings.push(`Duplicate path parameter detected: "${paramName}".`);
    }
    paramNames.add(paramName);

    if (customRegex) {
      warnings.push(`Parameter "${paramName}" uses custom RegExp pattern "${customRegex}". Pattern stored in description.`);
    }

    pathParams.push({
      name: paramName,
      in: 'path',
      required: true, // OpenAPI 3.1 requires path parameters to always be required: true
      description: customRegex ? `Pattern: ${customRegex}` : undefined,
      schema: {
        type: 'string'
      }
    });

    return `{${paramName}}`;
  });

  // Check if there are unhandled wildcards or regexes (* or (.*))
  if (openApiPath.includes('*') || openApiPath.includes('(')) {
    isSupported = false;
    warnings.push(`Path contains unsupported wildcard or regex pattern: "${openApiPath}".`);
  }

  return {
    openApiPath,
    pathParams,
    isSupported,
    warnings
  };
}

/**
 * Combines parent mount path and child router path cleanly.
 * 
 * @param {string} parentPath 
 * @param {string} childPath 
 * @returns {string}
 */
function joinPaths(parentPath, childPath) {
  const p = (parentPath || '').trim();
  const c = (childPath || '').trim();

  if (!p || p === '/') return c.startsWith('/') ? c : '/' + c;
  if (!c || c === '/') return p.startsWith('/') ? p : '/' + p;

  const normalizedP = p.endsWith('/') ? p.slice(0, -1) : p;
  const normalizedC = c.startsWith('/') ? c : '/' + c;

  return (normalizedP + normalizedC).replace(/\/+/g, '/');
}

// --- Module: lib/discovery/router-tree.js ---
/**
 * Router Tree and mount metadata tracking.
 */



/**
 * WeakMap tracking router mount prefixes.
 * router -> Array<{ parent: any, prefix: string }>
 */
const routerMountMap = new WeakMap();

/**
 * Attaches a mount prefix to a router instance.
 * @param {Object} router 
 * @param {string} prefix 
 * @param {Object} [parent]
 */
function recordRouterMount(router, prefix, parent = null) {
  if (!router || (typeof router !== 'object' && typeof router !== 'function')) {
    return;
  }
  const existing = routerMountMap.get(router) || [];
  existing.push({ prefix: prefix || '', parent });
  routerMountMap.set(router, existing);
}

/**
 * Extracts a mount path from an Express router layer regexp if available.
 * e.g. /^\/api\/v1\/?(?=\/|$)/i -> "/api/v1"
 * 
 * @param {RegExp} regexp 
 * @returns {string|null}
 */
function extractPrefixFromRegexp(regexp) {
  if (!regexp) return null;
  if (regexp.fast_slash) return '';

  let s = regexp.source;
  if (!s || s === '^\\/?$') return '';

  // Remove leading ^
  s = s.replace(/^\^/, '');

  // Remove trailing Express lookaheads and optional trailing slashes
  s = s.replace(/\\\/\?\(\?=\\\/\|\$\)$/, '');
  s = s.replace(/\(\?=\\\/\|\$\)$/, '');
  s = s.replace(/\\\/\?$/, '');
  s = s.replace(/\\\/?$/, '');

  // Unescape backslashes
  s = s.replace(/\\(.)/g, '$1');

  if (!s.startsWith('/')) {
    s = '/' + s;
  }
  // Remove trailing slash if longer than 1 char
  if (s.length > 1 && s.endsWith('/')) {
    s = s.slice(0, -1);
  }

  return s;
}

// --- Module: lib/discovery/express4-adapter.js ---
/**
 * Express 4 Router Stack Introspection Adapter.
 */




/**
 * Traverses an Express 4 router stack to discover pre-registered routes.
 * 
 * @param {Object} appOrRouter - Express application or Router instance
 * @param {string} [currentPrefix=''] - Current mount prefix
 * @param {Set} [visited] - Set of visited routers to prevent cycles
 * @returns {Array<Object>} List of discovered raw route definitions
 */
function introspectExpress4(appOrRouter, currentPrefix = '', visited = new Set()) {
  const routes = [];
  if (!appOrRouter) return routes;

  if (visited.has(appOrRouter)) {
    return routes;
  }
  visited.add(appOrRouter);

  const stack = appOrRouter._router?.stack || appOrRouter.stack;
  if (!Array.isArray(stack)) {
    return routes;
  }

  for (const layer of stack) {
    if (!layer) continue;

    // Direct route layer
    if (layer.route) {
      const route = layer.route;
      const rawPath = route.path;
      const methods = Object.keys(route.methods || {}).filter(m => route.methods[m]);
      const paths = Array.isArray(rawPath) ? rawPath : [rawPath];

      // Extract metadata attached by describeRoute()
      let enrichedMetadata = {};
      let handlerName;
      if (Array.isArray(route.stack)) {
        for (const stackLayer of route.stack) {
          if (stackLayer.handle?.__scout_metadata__) {
            enrichedMetadata = { ...enrichedMetadata, ...stackLayer.handle.__scout_metadata__ };
          }
          if (stackLayer.name && stackLayer.name !== '<anonymous>' && stackLayer.name !== 'scoutDescribeRoute') {
            handlerName = stackLayer.name;
          }
        }
      }

      for (const p of paths) {
        const fullRawPath = joinPaths(currentPrefix, p);
        const { openApiPath, pathParams, isSupported, warnings } = normalizeExpressPath(fullRawPath);

        for (const method of methods) {
          routes.push({
            method: method.toLowerCase(),
            path: openApiPath,
            originalPath: fullRawPath,
            pathParams,
            handlerName,
            status: isSupported ? 'discovered' : 'unsupported',
            warnings: [...warnings],
            ...enrichedMetadata
          });
        }
      }
    } 
    // Sub-router layer
    else if (layer.name === 'router' || (layer.handle && Array.isArray(layer.handle.stack))) {
      const subRouter = layer.handle;
      
      let mountPrefix = '';
      const recordedMounts = routerMountMap.get(subRouter);
      if (recordedMounts && recordedMounts.length > 0) {
        mountPrefix = recordedMounts[0].prefix;
      } else {
        mountPrefix = extractPrefixFromRegexp(layer.regexp) || '';
      }

      const nextPrefix = joinPaths(currentPrefix, mountPrefix);
      const subRoutes = introspectExpress4(subRouter, nextPrefix, visited);
      routes.push(...subRoutes);
    }
  }

  return routes;
}

// --- Module: lib/discovery/express5-adapter.js ---
/**
 * Express 5 Router Stack Introspection Adapter.
 */




/**
 * Traverses an Express 5 router stack to discover pre-registered routes.
 * 
 * @param {Object} appOrRouter - Express application or Router instance
 * @param {string} [currentPrefix=''] - Current mount prefix
 * @param {Set} [visited] - Set of visited routers
 * @returns {Array<Object>} List of discovered raw route definitions
 */
function introspectExpress5(appOrRouter, currentPrefix = '', visited = new Set()) {
  const routes = [];
  if (!appOrRouter) return routes;

  if (visited.has(appOrRouter)) {
    return routes;
  }
  visited.add(appOrRouter);

  let routerInstance = null;
  if (appOrRouter._router) {
    routerInstance = appOrRouter._router;
  } else if (Array.isArray(appOrRouter.stack)) {
    routerInstance = appOrRouter;
  } else {
    try {
      if (appOrRouter.router && Array.isArray(appOrRouter.router.stack)) {
        routerInstance = appOrRouter.router;
      }
    } catch {
      // Ignore deprecation getters from Express 4
    }
  }

  const stack = routerInstance?.stack;
  if (!Array.isArray(stack)) {
    return routes;
  }

  for (const layer of stack) {
    if (!layer) continue;

    // Direct route
    if (layer.route) {
      const route = layer.route;
      const rawPath = route.path;
      const methods = Object.keys(route.methods || {}).filter(m => route.methods[m]);
      const paths = Array.isArray(rawPath) ? rawPath : [rawPath];

      let enrichedMetadata = {};
      let handlerName;
      if (Array.isArray(route.stack)) {
        for (const stackLayer of route.stack) {
          if (stackLayer.handle?.__scout_metadata__) {
            enrichedMetadata = { ...enrichedMetadata, ...stackLayer.handle.__scout_metadata__ };
          }
          if (stackLayer.name && stackLayer.name !== '<anonymous>' && stackLayer.name !== 'scoutDescribeRoute') {
            handlerName = stackLayer.name;
          }
        }
      }

      for (const p of paths) {
        const fullRawPath = joinPaths(currentPrefix, p);
        const { openApiPath, pathParams, isSupported, warnings } = normalizeExpressPath(fullRawPath);

        for (const method of methods) {
          routes.push({
            method: method.toLowerCase(),
            path: openApiPath,
            originalPath: fullRawPath,
            pathParams,
            handlerName,
            status: isSupported ? 'discovered' : 'unsupported',
            warnings: [...warnings],
            ...enrichedMetadata
          });
        }
      }
    }
    // Sub-router layer
    else if (layer.name === 'router' || (layer.handle && (Array.isArray(layer.handle.stack) || layer.handle.router))) {
      let subRouter = layer.handle;
      try {
        if (layer.handle && layer.handle.router) {
          subRouter = layer.handle.router;
        }
      } catch {
        // ignore
      }

      let mountPrefix = '';
      const recordedMounts = routerMountMap.get(subRouter);
      if (recordedMounts && recordedMounts.length > 0) {
        mountPrefix = recordedMounts[0].prefix;
      } else {
        mountPrefix = extractPrefixFromRegexp(layer.regexp) || '';
      }

      const nextPrefix = joinPaths(currentPrefix, mountPrefix);
      const subRoutes = introspectExpress5(subRouter, nextPrefix, visited);
      routes.push(...subRoutes);
    }
  }

  return routes;
}

// --- Module: lib/discovery/interceptor.js ---
/**
 * Runtime route instrumentation for Express applications and routers.
 * Intercepts route additions happening after autoDocs() initialization.
 */





const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'all'];

/**
 * Helper to extract metadata from handlers passed to an Express route.
 * @param {Array<Function>} handlers 
 * @returns {{ enrichedMetadata: Object, handlerName: string|undefined }}
 */
function extractHandlerMetadata(handlers) {
  let enrichedMetadata = {};
  let handlerName;

  for (const h of handlers) {
    if (!h) continue;
    if (h.__scout_metadata__) {
      enrichedMetadata = { ...enrichedMetadata, ...h.__scout_metadata__ };
    }
    if (typeof h === 'function' && h.name && h.name !== '<anonymous>' && h.name !== 'scoutDescribeRoute') {
      handlerName = h.name;
    }
  }

  return { enrichedMetadata, handlerName };
}

/**
 * Instruments an Express app or Router instance to capture route registrations in real time.
 * 
 * @param {Object} appOrRouter - Express application or Router instance
 * @param {import('../metadata/registry.js').RouteRegistry} registry - Target route registry
 * @param {string} [currentPrefix=''] - Current router prefix
 */
function instrumentRouter(appOrRouter, registry, currentPrefix = '') {
  if (!appOrRouter || appOrRouter.__scout_instrumented__) {
    return;
  }
  appOrRouter.__scout_instrumented__ = true;

  // 1. Intercept HTTP methods
  for (const method of HTTP_METHODS) {
    const originalMethod = appOrRouter[method];
    if (typeof originalMethod !== 'function') continue;

    appOrRouter[method] = function (path, ...handlers) {
      if (method === 'get' && arguments.length === 1 && typeof path === 'string' && !path.startsWith('/')) {
        return originalMethod.apply(this, arguments);
      }

      if (typeof path === 'string' || path instanceof RegExp) {
        const fullRawPath = joinPaths(currentPrefix, path);
        const { openApiPath, pathParams, isSupported, warnings } = normalizeExpressPath(fullRawPath);
        const { enrichedMetadata, handlerName } = extractHandlerMetadata(handlers);

        if (method === 'all') {
          for (const m of ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']) {
            registry.register({
              method: m,
              path: openApiPath,
              originalPath: fullRawPath,
              pathParams,
              handlerName,
              status: isSupported ? 'discovered' : 'unsupported',
              warnings: [...warnings],
              ...enrichedMetadata
            });
          }
        } else {
          registry.register({
            method,
            path: openApiPath,
            originalPath: fullRawPath,
            pathParams,
            handlerName,
            status: isSupported ? 'discovered' : 'unsupported',
            warnings: [...warnings],
            ...enrichedMetadata
          });
        }
      }

      return originalMethod.apply(this, arguments);
    };
  }

  // 2. Intercept app.route() chaining
  const originalRoute = appOrRouter.route;
  if (typeof originalRoute === 'function') {
    appOrRouter.route = function (path) {
      const routeInstance = originalRoute.apply(this, arguments);
      if (routeInstance && !routeInstance.__scout_instrumented__) {
        routeInstance.__scout_instrumented__ = true;
        for (const method of HTTP_METHODS) {
          const originalRouteMethod = routeInstance[method];
          if (typeof originalRouteMethod !== 'function') continue;

          routeInstance[method] = function (...handlers) {
            const fullRawPath = joinPaths(currentPrefix, path);
            const { openApiPath, pathParams, isSupported, warnings } = normalizeExpressPath(fullRawPath);
            const { enrichedMetadata, handlerName } = extractHandlerMetadata(handlers);

            if (method === 'all') {
              for (const m of ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']) {
                registry.register({
                  method: m,
                  path: openApiPath,
                  originalPath: fullRawPath,
                  pathParams,
                  handlerName,
                  status: isSupported ? 'discovered' : 'unsupported',
                  warnings: [...warnings],
                  ...enrichedMetadata
                });
              }
            } else {
              registry.register({
                method,
                path: openApiPath,
                originalPath: fullRawPath,
                pathParams,
                handlerName,
                status: isSupported ? 'discovered' : 'unsupported',
                warnings: [...warnings],
                ...enrichedMetadata
              });
            }

            return originalRouteMethod.apply(this, arguments);
          };
        }
      }
      return routeInstance;
    };
  }

  // 3. Intercept app.use() for sub-routers
  const originalUse = appOrRouter.use;
  if (typeof originalUse === 'function') {
    appOrRouter.use = function (...args) {
      let mountPrefix = '';
      let subRouters = [];

      if (typeof args[0] === 'string') {
        mountPrefix = args[0];
        subRouters = args.slice(1);
      } else {
        subRouters = args;
      }

      for (const item of subRouters) {
        if (item && (typeof item === 'function' || typeof item === 'object')) {
          if (Array.isArray(item.stack) || item.route || typeof item.use === 'function') {
            const combinedPrefix = joinPaths(currentPrefix, mountPrefix);
            recordRouterMount(item, combinedPrefix, appOrRouter);

            // Introspect any existing routes already on this router
            const existingSubRoutes = introspectExpress4(item, combinedPrefix);
            for (const r of existingSubRoutes) {
              registry.register(r);
            }

            // Instrument for any future routes
            instrumentRouter(item, registry, combinedPrefix);
          }
        }
      }

      return originalUse.apply(this, args);
    };
  }
}

// --- Module: lib/discovery/index.js ---
/**
 * Main Discovery Engine orchestrator.
 */





/**
 * Discovers and registers routes from an Express app.
 * 
 * @param {Object} app - Express application
 * @param {import('../metadata/registry.js').RouteRegistry} registry - Route metadata registry
 * @param {Object} [options={}] - Discovery options
 * @returns {void}
 */
function discoverRoutes(app, registry, options = {}) {
  if (!app) return;

  const includeFilters = options.include || [];
  const excludeFilters = options.exclude || [];

  /**
   * Helper to determine if a path matches an inclusion/exclusion pattern.
   * Supports prefix strings or regexes.
   */
  function isExcluded(path) {
    if (excludeFilters.length > 0) {
      for (const pattern of excludeFilters) {
        if (pattern instanceof RegExp && pattern.test(path)) return true;
        if (typeof pattern === 'string' && (path.startsWith(pattern) || path === pattern)) return true;
      }
    }
    if (includeFilters.length > 0) {
      let matched = false;
      for (const pattern of includeFilters) {
        if (pattern instanceof RegExp && pattern.test(path)) { matched = true; break; }
        if (typeof pattern === 'string' && (path.startsWith(pattern) || path === pattern)) { matched = true; break; }
      }
      if (!matched) return true;
    }
    return false;
  }

  // Ensure router is initialized if Express provides lazyrouter
  if (typeof app.lazyrouter === 'function' && !app._router) {
    app.lazyrouter();
  }

  // 1. Run stack introspection to discover pre-registered routes
  let discovered = introspectExpress4(app);
  if (discovered.length === 0) {
    discovered = introspectExpress5(app);
  }

  for (const route of discovered) {
    if (isExcluded(route.path) || isExcluded(route.originalPath)) {
      registry.register({ ...route, status: 'excluded' });
    } else {
      registry.register(route);
    }
  }

  // 2. Instrument app for dynamic / subsequent route registrations
  instrumentRouter(app, {
    register: (route) => {
      if (isExcluded(route.path) || isExcluded(route.originalPath)) {
        return registry.register({ ...route, status: 'excluded' });
      }
      return registry.register(route);
    }
  });
}

// --- Module: lib/metadata/registry.js ---
/**
 * In-memory Route Metadata Registry for SCOUT-JS.
 * Tracks discovered routes, enrichment metadata, and status.
 */

class RouteRegistry {
  constructor() {
    /** @type {Map<string, import('./registry.js').RouteDefinition>} */
    this.routes = new Map();
  }

  /**
   * Generates a unique route key.
   * @param {string} method 
   * @param {string} path 
   * @returns {string}
   */
  makeKey(method, path) {
    return `${(method || '').toLowerCase()}:${path}`;
  }

  /**
   * Registers or updates a route definition.
   * If a route is already registered, preserves existing metadata and merges updates.
   * 
   * @param {Object} definition
   * @returns {Object} the stored RouteDefinition
   */
  register(definition) {
    const key = this.makeKey(definition.method, definition.path);
    const existing = this.routes.get(key);

    if (existing) {
      // Merge properties without overriding with undefined
      const merged = {
        ...existing,
        ...definition,
        warnings: Array.from(new Set([...(existing.warnings || []), ...(definition.warnings || [])])),
        pathParams: definition.pathParams?.length ? definition.pathParams : existing.pathParams,
        tags: definition.tags?.length ? definition.tags : existing.tags,
        responses: { ...(existing.responses || {}), ...(definition.responses || {}) },
        // Don't downgrade status from partial to discovered if issues were detected
        status: (existing.status === 'unsupported' || definition.status === 'unsupported') 
          ? 'unsupported' 
          : (existing.status === 'partial' || definition.status === 'partial') 
            ? 'partial' 
            : definition.status || existing.status || 'discovered'
      };

      this.routes.set(key, merged);
      return merged;
    }

    const routeDef = {
      id: key,
      method: (definition.method || 'get').toLowerCase(),
      path: definition.path,
      originalPath: definition.originalPath || definition.path,
      pathParams: definition.pathParams || [],
      queryParams: definition.queryParams || undefined,
      headerParams: definition.headerParams || undefined,
      status: definition.status || 'discovered',
      handlerName: definition.handlerName || 'anonymous',
      tags: definition.tags || [],
      summary: definition.summary || '',
      description: definition.description || '',
      requestBody: definition.requestBody || undefined,
      responses: definition.responses || undefined,
      security: definition.security || undefined,
      warnings: definition.warnings || []
    };

    this.routes.set(key, routeDef);
    return routeDef;
  }

  /**
   * Finds a route definition by method and path.
   * @param {string} method 
   * @param {string} path 
   * @returns {Object|undefined}
   */
  get(method, path) {
    return this.routes.get(this.makeKey(method, path));
  }

  /**
   * Returns all registered routes as an array.
   * @returns {Array<Object>}
   */
  getAll() {
    return Array.from(this.routes.values());
  }

  /**
   * Returns statistics about discovered routes.
   * @returns {{ total: number, discovered: number, partial: number, unsupported: number, excluded: number }}
   */
  getStats() {
    const stats = {
      total: this.routes.size,
      discovered: 0,
      partial: 0,
      unsupported: 0,
      excluded: 0
    };

    for (const route of this.routes.values()) {
      if (stats[route.status] !== undefined) {
        stats[route.status]++;
      }
    }

    return stats;
  }

  /**
   * Clears the registry.
   */
  clear() {
    this.routes.clear();
  }
}

// --- Module: lib/openapi/serializer.js ---
/**
 * Serializer for OpenAPI specifications (JSON and YAML).
 */

/**
 * Pure JavaScript YAML dumper. Zero external dependencies.
 * 
 * @param {any} data 
 * @param {number} [indent=0] 
 * @returns {string}
 */
function dumpYaml(data, indent = 0) {
  const spaces = '  '.repeat(indent);

  if (data === null || data === undefined) {
    return 'null\n';
  }

  if (typeof data === 'boolean' || typeof data === 'number') {
    return String(data) + '\n';
  }

  if (typeof data === 'string') {
    // If multiline or contains special YAML characters, quote or block
    if (data.includes('\n')) {
      const lines = data.split('\n').map(l => '  '.repeat(indent + 1) + l).join('\n');
      return `|\n${lines}\n`;
    }
    if (data.match(/[:#\[\]{}|>&*!%@`,'"?]/) || data.trim() !== data || data === '') {
      return JSON.stringify(data) + '\n';
    }
    return data + '\n';
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return '[]\n';
    let out = '';
    for (const item of data) {
      if (typeof item === 'object' && item !== null) {
        const itemYaml = dumpYaml(item, indent + 1).trimStart();
        out += `${spaces}- ${itemYaml}`;
      } else {
        out += `${spaces}- ${dumpYaml(item, 0)}`;
      }
    }
    return out;
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return '{}\n';
    let out = '';
    for (const key of keys) {
      const val = data[key];
      if (val === undefined) continue;

      if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val) && val.length === 0) {
          out += `${spaces}${key}: []\n`;
        } else if (Object.keys(val).length === 0) {
          out += `${spaces}${key}: {}\n`;
        } else {
          out += `${spaces}${key}:\n${dumpYaml(val, indent + 1)}`;
        }
      } else {
        out += `${spaces}${key}: ${dumpYaml(val, 0)}`;
      }
    }
    return out;
  }

  return String(data) + '\n';
}

/**
 * Serializes OpenAPI document to JSON.
 * @param {Object} doc 
 * @returns {string}
 */
function toJson(doc) {
  return JSON.stringify(doc, null, 2);
}

/**
 * Serializes OpenAPI document to YAML.
 * @param {Object} doc 
 * @returns {string}
 */
function toYaml(doc) {
  return dumpYaml(doc);
}

// --- Module: lib/openapi/validator.js ---
/**
 * Structural OpenAPI 3.1 Validator.
 */

const VALID_HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace']);

/**
 * Validates an OpenAPI 3.1 document structure.
 * 
 * @param {Object} doc - Generated OpenAPI document
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateOpenApiDocument(doc) {
  const errors = [];

  if (!doc || typeof doc !== 'object') {
    return { valid: false, errors: ['Document must be an object.'] };
  }

  if (!doc.openapi || !doc.openapi.startsWith('3.1')) {
    errors.push(`Invalid or missing "openapi" version. Expected "3.1.x", got "${doc.openapi}".`);
  }

  if (!doc.info || typeof doc.info !== 'object') {
    errors.push('Missing required "info" object.');
  } else {
    if (!doc.info.title) errors.push('Missing required "info.title".');
    if (!doc.info.version) errors.push('Missing required "info.version".');
  }

  if (!doc.paths || typeof doc.paths !== 'object') {
    errors.push('Missing required "paths" object.');
    return { valid: errors.length === 0, errors };
  }

  for (const [pathKey, pathItem] of Object.entries(doc.paths)) {
    if (!pathKey.startsWith('/')) {
      errors.push(`Path "${pathKey}" must start with a slash '/'.`);
    }

    // Extract path parameters from template e.g. /users/{id} -> ["id"]
    const templateParams = (pathKey.match(/{([^}]+)}/g) || []).map(p => p.slice(1, -1));

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!VALID_HTTP_METHODS.has(method.toLowerCase())) {
        errors.push(`Invalid HTTP method "${method}" at path "${pathKey}".`);
        continue;
      }

      if (!operation.responses || typeof operation.responses !== 'object' || Object.keys(operation.responses).length === 0) {
        errors.push(`Operation "${method.toUpperCase()} ${pathKey}" must define at least one response.`);
      }

      // Verify that all template parameters are defined with required: true and in: "path"
      if (templateParams.length > 0) {
        const declaredParams = operation.parameters || [];
        for (const tp of templateParams) {
          const match = declaredParams.find(p => p.name === tp && p.in === 'path');
          if (!match) {
            errors.push(`Path parameter "{${tp}}" in path "${pathKey}" is not declared in parameters.`);
          } else if (match.required !== true) {
            errors.push(`Path parameter "{${tp}}" in path "${pathKey}" must have required: true.`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// --- Module: lib/openapi/builder.js ---
/**
 * OpenAPI 3.1 Document Builder.
 * Adheres strictly to PRD Principle: Never fabricate schemas or examples.
 */

/**
 * Derives a default tag name from an OpenAPI path.
 * e.g. "/api/v1/users/{id}" -> "Users"
 * 
 * @param {string} path 
 * @returns {string}
 */
function deriveTag(path) {
  if (!path || path === '/') return 'Default';
  const segments = path.split('/').filter(s => s && !s.startsWith('{') && s !== 'api' && !s.startsWith('v'));
  if (segments.length === 0) return 'Default';
  const tag = segments[0];
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

/**
 * Generates an operationId deterministically.
 * e.g. ("get", "/users/{id}") -> "getUsersById"
 * 
 * @param {string} method 
 * @param {string} path 
 * @returns {string}
 */
function deriveOperationId(method, path) {
  const parts = path
    .split('/')
    .filter(Boolean)
    .map(p => {
      if (p.startsWith('{') && p.endsWith('}')) {
        const param = p.slice(1, -1);
        return 'By' + param.charAt(0).toUpperCase() + param.slice(1);
      }
      return p.charAt(0).toUpperCase() + p.slice(1);
    });

  return method.toLowerCase() + parts.join('');
}

/**
 * Builds an OpenAPI 3.1.0 document from registered routes and options.
 * 
 * @param {import('../metadata/registry.js').RouteRegistry} registry 
 * @param {Object} [options={}]
 * @returns {Object} OpenAPI 3.1.0 document
 */
function buildOpenApiDocument(registry, options = {}) {
  const info = {
    title: options.info?.title || 'API Documentation',
    version: options.info?.version || '1.0.0',
    description: options.info?.description || 'Auto-generated interactive API documentation powered by SCOUT-JS.'
  };

  const document = {
    openapi: '3.1.0',
    info,
    paths: {},
    components: {
      schemas: options.components?.schemas || {},
      securitySchemes: options.security?.schemes || options.components?.securitySchemes || {}
    }
  };

  if (options.server?.url) {
    document.servers = [
      {
        url: options.server.url,
        description: options.server.description || 'API Server'
      }
    ];
  }

  const routes = registry.getAll();

  for (const route of routes) {
    // Excluded routes are not added to OpenAPI paths
    if (route.status === 'excluded') {
      continue;
    }

    const { path, method, pathParams, summary, description, tags, requestBody, responses, security, queryParams, headerParams } = route;

    if (!document.paths[path]) {
      document.paths[path] = {};
    }

    const operationTags = (tags && tags.length > 0) ? tags : [deriveTag(path)];
    const operationId = deriveOperationId(method, path);

    // Build parameters array (path params + query params)
    const parameters = [];

    // Path parameters - MUST always have required: true
    if (Array.isArray(pathParams)) {
      for (const p of pathParams) {
        parameters.push({
          name: p.name,
          in: 'path',
          required: true,
          description: p.description,
          schema: p.schema || { type: 'string' }
        });
      }
    }

    // Query parameters
    if (Array.isArray(queryParams)) {
      for (const q of queryParams) {
        parameters.push({
          name: q.name,
          in: 'query',
          required: Boolean(q.required),
          description: q.description,
          schema: q.schema || { type: 'string' }
        });
      }
    }

    // Header parameters
    if (Array.isArray(headerParams)) {
      for (const h of headerParams) {
        parameters.push({
          name: h.name,
          in: 'header',
          required: Boolean(h.required),
          description: h.description,
          schema: h.schema || { type: 'string' }
        });
      }
    }

    // Build responses
    // Principle: Never fabricate schemas! If unspecified, provide status description only.
    let operationResponses = responses;
    if (!operationResponses || Object.keys(operationResponses).length === 0) {
      operationResponses = {
        '200': {
          description: 'Successful response'
        }
      };
    }

    const operation = {
      operationId,
      tags: operationTags,
      summary: summary || `${method.toUpperCase()} ${path}`,
      responses: operationResponses
    };

    if (description) {
      operation.description = description;
    }

    if (parameters.length > 0) {
      operation.parameters = parameters;
    }

    if (requestBody) {
      operation.requestBody = requestBody;
    }

    if (security) {
      operation.security = security;
    }

    document.paths[path][method.toLowerCase()] = operation;
  }

  return document;
}

// --- Module: lib/schema/json-schema.js ---
/**
 * Pure JavaScript Schema converter.
 * Converts Zod schemas or raw JavaScript definitions into OpenAPI 3.1 / JSON Schema objects.
 */

/**
 * Checks if a schema is a Zod schema.
 * @param {any} schema 
 * @returns {boolean}
 */
function isZodSchema(schema) {
  return Boolean(schema && typeof schema === 'object' && ('_def' in schema || typeof schema.safeParse === 'function'));
}

/**
 * Normalizes type identifier across different Zod versions.
 * @param {any} def 
 * @returns {string}
 */
function getZodKind(def) {
  if (!def) return 'unknown';
  const raw = def.type || def.typeName || '';
  return String(raw).replace(/^Zod/, '').toLowerCase();
}

/**
 * Normalizes check metadata across Zod v3 and v4/canary.
 * @param {any} check 
 * @returns {Object}
 */
function normalizeCheck(check) {
  const def = check._zod?.def || check.def || check;
  const kind = def.check || def.kind || '';
  const value = def.minimum ?? def.maximum ?? def.value;
  const format = def.format;
  const inclusive = def.inclusive !== false;
  return { kind, value, format, inclusive, regex: def.pattern || def.regex };
}

/**
 * Converts a Zod type definition to an OpenAPI 3.1 JSON Schema.
 * Pure JS implementation with zero runtime dependencies.
 * 
 * @param {any} zodSchema 
 * @returns {Object} JSON Schema object
 */
function zodToJsonSchema(zodSchema) {
  if (!zodSchema || !zodSchema._def) {
    return { type: 'object' };
  }

  const def = zodSchema._def;
  const kind = getZodKind(def);

  switch (kind) {
    case 'string': {
      const schema = { type: 'string' };
      const checks = def.checks || [];
      for (const rawCheck of checks) {
        const c = normalizeCheck(rawCheck);
        if (c.kind === 'min' || c.kind === 'min_length') schema.minLength = c.value;
        if (c.kind === 'max' || c.kind === 'max_length') schema.maxLength = c.value;
        if (c.kind === 'email' || c.format === 'email') schema.format = 'email';
        if (c.kind === 'url' || c.format === 'uri') schema.format = 'uri';
        if (c.kind === 'uuid' || c.format === 'uuid') schema.format = 'uuid';
        if ((c.kind === 'regex' || c.kind === 'string_format') && c.regex) {
          schema.pattern = c.regex.source || String(c.regex);
        }
      }
      return schema;
    }

    case 'number': {
      const schema = { type: 'number' };
      const checks = def.checks || [];
      for (const rawCheck of checks) {
        const c = normalizeCheck(rawCheck);
        if (c.kind === 'min' || c.kind === 'greater_than') {
          schema.minimum = c.value;
        }
        if (c.kind === 'max' || c.kind === 'less_than') {
          schema.maximum = c.value;
        }
        if (c.kind === 'int' || c.format === 'int' || c.format === 'safeint') {
          schema.type = 'integer';
        }
      }
      return schema;
    }

    case 'boolean':
      return { type: 'boolean' };

    case 'array': {
      const itemSchema = def.element || def.type;
      return {
        type: 'array',
        items: zodToJsonSchema(itemSchema)
      };
    }

    case 'object': {
      let shape = {};
      if (typeof def.shape === 'function') {
        shape = def.shape();
      } else if (def.shape) {
        shape = def.shape;
      } else if (typeof zodSchema.shape === 'object') {
        shape = zodSchema.shape;
      }

      const properties = {};
      const required = [];

      for (const [key, val] of Object.entries(shape || {})) {
        properties[key] = zodToJsonSchema(val);
        const fieldKind = getZodKind(val?._def);
        if (fieldKind !== 'optional' && fieldKind !== 'default') {
          required.push(key);
        }
      }

      const schema = { type: 'object', properties };
      if (required.length > 0) {
        schema.required = required;
      }
      return schema;
    }

    case 'optional': {
      return zodToJsonSchema(def.innerType);
    }

    case 'nullable': {
      const inner = zodToJsonSchema(def.innerType);
      return { ...inner, nullable: true };
    }

    case 'enum': {
      let enumValues = [];
      if (Array.isArray(def.values)) {
        enumValues = def.values;
      } else if (def.entries) {
        enumValues = Object.values(def.entries);
      }
      return {
        type: 'string',
        enum: enumValues
      };
    }

    case 'union': {
      return {
        oneOf: (def.options || []).map(zodToJsonSchema)
      };
    }

    default:
      return { type: 'object' };
  }
}

/**
 * Normalizes any schema input (Zod, JSON Schema, or plain object) to an OpenAPI schema.
 * 
 * @param {any} input 
 * @returns {Object}
 */
function normalizeSchema(input) {
  if (!input) return undefined;
  if (isZodSchema(input)) {
    return zodToJsonSchema(input);
  }
  if (typeof input === 'object') {
    return input;
  }
  return { type: 'string' };
}

// --- Module: lib/schema/runtime-validator.js ---
/**
 * Pure JavaScript Runtime Request Validator for SCOUT-JS.
 * Validates request body, query parameters, path parameters, and headers.
 * Supports both Zod schemas and standard JSON Schema definitions with zero external dependencies.
 */

/**
 * Validates data against a schema (Zod or JSON Schema).
 * 
 * @param {any} schema - Zod schema or JSON Schema object
 * @param {any} data - Input payload (req.body, req.query, req.params, or req.headers)
 * @param {string} location - 'body' | 'query' | 'params' | 'headers'
 * @returns {{ valid: boolean, data?: any, issues?: Array<{ field: string, message: string, code?: string }> }}
 */
function validatePayload(schema, data, location = 'body') {
  if (!schema) {
    return { valid: true, data };
  }

  // 1. Zod Schema Validation
  const zodSchema = schema.schema || schema;
  if (typeof zodSchema.safeParse === 'function') {
    const result = zodSchema.safeParse(data);
    if (!result.success) {
      const rawIssues = result.error.issues || result.error.errors || [];
      return {
        valid: false,
        issues: rawIssues.map(err => ({
          field: (err.path && err.path.length > 0) ? err.path.join('.') : location,
          message: err.message,
          code: err.code
        }))
      };
    }
    return { valid: true, data: result.data };
  }

  // 2. Standard JSON Schema Validation
  const jsonSchema = zodSchema;
  if (typeof jsonSchema !== 'object' || jsonSchema === null) {
    return { valid: true, data };
  }

  const issues = [];
  const targetData = data || {};

  // For query & params, convert string numbers/booleans if schema expects them
  const coercedData = (location === 'query' || location === 'params' || location === 'headers') && typeof targetData === 'object'
    ? { ...targetData }
    : targetData;

  if (jsonSchema.type === 'object' && jsonSchema.properties) {
    if (typeof targetData !== 'object' || targetData === null || Array.isArray(targetData)) {
      return {
        valid: false,
        issues: [{ field: location, message: `Expected an object for ${location}` }]
      };
    }

    // Check required fields
    if (Array.isArray(jsonSchema.required)) {
      for (const reqField of jsonSchema.required) {
        if (targetData[reqField] === undefined || targetData[reqField] === null || targetData[reqField] === '') {
          issues.push({
            field: reqField,
            message: `Field '${reqField}' is required in ${location}`
          });
        }
      }
    }

    // Check properties
    for (const [key, propSchema] of Object.entries(jsonSchema.properties)) {
      let val = targetData[key];

      // Type coercion for query & params (e.g. limit="10" -> 10)
      if ((location === 'query' || location === 'params' || location === 'headers') && val !== undefined) {
        if ((propSchema.type === 'number' || propSchema.type === 'integer') && typeof val === 'string' && val.trim() !== '' && !isNaN(Number(val))) {
          val = Number(val);
          coercedData[key] = val;
        } else if (propSchema.type === 'boolean' && typeof val === 'string') {
          if (val === 'true') { val = true; coercedData[key] = true; }
          else if (val === 'false') { val = false; coercedData[key] = false; }
        }
      }

      if (val === undefined) continue;

      // Type checking
      if (propSchema.type) {
        if (propSchema.type === 'string' && typeof val !== 'string') {
          issues.push({ field: key, message: `Field '${key}' must be a string` });
        } else if ((propSchema.type === 'number' || propSchema.type === 'integer') && (typeof val !== 'number' || isNaN(val))) {
          issues.push({ field: key, message: `Field '${key}' must be a number` });
        } else if (propSchema.type === 'integer' && !Number.isInteger(val)) {
          issues.push({ field: key, message: `Field '${key}' must be an integer` });
        } else if (propSchema.type === 'boolean' && typeof val !== 'boolean') {
          issues.push({ field: key, message: `Field '${key}' must be a boolean` });
        } else if (propSchema.type === 'array' && !Array.isArray(val)) {
          issues.push({ field: key, message: `Field '${key}' must be an array` });
        }
      }

      // String constraints
      if (typeof val === 'string') {
        if (propSchema.minLength !== undefined && val.length < propSchema.minLength) {
          issues.push({ field: key, message: `Field '${key}' must be at least ${propSchema.minLength} characters` });
        }
        if (propSchema.maxLength !== undefined && val.length > propSchema.maxLength) {
          issues.push({ field: key, message: `Field '${key}' must not exceed ${propSchema.maxLength} characters` });
        }
        if (propSchema.pattern) {
          const regex = new RegExp(propSchema.pattern);
          if (!regex.test(val)) {
            issues.push({ field: key, message: `Field '${key}' does not match required pattern` });
          }
        }
        if (propSchema.format === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            issues.push({ field: key, message: `Field '${key}' must be a valid email address` });
          }
        }
      }

      // Number constraints
      if (typeof val === 'number') {
        if (propSchema.minimum !== undefined && val < propSchema.minimum) {
          issues.push({ field: key, message: `Field '${key}' must be >= ${propSchema.minimum}` });
        }
        if (propSchema.maximum !== undefined && val > propSchema.maximum) {
          issues.push({ field: key, message: `Field '${key}' must be <= ${propSchema.maximum}` });
        }
      }

      // Enum constraints
      if (Array.isArray(propSchema.enum)) {
        if (!propSchema.enum.includes(val)) {
          issues.push({ field: key, message: `Field '${key}' must be one of: [${propSchema.enum.join(', ')}]` });
        }
      }
    }
  }

  if (issues.length > 0) {
    return { valid: false, issues };
  }

  return { valid: true, data: coercedData };
}

// --- Module: lib/schema/response-serializer.js ---
/**
 * Pure JavaScript Response Serializer and Output Filter for SCOUT-JS.
 * Emulates FastAPI's response_model in Express.js.
 * Automatically filters unlisted fields (e.g. password_hash) and validates response schema.
 */

/**
 * Filters a data object or array against a JSON Schema, stripping unlisted properties.
 * 
 * @param {Object} schema 
 * @param {any} data 
 * @param {Array<string>} [issues]
 * @param {string} [currentPath='']
 * @returns {any}
 */
function filterByJsonSchema(schema, data, issues = [], currentPath = '') {
  if (data === null || data === undefined) {
    return data;
  }

  // Array handling
  if (Array.isArray(data)) {
    const itemSchema = schema.items || (schema.type === 'array' ? null : schema);
    if (!itemSchema) return data;
    return data.map((item, idx) => filterByJsonSchema(itemSchema, item, issues, `${currentPath}[${idx}]`));
  }

  if (typeof data !== 'object') {
    return data;
  }

  // Object handling
  const properties = schema.properties || {};
  const required = schema.required || [];
  const propertyKeys = Object.keys(properties);

  // If no properties defined, return data as is
  if (propertyKeys.length === 0) {
    return data;
  }

  const filtered = {};

  for (const key of propertyKeys) {
    if (key in data) {
      filtered[key] = filterByJsonSchema(properties[key], data[key], issues, currentPath ? `${currentPath}.${key}` : key);
    } else if (required.includes(key)) {
      issues.push(`Missing required response field: "${currentPath ? `${currentPath}.${key}` : key}"`);
    }
  }

  return filtered;
}

/**
 * Serializes and filters an outgoing response payload against a schema.
 * 
 * @param {any} schema - Zod schema or JSON Schema definition
 * @param {any} data - Raw payload passed to res.json()
 * @param {Object} [options={}]
 * @param {number} [options.statusCode=200]
 * @param {string} [options.method='GET']
 * @param {string} [options.path='/']
 * @param {Function} [options.onResponseValidationError]
 * @returns {any} Serialized and filtered payload
 */
function serializeAndFilterResponse(schema, data, options = {}) {
  if (!schema || data === null || data === undefined) {
    return data;
  }

  const rawSchema = schema.schema || schema;

  // 1. Zod Schema
  if (typeof rawSchema.safeParse === 'function') {
    const result = rawSchema.safeParse(data);
    if (result.success) {
      return result.data;
    }

    // Validation warning in non-production
    const issues = (result.error.issues || result.error.errors || []).map(err => ({
      field: (err.path && err.path.length > 0) ? err.path.join('.') : 'root',
      message: err.message,
      code: err.code
    }));

    if (typeof options.onResponseValidationError === 'function') {
      options.onResponseValidationError(issues, data, options);
    } else if (process.env.NODE_ENV !== 'production') {
      const summary = issues.map(i => `${i.field}: ${i.message}`).join(', ');
      console.warn(`[SCOUT-JS] Response schema validation warning on ${options.method || ''} ${options.path || ''}: ${summary}`);
    }

    // Gracefully attempt to strip unknown keys using shape if available
    const shape = rawSchema._def?.shape?.() || rawSchema._def?.shape || rawSchema.shape;
    if (shape && typeof data === 'object' && !Array.isArray(data)) {
      const filtered = {};
      for (const k of Object.keys(shape)) {
        if (k in data) filtered[k] = data[k];
      }
      return filtered;
    }

    return data;
  }

  // 2. Standard JSON Schema
  if (typeof rawSchema === 'object') {
    const issues = [];
    const filtered = filterByJsonSchema(rawSchema, data, issues);

    if (issues.length > 0) {
      if (typeof options.onResponseValidationError === 'function') {
        options.onResponseValidationError(issues.map(msg => ({ message: msg })), data, options);
      } else if (process.env.NODE_ENV !== 'production') {
        console.warn(`[SCOUT-JS] Response schema validation warning on ${options.method || ''} ${options.path || ''}: ${issues.join(', ')}`);
      }
    }

    return filtered;
  }

  return data;
}

/**
 * Attaches the response serialization interceptor to the Express res object.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {Object} metadata 
 */
function setupResponseSerialization(req, res, metadata) {
  if (res.__scout_serialization_attached__) {
    return;
  }
  res.__scout_serialization_attached__ = true;

  const originalJson = res.json.bind(res);

  res.json = function scoutSerializedJson(body) {
    if (res.__scout_serialized__) {
      return originalJson(body);
    }
    res.__scout_serialized__ = true;

    try {
      const statusCode = res.statusCode || 200;
      if (statusCode >= 200 && statusCode < 300) {
        let targetSchema = metadata.responseModel;

        if (!targetSchema && metadata.responses) {
          const resp = metadata.responses[statusCode] || metadata.responses[String(statusCode)] || metadata.responses['200'] || metadata.responses['201'];
          targetSchema = resp?.body || resp?.schema || resp?.content?.['application/json']?.schema;
        }

        if (targetSchema) {
          const filtered = serializeAndFilterResponse(targetSchema, body, {
            statusCode,
            method: req.method,
            path: req.originalUrl || req.path,
            onResponseValidationError: metadata.onResponseValidationError
          });
          return originalJson(filtered);
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[SCOUT-JS] Error during response serialization on ${req.method} ${req.path}:`, err.message);
      }
    }

    return originalJson(body);
  };
}

// --- Module: lib/schema/describe-route.js ---
/**
 * Route enrichment and runtime validation helper: describeRoute()
 */





/**
 * Creates route description metadata to enrich OpenAPI documentation
 * and optionally validates incoming requests at runtime.
 * 
 * @param {Object} options
 * @param {string} [options.summary]
 * @param {string} [options.description]
 * @param {string[]} [options.tags]
 * @param {any} [options.body] - Request body schema (Zod or JSON Schema or { schema, example })
 * @param {any} [options.example] - Example request body payload
 * @param {any} [options.query] - Query parameter schema (Zod or JSON Schema)
 * @param {any} [options.headers] - Headers parameter schema (Zod or JSON Schema)
 * @param {any} [options.params] - Path parameters schema (Zod or JSON Schema)
 * @param {Record<string|number, any>} [options.responses] - Response schemas
 * @param {any[]} [options.security] - Security requirements
 * @param {boolean|{ body?: boolean, query?: boolean, params?: boolean, headers?: boolean }} [options.validate=false] - Whether to validate requests at runtime
 * @param {Function} [options.onValidationError] - Custom error handler callback (issues, req, res, next)
 * @returns {import('express').RequestHandler}
 */
function describeRoute(options = {}) {
  const normalizedMetadata = {
    summary: options.summary,
    description: options.description,
    tags: options.tags,
    security: options.security
  };

  // Determine validation settings
  const shouldValidate = Boolean(options.validate);
  const validateConfig = typeof options.validate === 'object' && options.validate !== null ? options.validate : {
    body: shouldValidate,
    query: shouldValidate,
    params: shouldValidate,
    headers: shouldValidate
  };

  // Process request body
  if (options.body) {
    const rawSchema = options.body?.schema || options.body;
    const bodySchema = normalizeSchema(rawSchema);
    const bodyExample = options.body?.example ?? options.example;

    const mediaObj = {
      schema: bodySchema
    };

    if (bodyExample !== undefined) {
      mediaObj.example = bodyExample;
    }

    normalizedMetadata.requestBody = {
      required: true,
      content: {
        'application/json': mediaObj
      }
    };
  }

  // Process query parameters
  if (options.query) {
    const querySchema = normalizeSchema(options.query);
    const queryParams = [];
    if (querySchema.type === 'object' && querySchema.properties) {
      for (const [key, prop] of Object.entries(querySchema.properties)) {
        queryParams.push({
          name: key,
          in: 'query',
          required: querySchema.required?.includes(key) || false,
          description: prop.description,
          schema: prop
        });
      }
    }
    normalizedMetadata.queryParams = queryParams;
  }

  // Process header parameters
  if (options.headers) {
    const headerSchema = normalizeSchema(options.headers);
    const headerParams = [];
    if (headerSchema.type === 'object' && headerSchema.properties) {
      for (const [key, prop] of Object.entries(headerSchema.properties)) {
        headerParams.push({
          name: key,
          in: 'header',
          required: headerSchema.required?.includes(key) || false,
          description: prop.description,
          schema: prop
        });
      }
    }
    normalizedMetadata.headerParams = headerParams;
  }

  // Process responses
  const responses = {};
  if (options.responses) {
    for (const [status, resp] of Object.entries(options.responses)) {
      if (typeof resp === 'string') {
        responses[status] = { description: resp };
      } else if (resp && typeof resp === 'object') {
        const description = resp.description || 'Response';
        const body = resp.body || resp.schema;
        const example = resp.example;
        if (body) {
          const mediaObj = {
            schema: normalizeSchema(body)
          };
          if (example !== undefined) {
            mediaObj.example = example;
          }
          responses[status] = {
            description,
            content: {
              'application/json': mediaObj
            }
          };
        } else {
          responses[status] = { description };
        }
      }
    }
  }

  // Support responseModel (FastAPI style)
  if (options.responseModel && !responses['200'] && !responses['201']) {
    responses['200'] = {
      description: 'Successful Response',
      content: {
        'application/json': {
          schema: normalizeSchema(options.responseModel)
        }
      }
    };
  }

  // Determine response serialization settings
  const shouldSerialize = options.serialize === true || (Boolean(options.responseModel) && options.serialize !== false);

  // Auto-document 400 Bad Request when validation is enabled
  if (shouldValidate && !responses['400']) {
    responses['400'] = {
      description: 'Bad Request - Validation Error'
    };
  }

  if (Object.keys(responses).length > 0) {
    normalizedMetadata.responses = responses;
  }

  // Express middleware with optional runtime validation & response serialization
  const middleware = function scoutDescribeRoute(req, res, next) {
    // Setup response serialization & output filtering
    if (shouldSerialize) {
      setupResponseSerialization(req, res, options);
    }

    if (!shouldValidate) {
      return next();
    }

    const allIssues = [];

    // 1. Validate Body
    if (validateConfig.body !== false && options.body && req.body !== undefined) {
      const bodyResult = validatePayload(options.body, req.body, 'body');
      if (!bodyResult.valid) {
        allIssues.push(...bodyResult.issues.map(i => ({ ...i, location: 'body' })));
      } else if (bodyResult.data !== undefined) {
        req.body = bodyResult.data;
      }
    }

    // 2. Validate Query Parameters
    if (validateConfig.query !== false && options.query && req.query !== undefined) {
      const queryResult = validatePayload(options.query, req.query, 'query');
      if (!queryResult.valid) {
        allIssues.push(...queryResult.issues.map(i => ({ ...i, location: 'query' })));
      } else if (queryResult.data !== undefined) {
        req.query = queryResult.data;
      }
    }

    // 3. Validate Path Parameters
    if (validateConfig.params !== false && options.params && req.params !== undefined) {
      const paramsResult = validatePayload(options.params, req.params, 'params');
      if (!paramsResult.valid) {
        allIssues.push(...paramsResult.issues.map(i => ({ ...i, location: 'params' })));
      } else if (paramsResult.data !== undefined) {
        req.params = paramsResult.data;
      }
    }

    // 4. Validate Headers
    if (validateConfig.headers !== false && options.headers && req.headers !== undefined) {
      const headersResult = validatePayload(options.headers, req.headers, 'headers');
      if (!headersResult.valid) {
        allIssues.push(...headersResult.issues.map(i => ({ ...i, location: 'headers' })));
      }
    }

    // Return 400 on validation failure
    if (allIssues.length > 0) {
      if (typeof options.onValidationError === 'function') {
        return options.onValidationError(allIssues, req, res, next);
      }
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Request validation failed',
        statusCode: 400,
        issues: allIssues
      });
    }

    return next();
  };

  middleware.__scout_metadata__ = normalizedMetadata;
  return middleware;
}

// --- Module: lib/server/security.js ---
/**
 * Security and production controls for SCOUT-JS.
 */

/**
 * Checks whether the documentation endpoints should be enabled.
 * Rule: Secure by default. Disabled in production unless explicitly enabled.
 * 
 * @param {Object} [options={}]
 * @returns {boolean}
 */
function isDocsEnabled(options = {}) {
  if (options.docs?.enabled !== undefined) {
    return Boolean(options.docs.enabled);
  }

  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    // In production, require explicit opt-in or protectDocs
    return Boolean(options.security?.protectDocs);
  }

  return true;
}

/**
 * Creates authentication guard middleware for documentation endpoints.
 * 
 * @param {Object} [options={}]
 * @returns {import('express').RequestHandler}
 */
function createAuthGuard(options = {}) {
  const protectDocs = options.security?.protectDocs;
  const credentials = options.security?.credentials; // { username, password }

  return function docsAuthGuard(req, res, next) {
    if (!protectDocs) {
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      res.setHeader('WWW-Authenticate', 'Basic realm="API Documentation"');
      return res.status(401).send('Authentication required to access API documentation.');
    }

    if (credentials?.username && credentials?.password) {
      const b64 = authHeader.split(' ')[1];
      const decoded = Buffer.from(b64, 'base64').toString('utf-8');
      const [u, p] = decoded.split(':');

      if (u !== credentials.username || p !== credentials.password) {
        res.setHeader('WWW-Authenticate', 'Basic realm="API Documentation"');
        return res.status(401).send('Invalid credentials.');
      }
    }

    return next();
  };
}

// --- Module: lib/ui/render.js ---
/**
 * Server-side HTML renderer for the SCOUT-JS documentation UI.
 * Applies the Perk Design System: electric lime on warm parchment paper.
 * Pure Vanilla HTML/CSS/JS. 100% offline-ready, zero external CDNs.
 */








// Cache CSS and JS assets in memory for high-speed retrieval
// cssContent inlined
// jsContent inlined

/**
 * Escapes HTML characters for safe rendering.
 * @param {string} str 
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formats a JSON Schema into a concise human-readable schema string.
 * @param {Object} schema 
 * @param {number} [indent=0] 
 * @returns {string}
 */
function formatSchemaText(schema, indent = 0) {
  if (!schema || typeof schema !== 'object') return 'any';
  const sp = '  '.repeat(indent);

  if (schema.type === 'object' && schema.properties) {
    const lines = ['{'];
    const req = schema.required || [];
    for (const [k, v] of Object.entries(schema.properties)) {
      const isReq = req.includes(k) ? ' (required)' : '';
      const typeStr = v.enum ? `enum[${v.enum.join(', ')}]` : (v.type || 'any');
      lines.push(`${sp}  ${k}${isReq}: ${typeStr}`);
    }
    lines.push(`${sp}}`);
    return lines.join('\n');
  }

  if (schema.type === 'array') {
    return `Array<${formatSchemaText(schema.items, indent)}>`;
  }

  if (schema.enum) {
    return `enum[${schema.enum.join(', ')}]`;
  }

  return schema.type || 'string';
}

/**
 * Renders the Perk-styled FastAPI / Swagger UI layout HTML.
 * 
 * @param {Object} doc - OpenAPI 3.1 document
 * @param {Object} [options={}] - Config options
 * @returns {string} Fully rendered HTML
 */
function renderDocsHtml(doc, options = {}) {
  const title = escapeHtml(doc.info?.title || 'API Documentation');
  const version = escapeHtml(doc.info?.version || '1.0.0');
  const description = escapeHtml(doc.info?.description || 'Auto-generated interactive API documentation.');
  const theme = options.docs?.theme || 'light';
  const openApiPath = options.openapi?.path || '/openapi.json';
  const serversList = (doc.servers && doc.servers.length > 0)
    ? doc.servers
    : [{ url: options.server?.url || 'http://localhost:3000', description: 'Primary Server' }];

  // Group operations by tag
  const tagGroups = {};

  for (const [pathKey, pathItem] of Object.entries(doc.paths || {})) {
    for (const [method, operation] of Object.entries(pathItem)) {
      const tags = operation.tags?.length ? operation.tags : ['default'];
      for (const tag of tags) {
        if (!tagGroups[tag]) tagGroups[tag] = [];
        tagGroups[tag].push({
          method: method.toLowerCase(),
          path: pathKey,
          operation,
          id: `${method.toLowerCase()}-${pathKey.replace(/[^a-zA-Z0-9]/g, '-')}`
        });
      }
    }
  }

  // Render Tag Sections and Operations
  let tagSectionsHtml = '';

  for (const [tag, endpoints] of Object.entries(tagGroups)) {
    let operationsHtml = '';

    for (const ep of endpoints) {
      const op = ep.operation;
      const pathParams = (op.parameters || []).filter(p => p.in === 'path');
      const queryParams = (op.parameters || []).filter(p => p.in === 'query');
      const headerParams = (op.parameters || []).filter(p => p.in === 'header');
      const allParams = [...pathParams, ...queryParams, ...headerParams];
      const hasSecurity = (op.security && op.security.length > 0) || (doc.components?.securitySchemes && Object.keys(doc.components.securitySchemes).length > 0);

      // Parameters Table (Swagger style)
      let parametersTableHtml = '';
      if (allParams.length > 0) {
        parametersTableHtml = `
          <div class="op-section-title">Parameters</div>
          <table class="swagger-table">
            <thead>
              <tr>
                <th class="param-col-name">Name</th>
                <th class="param-col-val">Description & Value</th>
              </tr>
            </thead>
            <tbody>
              ${allParams.map(p => {
                const isPath = p.in === 'path';
                const isHeader = p.in === 'header';
                const inputClass = isPath ? 'param-input-path' : isHeader ? 'param-input-header' : 'param-input-query';
                const requiredAsterisk = p.required ? '<span class="param-required-tag">* required</span>' : '';
                const defaultValue = p.schema?.default !== undefined ? String(p.schema.default) : '';
                const enums = p.schema?.enum;

                let inputControl = '';
                if (Array.isArray(enums) && enums.length > 0) {
                  inputControl = `
                    <select 
                      class="param-input-field ${inputClass}" 
                      data-param="${escapeHtml(p.name)}" 
                      disabled
                    >
                      <option value="">-- select ${escapeHtml(p.name)} --</option>
                      ${enums.map(opt => `<option value="${escapeHtml(opt)}"${opt === defaultValue ? ' selected' : ''}>${escapeHtml(opt)}</option>`).join('')}
                    </select>
                  `;
                } else {
                  inputControl = `
                    <input 
                      type="text" 
                      class="param-input-field ${inputClass}" 
                      data-param="${escapeHtml(p.name)}" 
                      placeholder="${escapeHtml(p.name)}${p.required ? ' (required)' : ''}" 
                      value="${escapeHtml(defaultValue)}"
                      disabled 
                    />
                  `;
                }

                return `
                  <tr>
                    <td class="param-col-name">
                      <div class="param-name-txt">${escapeHtml(p.name)} ${requiredAsterisk}</div>
                      <div class="param-meta">${escapeHtml(p.schema?.type || 'string')} · ${p.in}${Array.isArray(enums) ? ' (enum)' : ''}</div>
                    </td>
                    <td class="param-col-val">
                      <div style="margin-bottom:0.4rem; color:var(--text-secondary); font-size:13px;">${escapeHtml(p.description || '')}</div>
                      ${inputControl}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `;
      } else {
        parametersTableHtml = `
          <div class="op-section-title">Parameters</div>
          <p style="font-size:13px; color:var(--text-muted); margin-bottom:1.5rem;">No parameters required for this endpoint.</p>
        `;
      }

      // Request Body with Example Value vs Schema tabs
      let requestBodyHtml = '';
      if (['post', 'put', 'patch'].includes(ep.method)) {
        const media = op.requestBody?.content?.['application/json'];
        const bodySchema = media?.schema;
        let exampleJson = '{}';

        if (media?.example !== undefined) {
          exampleJson = typeof media.example === 'string' ? media.example : JSON.stringify(media.example, null, 2);
        } else if (bodySchema && bodySchema.properties) {
          const sample = {};
          for (const [k, v] of Object.entries(bodySchema.properties)) {
            sample[k] = v.type === 'number' || v.type === 'integer' ? 0 : v.type === 'boolean' ? true : v.enum ? v.enum[0] : 'string';
          }
          exampleJson = JSON.stringify(sample, null, 2);
        }

        const schemaViewText = formatSchemaText(bodySchema);

        requestBodyHtml = `
          <div class="body-container tab-wrapper">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <div class="op-section-title" style="margin-bottom:0;">Request body <span style="font-size:11px; text-transform:none; color:var(--text-muted); font-weight:normal;">application/json</span></div>
              <div class="tab-header">
                <button type="button" class="tab-btn active" data-target="#${ep.id}-body-example">Example Value</button>
                <button type="button" class="tab-btn" data-target="#${ep.id}-body-schema">Schema</button>
              </div>
            </div>
            <div class="tab-pane active" id="${ep.id}-body-example">
              <div class="body-editor-wrap">
                <textarea class="body-textarea" placeholder="${escapeHtml(exampleJson)}" disabled></textarea>
              </div>
            </div>
            <div class="tab-pane" id="${ep.id}-body-schema" style="display:none;">
              <pre class="schema-code-block">${escapeHtml(schemaViewText)}</pre>
            </div>
          </div>
        `;
      }

      // Responses Table with Schema / Example Value
      let responsesHtml = `
        <div class="op-section-title">Responses</div>
        <table class="swagger-table">
          <thead>
            <tr>
              <th style="width:100px;">Code</th>
              <th>Description & Schema</th>
            </tr>
          </thead>
          <tbody>
            ${Object.entries(op.responses || { '200': { description: 'Successful Response' } }).map(([code, resp]) => {
              const respMedia = resp.content?.['application/json'];
              const respSchema = respMedia?.schema;
              let schemaBlock = '';
              if (respSchema) {
                const schemaTxt = formatSchemaText(respSchema);
                schemaBlock = `
                  <div style="margin-top:0.5rem;">
                    <div style="font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); margin-bottom:0.25rem;">Response Schema</div>
                    <pre class="schema-code-block" style="padding:0.5rem 0.75rem; font-size:12px;">${escapeHtml(schemaTxt)}</pre>
                  </div>
                `;
              }
              const is2xx = code.startsWith('2');
              const codeBadgeClass = is2xx ? 'status-pill-2xx' : 'status-pill-err';
              return `
                <tr>
                  <td><span class="status-pill ${codeBadgeClass}">${escapeHtml(code)}</span></td>
                  <td>
                    <div style="font-weight:500;">${escapeHtml(resp.description || 'Response')}</div>
                    ${schemaBlock}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      `;

      // Live Execution / Dark Island Response Box
      const liveResponseHtml = `
        <div class="live-response-box" style="display:none;">
          <div class="live-response-title">Server Response</div>
          
          <div style="font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-ash); margin-bottom:0.35rem;">CURL</div>
          <div class="live-code-block">
            <button class="copy-btn">Copy</button>
            <div class="live-curl"></div>
          </div>

          <div style="font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-ash); margin-bottom:0.35rem;">REQUEST URL</div>
          <div class="live-code-block">
            <div class="live-url"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin: 1rem 0 0.35rem;">
            <div style="font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-ash);">STATUS & TIMING</div>
            <div class="live-duration" style="font-size:12px; color:var(--color-ash);"></div>
          </div>
          <div>
            <span class="live-status-badge status-indicator"></span>
          </div>
          
          <div style="font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-ash); margin-bottom:0.35rem;">RESPONSE BODY</div>
          <div class="live-code-block">
            <button class="copy-btn">Copy</button>
            <div class="live-body"></div>
          </div>

          <div style="font-size:11px; font-weight:500; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-ash); margin-bottom:0.35rem;">RESPONSE HEADERS</div>
          <div class="live-code-block">
            <div class="live-headers"></div>
          </div>
        </div>
      `;

      operationsHtml += `
        <div class="op-card op-${ep.method}" id="${ep.id}" data-method="${ep.method}" data-path="${escapeHtml(ep.path)}" data-summary="${escapeHtml(op.summary || '')}">
          <div class="op-header">
            <div class="op-header-left">
              <a href="#${ep.id}" class="op-anchor" title="Direct link to this operation">#</a>
              <span class="op-badge op-badge-${ep.method}">${ep.method}</span>
              <span class="op-path">${escapeHtml(ep.path)}</span>
              ${hasSecurity ? '<span class="sec-badge" title="Requires Authentication">Secured</span>' : ''}
              <span class="op-summary">${escapeHtml(op.summary || '')}</span>
            </div>
            <div class="op-header-right">
              <span class="op-chevron">▼</span>
            </div>
          </div>

          <div class="op-content">
            <div class="op-action-bar">
              <div class="op-desc">${escapeHtml(op.description || op.summary || '')}</div>
              <button type="button" class="btn-try">Try it out</button>
            </div>

            ${parametersTableHtml}
            ${requestBodyHtml}

            <!-- Execute Bar (Lime Pill CTA) -->
            <div class="execute-bar" style="display:none;">
              <button type="button" class="btn-execute">Execute</button>
              <button type="button" class="btn-clear">Clear</button>
            </div>

            ${liveResponseHtml}

            <!-- Multi-Language Code Snippets -->
            <div class="snippets-section">
              <div style="display:flex; justify-content:space-between; align-items:center; margin: 1.5rem 0 0.5rem; flex-wrap:wrap; gap:0.5rem;">
                <div class="op-section-title" style="margin-bottom:0;">Code Snippets</div>
                <div class="snippet-lang-tabs">
                  <button type="button" class="snippet-tab-btn active" data-lang="curl">cURL</button>
                  <button type="button" class="snippet-tab-btn" data-lang="fetch">Fetch</button>
                  <button type="button" class="snippet-tab-btn" data-lang="axios">Axios</button>
                  <button type="button" class="snippet-tab-btn" data-lang="python">Python</button>
                  <button type="button" class="snippet-tab-btn" data-lang="go">Go</button>
                </div>
              </div>
              <div class="live-code-block snippet-block">
                <button type="button" class="copy-btn snippet-copy-btn">Copy</button>
                <pre class="snippet-code-content"></pre>
              </div>
            </div>

            ${responsesHtml}
          </div>
        </div>
      `;
    }

    tagSectionsHtml += `
      <div class="tag-section">
        <div class="tag-header">
          <div class="tag-title-wrap">
            <span class="tag-title">${escapeHtml(tag)}</span>
            <span class="tag-count">${endpoints.length} endpoint${endpoints.length > 1 ? 's' : ''}</span>
          </div>
          <span class="tag-chevron">▼</span>
        </div>
        <div class="operations-list">
          ${operationsHtml}
        </div>
      </div>
    `;
  }

  // Schemas Section (Collapsible models)
  const schemas = doc.components?.schemas || {};
  let schemasHtml = '';
  if (Object.keys(schemas).length > 0) {
    schemasHtml = `
      <div class="schemas-container collapsed">
        <div class="schemas-header">
          <span>Schemas</span>
          <span>▼</span>
        </div>
        <div class="schemas-content">
          ${Object.entries(schemas).map(([name, schema]) => `
            <div style="margin-bottom:1.5rem;">
              <div style="font-weight:500; font-family:var(--font-mono); font-size:14px; margin-bottom:0.4rem; color:var(--text-primary);">${escapeHtml(name)}</div>
              <pre class="schema-code-block">${escapeHtml(JSON.stringify(schema, null, 2))}</pre>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="en" data-theme="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - SCOUT-JS</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><rect width='24' height='24' rx='6' fill='%23beff50'/><path fill='%2314140f' d='M12 4L4 8l8 4 8-4-8-4zm0 6.5l2.5-1.25L12 8l-2.5 1.25L12 10.5zm0 2.5l-4-2-4 2 8 4 8-4-4-2-4 2z'/></svg>">
  <style>
${cssContent}
  </style>
</head>
<body>
  <!-- Topbar Header -->
  <header class="topbar">
    <div class="topbar-brand">
      <span>SCOUT-JS</span>
      <span class="topbar-brand-pill">PERK</span>
    </div>
    <div class="topbar-actions">
      <button id="theme-toggle" class="topbar-btn" title="Toggle Light/Dark Theme">Theme: Light</button>
      <button id="btn-authorize" class="topbar-btn btn-authorize">Authorize</button>
      <a href="${openApiPath}" target="_blank" class="topbar-btn">openapi.json</a>
      <a href="${openApiPath.replace(/\.json$/, '.yaml')}" target="_blank" class="topbar-btn">openapi.yaml</a>
    </div>
  </header>

  <!-- Main Container -->
  <main class="container">
    <!-- Info Banner (Warm Parchment Card) -->
    <div class="info-banner">
      <div class="info-eyebrow">API Documentation & Playground</div>
      <div class="info-title-row">
        <h1 class="info-title">${title}</h1>
        <span class="version-chip">v${version}</span>
        <span class="oas-chip">OAS 3.1.0</span>
        <a href="${openApiPath}" target="_blank" class="spec-link">[ ${openApiPath} ]</a>
      </div>
      <p class="info-description">${description}</p>
      
      <div class="server-selector">
        <span style="font-weight:500; color:var(--text-secondary); font-size:13px; text-transform:uppercase; letter-spacing:0.05em;">Servers:</span>
        <select class="server-select">
          ${serversList.map(s => `<option value="${escapeHtml(s.url)}">${escapeHtml(s.url)}${s.description ? ` - ${escapeHtml(s.description)}` : ''}</option>`).join('')}
        </select>
      </div>
    </div>

    <!-- Filter Bar & View Controls -->
    <div class="filter-container">
      <input type="text" id="filter-input" class="filter-input" placeholder="Filter endpoints by tag or path..." />
      <div class="filter-controls">
        <button type="button" id="btn-expand-all" class="filter-btn">Expand All</button>
        <button type="button" id="btn-collapse-all" class="filter-btn">Collapse All</button>
      </div>
    </div>

    <!-- Tag & Operation Sections -->
    ${tagSectionsHtml}

    <!-- Schemas Section -->
    ${schemasHtml}
  </main>

  <!-- Authorize Modal -->
  <div id="auth-modal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <span>Available Authorizations</span>
        <button id="auth-close" style="background:none; border:none; cursor:pointer; font-size:1.5rem; color:var(--text-muted);">&times;</button>
      </div>
      <div class="modal-body">
        <div style="font-weight:500; font-size:15px; margin-bottom:0.5rem;">HTTP Bearer / API Key</div>
        <p style="font-size:14px; color:var(--text-secondary); line-height:1.5; margin-bottom:1rem;">
          Enter your authentication token. It will be sent automatically as the <code>Authorization</code> header on all playground requests.
        </p>
        <input type="text" id="auth-token-input" class="param-input-field" style="max-width:100%;" placeholder="Bearer your-secret-token" />
      </div>
      <div class="modal-footer">
        <button id="auth-save" class="btn-execute">Authorize</button>
      </div>
    </div>
  </div>

  <script>
${jsContent}
  </script>
</body>
</html>`;
}

// --- Module: lib/server/routes.js ---
/**
 * Documentation routes and endpoint mounting.
 */







/**
 * Registers documentation and specification endpoints on an Express application.
 * 
 * @param {Object} app - Express application
 * @param {import('../metadata/registry.js').RouteRegistry} registry 
 * @param {Object} options 
 * @returns {{ getDocument: () => Object, refresh: () => Promise<void>, close: () => void }}
 */
function registerDocsRoutes(app, registry, options = {}) {
  const docsPath = options.docs?.path || '/docs';
  const openApiPath = options.openapi?.path || '/openapi.json';
  const yamlPath = openApiPath.replace(/\.json$/, '.yaml');
  const healthPath = (docsPath === '/' ? '' : docsPath) + '/health';

  const enabled = isDocsEnabled(options);
  const authGuard = createAuthGuard(options);

  // Cached representations
  let cachedDoc = null;
  let cachedJson = null;
  let cachedYaml = null;
  let cachedHtml = null;

  function generateSpec() {
    cachedDoc = buildOpenApiDocument(registry, options);
    cachedJson = toJson(cachedDoc);
    cachedYaml = toYaml(cachedDoc);
    cachedHtml = renderDocsHtml(cachedDoc, options);
    return cachedDoc;
  }

  // Pre-generate on startup
  generateSpec();

  if (enabled) {
    // 1. Interactive UI: /docs
    app.get(docsPath, authGuard, (req, res) => {
      if (!cachedHtml) generateSpec();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.send(cachedHtml);
    });

    // 2. OpenAPI Spec JSON: /openapi.json
    app.get(openApiPath, authGuard, (req, res) => {
      if (!cachedJson) generateSpec();
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.send(cachedJson);
    });

    // 3. OpenAPI Spec YAML: /openapi.yaml
    app.get(yamlPath, authGuard, (req, res) => {
      if (!cachedYaml) generateSpec();
      res.setHeader('Content-Type', 'text/yaml; charset=utf-8');
      res.send(cachedYaml);
    });

    // 4. Health and Diagnostics: /docs/health
    app.get(healthPath, authGuard, (req, res) => {
      const stats = registry.getStats();
      const validation = validateOpenApiDocument(cachedDoc || generateSpec());

      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: options.info?.version || '1.0.0',
        routes: stats,
        validation: {
          valid: validation.valid,
          errorCount: validation.errors.length,
          errors: validation.errors
        },
        memory: process.memoryUsage()
      });
    });
  }

  return {
    getDocument: () => cachedDoc || generateSpec(),
    refresh: async () => {
      generateSpec();
    },
    close: () => {
      cachedDoc = null;
      cachedJson = null;
      cachedYaml = null;
      cachedHtml = null;
    }
  };
}

// --- Module: lib/core.js ---
/**
 * Core engine orchestrator for SCOUT-JS.
 */






/**
 * Initializes SCOUT-JS on an Express application.
 * 
 * @param {import('express').Application} app - Express application
 * @param {Object} [options={}] - Configuration options
 * @param {Object} options.info - API metadata { title, version, description }
 * @param {Object} [options.docs] - Docs UI options { enabled, path, theme }
 * @param {Object} [options.openapi] - OpenAPI options { path, version }
 * @param {Object} [options.discovery] - Route discovery filters { enabled, include, exclude }
 * @param {Object} [options.security] - Security controls { protectDocs, credentials, schemes }
 * @param {Object} [options.server] - Server URL { url, description }
 * @returns {AutoDocsInstance}
 */
function autoDocs(app, options = {}) {
  if (!app) {
    throw new Error('SCOUT-JS: You must pass an Express application instance to autoDocs(app, options).');
  }

  const registry = new RouteRegistry();

  // 1. Initial route discovery
  if (options.discovery?.enabled !== false) {
    discoverRoutes(app, registry, options.discovery || {});
  }

  // 2. Register documentation routes (/docs, /openapi.json, etc.)
  const serverController = registerDocsRoutes(app, registry, options);

  // 3. Return AutoDocsInstance
  return {
    getDocument: () => serverController.getDocument(),
    refresh: async () => {
      if (options.discovery?.enabled !== false) {
        discoverRoutes(app, registry, options.discovery || {});
      }
      await serverController.refresh();
    },
    getRoutes: () => registry.getAll(),
    getStats: () => registry.getStats(),
    close: () => {
      serverController.close();
      registry.clear();
    }
  };
}

// Exports
module.exports = {
  autoDocs,
  describeRoute,
  RouteRegistry,
  buildOpenApiDocument,
  validateOpenApiDocument
};
module.exports.default = autoDocs;
module.exports.autoDocs = autoDocs;
module.exports.describeRoute = describeRoute;
module.exports.RouteRegistry = RouteRegistry;
module.exports.buildOpenApiDocument = buildOpenApiDocument;
module.exports.validateOpenApiDocument = validateOpenApiDocument;
