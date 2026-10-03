/**
 * Embedded Exhibit Generator Component
 * Renders high-fidelity, native CSS/SVG mockups for CLI terminals,
 * Windows GUI dialogs, cable pinout visualizers, and network topology maps,
 * alongside authentic high-resolution scans extracted directly from the original Pearson VUE exam dump.
 */

export function renderExhibitWithTabs(question) {
  const hasOriginalImage = Boolean(question.imageExhibit);
  const hasInteractiveMockup = Boolean(question.exhibit);

  if (!hasOriginalImage && !hasInteractiveMockup) return '';

  const imgSrc = question.imageExhibit ? (question.imageExhibit.data || question.imageExhibit.file) : '';
  const nativeHtml = question.exhibit ? renderExhibit(question.exhibit) : '';

  // If both original scan and interactive vector exist, provide tab switcher
  if (hasOriginalImage && hasInteractiveMockup) {
    return `
      <div class="exhibit-with-tabs-container">
        <div class="exhibit-view-tabs" role="tablist">
          <button type="button" class="exhibit-tab-btn active" data-tab="original">
            &#128247; Original Exam Screenshot
          </button>
          <button type="button" class="exhibit-tab-btn" data-tab="interactive">
            &#9881; Native High-Res Render
          </button>
        </div>
        <div class="exhibit-tab-content" id="tabContentOriginal">
          <div class="exam-image-frame">
            <img src="${imgSrc}" alt="Official Exam Exhibit Screenshot" class="exam-screenshot-img" />
            <div class="image-caption-bar">
              <span>&#9432; Authentic scan from Certiport / Pearson VUE Testing Engine</span>
            </div>
          </div>
        </div>
        <div class="exhibit-tab-content" id="tabContentInteractive" style="display: none;">
          ${nativeHtml}
        </div>
      </div>
    `;
  }

  // If only original image exists
  if (hasOriginalImage) {
    return `
      <div class="exam-image-frame">
        <img src="${imgSrc}" alt="Official Exam Exhibit Screenshot" class="exam-screenshot-img" />
        <div class="image-caption-bar">
          <span>&#9432; Authentic scan from Certiport / Pearson VUE Testing Engine</span>
        </div>
      </div>
    `;
  }

  // If only native mockup exists
  return nativeHtml;
}

export function renderExhibit(exhibit) {
  if (!exhibit) return '';

  switch (exhibit.type) {
    case 'cli-terminal':
      return renderCliTerminal(exhibit);
    case 'win-dialog':
      return renderWinDialog(exhibit);
    case 'cable-pinout':
      return renderCableExhibit(exhibit);
    case 'topology-map':
      return renderTopologyCanvas(exhibit);
    default:
      return `<div class="generic-exhibit"><p>${exhibit.content || ''}</p></div>`;
  }
}

/**
 * Windows Command Prompt Component (<CliTerminal />)
 */
