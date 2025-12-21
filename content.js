// The Reddit Robocop - AI Detection Content Script
// "Dead or alive, you're coming with me... to the authenticity scanner."

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    scanDelay: 500,
    minTextLength: 50,
    badgeSize: 24,
    animationDuration: 300
  };

  // AI Detection Heuristics
  // These patterns are commonly associated with AI-generated text
  const AI_INDICATORS = {
    // Common AI phrases and patterns
    phrases: [
      /\bdelve\b/gi,
      /\bfosterin?g?\b/gi,
      /\beverchanging\b/gi,
      /\bever-changing\b/gi,
      /\blandscape\b/gi,
      /\btapestry\b/gi,
      /\bholistic\b/gi,
      /\bsynergy\b/gi,
      /\bleverag(e|ing)\b/gi,
      /\bunpack(ing)?\b/gi,
      /\brobust\b/gi,
      /\bseamless(ly)?\b/gi,
      /\bcutting[- ]edge\b/gi,
      /\bgame[- ]?changer\b/gi,
      /\bparadigm\b/gi,
      /\bpivotal\b/gi,
      /\bfacilitat(e|ing)\b/gi,
      /\boptimiz(e|ing)\b/gi,
      /\bstreamlining?\b/gi,
      /\bempowering?\b/gi,
      /\binnovative\b/gi,
      /\btransformative\b/gi,
      /\bgroundbreaking\b/gi,
      /\bnavigate\b/gi,
      /\brealm\b/gi,
      /\bembark(ing)?\b/gi,
      /\bjourney\b/gi,
      /\bin today'?s\b/gi,
      /\bworld of\b/gi,
      /\bit'?s important to (note|remember|understand)\b/gi,
      /\bworth noting\b/gi,
      /\bin conclusion\b/gi,
      /\bhowever,? it'?s\b/gi,
      /\bthat being said\b/gi,
      /\bwith that in mind\b/gi,
      /\brest assured\b/gi,
      /\bi hope (this|that) helps\b/gi,
      /\bfeel free to\b/gi,
      /\bdon'?t hesitate to\b/gi,
      /\bhappy to help\b/gi,
      /\blet me know if\b/gi,
      /\bas an ai\b/gi,
      /\bas a language model\b/gi,
      /\bi don'?t have personal\b/gi,
      /\bi cannot provide\b/gi,
      /\bplethora\b/gi,
      /\bmyriad\b/gi,
      /\bcommenc(e|ing)\b/gi,
      /\butiliz(e|ing)\b/gi,
      /\bfurthermore\b/gi,
      /\bmoreover\b/gi,
      /\bnevertheless\b/gi,
      /\bnonetheless\b/gi,
      /\bconsequently\b/gi,
      /\bsubsequently\b/gi,
      /\badditionally\b/gi,
      /\bmeticulous(ly)?\b/gi,
      /\bcomprehensive\b/gi,
      /\bexemplary\b/gi,
      /\bremember,?\b/gi,
      /\bcrucial(ly)?\b/gi,
      /\bessential(ly)?\b/gi,
      /\bfundamental(ly)?\b/gi,
    ],
    
    // Structural patterns
    structuralPatterns: [
      /^\d+\.\s+\*\*[^*]+\*\*/gm, // Numbered lists with bold headers
      /^[-•]\s+\*\*[^*]+\*\*:/gm, // Bullet points with bold labels
      /\*\*[^*]+\*\*:\s/g, // Bold text followed by colon
      /^(First|Second|Third|Finally|Lastly|In summary),/gm,
    ],
    
    // Emoji patterns (AI often uses emojis in specific ways)
    emojiPatterns: [
      /[😊🙂👍✨🎉💡🚀⭐️🌟💪🔥❤️💯🙏✅]/g
    ]
  };

  // Scoring weights
  const WEIGHTS = {
    phraseMatch: 3,
    structuralMatch: 5,
    emojiCluster: 2,
    sentenceLengthUniformity: 4,
    lowPerplexityIndicator: 3,
    perfectPunctuation: 2,
    listHeavy: 4
  };

  // Analyze text for AI probability
  function analyzeText(text) {
    if (!text || text.length < CONFIG.minTextLength) {
      return { score: 0, confidence: 'low', reasons: ['Text too short to analyze'] };
    }

    let score = 0;
    const reasons = [];
    const textLower = text.toLowerCase();

    // Check for AI phrases
    let phraseMatches = 0;
    AI_INDICATORS.phrases.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        phraseMatches += matches.length;
      }
    });
    
    if (phraseMatches > 0) {
      const phraseScore = Math.min(phraseMatches * WEIGHTS.phraseMatch, 25);
      score += phraseScore;
      reasons.push(`${phraseMatches} AI-typical phrase${phraseMatches > 1 ? 's' : ''} detected`);
    }

    // Check structural patterns
    let structuralMatches = 0;
    AI_INDICATORS.structuralPatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        structuralMatches += matches.length;
      }
    });
    
    if (structuralMatches > 2) {
      score += WEIGHTS.structuralMatch * Math.min(structuralMatches, 5);
      reasons.push('Structured formatting typical of AI');
    }

    // Analyze sentence structure
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    if (sentences.length >= 3) {
      const lengths = sentences.map(s => s.trim().split(/\s+/).length);
      const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
      const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
      const stdDev = Math.sqrt(variance);
      
      // AI text tends to have more uniform sentence lengths
      if (stdDev < 5 && avgLength > 10) {
        score += WEIGHTS.sentenceLengthUniformity;
        reasons.push('Unusually uniform sentence structure');
      }
    }

    // Check for perfect punctuation and capitalization
    const properSentences = text.match(/[A-Z][^.!?]*[.!?]/g) || [];
    if (properSentences.length > 3 && properSentences.length === sentences.length) {
      score += WEIGHTS.perfectPunctuation;
      reasons.push('Suspiciously perfect punctuation');
    }

    // Check for list-heavy content
    const listItems = text.match(/^[\s]*[-•*]\s+/gm) || [];
    const numberedItems = text.match(/^[\s]*\d+[.)]\s+/gm) || [];
    if (listItems.length + numberedItems.length > 3) {
      score += WEIGHTS.listHeavy;
      reasons.push('Heavy use of lists');
    }

    // Check for hedging language
    const hedges = (text.match(/\b(might|could|may|perhaps|possibly|generally|typically|usually|often)\b/gi) || []).length;
    if (hedges > 3) {
      score += 3;
      reasons.push('Excessive hedging language');
    }

    // Normalize score to 0-100
    const normalizedScore = Math.min(Math.round(score * 1.5), 100);
    
    // Determine confidence level
    let confidence;
    if (text.length < 200) {
      confidence = 'low';
    } else if (text.length < 500) {
      confidence = 'medium';
    } else {
      confidence = 'high';
    }

    return {
      score: normalizedScore,
      confidence,
      reasons: reasons.length > 0 ? reasons : ['No strong AI indicators found']
    };
  }

  // Get verdict based on score
  function getVerdict(score) {
    if (score >= 70) return { label: 'LIKELY AI', class: 'robocop-high', icon: '🤖' };
    if (score >= 40) return { label: 'SUSPICIOUS', class: 'robocop-medium', icon: '⚠️' };
    if (score >= 20) return { label: 'UNCERTAIN', class: 'robocop-low', icon: '🔍' };
    return { label: 'LIKELY HUMAN', class: 'robocop-clean', icon: '✓' };
  }

  // Create the badge element
  function createBadge(analysis) {
    const verdict = getVerdict(analysis.score);
    
    const badge = document.createElement('div');
    badge.className = `robocop-badge ${verdict.class}`;
    badge.innerHTML = `
      <span class="robocop-icon">${verdict.icon}</span>
      <span class="robocop-score">${analysis.score}%</span>
    `;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'robocop-tooltip';
    tooltip.innerHTML = `
      <div class="robocop-tooltip-header">
        <span class="robocop-verdict">${verdict.label}</span>
        <span class="robocop-confidence">Confidence: ${analysis.confidence}</span>
      </div>
      <div class="robocop-tooltip-body">
        <div class="robocop-reasons">
          ${analysis.reasons.map(r => `<div class="robocop-reason">• ${r}</div>`).join('')}
        </div>
      </div>
      <div class="robocop-tooltip-footer">
        🚔 Reddit Robocop Analysis
      </div>
    `;
    
    badge.appendChild(tooltip);
    
    badge.addEventListener('click', (e) => {
      e.stopPropagation();
      badge.classList.toggle('robocop-expanded');
    });
    
    return badge;
  }

  // Process a single comment/post
  function processContent(element, textSelector) {
    if (element.dataset.robocopScanned) return;
    element.dataset.robocopScanned = 'true';
    
    const textElement = textSelector ? element.querySelector(textSelector) : element;
    if (!textElement) return;
    
    const text = textElement.innerText || textElement.textContent;
    if (!text || text.length < CONFIG.minTextLength) return;
    
    const analysis = analyzeText(text);
    const badge = createBadge(analysis);
    
    // Find appropriate place to insert badge
    const header = element.querySelector('[data-testid="comment_author_link"], .author, .tagline');
    if (header) {
      header.style.position = 'relative';
      header.appendChild(badge);
    } else {
      element.style.position = 'relative';
      element.insertBefore(badge, element.firstChild);
    }
  }

  // Scan for Reddit content (new Reddit)
  function scanNewReddit() {
    // Comments
    document.querySelectorAll('shreddit-comment:not([data-robocop-scanned])').forEach(comment => {
      comment.dataset.robocopScanned = 'true';
      
      // New Reddit uses shadow DOM, need to handle differently
      const textContent = comment.querySelector('[slot="comment"]');
      if (textContent) {
        const text = textContent.innerText;
        if (text && text.length >= CONFIG.minTextLength) {
          const analysis = analyzeText(text);
          const badge = createBadge(analysis);
          
          const header = comment.querySelector('header, .flex');
          if (header) {
            header.style.position = 'relative';
            header.appendChild(badge);
          }
        }
      }
    });
    
    // Also try the div-based comments (Reddit's structure varies)
    document.querySelectorAll('[data-testid="comment"]:not([data-robocop-scanned])').forEach(comment => {
      processContent(comment, '[data-testid="comment"] > div > div');
    });
    
    // Posts
    document.querySelectorAll('[data-testid="post-container"]:not([data-robocop-scanned])').forEach(post => {
      const textContent = post.querySelector('[data-click-id="text"]');
      if (textContent) {
        processContent(post, '[data-click-id="text"]');
      }
    });
  }

  // Scan for Reddit content (old Reddit)
  function scanOldReddit() {
    document.querySelectorAll('.comment:not([data-robocop-scanned])').forEach(comment => {
      processContent(comment, '.usertext-body');
    });
    
    document.querySelectorAll('.thing.link:not([data-robocop-scanned])').forEach(post => {
      processContent(post, '.usertext-body');
    });
  }

  // Main scan function
  function scan() {
    const isOldReddit = window.location.hostname === 'old.reddit.com' || 
                        document.querySelector('.oldreddit');
    
    if (isOldReddit) {
      scanOldReddit();
    } else {
      scanNewReddit();
    }
  }

  // Initialize
  function init() {
    console.log('🚔 Reddit Robocop initialized. Scanning for synthetic lifeforms...');
    
    // Initial scan
    setTimeout(scan, CONFIG.scanDelay);
    
    // Watch for new content (infinite scroll, expanding comments, etc.)
    const observer = new MutationObserver((mutations) => {
      let shouldScan = false;
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
          shouldScan = true;
        }
      });
      if (shouldScan) {
        setTimeout(scan, CONFIG.scanDelay);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Also scan on scroll (Reddit lazy loads)
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(scan, 500);
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
