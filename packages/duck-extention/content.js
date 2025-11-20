function applyGentleduck(config) {
  const hostname = window.location.hostname

  const match = config.whiteList.find((item) => {
    const itemHost = item.url
    return hostname === itemHost
  })

  const isWhitelisted = match && !match.disabled

  if (isWhitelisted) {
    const style = document.getElementById('gentleduck-font-style')
    if (style) style.remove()

    return
  }

  // Continue if NOT whitelisted…

  if (!config) return

  const { font, themeKey, url, css } = config

  // 1) Google Fonts <link>
  let link = document.getElementById('gentleduck-font-link')
  if (link) link.remove()

  if (url) {
    link = document.createElement('link')
    link.id = 'gentleduck-font-link'
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
  }

  // 2) <style> with CSS (font + theme)
  let style = document.getElementById('gentleduck-font-style')
  if (style) style.remove()

  style = document.createElement('style')
  style.id = 'gentleduck-font-style'
  style.textContent = css || ''
  document.head.appendChild(style)

  // 3) Make sure the theme class exists on <html> (e.g. .dark)
  if (themeKey) {
    document.documentElement.classList.add(themeKey)
  }

  if (font?.family) {
    console.log('🔥 Gentleduck font applied:', font.family, 'theme:', themeKey)
  }
}

// Run on page load
chrome.storage.sync.get('gentleduck_font', (data) => {
  applyGentleduck(data.gentleduck_font)
})

// Run LIVE when popup updates storage (no reload needed)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return
  if (changes.gentleduck_font) {
    applyGentleduck(changes.gentleduck_font.newValue)
  }
})
