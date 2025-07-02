// Utility for combining class names
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// Utility for handling smooth scroll
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId.replace("#", ""));
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
}

// Format statistics numbers
export function formatStatNumber(num: string): string {
  if (num.includes("+")) {
    return num;
  }
  const number = parseInt(num);
  if (number >= 1000) {
    return `${(number / 1000).toFixed(0)}k+`;
  }
  return `${number}+`;
}
