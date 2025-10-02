import React from 'react';

export const createGlobalRipple = (event: React.MouseEvent<HTMLElement>) => {
  const circle = document.createElement("span");

  // Style the ripple
  circle.style.position = 'fixed';
  circle.style.zIndex = '9999';
  circle.style.left = `${event.clientX}px`;
  circle.style.top = `${event.clientY}px`;
  circle.style.borderRadius = '50%';
  circle.style.transform = 'translate(-50%, -50%) scale(0)';
  circle.style.pointerEvents = 'none'; // so it doesn't interfere with other clicks
  
  // Use a CSS variable for color to adapt to themes
  circle.style.backgroundColor = 'var(--ripple-color)';

  // Add the animation class
  circle.classList.add("global-ripple-effect");

  document.body.appendChild(circle);

  // Clean up the element after animation
  setTimeout(() => {
    circle.remove();
  }, 800); // match animation duration in CSS
};