export function renderCliTerminal(exhibit) {
  const title = exhibit.title || "Command Prompt";
  const escapedContent = (exhibit.content || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `
    <div class="terminal-window" role="region" aria-label="${title}">
      <div class="terminal-header">
        <div class="terminal-title-group">
          <svg class="terminal-icon" viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
            <rect x="1" y="2" width="14" height="11" rx="1" fill="#000" stroke="#aaa" stroke-width="1"/>
            <path d="M4 5 L7 7.5 L4 10" stroke="#0f0" stroke-width="1.2" fill="none" stroke-linecap="round"/>
            <line x1="8" y1="10" x2="11" y2="10" stroke="#fff" stroke-width="1.2"/>
          </svg>
          <span class="terminal-title">${title}</span>
        </div>
        <div class="terminal-window-controls">
          <span class="ctrl-btn minimize" title="Minimize">_</span>
          <span class="ctrl-btn maximize" title="Maximize">&#9634;</span>
          <span class="ctrl-btn close" title="Close">&times;</span>
        </div>
      </div>
      <div class="terminal-body-container">
        <pre class="terminal-body">${escapedContent}</pre>
      </div>
    </div>
  `;
}

/**
 * Windows Network Properties Dialog (<WinDialog />)
 */
export function renderWinDialog(exhibit) {
  const content = exhibit.content || {};
  const isWireless = content.dialogType === 'wireless-properties';

  if (isWireless) {
    return renderWirelessDialog(exhibit.title, content);
  }

  const dhcpEnabled = content.dhcpEnabled || false;
  const ipParts = (content.ipAddress || "...").split(".");
  const maskParts = (content.subnetMask || "...").split(".");
  const gwParts = (content.defaultGateway || "...").split(".");
  const dnsParts = (content.preferredDns || "...").split(".");
  const altDnsParts = (content.alternateDns || "...").split(".");

  const renderOctets = (parts, disabled) => {
    return `
      <div class="octet-group ${disabled ? 'disabled' : ''}">
        <span class="octet-box">${parts[0] || '&nbsp;'}</span><span class="octet-dot">.</span>
        <span class="octet-box">${parts[1] || '&nbsp;'}</span><span class="octet-dot">.</span>
        <span class="octet-box">${parts[2] || '&nbsp;'}</span><span class="octet-dot">.</span>
        <span class="octet-box">${parts[3] || '&nbsp;'}</span>
      </div>
    `;
  };

  return `
    <div class="win-dialog" role="dialog" aria-label="${exhibit.title || 'Internet Protocol Version 4 Properties'}">
      <div class="win-dialog-titlebar">
        <div class="win-title-left">
          <svg class="win-net-icon" viewBox="0 0 16 16" width="15" height="15" fill="#0078d7">
            <path d="M0 3h16v10H0z" fill="#0284c7" opacity="0.3"/>
            <rect x="2" y="5" width="12" height="6" fill="#fff" stroke="#0284c7" stroke-width="1"/>
            <circle cx="8" cy="8" r="1.5" fill="#0284c7"/>
          </svg>
          <span class="win-dialog-title">${exhibit.title || 'Internet Protocol Version 4 (TCP/IPv4) Properties'}</span>
        </div>
        <div class="win-dialog-controls">
          <button class="win-ctrl-help" title="Help">?</button>
          <button class="win-ctrl-close" title="Close">&times;</button>
        </div>
      </div>

      <div class="win-dialog-tabs">
        <div class="win-tab active">General</div>
        <div class="win-tab">Alternate Configuration</div>
      </div>

      <div class="win-dialog-body">
        <p class="win-dialog-intro">
          You can get IP settings assigned automatically if your network supports this capability. Otherwise, you need to ask your network administrator for the appropriate IP settings.
        </p>

        <div class="win-section">
          <label class="win-radio-label">
            <input type="radio" name="ip-mode" ${dhcpEnabled ? 'checked' : ''} disabled />
            <span>Obtain an IP address automatically</span>
          </label>
          <label class="win-radio-label">
            <input type="radio" name="ip-mode" ${!dhcpEnabled ? 'checked' : ''} disabled />
            <span>Use the following IP address:</span>
          </label>

          <div class="win-fields-indent">
            <div class="win-field-row">
              <span class="field-label">IP address:</span>
              ${renderOctets(ipParts, dhcpEnabled)}
            </div>
            <div class="win-field-row">
              <span class="field-label">Subnet mask:</span>
              ${renderOctets(maskParts, dhcpEnabled)}
            </div>
            <div class="win-field-row">
              <span class="field-label">Default gateway:</span>
              ${renderOctets(gwParts, dhcpEnabled)}
            </div>
          </div>
        </div>

        <div class="win-section divider-top">
          <label class="win-radio-label">
            <input type="radio" name="dns-mode" ${content.dnsAutomatic ? 'checked' : ''} disabled />
            <span>Obtain DNS server address automatically</span>
          </label>
          <label class="win-radio-label">
            <input type="radio" name="dns-mode" ${!content.dnsAutomatic ? 'checked' : ''} disabled />
            <span>Use the following DNS server addresses:</span>
          </label>

          <div class="win-fields-indent">
            <div class="win-field-row">
              <span class="field-label">Preferred DNS server:</span>
              ${renderOctets(dnsParts, content.dnsAutomatic)}
            </div>
            <div class="win-field-row">
              <span class="field-label">Alternate DNS server:</span>
              ${renderOctets(altDnsParts, content.dnsAutomatic)}
            </div>
          </div>
        </div>

        <div class="win-dialog-actions-row">
          <label class="win-checkbox-label">
            <input type="checkbox" disabled />
            <span>Validate settings upon exit</span>
          </label>
          <button class="win-btn win-btn-adv" disabled>Advanced...</button>
        </div>
      </div>

      <div class="win-dialog-footer">
        <button class="win-btn win-btn-primary">OK</button>
        <button class="win-btn">Cancel</button>
      </div>
    </div>
  `;
}

function renderWirelessDialog(title, content) {
  return `
    <div class="win-dialog" role="dialog" aria-label="${title}">
      <div class="win-dialog-titlebar">
        <div class="win-title-left">
          <svg viewBox="0 0 16 16" width="15" height="15" fill="#0284c7">
            <path d="M8 12a2 2 0 100 4 2 2 0 000-4zm-4.9-2.9a7 7 0 019.8 0l1.4-1.4a9 9 0 00-12.6 0l1.4 1.4zm-2.8-2.8a11 11 0 0115.4 0l1.4-1.4a13 13 0 00-18.2 0l1.4 1.4z"/>
          </svg>
          <span class="win-dialog-title">${title}</span>
        </div>
        <div class="win-dialog-controls">
          <button class="win-ctrl-close">&times;</button>
        </div>
      </div>

      <div class="win-dialog-tabs">
        <div class="win-tab">Connection</div>
        <div class="win-tab active">Security</div>
      </div>

      <div class="win-dialog-body">
        <div class="win-section">
          <div class="win-field-row-horizontal">
            <span class="field-label-w">Security type:</span>
            <div class="win-mock-select">${content.securityType || '802.1X'} &#9662;</div>
          </div>
          <div class="win-field-row-horizontal">
            <span class="field-label-w">Encryption type:</span>
            <div class="win-mock-select">${content.encryptionType || 'AES'} &#9662;</div>
          </div>
          <div class="win-field-row-horizontal">
            <span class="field-label-w">Choose a network authentication method:</span>
            <div class="win-mock-select">Microsoft: Protected EAP (PEAP) &#9662;</div>
          </div>
          <div class="win-dialog-actions-row">
            <button class="win-btn">Settings...</button>
            <label class="win-checkbox-label" style="margin-left: 15px;">
              <input type="checkbox" checked disabled />
              <span>Remember my credentials</span>
            </label>
          </div>
        </div>

        <div class="win-section divider-top">
          <button class="win-btn win-btn-adv" disabled>Advanced settings</button>
        </div>
      </div>

      <div class="win-dialog-footer">
        <button class="win-btn win-btn-primary">OK</button>
        <button class="win-btn">Cancel</button>
      </div>
    </div>
  `;
}

/**
 * Physical RJ-45 & Cable Pinout Visualizer (<CableExhibit />)
 */
export function renderCableExhibit(exhibit) {
  const title = exhibit.title || "RJ-45 Modular Connector (T568B)";
  return `
    <div class="cable-visualizer-container" role="region" aria-label="${title}">
      <div class="visualizer-header">
        <div class="vis-title">${title}</div>
        <div class="vis-badge">TIA/EIA-568-B Standard</div>
      </div>
      <div class="svg-wrapper">
        <svg viewBox="0 0 540 320" class="cable-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="plugBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e0f2fe" stop-opacity="0.85"/>
              <stop offset="50%" stop-color="#bae6fd" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.75"/>
            </linearGradient>
            <linearGradient id="goldPin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#fef08a"/>
              <stop offset="50%" stop-color="#eab308"/>
              <stop offset="100%" stop-color="#ca8a04"/>
            </linearGradient>
            <linearGradient id="cableJacket" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#475569"/>
              <stop offset="50%" stop-color="#334155"/>
              <stop offset="100%" stop-color="#1e293b"/>
            </linearGradient>
            <pattern id="stripeOrange" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <rect width="4" height="8" fill="#ffffff"/>
              <rect x="4" width="4" height="8" fill="#f97316"/>
            </pattern>
            <pattern id="stripeGreen" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <rect width="4" height="8" fill="#ffffff"/>
              <rect x="4" width="4" height="8" fill="#22c55e"/>
            </pattern>
            <pattern id="stripeBlue" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <rect width="4" height="8" fill="#ffffff"/>
              <rect x="4" width="4" height="8" fill="#3b82f6"/>
            </pattern>
            <pattern id="stripeBrown" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <rect width="4" height="8" fill="#ffffff"/>
              <rect x="4" width="4" height="8" fill="#92400e"/>
            </pattern>
          </defs>

          <!-- Outer Cable Jacket -->
          <rect x="15" y="100" width="130" height="120" rx="10" fill="url(#cableJacket)" stroke="#0f172a" stroke-width="2"/>
          <text x="80" y="165" fill="#f8fafc" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">Cat 6 UTP</text>

          <!-- Transparent RJ-45 Plug Housing -->
          <path d="M 140 70 L 410 70 L 410 95 L 450 95 L 450 225 L 410 225 L 410 250 L 140 250 Z" 
                fill="url(#plugBody)" stroke="#0284c7" stroke-width="2.5" stroke-linejoin="round"/>

          <!-- Retaining Latch Clip -->
          <path d="M 230 68 L 330 35 L 340 40 L 260 68 Z" fill="#93c5fd" opacity="0.8" stroke="#0284c7" stroke-width="1.5"/>

          <!-- 8 Conductors (Wires) -->
          <rect x="145" y="85" width="265" height="14" rx="2" fill="url(#stripeOrange)" stroke="#ea580c" stroke-width="1"/>
          <rect x="145" y="102" width="265" height="14" rx="2" fill="#ea580c" stroke="#c2410c" stroke-width="1"/>
          <rect x="145" y="119" width="265" height="14" rx="2" fill="url(#stripeGreen)" stroke="#16a34a" stroke-width="1"/>
          <rect x="145" y="136" width="265" height="14" rx="2" fill="#2563eb" stroke="#1d4ed8" stroke-width="1"/>
          <rect x="145" y="153" width="265" height="14" rx="2" fill="url(#stripeBlue)" stroke="#2563eb" stroke-width="1"/>
          <rect x="145" y="170" width="265" height="14" rx="2" fill="#16a34a" stroke="#15803d" stroke-width="1"/>
          <rect x="145" y="187" width="265" height="14" rx="2" fill="url(#stripeBrown)" stroke="#78350f" stroke-width="1"/>
          <rect x="145" y="204" width="265" height="14" rx="2" fill="#78350f" stroke="#451a03" stroke-width="1"/>

          <!-- 8 Gold Pins at Connector Tip -->
          <g>
            <rect x="412" y="86" width="30" height="12" rx="1.5" fill="url(#goldPin)" stroke="#854d0e" stroke-width="0.8"/>
            <rect x="412" y="103" width="30" height="12" rx="1.5" fill="url(#goldPin)" stroke="#854d0e" stroke-width="0.8"/>
            <rect x="412" y="120" width="30" height="12" rx="1.5" fill="url(#goldPin)" stroke="#854d0e" stroke-width="0.8"/>
            <rect x="412" y="137" width="30" height="12" rx="1.5" fill="url(#goldPin)" stroke="#854d0e" stroke-width="0.8"/>
            <rect x="412" y="154" width="30" height="12" rx="1.5" fill="url(#goldPin)" stroke="#854d0e" stroke-width="0.8"/>
            <rect x="412" y="171" width="30" height="12" rx="1.5" fill="url(#goldPin)" stroke="#854d0e" stroke-width="0.8"/>
            <rect x="412" y="188" width="30" height="12" rx="1.5" fill="url(#goldPin)" stroke="#854d0e" stroke-width="0.8"/>
            <rect x="412" y="205" width="30" height="12" rx="1.5" fill="url(#goldPin)" stroke="#854d0e" stroke-width="0.8"/>
          </g>

          <g font-size="11" font-weight="bold" fill="#0f172a" font-family="sans-serif">
            <text x="460" y="96">Pin 1 (W-Org)</text>
            <text x="460" y="113">Pin 2 (Org)</text>
            <text x="460" y="130">Pin 3 (W-Grn)</text>
            <text x="460" y="147">Pin 4 (Blu)</text>
            <text x="460" y="164">Pin 5 (W-Blu)</text>
            <text x="460" y="181">Pin 6 (Grn)</text>
            <text x="460" y="198">Pin 7 (W-Brn)</text>
            <text x="460" y="215">Pin 8 (Brn)</text>
          </g>
        </svg>
      </div>
      <div class="cable-legend-bar">
        <span class="legend-item"><span class="color-chip w-org"></span> 1. White/Orange</span>
        <span class="legend-item"><span class="color-chip org"></span> 2. Orange</span>
        <span class="legend-item"><span class="color-chip w-grn"></span> 3. White/Green</span>
        <span class="legend-item"><span class="color-chip blu"></span> 4. Blue</span>
        <span class="legend-item"><span class="color-chip w-blu"></span> 5. White/Blue</span>
        <span class="legend-item"><span class="color-chip grn"></span> 6. Green</span>
        <span class="legend-item"><span class="color-chip w-brn"></span> 7. White/Brown</span>
        <span class="legend-item"><span class="color-chip brn"></span> 8. Brown</span>
      </div>
    </div>
  `;
}

/**
 * Topology & Perimeter Network Map (<TopologyCanvas />)
 */
export function renderTopologyCanvas(exhibit) {
  const title = exhibit.title || "Network Architecture & Security Zones";
  return `
    <div class="topology-canvas-container" role="region" aria-label="${title}">
      <div class="visualizer-header">
        <div class="vis-title">${title}</div>
        <div class="vis-badge">Three-Leg Perimeter / Multi-Tier Model</div>
      </div>
      <div class="svg-wrapper">
        <svg viewBox="0 0 680 380" class="topology-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#e0f2fe"/>
              <stop offset="100%" stop-color="#93c5fd"/>
            </linearGradient>
            <linearGradient id="fwGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#dc2626"/>
              <stop offset="100%" stop-color="#ef4444"/>
            </linearGradient>
            <linearGradient id="serverGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#f8fafc"/>
              <stop offset="100%" stop-color="#cbd5e1"/>
            </linearGradient>
          </defs>

          <!-- Zone 1: Public Internet Cloud -->
          <g transform="translate(30, 140)">
            <ellipse cx="60" cy="50" rx="55" ry="35" fill="url(#cloudGrad)" stroke="#0284c7" stroke-width="2"/>
            <circle cx="45" cy="35" r="25" fill="url(#cloudGrad)"/>
            <circle cx="85" cy="38" r="22" fill="url(#cloudGrad)"/>
            <circle cx="65" cy="25" r="22" fill="url(#cloudGrad)"/>
            <text x="60" y="55" text-anchor="middle" font-size="12" font-weight="bold" fill="#0369a1" font-family="sans-serif">The Internet</text>
            <text x="60" y="70" text-anchor="middle" font-size="10" fill="#475569" font-family="sans-serif">(Untrusted Zone)</text>
          </g>

          <line x1="145" y1="185" x2="210" y2="185" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4,3"/>
          <polygon points="175,178 185,185 175,192" fill="#d97706"/>
          <text x="178" y="172" text-anchor="middle" font-size="10" font-weight="bold" fill="#b45309" font-family="sans-serif">WAN / T3 Link</text>

          <!-- Firewall 1 -->
          <g transform="translate(210, 125)">
            <rect x="0" y="0" width="30" height="120" rx="4" fill="url(#fwGrad)" stroke="#991b1b" stroke-width="2"/>
            <line x1="0" y1="30" x2="30" y2="30" stroke="#fecaca" stroke-width="1.5"/>
            <line x1="0" y1="60" x2="30" y2="60" stroke="#fecaca" stroke-width="1.5"/>
            <line x1="0" y1="90" x2="30" y2="90" stroke="#fecaca" stroke-width="1.5"/>
            <text x="15" y="135" text-anchor="middle" font-size="10" font-weight="bold" fill="#991b1b" font-family="sans-serif">Firewall</text>
          </g>

          <!-- DMZ Perimeter Network -->
          <line x1="240" y1="155" x2="340" y2="155" stroke="#0284c7" stroke-width="3"/>
          <line x1="340" y1="155" x2="340" y2="80" stroke="#0284c7" stroke-width="3"/>
          <line x1="340" y1="80" x2="430" y2="80" stroke="#0284c7" stroke-width="4"/>

          <rect x="290" y="30" width="220" height="95" rx="8" fill="#fef3c7" fill-opacity="0.4" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,2"/>
          <text x="300" y="48" font-size="11" font-weight="bold" fill="#b45309" font-family="sans-serif">PERIMETER NETWORK (DMZ)</text>

          <g transform="translate(370, 50)">
            <rect x="0" y="0" width="50" height="40" rx="3" fill="url(#serverGrad)" stroke="#475569" stroke-width="1.5"/>
            <circle cx="40" cy="25" r="2.5" fill="#22c55e"/>
            <text x="25" y="52" text-anchor="middle" font-size="9" font-weight="bold" fill="#0f172a" font-family="sans-serif">Web Server</text>
            <text x="25" y="62" text-anchor="middle" font-size="8" fill="#64748b" font-family="sans-serif">www.contoso.com</text>
          </g>

          <!-- Internal Firewall -->
          <g transform="translate(390, 160)">
            <rect x="0" y="0" width="26" height="110" rx="4" fill="url(#fwGrad)" stroke="#991b1b" stroke-width="2"/>
            <text x="13" y="125" text-anchor="middle" font-size="10" font-weight="bold" fill="#991b1b" font-family="sans-serif">Internal FW</text>
          </g>

          <line x1="240" y1="215" x2="390" y2="215" stroke="#0284c7" stroke-width="3"/>
          <line x1="416" y1="215" x2="480" y2="215" stroke="#0284c7" stroke-width="3"/>

          <!-- Internal LAN -->
          <rect x="470" y="140" width="195" height="190" rx="8" fill="#f0fdf4" fill-opacity="0.6" stroke="#16a34a" stroke-width="1.5" stroke-dasharray="4,2"/>
          <text x="480" y="160" font-size="11" font-weight="bold" fill="#15803d" font-family="sans-serif">INTERNAL LAN (Trusted)</text>

          <g transform="translate(485, 200)">
            <rect x="0" y="0" width="70" height="28" rx="3" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
            <circle cx="10" cy="14" r="2.5" fill="#22c55e"/>
            <circle cx="20" cy="14" r="2.5" fill="#22c55e"/>
            <circle cx="30" cy="14" r="2.5" fill="#22c55e"/>
            <text x="35" y="40" text-anchor="middle" font-size="9" fill="#334155" font-weight="bold" font-family="sans-serif">LAN Switch</text>
          </g>

          <g transform="translate(580, 180)">
            <rect x="0" y="0" width="28" height="22" rx="2" fill="#f1f5f9" stroke="#334155" stroke-width="1.2"/>
            <text x="38" y="16" font-size="9" fill="#0f172a" font-family="sans-serif">PC 1</text>
          </g>

          <g transform="translate(500, 260)">
            <rect x="0" y="0" width="55" height="42" rx="3" fill="url(#serverGrad)" stroke="#15803d" stroke-width="1.5"/>
            <circle cx="45" cy="28" r="2.5" fill="#22c55e"/>
            <text x="27" y="55" text-anchor="middle" font-size="9" font-weight="bold" fill="#15803d" font-family="sans-serif">HR Server</text>
            <text x="27" y="65" text-anchor="middle" font-size="8" fill="#64748b" font-family="sans-serif">hr.contoso.com</text>
          </g>

          <g transform="translate(30, 290)">
            <rect x="0" y="0" width="55" height="42" rx="3" fill="#e2e8f0" stroke="#d97706" stroke-width="1.5"/>
            <text x="27" y="20" text-anchor="middle" font-size="8" font-weight="bold" fill="#92400e" font-family="sans-serif">Sales Partner</text>
            <text x="27" y="32" text-anchor="middle" font-size="7" fill="#64748b" font-family="sans-serif">northwindtraders</text>
          </g>

          <path d="M 85 311 Q 145 285 210 230" fill="none" stroke="#d97706" stroke-width="4" stroke-dasharray="6,4"/>
          <text x="140" y="275" font-size="9" font-weight="bold" fill="#b45309" font-family="sans-serif">VPN Tunnel</text>
        </svg>
      </div>
    </div>
  `;
}
