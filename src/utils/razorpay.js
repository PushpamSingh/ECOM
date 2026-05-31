// Loads the Razorpay checkout script once and resolves when ready.
let loaded = false;

export function loadRazorpay() {
  return new Promise((resolve) => {
    if (loaded || window.Razorpay) {
      loaded = true;
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      loaded = true;
      resolve(true);
    };
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
