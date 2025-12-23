// Translation System
const translations = {
  ar: {
    'mrjoker.bio.title': 'نبذة مختصرة',
    'mrjoker.bio.description': 'باحث أمني ومطوّر أدوات هجومية، أركّز على تحويل الأفكار إلى أدوات عملية دقيقة وقابلة للاستخدام الحقيقي، مع اهتمام عالٍ بالأداء، الأمان، والتصميم النظيف.',
    'mrjoker.stats.repos': 'المستودعات',
    'mrjoker.stats.stars': 'النجوم',
    'mrjoker.stats.followers': 'المتابِعون',
    'mrjoker.stats.following': 'تتابِع',
    'mrjoker.overview.title': 'نظرة سريعة',
    'mrjoker.overview.description': 'إيقاع إنتاجي مستمر • جودة الكود • نشاط عام',
    'mrjoker.tech.title': 'ملف شخصي تقني',
    'badge.security': 'Security Research',
    'badge.builder': 'Builder',
    'badge.solver': 'Problem Solver',
    'badge.design': 'Clean Design'
  },
  en: {
    'mrjoker.bio.title': 'Brief Bio',
    'mrjoker.bio.description': 'Security researcher and offensive tool developer, focused on turning ideas into precise, real-world usable tools with high attention to performance, security, and clean design.',
    'mrjoker.stats.repos': 'Repositories',
    'mrjoker.stats.stars': 'Stars',
    'mrjoker.stats.followers': 'Followers',
    'mrjoker.stats.following': 'Following',
    'mrjoker.overview.title': 'Quick Overview',
    'mrjoker.overview.description': 'Consistent productive rhythm • Code quality • General activity',
    'mrjoker.tech.title': 'Technical Profile',
    'badge.security': 'Security Research',
    'badge.builder': 'Builder',
    'badge.solver': 'Problem Solver',
    'badge.design': 'Clean Design'
  }
}

// Get locale from localStorage or default to 'ar'
function getLocale() {
  return localStorage.getItem('mrjoker_locale') || 'ar'
}

// Set locale
function setLocale(locale) {
  localStorage.setItem('mrjoker_locale', locale)
  document.documentElement.lang = locale
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
  updateTranslations()
  updateSEO(locale)
}

// Translate text
function t(key) {
  const locale = getLocale()
  return translations[locale]?.[key] || key
}

// Update all translations on page
function updateTranslations() {
  const locale = getLocale()
  const dict = translations[locale] || {}
  
  // Update elements with data-key attribute
  document.querySelectorAll('[data-key]').forEach(el => {
    const key = el.getAttribute('data-key')
    if (dict[key]) {
      el.textContent = dict[key]
    }
  })
  
  // Update lang toggle button
  const langToggle = document.getElementById('lang-toggle')
  if (langToggle) {
    langToggle.textContent = locale === 'ar' ? 'EN' : 'AR'
  }
}

// Update SEO meta tags
function updateSEO(locale) {
  const isAr = locale === 'ar'
  
  const seoTitle = isAr
    ? 'Mr Joker (vv1ck) - باحث أمني ومطوّر أدوات | Cat Hack'
    : 'Mr Joker (vv1ck) - Security Researcher & Tool Developer | Cat Hack'
  
  const seoDescription = isAr
    ? 'باحث أمني ومطوّر أدوات هجومية، أركّز على تحويل الأفكار إلى أدوات عملية دقيقة وقابلة للاستخدام الحقيقي، مع اهتمام عالٍ بالأداء، الأمان، والتصميم النظيف. متخصص في Offensive Security، Reverse Engineering، وAutomation.'
    : 'Security researcher and offensive tool developer, focused on turning ideas into precise, real-world usable tools with high attention to performance, security, and clean design. Specialized in Offensive Security, Reverse Engineering, and Automation.'
  
  // Update title
  document.title = seoTitle
  const titleMeta = document.getElementById('seo-title')
  if (titleMeta) titleMeta.textContent = seoTitle
  
  // Update description
  const descMeta = document.getElementById('seo-description')
  if (descMeta) descMeta.setAttribute('content', seoDescription)
  
  // Update Open Graph
  const ogTitle = document.getElementById('og-title')
  if (ogTitle) ogTitle.setAttribute('content', seoTitle)
  const ogDesc = document.getElementById('og-description')
  if (ogDesc) ogDesc.setAttribute('content', seoDescription)
  
  // Update Twitter
  const twitterTitle = document.getElementById('twitter-title')
  if (twitterTitle) twitterTitle.setAttribute('content', seoTitle)
  const twitterDesc = document.getElementById('twitter-description')
  if (twitterDesc) twitterDesc.setAttribute('content', seoDescription)
  
  // Update structured data
  const structuredData = document.getElementById('structured-data')
  if (structuredData) {
    const data = JSON.parse(structuredData.textContent)
    data.jobTitle = isAr ? 'باحث أمني ومطوّر أدوات' : 'Security Researcher & Tool Developer'
    data.description = seoDescription
    structuredData.textContent = JSON.stringify(data)
  }
}

// Load GitHub Stats
async function loadGitHubStats() {
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch('https://api.github.com/users/vv1ck'),
      fetch('https://api.github.com/users/vv1ck/repos?per_page=100')
    ])
    
    const user = await userRes.json()
    const repos = await reposRes.json()
    
    const stars = Array.isArray(repos) 
      ? repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
      : 0
    
    const stats = {
      repos: user.public_repos || (Array.isArray(repos) ? repos.length : 0),
      stars: stars,
      followers: user.followers || 0,
      following: user.following || 0
    }
    
    // Update DOM
    document.getElementById('stat-repos').textContent = stats.repos
    document.getElementById('stat-stars').textContent = stats.stars
    document.getElementById('stat-followers').textContent = stats.followers
    document.getElementById('stat-following').textContent = stats.following
  } catch (error) {
    console.error('Failed to load GitHub stats:', error)
    // Keep the "—" placeholder on error
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  document.getElementById('current-year').textContent = new Date().getFullYear()
  
  // Initialize locale
  const locale = getLocale()
  setLocale(locale)
  
  // Setup lang toggle
  const langToggle = document.getElementById('lang-toggle')
  if (langToggle) {
    langToggle.addEventListener('click', () => {
      const current = getLocale()
      const next = current === 'ar' ? 'en' : 'ar'
      setLocale(next)
    })
  }
  
  // Load GitHub stats
  loadGitHubStats()
  
  // Add fade-in animation to profile card
  const profileCard = document.querySelector('.profile-card')
  if (profileCard) {
    profileCard.style.animation = 'fadeInUp 0.6s ease-out both'
  }
})

