// vite-env.d.ts

/// <reference types="vite/client" />

// Para imports con valor: import styles from './Hero.css'
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Para side-effect imports: import './Hero.css'
declare module "*.css" {}