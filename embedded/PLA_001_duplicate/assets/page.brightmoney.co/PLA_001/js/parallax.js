/**
 * Parallax Scroll Animation
 * 
 * Creates scroll-based animations where:
 * 1. Text fades out as user scrolls
 * 2. Phone starts cropped (only top half visible), zoomed in, and tilted
 * 3. As user scrolls: reveals full image, scales down, and straightens
 * 4. Phone image transitions from image 1 to image 2 at 85% scroll
 */

// DOM Elements
const parallaxContainer = document.querySelector('.parallax-container');
const textContent = document.querySelector('.text-content');
const line1 = document.querySelector('.line-1');
const line2 = document.querySelector('.line-2');
const amount = document.querySelector('.amount');
const subtext = document.querySelector('.subtext');
const phoneScene = document.querySelector('.phone-scene');
const phoneBoxWrapper = document.querySelector('.phone-box-wrapper');
const phoneContainer = document.querySelector('.phone-container');
const phoneImage1 = document.querySelector('.phone-image-1');
const phoneImage2 = document.querySelector('.phone-image-2');
const phoneImage3 = document.querySelector('.phone-image-3');
const phoneImage4 = document.querySelector('.phone-image-4');
const sideImageLeft = document.querySelector('.side-image-left');
const sideImageRight = document.querySelector('.side-image-right');
const section2Left = document.querySelector('.section-2-left');
const section2Right = document.querySelector('.section-2-right');
const section2RightContent = document.querySelector('.section-2-right-content');
const section3RightContent = document.querySelector('.section-3-right-content');
const section2Words = document.querySelectorAll('.section-2-title .word');
const section3Left = document.querySelector('.section-3-left');
const section3LeftImg = document.querySelector('.section-3-left-img');
const section3TitleNew = document.querySelector('.section-3-title-new');
const section3CapsWords = document.querySelectorAll('.section-3-title-caps .caps-word');
const section4RightContent = document.querySelector('.section-4-right-content');
const section4Left = document.querySelector('.section-4-left');
const section4TagRow2 = document.querySelector('.tag-row-2');
const section4TitleNew = document.querySelector('.section-4-title-new');
const section3LeftRow = document.querySelector('.section-3-left-row');
const sectionBg = document.querySelector('.section-bg');
const section2GradientBg = document.querySelector('.section-2-gradient-bg');
const sideImages = document.querySelector('.side-images');
const persistentCta = document.querySelector('.persistent-cta');

// Animation state
let ticking = false;
let initialAnimationComplete = false;
let initCalled = false;

// Initial phone values (cropped, zoomed, tilted)
const INITIAL_ROTATE_X = 38;
const INITIAL_SCALE = 1.5;

// Final phone values (full, normal, straight)
const FINAL_ROTATE_X = 0;
const FINAL_SCALE = 1;

// Scene height values (vh units)
const INITIAL_SCENE_HEIGHT = 45;  // Only shows top portion
const FINAL_SCENE_HEIGHT = 85;    // Shows full image

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
function lerp(start, end, progress) {
  return start + (end - start) * progress;
}

/**
 * Easing function - ease out cubic (decelerating)
 */
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Easing function - ease in cubic (accelerating)
 */
function easeInCubic(t) {
  return t * t * t;
}

/**
 * Easing function - ease in out cubic (smooth both ends)
 */
