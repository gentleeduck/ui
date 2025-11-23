function getDomain(input) {
  if (!input || typeof input !== 'string') return null

  // Strip browser-internal pages
  const forbidden = ['chrome://', 'edge://', 'about:', 'moz-extension://', 'chrome-extension://']
  if (forbidden.some((p) => input.startsWith(p))) return null

  let url = input.trim()

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function generateFontCSS(font, importUrl) {
  if (!font || !importUrl) return ''

  return [
    `@import url('${importUrl}');`,
    `*, *::before, *::after {`,
    `  font-family: '${font.family}', sans-serif !important;`,
    `}`,
  ].join('\n')
}

function applyFont(font, importUrl) {
  // Remove existing font link
  let link = document.getElementById('gentleduck-font-link')
  if (link) link.remove()

  // Add Google Fonts link
  if (importUrl) {
    link = document.createElement('link')
    link.id = 'gentleduck-font-link'
    link.rel = 'stylesheet'
    link.href = importUrl
    document.head.appendChild(link)
  }

  // Remove existing style
  let style = document.getElementById('gentleduck-font-style')
  if (style) style.remove()

  // Add font CSS
  const css = generateFontCSS(font, importUrl)
  if (css) {
    style = document.createElement('style')
    style.id = 'gentleduck-font-style'
    style.textContent = css
    document.head.appendChild(style)
  }

  if (font?.family) {
    console.log('🔥 Gentleduck font applied:', font.family)
  }
}

function removeFont() {
  const link = document.getElementById('gentleduck-font-link')
  if (link) link.remove()

  const style = document.getElementById('gentleduck-font-style')
  if (style) style.remove()
}

function applyGentleduck() {
  const domain = getDomain(window.location.href)
  if (!domain) {
    removeFont()
    return
  }

  chrome.storage.sync.get(['gentleduck_domainFonts', 'gentleduck_disabledDomains'], (data) => {
    const domainFonts = data.gentleduck_domainFonts || {}
    const disabledDomains = data.gentleduck_disabledDomains || []

    // Check if domain is disabled
    if (disabledDomains.includes(domain)) {
      removeFont()
      return
    }

    // Get font for this domain
    const font = domainFonts[domain]
    if (!font) {
      removeFont()
      return
    }

    // Generate import URL
    const importUrl = `https://fonts.googleapis.com/css2?family=${font.family.replaceAll(
      ' ',
      '+',
    )}:wght@${font.variants.join(';')}&display=swap`

    applyFont(font, importUrl)
  })
}

// Inject toggle button
function injectToggleButton() {
  // Check if button already exists
  if (document.getElementById('gentleduck-toggle-btn')) return

  const domain = getDomain(window.location.href)
  if (!domain) return

  // Only show button if domain is in the list
  chrome.storage.sync.get(['gentleduck_domainFonts'], (data) => {
    const domainFonts = data.gentleduck_domainFonts || {}
    
    // Only inject button if this domain has a font configured
    if (!domainFonts[domain]) {
      return
    }

    // Create button
    const button = document.createElement('button')
    button.id = 'gentleduck-toggle-btn'
    button.innerHTML = '🔤'
    button.title = 'Toggle Gentleduck Extension'
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: #000;
      color: #fff;
      border: 2px solid #fff;
      cursor: pointer;
      z-index: 999999;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      transition: all 0.2s;
      user-select: none;
      -webkit-user-select: none;
      padding: 0;
      margin: 0;
    `

    // Check initial state
    chrome.storage.sync.get(['gentleduck_disabledDomains'], (data) => {
      const disabledDomains = data.gentleduck_disabledDomains || []
      const isDisabled = disabledDomains.includes(domain)
      updateButtonState(button, isDisabled)
    })

    // Add hover effects
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'scale(1.1)'
      button.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.4)'
    })

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)'
      button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
    })

    // Toggle on click
    button.addEventListener('click', () => {
      chrome.storage.sync.get(['gentleduck_disabledDomains'], (data) => {
        const disabledDomains = data.gentleduck_disabledDomains || []
        const isDisabled = disabledDomains.includes(domain)
        const newDisabledDomains = isDisabled ? disabledDomains.filter((d) => d !== domain) : [...disabledDomains, domain]

        chrome.storage.sync.set({ gentleduck_disabledDomains: newDisabledDomains }, () => {
          updateButtonState(button, !isDisabled)
          applyGentleduck()
        })
      })
    })

    document.body.appendChild(button)
  })
}

function updateButtonState(button, isDisabled) {
  if (isDisabled) {
    button.style.opacity = '0.5'
    button.style.background = '#666'
    button.title = 'Enable Gentleduck Extension'
  } else {
    button.style.opacity = '1'
    button.style.background = '#000'
    button.title = 'Disable Gentleduck Extension'
  }
}

// Run on page load
function init() {
  applyGentleduck()

  // Wait a bit for body to be ready, then inject button
  if (document.body) {
    injectToggleButton()
  } else {
    const observer = new MutationObserver(() => {
      if (document.body) {
        injectToggleButton()
        observer.disconnect()
      }
    })
    observer.observe(document.documentElement, { childList: true, subtree: true })
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return
  if (changes.gentleduck_domainFonts || changes.gentleduck_disabledDomains) {
    applyGentleduck()

    const domain = getDomain(window.location.href)
    if (!domain) return

    // Check if domain is still in the list
    chrome.storage.sync.get(['gentleduck_domainFonts'], (data) => {
      const domainFonts = data.gentleduck_domainFonts || {}
      const button = document.getElementById('gentleduck-toggle-btn')
      
      if (domainFonts[domain]) {
        // Domain is in list - show/update button
        if (!button) {
          injectToggleButton()
        } else {
          chrome.storage.sync.get(['gentleduck_disabledDomains'], (data) => {
            const disabledDomains = data.gentleduck_disabledDomains || []
            updateButtonState(button, disabledDomains.includes(domain))
          })
        }
      } else {
        // Domain removed from list - remove button
        if (button) {
          button.remove()
        }
      }
    })
  }
})

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'UPDATE_FONT') {
    applyGentleduck()

    const domain = getDomain(window.location.href)
    if (!domain) return

    // Check if domain is in the list
    chrome.storage.sync.get(['gentleduck_domainFonts'], (data) => {
      const domainFonts = data.gentleduck_domainFonts || {}
      const button = document.getElementById('gentleduck-toggle-btn')
      
      if (domainFonts[domain]) {
        // Domain is in list - show/update button
        if (!button) {
          injectToggleButton()
        } else {
          chrome.storage.sync.get(['gentleduck_disabledDomains'], (data) => {
            const disabledDomains = data.gentleduck_disabledDomains || []
            updateButtonState(button, disabledDomains.includes(domain))
          })
        }
      } else {
        // Domain not in list - remove button
        if (button) {
          button.remove()
        }
      }
    })
  }
})