function easeInOutCubic(t) {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Calculate scroll progress through the parallax container
 * Returns a value from 0 to 1
 */
function getScrollProgress() {
  const rect = parallaxContainer.getBoundingClientRect();
  const containerHeight = parallaxContainer.offsetHeight;
  const viewportHeight = window.innerHeight;
  
  const scrollableDistance = containerHeight - viewportHeight;
  const scrolled = -rect.top;
  
  return clamp(scrolled / scrollableDistance, 0, 1);
}

/**
 * Apply transforms based on scroll progress
 */
function updateAnimations() {
  const progress = getScrollProgress();
  
  // Sections 2, 3, 4 visibility range (when gradient background should be visible and side images hidden)
  const sections234BgStart = 0.40;  // Section 2 starts
  const sections234BgEnd = 1.0;     // Extend slightly past section 4 to ensure full visibility
  
  // ============================================
  // PHASE 1: Text Animation (0% - 40% scroll)
  // Text scrolls up and fades out as phone rises
  // ============================================
  
  // Overall text container moves up significantly - faster and further
  const textProgress = clamp(progress / 0.25, 0, 1); // Reduced from 0.35 to 0.25 for faster movement
  const textEased = easeOutCubic(textProgress);
  const textContainerTranslateY = lerp(0, -500, textEased);
  
  if (textContent) {
    textContent.style.transform = `translateY(${textContainerTranslateY}px)`;
  }
  
  // Individual text elements fade out faster - increased multipliers for quicker transitions
  const line1Progress = clamp(progress * 8, 0, 1); // Increased from 5 to 8 for faster fade
  const line1Opacity = lerp(1, 0, easeInCubic(line1Progress));
  
  const line2Progress = clamp((progress - 0.01) * 7, 0, 1); // Increased from 4.5 to 7, reduced delay from 0.02 to 0.01
  const line2Opacity = lerp(1, 0, easeInCubic(line2Progress));
  
  const amountProgress = clamp((progress - 0.02) * 6, 0, 1); // Increased from 4 to 6, reduced delay from 0.05 to 0.02
  const amountOpacity = lerp(1, 0, easeInCubic(amountProgress));
  const amountScale = lerp(1, 0.95, easeInCubic(amountProgress));
  
  const subtextProgress = clamp((progress - 0.03) * 5.5, 0, 1); // Increased from 3.5 to 5.5, reduced delay from 0.08 to 0.03
  const subtextOpacity = lerp(1, 0, easeInCubic(subtextProgress));
  
  if (line1) {
    line1.style.opacity = line1Opacity;
  }
  
  if (line2) {
    line2.style.opacity = line2Opacity;
  }
  
  if (amount) {
    amount.style.opacity = amountOpacity;
    amount.style.transform = `scale(${amountScale})`;
  }
  
  if (subtext) {
    subtext.style.opacity = subtextOpacity;
  }
  
  // ============================================
  // PHASE 2: Phone Reveal & Transform (0% - 50% scroll) - Speeded up from 70%
  // - Expand scene height to reveal full image
  // - Scale down from zoomed to normal
  // - Straighten from tilted to flat
  // ============================================
  
  const phoneProgress = clamp(progress / 0.5, 0, 1); // Reduced from 0.7 to 0.5 for faster animation
  const phoneEased = easeOutCubic(phoneProgress);
  
  // Expand the scene height to reveal more of the image
  const sceneHeight = lerp(INITIAL_SCENE_HEIGHT, FINAL_SCENE_HEIGHT, phoneEased);
  
  // Scale down from zoomed to normal
  const scale = lerp(INITIAL_SCALE, FINAL_SCALE, phoneEased);
  
  // Straighten from tilted to flat
  const rotateX = lerp(INITIAL_ROTATE_X, FINAL_ROTATE_X, phoneEased);
  
  if (phoneScene) {
    phoneScene.style.height = `${sceneHeight}vh`;
  }
  
  if (phoneContainer) {
    phoneContainer.style.transform = `
      translateX(-50%) 
      rotateX(${rotateX}deg) 
      scale(${scale})
    `;
  }
  
  // ============================================
  // PHASE 3: Side Images Animation (0% - 35% scroll) - Speeded up from 50%
  // Move along 45° diagonal line (top-left and top-right) and fade out
  // Hide completely when sections 2, 3, 4 are active (40% - 98%)
  // Only apply after initial CSS animation completes
  // ============================================
  
  if (initialAnimationComplete) {
    // If we're in sections 2, 3, 4 range, hide side images completely (40% to 98%)
    const section4End = 0.98;
    if (progress >= sections234BgStart && progress <= section4End) {
      if (sideImageLeft) {
        sideImageLeft.style.opacity = '0';
      }
      if (sideImageRight) {
        sideImageRight.style.opacity = '0';
      }
    } else {
      // Normal animation: fade out from 0% to 35% - Speeded up from 50%
      const sideProgress = clamp(progress / 0.35, 0, 1); // Reduced from 0.5 to 0.35 for faster fade
      const sideEased = easeOutCubic(sideProgress);
      
      // Movement distance (pixels)
      const moveDistance = 300;
      
      // Left image: move towards top-left (negative X, negative Y)
      const leftTranslateX = lerp(0, -moveDistance, sideEased);
      const leftTranslateY = lerp(0, -moveDistance, sideEased);
      const leftOpacity = lerp(1, 0, sideEased);
      
      // Right image: move towards top-right (positive X, negative Y)
      const rightTranslateX = lerp(0, moveDistance, sideEased);
      const rightTranslateY = lerp(0, -moveDistance, sideEased);
      const rightOpacity = lerp(1, 0, sideEased);
      
      if (sideImageLeft) {
        sideImageLeft.style.opacity = leftOpacity;
        sideImageLeft.style.transform = `translate(${leftTranslateX}px, ${leftTranslateY}px)`;
      }
      
      if (sideImageRight) {
        sideImageRight.style.opacity = rightOpacity;
        sideImageRight.style.transform = `translate(${rightTranslateX}px, ${rightTranslateY}px)`;
      }
    }
  }
  
  // ============================================
  // PHASE 4: Image Slide Transitions (4 images) - Speeded up transitions
  // Transition 1: Image 1 → Image 2 (25% - 38%) - Faster from (30% - 45%)
  // Transition 2: Image 2 → Image 3 (58% - 68%) - Faster from (65% - 75%)
  // Transition 3: Image 3 → Image 4 (78% - 88%) - Faster from (85% - 95%)
  // 
  // Animation: Current image slides UP and exits completely,
  // then new image slides IN from the bottom of the screen
  // Minimal overlap - sequential feel
  // ============================================
  
  // Large slide distance - image comes from way below the screen
  const slideDistanceOut = 800;  // How far the outgoing image travels up
  const slideDistanceIn = 1000;  // How far below the incoming image starts
  
  // Transition 1: Image 1 to Image 2 - Speeded up
  const crossfade1Start = 0.25; // Reduced from 0.30
  const crossfade1End = 0.38;   // Reduced from 0.45
  const crossfade1Progress = clamp(
    (progress - crossfade1Start) / (crossfade1End - crossfade1Start), 
    0, 1
  );
  
  // Transition 2: Image 2 to Image 3 - Speeded up
  const crossfade2Start = 0.58; // Reduced from 0.65
  const crossfade2End = 0.68;   // Reduced from 0.75
  const crossfade2Progress = clamp(
    (progress - crossfade2Start) / (crossfade2End - crossfade2Start), 
    0, 1
  );
  
  // Transition 3: Image 3 to Image 4 - Speeded up
  const crossfade3Start = 0.78; // Reduced from 0.85
  const crossfade3End = 0.88;   // Reduced from 0.95
  const crossfade3Progress = clamp(
    (progress - crossfade3Start) / (crossfade3End - crossfade3Start), 
    0, 1
  );
  
  // Use different easing for out vs in to create sequential feel
  // Outgoing: accelerate out (ease-in)
  // Incoming: decelerate in (ease-out)
  
  /**
   * Calculate image states for a transition
   * First half (0-0.5): outgoing image exits upward
   * Second half (0.5-1): incoming image enters from below
   */
  function getTransitionState(transitionProgress) {
    // Outgoing image: exits in first 60% of transition
    const outProgress = clamp(transitionProgress / 0.6, 0, 1);
    const outEased = easeInCubic(outProgress); // Accelerate out
    
    // Incoming image: enters in last 70% of transition (overlaps slightly)
    const inProgress = clamp((transitionProgress - 0.3) / 0.7, 0, 1);
    const inEased = easeOutCubic(inProgress); // Decelerate in
    
    return {
      outOpacity: lerp(1, 0, outEased),
      outTranslateY: lerp(0, -slideDistanceOut, outEased),
      inOpacity: lerp(0, 1, inEased),
      inTranslateY: lerp(slideDistanceIn, 0, inEased)
    };
  }
  
  // Calculate states for all images
  let img1Opacity = 1, img2Opacity = 0, img3Opacity = 0, img4Opacity = 0;
  let img1TranslateY = 0, img2TranslateY = slideDistanceIn, img3TranslateY = slideDistanceIn, img4TranslateY = slideDistanceIn;
  
  if (progress < crossfade1Start) {
    // Before any transition - only image 1 visible
    img1Opacity = 1;
    img1TranslateY = 0;
    img2Opacity = 0;
    img2TranslateY = slideDistanceIn;
    img3Opacity = 0;
    img3TranslateY = slideDistanceIn;
    img4Opacity = 0;
    img4TranslateY = slideDistanceIn;
  } else if (progress < crossfade1End) {
    // During transition 1
    const state = getTransitionState(crossfade1Progress);
    img1Opacity = state.outOpacity;
    img1TranslateY = state.outTranslateY;
    img2Opacity = state.inOpacity;
    img2TranslateY = state.inTranslateY;
    img3Opacity = 0;
    img3TranslateY = slideDistanceIn;
    img4Opacity = 0;
    img4TranslateY = slideDistanceIn;
  } else if (progress < crossfade2Start) {
    // Between transition 1 and 2 - only image 2 visible
    img1Opacity = 0;
    img1TranslateY = -slideDistanceOut;
    img2Opacity = 1;
    img2TranslateY = 0;
    img3Opacity = 0;
    img3TranslateY = slideDistanceIn;
    img4Opacity = 0;
    img4TranslateY = slideDistanceIn;
  } else if (progress < crossfade2End) {
    // During transition 2
    const state = getTransitionState(crossfade2Progress);
    img1Opacity = 0;
    img1TranslateY = -slideDistanceOut;
    img2Opacity = state.outOpacity;
    img2TranslateY = state.outTranslateY;
    img3Opacity = state.inOpacity;
    img3TranslateY = state.inTranslateY;
    img4Opacity = 0;
    img4TranslateY = slideDistanceIn;
  } else if (progress < crossfade3Start) {
    // Between transition 2 and 3 - only image 3 visible
    img1Opacity = 0;
    img1TranslateY = -slideDistanceOut;
    img2Opacity = 0;
    img2TranslateY = -slideDistanceOut;
    img3Opacity = 1;
    img3TranslateY = 0;
    img4Opacity = 0;
    img4TranslateY = slideDistanceIn;
  } else {
    // During or after transition 3
    const state = getTransitionState(crossfade3Progress);
    img1Opacity = 0;
    img1TranslateY = -slideDistanceOut;
    img2Opacity = 0;
    img2TranslateY = -slideDistanceOut;
    img3Opacity = state.outOpacity;
    img3TranslateY = state.outTranslateY;
    img4Opacity = state.inOpacity;
    img4TranslateY = state.inTranslateY;
  }
  
  // Apply opacity and transforms to all phone images
  if (phoneImage1) {
    phoneImage1.style.opacity = img1Opacity;
    phoneImage1.style.transform = `translateY(${img1TranslateY}px)`;
  }
  if (phoneImage2) {
    phoneImage2.style.opacity = img2Opacity;
    phoneImage2.style.transform = `translateY(${img2TranslateY}px)`;
  }
  if (phoneImage3) {
    phoneImage3.style.opacity = img3Opacity;
    phoneImage3.style.transform = `translateY(${img3TranslateY}px)`;
  }
  if (phoneImage4) {
    phoneImage4.style.opacity = img4Opacity;
    phoneImage4.style.transform = `translateY(${img4TranslateY}px)`;
  }
  
  // ============================================
  // BACKGROUND: Transition from bottom to vertically centered
  // Starts at bottom 60%, moves to center of viewport
  // Hide when sections 2, 3, 4 are active, show gradient instead
  // ============================================
  
  if (sectionBg) {
    // Start transitioning after section 1 (around 30% scroll) - Speeded up
    const bgTransitionStart = 0.30; // Reduced from 0.35
    const bgTransitionEnd = 0.48;   // Reduced from 0.55 for faster transition
    const bgProgress = clamp(
      (progress - bgTransitionStart) / (bgTransitionEnd - bgTransitionStart),
      0, 1
    );
    const bgEased = easeOutCubic(bgProgress);
    
    // Height stays at 60%
    // Top moves from 40% (bottom-aligned) to 20% (vertically centered: (100-60)/2 = 20%)
    const bgTop = lerp(40, 20, bgEased);
    
    // Fade out section1BG as gradient background fades in - Speeded up
    // Gradient fades in from 40% to 45% scroll, so section1BG should fade out in sync
    const section4End = 0.98;
    const bgFadeOutStart = sections234BgStart; // Start fading out when section 2 starts (40%)
    const bgFadeOutEnd = sections234BgStart + 0.05; // Fade out over 5% scroll (40% to 45%) - Reduced from 10%
    
    if (progress < bgFadeOutStart) {
      // Section 1 (loan offers): Keep old background visible
      // After animation completes, explicitly set opacity to 0.7 to maintain visibility
      if (initialAnimationComplete) {
        // Animation is done, explicitly set opacity to 0.7 for section 1
        sectionBg.style.opacity = '0.7';
      }
      // If animation hasn't completed yet, let CSS handle it
      sectionBg.style.top = `${bgTop}%`;
    } else if (progress >= bgFadeOutStart && progress <= bgFadeOutEnd) {
      // Fade out section1BG gradually as gradient background fades in (40% to 50%)
      const bgFadeOutProgress = clamp(
        (progress - bgFadeOutStart) / (bgFadeOutEnd - bgFadeOutStart),
        0, 1
      );
      const bgFadeOutEased = easeOutCubic(bgFadeOutProgress);
      // Fade from 0.7 (or current opacity) to 0
      const currentBgOpacity = initialAnimationComplete ? 0.7 : 0.7;
      const bgOpacity = lerp(currentBgOpacity, 0, bgFadeOutEased);
      sectionBg.style.opacity = bgOpacity;
      sectionBg.style.top = `${bgTop}%`;
    } else if (progress > bgFadeOutEnd && progress <= section4End) {
      // Sections 2, 3, 4: Keep section1BG hidden (gradient is fully visible)
      sectionBg.style.opacity = '0';
      sectionBg.style.top = `${bgTop}%`;
    } else {
      // After section 4 (progress > 98%): Old background not needed
      // Keep it hidden
      sectionBg.style.opacity = '0';
      sectionBg.style.top = `${bgTop}%`;
    }
  }
  
  // Show/hide gradient background for sections 2, 3, 4 - Speeded up
  if (section2GradientBg) {
    // Section 4 ends at 98%, so keep gradient fully visible until then
    const section4End = 0.98;
    const gradientFadeOutStart = 0.98; // Start fading out after section 4 ends
    
    if (progress >= sections234BgStart) {
      // Fade in gradient background smoothly at start - Speeded up
      const gradientInProgress = clamp(
        (progress - sections234BgStart) / 0.05, // Fade in over 5% scroll (40% to 45%) - Reduced from 10%
        0, 1
      );
      
      let gradientOpacity;
      if (gradientInProgress < 1) {
        // Fading in at the start (40% to 50%)
        gradientOpacity = lerp(0, 1, easeOutCubic(gradientInProgress));
      } else if (progress >= gradientFadeOutStart) {
        // Fade out gradient background smoothly at end (after 98%)
        const gradientOutProgress = clamp(
          (progress - gradientFadeOutStart) / 0.02, // Fade out over 2% scroll (98% to 100%)
          0, 1
        );
        gradientOpacity = lerp(1, 0, easeInCubic(gradientOutProgress));
      } else {
        // Fully visible during sections 2, 3, 4 (50% to 98%)
        gradientOpacity = 1;
      }
      
      section2GradientBg.style.opacity = gradientOpacity;
    } else {
      section2GradientBg.style.opacity = '0';
    }
  }
  
  // ============================================
  // PHASE 5: Section 2 Content (40% - 60% scroll) - Speeded up
  // Left and Right content fade in from bottom
  // Then fade out as section 3 approaches
  // ============================================
  
  const section2InStart = 0.40;
  const section2InEnd = 0.48;  // Faster fade in (reduced from 0.50)
  const section2OutStart = 0.55; // Start fading out earlier (reduced from 0.60)
  const section2OutEnd = 0.62;   // Faster fade out, complete before section 3 starts (reduced from 0.70)
  
  // Section 3 transition variables (needed for section 3 right content logic)
  const section3Start = 0.62; // Start right after section 2 ends
  const section3End = 0.78;    // End earlier to avoid overlap with section 4
  const section3OutStart = 0.72; // Start fading out earlier
  const section3OutEnd = 0.78;   // Complete fade out before section 4 starts
  
  const section2InProgress = clamp(
    (progress - section2InStart) / (section2InEnd - section2InStart),
    0, 1
  );
  const section2OutProgress = clamp(
    (progress - section2OutStart) / (section2OutEnd - section2OutStart),
    0, 1
  );
  
  const section2InEased = easeOutCubic(section2InProgress);
  const section2OutEased = easeInCubic(section2OutProgress);
  
  // Calculate section 2 opacity (fade in then fade out)
  // Also handles reverse scrolling
  let sec2Opacity, sec2TranslateY;
  if (progress < section2InStart) {
    // Before section 2 starts - hidden
    sec2Opacity = 0;
    sec2TranslateY = 80;
  } else if (progress >= section2InStart && progress < section2OutStart) {
    // Fading in and visible
    sec2Opacity = lerp(0, 1, section2InEased);
    sec2TranslateY = lerp(80, 0, section2InEased);
  } else {
    // Fading out
    sec2Opacity = lerp(1, 0, section2OutEased);
    sec2TranslateY = lerp(0, -40, section2OutEased);
  }
  
  if (section2Left) {
    section2Left.style.opacity = sec2Opacity;
    section2Left.style.transform = `translateY(${sec2TranslateY}px)`;
    
    // Words move and scale during transition (only when fading out)
    if (progress >= section2OutStart && progress < section2OutEnd) {
      const transitionProgress = clamp(
        (progress - section2OutStart) / (section2OutEnd - section2OutStart),
        0, 1
      );
      const transitionEased = easeInOutCubic(transitionProgress);
      
      // Move words to form a single line and shrink
      // Word 0: "Build" - moves right and up
      // Word 1: "credit" - moves right  
      // Word 2: "history" - moves up and right
      const wordTargets = [
        { x: 50, y: -20, scale: 0.5 },   // Build
        { x: 30, y: -10, scale: 0.5 },   // credit
        { x: 80, y: -40, scale: 0.5 }    // history
      ];
      
      section2Words.forEach((word, index) => {
        const target = wordTargets[index] || { x: 0, y: 0, scale: 1 };
        
        const wordX = lerp(0, target.x, transitionEased);
        const wordY = lerp(0, target.y, transitionEased);
        const wordScale = lerp(1, target.scale, transitionEased);
        const wordOpacity = lerp(1, 0, transitionEased);
        
        word.style.transform = `translate(${wordX}px, ${wordY}px) scale(${wordScale})`;
        word.style.opacity = wordOpacity;
      });
    } else {
      // Reset words to normal position when not transitioning
      section2Words.forEach((word) => {
        word.style.transform = `translate(0px, 0px) scale(1)`;
        word.style.opacity = sec2Opacity; // Match parent opacity
      });
    }
  }
  
  // Section 2 Right Container - fades in and stays visible
  // IMPORTANT: This container holds section 2, 3, and 4 right content
  // Must stay visible (opacity: 1) when sections 3 or 4 are active
  // Also handles reverse scrolling
  if (section2Right) {
    const section4End = 0.98; // Define section 4 end for visibility check
    const isMobile = window.innerWidth <= 768;
    
    // On mobile, sync section-2-right appearance with phone image (starts at 25% scroll)
    // On desktop, use original timing (starts at 40% scroll)
    const mobileSection2Start = 0.25; // Same as phone image transition start
    const mobileSection2End = 0.35;   // Complete fade in by 35%
    const effectiveSection2Start = isMobile ? mobileSection2Start : section2InStart;
    const effectiveSection2End = isMobile ? mobileSection2End : section2InEnd;
    
    if (progress < effectiveSection2Start) {
      // Before section 2 starts - hidden
      section2Right.style.opacity = '0';
      section2Right.style.transform = `translateY(80px)`;
    } else if (progress >= effectiveSection2Start && progress < section2OutEnd) {
      // Fade in and stay visible during section 2
      const rightDelay = isMobile ? 0 : 0.02; // No delay on mobile for immediate sync
      const sec2RightInProgress = clamp(
        (progress - effectiveSection2Start - rightDelay) / (effectiveSection2End - effectiveSection2Start),
        0, 1
      );
      const sec2RightInEased = easeOutCubic(sec2RightInProgress);
      
      const containerOpacity = lerp(0, 1, sec2RightInEased);
      const containerTranslateY = lerp(80, 0, sec2RightInEased);
      
      section2Right.style.opacity = containerOpacity;
      section2Right.style.transform = `translateY(${containerTranslateY}px)`;
    } else if (progress >= section2OutEnd && progress < section4End) {
      // Sections 3 and 4 are active - keep container visible so children can be seen
      // The individual content (section 2, 3, 4) will handle their own opacity
      section2Right.style.opacity = '1';
      section2Right.style.transform = `translateY(0px)`;
    } else {
      // After section 4 ends - can fade out if needed
      section2Right.style.opacity = '1'; // Keep visible to show section 4 content
      section2Right.style.transform = `translateY(0px)`;
    }
  }
  
  // Section 2 Right Content - slides out to top when section 3 comes
  // Also handles reverse scrolling (fades back in when scrolling backwards)
  if (section2RightContent) {
    const isMobile = window.innerWidth <= 768;
    
    // On mobile, sync with phone image appearance (starts at 25% scroll)
    // On desktop, use original timing (starts at 40% scroll)
    const mobileSection2Start = 0.25; // Same as phone image transition start
    const mobileSection2End = 0.35;   // Complete fade in by 35%
    const effectiveSection2Start = isMobile ? mobileSection2Start : section2InStart;
    const effectiveSection2End = isMobile ? mobileSection2End : section2InEnd;
    
    let contentOpacity, contentTranslateY;
    if (progress < effectiveSection2Start) {
      // Before section 2 starts - hidden
      contentOpacity = 0;
      contentTranslateY = 60;
    } else if (progress >= effectiveSection2Start && progress < effectiveSection2End) {
      // Fading in
      const sec2ContentInProgress = clamp(
        (progress - effectiveSection2Start) / (effectiveSection2End - effectiveSection2Start),
        0, 1
      );
      const sec2ContentInEased = easeOutCubic(sec2ContentInProgress);
      contentOpacity = lerp(0, 1, sec2ContentInEased);
      contentTranslateY = lerp(60, 0, sec2ContentInEased);
    } else if (progress >= effectiveSection2End && progress < section2OutStart) {
      // Fully visible during section 2
      contentOpacity = 1;
      contentTranslateY = 0;
    } else if (progress >= section2OutStart && progress < section2OutEnd) {
      // Fading out
      contentOpacity = lerp(1, 0, section2OutEased);
      contentTranslateY = lerp(0, -60, section2OutEased);
    } else {
      // Completely hidden after fade out completes
      contentOpacity = 0;
      contentTranslateY = -60;
    }
    section2RightContent.style.opacity = contentOpacity;
    section2RightContent.style.transform = `translateY(${contentTranslateY}px)`;
  }
  
  // Section 3 Right Content - slides in from bottom when section 2 fades out
  // Start after section 2 is completely faded out to avoid overlap
  // Also handles reverse scrolling
  if (section3RightContent) {
    const section4Start = 0.78; // Define section 4 start for visibility check
    const sec3RightStart = section2OutEnd; // Start after section 2 fully fades out (0.62)
    const sec3RightEnd = section2OutEnd + 0.05; // Quick fade in (5% scroll) = 0.67
    const section3OutProgress = clamp(
      (progress - section3OutStart) / (section3OutEnd - section3OutStart),
      0, 1
    );
    const section3OutEased = easeInCubic(section3OutProgress);
    
    if (progress < sec3RightStart) {
      // Before section 3 starts - hidden
      section3RightContent.style.opacity = '0';
      section3RightContent.style.transform = `translateY(60px)`;
    } else if (progress >= sec3RightStart && progress < sec3RightEnd) {
      // Fading in
      const sec3RightProgress = clamp(
        (progress - sec3RightStart) / (sec3RightEnd - sec3RightStart),
        0, 1
      );
      const sec3Eased = easeOutCubic(sec3RightProgress);
      const sec3ContentOpacity = lerp(0, 1, sec3Eased);
      const sec3ContentTranslateY = lerp(60, 0, sec3Eased);
      section3RightContent.style.opacity = sec3ContentOpacity;
      section3RightContent.style.transform = `translateY(${sec3ContentTranslateY}px)`;
    } else if (progress >= sec3RightEnd && progress < section4Start) {
      // Fully visible during section 3 (until section 4 starts)
      section3RightContent.style.opacity = '1';
      section3RightContent.style.transform = `translateY(0px)`;
    } else if (progress >= section4Start) {
      // Fade out when section 4 starts
      const sec3FadeOutProgress = clamp(
        (progress - section4Start) / 0.05, // Quick fade out over 5% scroll
        0, 1
      );
      const sec3FadeOutEased = easeInCubic(sec3FadeOutProgress);
      const sec3FadeOut = lerp(1, 0, sec3FadeOutEased);
      const sec3SlideUp = lerp(0, -60, sec3FadeOutEased);
      section3RightContent.style.opacity = sec3FadeOut;
      section3RightContent.style.transform = `translateY(${sec3SlideUp}px)`;
    }
  }
  
  // ============================================
  // PHASE 6: Section 3 Content (62% - 78% scroll) - Speeded up
  // Left: text transforms to caps + image appears + new text fades in
  // Right: new content fades in from bottom
  // Note: section3Start, section3End, section3OutStart, section3OutEnd are defined above
  // ============================================
  
  const section3Progress = clamp(
    (progress - section3Start) / (section3End - section3Start),
    0, 1
  );
  const section3Eased = easeOutCubic(section3Progress);
  
  // Section 3 left container
  const sec3LeftOpacity = lerp(0, 1, section3Eased);
  const sec3LeftTranslateY = lerp(80, 0, section3Eased);
  
  if (section3Left) {
    section3Left.style.opacity = sec3LeftOpacity;
    section3Left.style.transform = `translateY(${sec3LeftTranslateY}px)`;
    
    // Words slide into position from their scattered starting points - Speeded up
    const reassembleProgress = clamp(section3Progress * 2.0, 0, 1); // Increased from 1.5 to 2.0 for faster reassembly
    const reassembleEased = easeOutCubic(reassembleProgress);
    
    // Starting positions for each word (coming from section 2 positions)
    const wordStarts = [
      { x: -60, y: 40, scale: 1.5 },   // BUILD - from left/below
      { x: -40, y: 30, scale: 1.5 },   // CREDIT - from left/below
      { x: -80, y: 60, scale: 1.5 }    // HISTORY - from further left/below
    ];
    
    section3CapsWords.forEach((word, index) => {
      const start = wordStarts[index] || { x: 0, y: 0, scale: 1 };
      
      const wordX = lerp(start.x, 0, reassembleEased);
      const wordY = lerp(start.y, 0, reassembleEased);
      const wordScale = lerp(start.scale, 1, reassembleEased);
      const wordOpacity = lerp(0, 1, reassembleEased);
      
      word.style.transform = `translate(${wordX}px, ${wordY}px) scale(${wordScale})`;
      word.style.opacity = wordOpacity;
    });
  }
  
  // Section 3 left image (appears slightly delayed) - Speeded up
  const sec3ImgProgress = clamp((section3Progress - 0.15) * 2.0, 0, 1); // Reduced delay from 0.2 to 0.15, increased multiplier from 1.5 to 2.0
  const sec3ImgEased = easeOutCubic(sec3ImgProgress);
  
  if (section3LeftImg) {
    section3LeftImg.style.opacity = lerp(0, 1, sec3ImgEased);
    section3LeftImg.style.transform = `scale(${lerp(0.8, 1, sec3ImgEased)})`;
  }
  
  // Section 3 new title (fades in from bottom, more delayed) - Speeded up
  // Then fades out when section 4 comes
  const sec3TitleInProgress = clamp((section3Progress - 0.2) * 2.0, 0, 1); // Reduced delay from 0.3 to 0.2, increased multiplier from 1.5 to 2.0
  const sec3TitleInEased = easeOutCubic(sec3TitleInProgress);
  
  // Section 3 to Section 4 transition - Speeded up
  // Note: section3OutStart and section3OutEnd are defined above
  const section3OutProgress = clamp(
    (progress - section3OutStart) / (section3OutEnd - section3OutStart),
    0, 1
  );
  const section3OutEased = easeInCubic(section3OutProgress);
  
  // Section 3 Vertical Line - appears between BUILD CREDIT HISTORY and Pay on-time - Speeded up
  const section3VerticalLine = document.querySelector('.section-3-vertical-line');
  if (section3VerticalLine) {
    let lineOpacity;
    if (progress < section3OutStart) {
      const lineProgress = clamp((section3Progress - 0.2) * 1.8, 0, 1); // Reduced delay from 0.25 to 0.2, increased multiplier from 1.4 to 1.8
      const lineEased = easeOutCubic(lineProgress);
      lineOpacity = lerp(0, 1, lineEased);
    } else {
      // Fade out when section 4 comes
      lineOpacity = lerp(1, 0, section3OutEased);
    }
    section3VerticalLine.style.opacity = lineOpacity;
  }
  
  if (section3TitleNew) {
    let titleOpacity, titleTranslateY;
    if (progress < section3OutStart) {
      titleOpacity = lerp(0, 1, sec3TitleInEased);
      titleTranslateY = lerp(40, 0, sec3TitleInEased);
    } else {
      titleOpacity = lerp(1, 0, section3OutEased);
      titleTranslateY = lerp(0, -40, section3OutEased);
    }
    section3TitleNew.style.opacity = titleOpacity;
    section3TitleNew.style.transform = `translateY(${titleTranslateY}px)`;
  }
  
  // Section 3 left row (BUILD CREDIT HISTORY): stays visible and shifts up for section 4
  if (section3LeftRow) {
    // During section 3 to 4 transition, shift the row up
    const shiftProgress = clamp(
      (progress - section3OutStart) / (section3OutEnd - section3OutStart),
      0, 1
    );
    const shiftEased = easeOutCubic(shiftProgress);
    const shiftY = lerp(0, -60, shiftEased);
    
    // Row always stays visible once section 3 starts
    section3LeftRow.style.transform = `translateY(${shiftY}px)`;
  }
  
  // ============================================
  // PHASE 7: Section 4 Content (78% - 98% scroll) - Speeded up
  // ============================================
  
  const section4Start = 0.78; // Start right after section 3 ends (reduced from 0.80)
  const section4End = 0.98;
  const section4Progress = clamp(
    (progress - section4Start) / (section4End - section4Start),
    0, 1
  );
  const section4Eased = easeOutCubic(section4Progress);
  
  // Section 4 Right Content - slides in from bottom - Speeded up
  // Section 3 right content fade out is already handled in section 3 code block above
  // Also handles reverse scrolling
  if (section4RightContent) {
    if (progress < section4Start) {
      // Before section 4 starts - hidden
      section4RightContent.style.opacity = '0';
      section4RightContent.style.transform = `translateY(60px)`;
    } else if (progress >= section4Start && progress <= section4End) {
      // Fade in section 4 right content - start immediately after section 3 ends
      // Use section4Progress directly (already clamped 0-1) and speed it up
      const sec4RightProgress = clamp(section4Progress * 1.5, 0, 1); // Speed up appearance
      const sec4Eased = easeOutCubic(sec4RightProgress);
      const sec4ContentOpacity = lerp(0, 1, sec4Eased);
      const sec4ContentTranslateY = lerp(60, 0, sec4Eased);
      section4RightContent.style.opacity = sec4ContentOpacity;
      section4RightContent.style.transform = `translateY(${sec4ContentTranslateY}px)`;
    } else {
      // After section 4 ends - keep visible
      section4RightContent.style.opacity = '1';
      section4RightContent.style.transform = `translateY(0px)`;
    }
  }
  
  // Section 4 Left Container - fades in (positioned below the persisting row)
  if (section4Left) {
    section4Left.style.opacity = lerp(0, 1, section4Eased);
  }
  
  // Section 4 Tag Row 2 (PAY ON-TIME) - appears below the persisting BUILD CREDIT HISTORY - Speeded up
  if (section4TagRow2) {
    const row2Progress = clamp((section4Progress - 0.1) * 1.8, 0, 1); // Reduced delay from 0.15 to 0.1, increased multiplier from 1.5 to 1.8
    const row2Eased = easeOutCubic(row2Progress);
    section4TagRow2.style.opacity = lerp(0, 1, row2Eased);
    section4TagRow2.style.transform = `translateY(${lerp(20, 0, row2Eased)}px)`;
  }
  
  // Section 4 Vertical Line - appears between PAY ON-TIME and Money manager - Speeded up
  const section4VerticalLine = document.querySelector('.section-4-vertical-line');
  if (section4VerticalLine) {
    const lineProgress = clamp((section4Progress - 0.15) * 1.7, 0, 1); // Reduced delay from 0.2 to 0.15, increased multiplier from 1.4 to 1.7
    const lineEased = easeOutCubic(lineProgress);
    section4VerticalLine.style.opacity = lerp(0, 1, lineEased);
  }
  
  // Section 4 Title (Money manager) - Speeded up
  if (section4TitleNew) {
    const titleProgress = clamp((section4Progress - 0.2) * 1.8, 0, 1); // Reduced delay from 0.3 to 0.2, increased multiplier from 1.5 to 1.8
    const titleEased = easeOutCubic(titleProgress);
    section4TitleNew.style.opacity = lerp(0, 1, titleEased);
    section4TitleNew.style.transform = `translateY(${lerp(40, 0, titleEased)}px)`;
  }
  
  // Add section-4-active class to persistent CTA when section 4 is active (desktop only)
  if (persistentCta) {
    const isDesktop = window.innerWidth > 768; // Desktop breakpoint
    if (isDesktop && progress >= section4Start && progress <= section4End) {
      persistentCta.classList.add('section-4-active');
    } else {
      persistentCta.classList.remove('section-4-active');
    }
  }

  // Add sections-234-active class to phone box wrapper when sections 2, 3, or 4 are active (for mobile border)
  if (phoneBoxWrapper) {
    const sections234Start = 0.40; // Section 2 starts
    const sections234End = 0.98;   // Section 4 ends
    if (progress >= sections234Start && progress <= sections234End) {
      phoneBoxWrapper.classList.add('sections-234-active');
    } else {
      phoneBoxWrapper.classList.remove('sections-234-active');
    }
  }

  // Update breadcrumb progress indicator for mobile (sections 2, 3, 4)
  if (section2Right) {
    const isMobile = window.innerWidth <= 768;
    const sections234Start = 0.40; // Section 2 starts
    const sections234End = 0.98;   // Section 4 ends
    
    if (isMobile) {
      // Show/hide breadcrumb based on whether we're in sections 2, 3, or 4
      if (progress >= sections234Start && progress <= sections234End) {
        section2Right.classList.add('sections-234-active');
      } else {
        section2Right.classList.remove('sections-234-active');
      }
      
      // Remove all active classes first
      section2Right.classList.remove('section-3-active', 'section-4-active');
      
      // Section 2: 40% - 62% scroll (section2InStart to section2OutEnd)
      // Section 3: 62% - 78% scroll (section3Start to section3End)
      // Section 4: 78% - 98% scroll (section4Start to section4End)
      // Priority: Section 4 > Section 3 > Section 2 (due to overlaps)
      if (progress >= section4Start && progress <= section4End) {
        // Section 4 active - green bar at bottom
        section2Right.classList.add('section-4-active');
      } else if (progress >= section3Start && progress <= section3End) {
        // Section 3 active - green bar in middle
        section2Right.classList.add('section-3-active');
      }
      // Section 2 is default (no class needed) - green bar at top
      // This applies when progress >= section2InStart (0.40) and < section3Start (0.62)
    }
  }

}

/**
 * Scroll event handler with requestAnimationFrame
 */
function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateAnimations();
      ticking = false;
    });
    ticking = true;
  }
}

/**
 * Initialize
 */
function init() {
  // Prevent multiple initializations
  if (initCalled) {
    return;
  }
  initCalled = true;
  
  if (!parallaxContainer) {
    console.warn('Parallax container not found');
    return;
  }
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    console.log('Reduced motion preferred, animations disabled');
    initialAnimationComplete = true;
    return;
  }
  
  // Check current scroll position after browser has had time to restore it
  const currentProgress = getScrollProgress();
  const sections234BgStart = 0.40; // Section 2 starts at 40%
  
  // Check if this is a back/forward navigation (scroll restoration scenario)
  const navigationEntries = performance.getEntriesByType('navigation');
  const isBackForward = navigationEntries.length > 0 && 
                        navigationEntries[0].type === 'back_forward';
  
  // If page loaded at a scrolled position (sections 2, 3, or 4) OR it's a back/forward navigation,
  // skip CSS animations entirely
  if (currentProgress >= sections234BgStart || (isBackForward && currentProgress > 0.1)) {
    // Immediately disable all CSS animations and let JS take full control
    initialAnimationComplete = true;
    
    if (sideImageLeft) {
      sideImageLeft.style.animation = 'none';
    }
    if (sideImageRight) {
      sideImageRight.style.animation = 'none';
    }
    if (phoneContainer) {
      phoneContainer.style.animation = 'none';
      phoneContainer.style.opacity = '1';
    }
    if (sectionBg) {
      sectionBg.style.animation = 'none';
    }
    
    // Immediately sync with current scroll position
    updateAnimations();
    
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return;
  }
  
  // Normal flow: page loaded at top, allow CSS animations to play
  // Immediately sync with current scroll position to prevent flash of wrong state
  updateAnimations();
  
  // Wait for initial CSS slide-in animations to complete (1s animation + 0.3s delay)
  setTimeout(() => {
    initialAnimationComplete = true;
    // Remove animation property so JS can take over
    if (sideImageLeft) {
      sideImageLeft.style.animation = 'none';
    }
    if (sideImageRight) {
      sideImageRight.style.animation = 'none';
    }
    if (phoneContainer) {
      phoneContainer.style.animation = 'none';
      phoneContainer.style.opacity = '1';
    }
    // Remove animation from section-bg so JS can fully control opacity
    // But preserve the final opacity value from the animation (0.7)
    if (sectionBg) {
      // Get the computed opacity value before removing animation
      const currentOpacity = window.getComputedStyle(sectionBg).opacity;
      sectionBg.style.animation = 'none';
      // If we're still in section 1 (before 40% scroll), preserve the opacity value
      const currentProgress = getScrollProgress();
      if (currentProgress < sections234BgStart) {
        // Preserve the animation's final opacity (0.7) for section 1
        sectionBg.style.opacity = currentOpacity || '0.7';
      }
    }
    // Trigger another update to sync with current scroll position after CSS animations complete
    updateAnimations();
  }, 1400);
  
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

// Wait for both DOM and scroll restoration to complete
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Use requestAnimationFrame to wait for browser's scroll restoration
    // This ensures we check scroll position AFTER the browser restores it
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        init();
      });
    });
  });
} else {
  // Page already loaded, wait for scroll restoration
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      init();
    });
  });
}

/**
 * Animated Footer Banner - Intersection Observer
 * Triggers animations when the section comes into view
 */
function initAnimatedFooterBanner() {
  const footerBanner = document.querySelector('.animated-footer-banner');
  if (!footerBanner) return;
  
  const footerDecorLeft = footerBanner.querySelector('.footer-decor-left');
  const footerDecorRight = footerBanner.querySelector('.footer-decor-right');
  const footerWords = footerBanner.querySelectorAll('.footer-word');
  const beamyIcon = footerBanner.querySelector('.beamy-icon');
  
  let hasAnimated = false;
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of the section is visible
  };
  
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        
        // Animate decorative images
        if (footerDecorLeft) {
          footerDecorLeft.classList.add('animate-in');
        }
        if (footerDecorRight) {
          footerDecorRight.classList.add('animate-in');
        }
        
        // Animate words with stagger
        footerWords.forEach(word => {
          word.classList.add('animate-in');
        });
        
        // Animate Beamy icon
        if (beamyIcon) {
          beamyIcon.classList.add('animate-in');
        }
      }
    });
  };
  
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  observer.observe(footerBanner);
}

// Initialize footer banner animations
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimatedFooterBanner);
} else {
  initAnimatedFooterBanner();
}
