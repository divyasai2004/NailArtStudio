import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import longNailsImg from "../images/longnails.jpg";
import bridalNailsImg from "../images/bridal.jpg";
import customNailsImg from "../images/custom1.jpg";
import shortNailsImg from "../images/shortnails.jpg";
import cherrysetImg from "../images/bluecherry.webp";
import blacknialImg from "../images/black.jpg";
import bridalImg from "../images/ivorybridali.jpeg";
import dreamNailImg from "../images/dreamnail1.webp";




/* ═══════════════════════════════════════════════════════════
   GLOBAL STYLES
═══════════════════════════════════════════════════════════ */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  --cream:    #F1ECE7;
  --crimson:  #451116;
  --rose:     #7a2030;
  --blush:    #e4d0c8;
  --nude:     #cdb5aa;
  --parchment:#f8f4f0;
  --text:     #2a0a0e;
  --muted:    #7a5a5a;
  --white:    #ffffff;
  --ff-serif: 'Cormorant Garamond', Georgia, serif;
  --ff-sans:  'DM Sans', sans-serif;
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --shadow-sm: 0 2px 12px rgba(69,17,22,0.08);
  --shadow-md: 0 8px 32px rgba(69,17,22,0.13);
  --shadow-lg: 0 20px 60px rgba(69,17,22,0.18);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  background: var(--cream);
  color: var(--text);
  font-family: var(--ff-sans);
  font-weight: 300;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--cream); }
::-webkit-scrollbar-thumb { background: var(--nude); border-radius: 99px; }

/* ── Announcement Bar ── */
.ann-bar {
  background: var(--crimson);
  color: var(--cream);
  text-align: center;
  padding: 11px 16px;
  font-family: var(--ff-sans);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.ann-bar code {
  background: rgba(255,255,255,0.18);
  padding: 2px 10px;
  border-radius: 2px;
  font-family: var(--ff-sans);
  font-weight: 500;
}

/* ── Hero ── */
.nh-hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  overflow: hidden;
  background: var(--parchment);
}
.nh-hero__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(64px,9vw,110px) clamp(28px,7vw,100px);
  position: relative;
  z-index: 2;
}
.nh-eyebrow {
  display: flex;
  align-items: center;
  gap: 14px;
  font-family: var(--ff-sans);
  font-size: 0.67rem;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--rose);
  margin-bottom: 22px;
  animation: nh-up 0.9s var(--ease-out) both;
}
.nh-eyebrow::before {
  content: '';
  display: block;
  width: 34px;
  height: 1px;
  background: var(--rose);
  flex-shrink: 0;
}
.nh-hero h1 {
  font-family: var(--ff-serif);
  font-size: clamp(3rem, 5.5vw, 6rem);
  font-weight: 300;
  line-height: 1.06;
  color: var(--crimson);
  letter-spacing: -0.02em;
  margin-bottom: 26px;
  animation: nh-up 0.9s 0.1s var(--ease-out) both;
}
.nh-hero h1 em { font-style: italic; font-weight: 400; color: var(--rose); }
.nh-hero__desc {
  font-size: clamp(0.9rem,1.3vw,1rem);
  line-height: 1.82;
  color: var(--muted);
  max-width: 390px;
  margin-bottom: 44px;
  animation: nh-up 0.9s 0.2s var(--ease-out) both;
}
.nh-hero__cta {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  animation: nh-up 0.9s 0.3s var(--ease-out) both;
}
.nh-btn-primary {
  display: inline-flex;
  align-items: center;
  background: var(--crimson);
  color: var(--cream);
  text-decoration: none;
  padding: 16px 40px;
  font-family: var(--ff-sans);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  transition: background 0.3s, transform 0.25s, box-shadow 0.3s;
  position: relative;
  overflow: hidden;
}
.nh-btn-primary:hover { background: var(--rose); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.nh-btn-ghost {
  display: inline-flex;
  align-items: center;
  background: transparent;
  color: var(--crimson);
  text-decoration: none;
  padding: 16px 30px;
  font-family: var(--ff-sans);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  border: 1px solid var(--nude);
  transition: border-color 0.3s, color 0.3s, background 0.3s;
}
.nh-btn-ghost:hover { border-color: var(--crimson); background: var(--crimson); color: var(--cream); }
.nh-hero__image {
  position: relative;
  overflow: hidden;
  background: var(--blush);
}
.nh-hero__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 8s var(--ease-out);
}
.nh-hero__image:hover img { transform: scale(1.04); }
.nh-hero__badge {
  position: absolute;
  bottom: 36px;
  left: -2px;
  background: var(--white);
  padding: 18px 26px;
  box-shadow: var(--shadow-md);
  animation: nh-badge 1s 0.6s var(--ease-out) both;
  z-index: 3;
}
.nh-hero__badge-title { font-family: var(--ff-serif); font-size: 1.35rem; font-weight: 400; color: var(--crimson); line-height: 1; display: block; margin-bottom: 4px; }
.nh-hero__badge-sub   { font-size: 0.68rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); display: block; }

/* ── Section base ── */
.nh-section { padding: clamp(64px,9vw,112px) clamp(22px,7vw,112px); }
.nh-section--dark   { background: var(--crimson); }
.nh-section--light  { background: var(--parchment); }
.nh-section--blush  { background: var(--blush); }
.nh-section-tag {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: var(--ff-sans);
  font-size: 0.67rem;
  font-weight: 500;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--rose);
  margin-bottom: 16px;
}
.nh-section-tag::before { content: ''; display: block; width: 26px; height: 1px; background: currentColor; }
.nh-section--dark .nh-section-tag { color: rgba(241,236,231,0.5); }
.nh-section h2 {
  font-family: var(--ff-serif);
  font-size: clamp(2.2rem,4vw,3.6rem);
  font-weight: 300;
  color: var(--crimson);
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin-bottom: 10px;
}
.nh-section--dark h2 { color: var(--cream); }
.nh-section__sub {
  font-size: clamp(0.87rem,1.2vw,0.97rem);
  color: var(--muted);
  line-height: 1.8;
  max-width: 480px;
  margin-bottom: 52px;
}
.nh-section--dark .nh-section__sub { color: rgba(241,236,231,0.6); }

/* ── Category Grid ── */
.nh-cat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.nh-cat-tile {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
  text-decoration: none;
  display: block;
  background: var(--blush);
}
.nh-cat-tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s var(--ease-out); }
.nh-cat-tile:hover img { transform: scale(1.07); }
.nh-cat-tile__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(45,5,8,0.75) 0%, rgba(45,5,8,0.1) 50%, transparent 100%);
  transition: opacity 0.35s;
}
.nh-cat-tile:hover .nh-cat-tile__overlay { opacity: 0.88; }
.nh-cat-tile__label {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 24px 20px 20px;
  z-index: 2;
  transform: translateY(6px);
  transition: transform 0.35s var(--ease-out);
}
.nh-cat-tile:hover .nh-cat-tile__label { transform: translateY(0); }
.nh-cat-tile__name { font-family: var(--ff-serif); font-size: 1.35rem; font-weight: 400; color: var(--cream); line-height: 1; display: block; margin-bottom: 5px; }
.nh-cat-tile__cta  { font-size: 0.63rem; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(241,236,231,0.65); font-family: var(--ff-sans); opacity: 0; transition: opacity 0.3s 0.05s; }
.nh-cat-tile:hover .nh-cat-tile__cta { opacity: 1; }

/* ── Product Cards ── */
.nh-products-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
.nh-product-card {
  background: var(--white);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.35s var(--ease-out), box-shadow 0.35s;
}
.nh-product-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); }
.nh-product-card__img { aspect-ratio: 4/5; overflow: hidden; position: relative; background: var(--blush); }
.nh-product-card__img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s var(--ease-out); }
.nh-product-card:hover .nh-product-card__img img { transform: scale(1.06); }
.nh-product-card__badge {
  position: absolute;
  top: 14px; left: 14px;
  background: var(--crimson);
  color: var(--cream);
  font-size: 0.57rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 5px 10px;
  font-family: var(--ff-sans);
  font-weight: 500;
  z-index: 2;
}
.nh-product-card__info {
  padding: 18px 20px 22px;
  border-top: 1px solid var(--blush);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.nh-product-card__name     { font-family: var(--ff-serif); font-size: 1.07rem; font-weight: 400; color: var(--crimson); margin-bottom: 4px; }
.nh-product-card__category { font-size: 0.67rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); }
.nh-product-card__price    { font-family: var(--ff-serif); font-size: 1.1rem; font-weight: 500; color: var(--rose); white-space: nowrap; }

/* ── Custom Section ── */
.nh-custom { display: grid; grid-template-columns: 1fr 1fr; min-height: 560px; align-items: stretch; }
.nh-custom__text {
  background: var(--crimson);
  padding: clamp(52px,7vw,90px) clamp(28px,6vw,80px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.nh-custom__text h2 { color: var(--cream); margin-bottom: 16px; }
.nh-custom__text .nh-section__sub { color: rgba(241,236,231,0.65); margin-bottom: 36px; max-width: 380px; }
.nh-btn-outline-light {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(241,236,231,0.4);
  color: var(--cream);
  text-decoration: none;
  padding: 15px 36px;
  font-family: var(--ff-sans);
  font-size: 0.7rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  width: fit-content;
  transition: background 0.3s, border-color 0.3s;
}
.nh-btn-outline-light:hover { background: rgba(241,236,231,0.1); border-color: rgba(241,236,231,0.75); }
.nh-custom__image { position: relative; overflow: hidden; background: var(--nude); min-height: 360px; }
.nh-custom__image img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.6s var(--ease-out); }
.nh-custom__image:hover img { transform: scale(1.04); }

/* ── How It Works ── */
.nh-how-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--blush); border: 1px solid var(--blush); margin-top: 52px; }
.nh-how-step {
  background: var(--parchment);
  padding: clamp(32px,4vw,52px) clamp(24px,3.5vw,44px);
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
}
.nh-how-step:hover { background: var(--white); }
.nh-how-step__line {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--crimson);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease-out);
}
.nh-how-step:hover .nh-how-step__line { transform: scaleX(1); }
.nh-how-step__num { font-family: var(--ff-serif); font-size: clamp(4rem,6vw,6rem); font-weight: 300; color: var(--blush); line-height: 1; margin-bottom: 20px; transition: color 0.3s; }
.nh-how-step:hover .nh-how-step__num { color: var(--nude); }
.nh-how-step h3 { font-family: var(--ff-serif); font-size: 1.3rem; font-weight: 400; color: var(--crimson); margin-bottom: 12px; }
.nh-how-step p  { font-size: 0.87rem; color: var(--muted); line-height: 1.78; }

/* ── Reviews ── */
.nh-reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 52px; }
.nh-review-card {
  background: var(--white);
  padding: 32px 28px;
  border-top: 2px solid var(--crimson);
  transition: transform 0.3s, box-shadow 0.3s;
}
.nh-review-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
.nh-review-stars   { color: var(--rose); font-size: 0.84rem; letter-spacing: 3px; margin-bottom: 16px; }
.nh-review-card blockquote { font-family: var(--ff-serif); font-size: 1.07rem; font-style: italic; font-weight: 300; color: var(--text); line-height: 1.72; margin-bottom: 20px; }
.nh-review-footer  { display: flex; align-items: center; gap: 12px; }
.nh-review-avatar  { width: 36px; height: 36px; border-radius: 50%; background: var(--blush); display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 500; color: var(--crimson); overflow: hidden; flex-shrink: 0; }
.nh-review-avatar img { width: 100%; height: 100%; object-fit: cover; }
.nh-review-name    { font-size: 0.7rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); font-weight: 500; }
.nh-review-loc     { font-size: 0.67rem; color: var(--muted); margin-top: 2px; }

/* ── Why Choose Us ── */
.nh-why-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 40px 32px; margin-top: 52px; }
.nh-why-item { padding-top: 28px; border-top: 1px solid var(--blush); display: flex; flex-direction: column; gap: 12px; }
.nh-why-item__icon { width: 44px; height: 44px; background: var(--blush); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; transition: background 0.3s; }
.nh-why-item:hover .nh-why-item__icon { background: rgba(69,17,22,0.12); }
.nh-why-item h3 { font-family: var(--ff-serif); font-size: 1.2rem; font-weight: 400; color: var(--crimson); }
.nh-why-item p  { font-size: 0.86rem; color: var(--muted); line-height: 1.78; }

/* ── Instagram ── */
.nh-insta-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; margin-top: 52px; }
.nh-insta-tile { aspect-ratio: 1; overflow: hidden; cursor: pointer; position: relative; background: rgba(241,236,231,0.06); }
.nh-insta-tile img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s var(--ease-out); }
.nh-insta-tile:hover img { transform: scale(1.08); }
.nh-insta-tile__hover { position: absolute; inset: 0; background: rgba(69,17,22,0.45); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
.nh-insta-tile:hover .nh-insta-tile__hover { opacity: 1; }
.nh-insta-tile__hover span { font-size: 1.4rem; color: var(--cream); }
.nh-insta-tile__ph { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 2rem; opacity: 0.15; }
.nh-insta-handle { text-align: center; margin-top: 36px; font-family: var(--ff-serif); font-size: 1.6rem; font-style: italic; font-weight: 300; color: rgba(241,236,231,0.5); }

/* ── Divider ── */
.nh-divider { height: 1px; background: linear-gradient(to right, transparent, var(--nude) 30%, var(--nude) 70%, transparent); margin: 0 clamp(22px,7vw,112px); }

/* ── Stats strip ── */
.nh-stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--blush);
}
.nh-stat {
  background: var(--parchment);
  padding: 24px 18px;
  text-align: center;
}
.nh-stat strong {
  display: block;
  font-family: var(--ff-serif);
  font-size: 1.6rem;
  color: var(--crimson);
}
.nh-stat span {
  font-size: 0.68rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ── Scroll reveal ── */
.nh-reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.75s var(--ease-out), transform 0.75s var(--ease-out); }
.nh-reveal.is-visible,
.is-visible .nh-reveal { opacity: 1; transform: translateY(0); }
.nh-reveal-d1 { transition-delay: 0.1s; }
.nh-reveal-d2 { transition-delay: 0.2s; }
.nh-reveal-d3 { transition-delay: 0.3s; }

/* ── Animations ── */
@keyframes nh-up    { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
@keyframes nh-badge { from { opacity:0; transform:translateX(-20px); } to { opacity:1; transform:translateX(0); } }

/* ═══════ RESPONSIVE ═══════ */
@media (max-width:1024px) {
  .nh-cat-grid        { grid-template-columns: repeat(2,1fr); }
  .nh-products-grid   { grid-template-columns: repeat(2,1fr); }
  .nh-reviews-grid    { grid-template-columns: repeat(2,1fr); }
  .nh-why-grid        { grid-template-columns: repeat(2,1fr); }
  .nh-insta-grid      { grid-template-columns: repeat(4,1fr); }
}
@media (max-width:768px) {
  .nh-hero            { grid-template-columns:1fr; min-height:auto; }
  .nh-hero__text      { padding:56px 22px 44px; order:2; }
  .nh-hero__image     { height:62vw; min-height:240px; order:1; }
  .nh-hero__badge     { bottom:18px; left:14px; }
  .nh-hero h1         { font-size:clamp(2.4rem,8vw,3.2rem); }
  .nh-custom          { grid-template-columns:1fr; }
  .nh-custom__image   { min-height:280px; order:-1; }
  .nh-how-grid        { grid-template-columns:1fr; }
  .nh-reviews-grid    { grid-template-columns:1fr; }
  .nh-why-grid        { grid-template-columns:1fr; gap:28px; }
  .nh-insta-grid      { grid-template-columns:repeat(3,1fr); }
  .nh-stats-strip     { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:480px) {
  .nh-cat-grid        { grid-template-columns:repeat(2,1fr); gap:8px; }
  .nh-products-grid   { grid-template-columns:1fr; }
  .nh-insta-grid      { grid-template-columns:repeat(2,1fr); }
  .nh-hero__cta       { flex-direction:column; }
  .nh-btn-primary,
  .nh-btn-ghost       { justify-content:center; text-align:center; }
  .nh-stats-strip     { grid-template-columns:1fr; }
}
`;

/* ═══════════════════════════════════════════════════════════
   DATA — swap placeholder src values with your own image paths
   e.g.  src: "/images/category-short.jpg"
         src: "/images/product-cherry-blossom.jpg"
         src: "/images/hero.jpg"
═══════════════════════════════════════════════════════════ */
const HERO_IMG = "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=85";

const CATEGORIES = [
  { name: "Short", cta: "Shop Short", src: shortNailsImg },
  { name: "Long", cta: "Shop Long", src: longNailsImg },
  { name: "Bridal", cta: "Shop Bridal", src: bridalNailsImg },
  { name: "Custom", cta: "Design Yours", src: customNailsImg },
];

const BESTSELLERS = [
  { name: "Blue Cherry Blossom Set", category: "Short · Almond", price: "₹549", badge: "Bestseller", src: cherrysetImg },
  { name: "Midnight Noir Set", category: "Long · Stiletto", price: "₹599", badge: "Trending", src: blacknialImg },
  { name: "Ivory Bridal Set", category: "Medium · Square", price: "₹699", badge: "New", src: bridalImg },
];

const REVIEWS = [
  { text: "Absolutely obsessed! Wore them two weeks straight without a single chip. Better than my salon.", name: "Priya M.", loc: "Mumbai" },
  { text: "Finally found press-ons that actually look salon-done. The packaging is stunning. Will reorder.", name: "Aarohi S.", loc: "Pune" },
  { text: "My custom bridal set was beyond expectations. Everyone thought I visited a salon!", name: "Tanvi R.", loc: "Delhi" },
];

const WHY = [
  { icon: "📦", title: "Cash on Delivery", desc: "No payment stress. Pay when your beautiful order arrives at your door." },
  { icon: "♻️", title: "Premium & Reusable", desc: "High-quality materials — remove, clean, and wear again up to 10 times." },
  { icon: "🤍", title: "100% Handmade", desc: "Every set is hand-crafted with care, patience, and artistic precision." },
];

const INSTA = ["💅", "🌸", "🤍", "✨", "🖤", "🌷", "💎", "🫧", "🌙", "💗"];

/* ── Scroll reveal hook ── */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Home() {
  useEffect(() => {
    if (!document.getElementById("nh-global-styles")) {
      const el = document.createElement("style");
      el.id = "nh-global-styles";
      el.textContent = STYLES;
      document.head.appendChild(el);
    }
  }, []);

  const catRef = useReveal();
  const sellRef = useReveal();
  const howRef = useReveal();
  const revRef = useReveal();
  const whyRef = useReveal();
  const instaRef = useReveal();

  return (
    <>
      {/* ── Discount Banner ── */}
      <div className="ann-bar">
        ✦ Free shipping above ₹999 &nbsp;·&nbsp; Use code <code>NAIL10</code> for 10% off your first order ✦
      </div>

      {/* ══════════════ HERO ══════════════ */}
      <section className="nh-hero">
        <div className="nh-hero__text">
          <p className="nh-eyebrow">Luxury Press-On Collection</p>
          <h1>Salon-quality<br />nails, <em>at your<br />door.</em></h1>
          <p className="nh-hero__desc">
            Handmade, reusable press-ons crafted to match your mood in minutes.
            No glue mess. No salon wait time. Just gorgeous nails.
          </p>
          <div className="nh-hero__cta">
            <Link className="nh-btn-primary" to="/products">Shop Collection</Link>
            <Link className="nh-btn-ghost" to="/products?category=Custom">Custom Design →</Link>
          </div>
        </div>

        {/*
          ┌─────────────────────────────────────────────────────────┐
          │  HERO IMAGE — replace src with your own photo path:      │
          │  src="/images/hero-nails.jpg"                            │
          └─────────────────────────────────────────────────────────┘
        */}
        <div className="nh-hero__image">
          <img src={HERO_IMG} alt="Luxury handmade press-on nails" loading="eager" />
          <div className="nh-hero__badge">
            <span className="nh-hero__badge-title">500+ Happy Customers</span>
            <span className="nh-hero__badge-sub">& counting ✦</span>
          </div>
        </div>
      </section>

      <div className="nh-divider" />
      <section className="nh-stats-strip">
        <article className="nh-stat">
          <strong>10k+</strong>
          <span>Sets Sold</span>
        </article>
        <article className="nh-stat">
          <strong>4.9/5</strong>
          <span>Average Rating</span>
        </article>
        <article className="nh-stat">
          <strong>48h</strong>
          <span>Fast Dispatch</span>
        </article>
        <article className="nh-stat">
          <strong>100%</strong>
          <span>Handmade</span>
        </article>
      </section>

      {/* ══════════════ CATEGORIES ══════════════ */}
      <section className="nh-section nh-section--light" ref={catRef}>
        <div className="nh-reveal">
          <p className="nh-section-tag">Explore</p>
          <h2>Shop by Category</h2>
          <p className="nh-section__sub">From everyday elegance to once-in-a-lifetime bridal — find the set that's meant for you.</p>
        </div>

        <div className="nh-cat-grid">
          {CATEGORIES.map((cat, i) => (
            <Link key={cat.name} className={`nh-cat-tile nh-reveal nh-reveal-d${Math.min(i + 1, 3)}`} to={`/products?category=${cat.name}`}>
              {/*
                Replace src with your own category image:
                src="/images/category-short.jpg"
              */}
              <img src={cat.src} alt={cat.name + " nails"} loading="lazy" />
              <div className="nh-cat-tile__overlay" />
              <div className="nh-cat-tile__label">
                <span className="nh-cat-tile__name">{cat.name} Nails</span>
                <span className="nh-cat-tile__cta">{cat.cta} →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="nh-divider" />

      {/* ══════════════ BEST SELLERS ══════════════ */}
      <section className="nh-section" ref={sellRef}>
        <div className="nh-reveal">
          <p className="nh-section-tag">Fan Favourites</p>
          <h2>Best Sellers</h2>
          <p className="nh-section__sub">Sets that sell out every week — for very good reason.</p>
        </div>

        <div className="nh-products-grid">
          {BESTSELLERS.map((p, i) => (
            <div key={p.name} className={`nh-product-card nh-reveal nh-reveal-d${i + 1}`}>
              <div className="nh-product-card__img">
                {/*
                  Replace src with your product photo:
                  src="/images/product-cherry-blossom.jpg"
                */}
                <img src={p.src} alt={p.name} loading="lazy" />
                <span className="nh-product-card__badge">{p.badge}</span>
              </div>
              <div className="nh-product-card__info">
                <div>
                  <p className="nh-product-card__name">{p.name}</p>
                  <p className="nh-product-card__category">{p.category}</p>
                </div>
                <p className="nh-product-card__price">{p.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ CUSTOM NAILS ══════════════ */}
      <section className="nh-custom">
        <div className="nh-custom__text">
          <p className="nh-section-tag">Made for You</p>
          <h2>Your Dream Nails, Crafted to Order</h2>
          <p className="nh-section__sub">Send your mood board, inspo pics, or just a vibe — we'll hand-craft a set that's entirely, uniquely yours.</p>
          <Link className="nh-btn-outline-light" to="/products?category=Custom">Start Your Design →</Link>
        </div>
        <div className="nh-custom__image">
          {/*
            Replace with your custom section image:
            src="/images/custom-nails-highlight.jpg"
          */}
          <img src={dreamNailImg} alt="Custom nail art" loading="lazy" />
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="nh-section nh-section--light" ref={howRef}>
        <div className="nh-reveal">
          <p className="nh-section-tag">The Process</p>
          <h2>How It Works</h2>
        </div>
        <div className="nh-how-grid">
          {[
            { n: "01", title: "Pick your design", desc: "Browse our collections or describe your dream set for a fully custom order." },
            { n: "02", title: "Select size & shape", desc: "Use our sizing guide to find the perfect fit — we handle everything else." },
            { n: "03", title: "Doorstep delivery", desc: "Your nails arrive beautifully packaged, ready to apply in under 10 minutes." },
          ].map(s => (
            <div key={s.n} className="nh-how-step nh-reveal">
              <div className="nh-how-step__line" />
              <div className="nh-how-step__num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ REVIEWS ══════════════ */}
      <section className="nh-section nh-section--blush" ref={revRef}>
        <div className="nh-reveal">
          <p className="nh-section-tag">Real Customers</p>
          <h2>They're Obsessed.<br /><em style={{ fontWeight: 300, color: "var(--rose)" }}>You Will Be Too.</em></h2>
        </div>
        <div className="nh-reviews-grid">
          {REVIEWS.map((r, i) => (
            <div key={r.name} className={`nh-review-card nh-reveal nh-reveal-d${i + 1}`}>
              <div className="nh-review-stars">★★★★★</div>
              <blockquote>"{r.text}"</blockquote>
              <div className="nh-review-footer">
                <div className="nh-review-avatar">{r.name.charAt(0)}</div>
                <div>
                  <p className="nh-review-name">{r.name}</p>
                  <p className="nh-review-loc">{r.loc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ WHY CHOOSE US ══════════════ */}
      <section className="nh-section" ref={whyRef}>
        <div className="nh-reveal">
          <p className="nh-section-tag">Our Promise</p>
          <h2>Why Choose Us</h2>
        </div>
        <div className="nh-why-grid">
          {WHY.map((w, i) => (
            <div key={w.title} className={`nh-why-item nh-reveal nh-reveal-d${i + 1}`}>
              <div className="nh-why-item__icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════ INSTAGRAM / UGC ══════════════ */}
      <section className="nh-section nh-section--dark" ref={instaRef}>
        <div className="nh-reveal" style={{ textAlign: "center" }}>
          <p className="nh-section-tag" style={{ justifyContent: "center" }}>Community</p>
          <h2 style={{ textAlign: "center" }}>Tag Us on Instagram</h2>
          <p className="nh-section__sub" style={{ margin: "0 auto", textAlign: "center" }}>
            Show off your set and get featured on our page. Tag <strong style={{ color: "var(--cream)" }}>@yournailbrand</strong>
          </p>
        </div>

        <div className="nh-insta-grid">
          {INSTA.map((em, i) => (
            <div key={i} className="nh-insta-tile nh-reveal">
              {/*
                ┌───────────────────────────────────────────────────┐
                │  INSTAGRAM / UGC PHOTOS — replace placeholder:     │
                │  <img src="/images/ugc-1.jpg" alt="Customer nails" │
                │       loading="lazy" />                            │
                └───────────────────────────────────────────────────┘
              */}
              <div className="nh-insta-tile__ph">{em}</div>
              <div className="nh-insta-tile__hover"><span>♥</span></div>
            </div>
          ))}
        </div>

        <p className="nh-insta-handle">@yournailbrand</p>
      </section>
    </>
  );
}



// import React from "react";
// import { Link } from "react-router-dom";

// const Home = () => {
//   return (
//     <div className="stack-lg">
//       <section className="hero">
//         <p className="eyebrow">Luxury Press-On Collection</p>
//         <h1>Salon-quality nails, delivered to your doorstep.</h1>
//         <p>
//           Handmade, reusable, and designed to match your mood in minutes. No
//           glue mess. No salon wait time.
//         </p>
//         <Link className="btn-primary" to="/products">
//           Shop Now
//         </Link>
//       </section>

//       <section className="panel">
//         <h2>Shop by Category</h2>
//         <div className="grid-4">
//           {["Short", "Long", "Bridal", "Custom"].map((cat) => (
//             <Link key={cat} className="tile" to={`/products?category=${cat}`}>
//               {cat} Nails
//             </Link>
//           ))}
//         </div>
//       </section>

//       <section className="panel">
//         <h2>Best Sellers</h2>
//         <p>Fan favorites that sell out every week.</p>
//       </section>

//       <section className="panel">
//         <h2>Custom Nails Highlight</h2>
//         <p>Send your mood board, and we craft your dream set.</p>
//       </section>

//       <section className="panel">
//         <h2>How It Works</h2>
//         <div className="grid-3">
//           <div className="tile">1. Pick your design</div>
//           <div className="tile">2. Select size & shape</div>
//           <div className="tile">3. Get doorstep delivery</div>
//         </div>
//       </section>

//       <section className="panel">
//         <h2>Customer Reviews</h2>
//         <p>Real customer photos and long-lasting wear proof.</p>
//       </section>

//       <section className="panel">
//         <h2>Why Choose Us</h2>
//         <ul className="plain-list">
//           <li>Cash on Delivery available</li>
//           <li>Reusable premium quality nails</li>
//           <li>100% handmade with love</li>
//         </ul>
//       </section>

//       <section className="panel">
//         <h2>Instagram / UGC Feed</h2>
//         <p>Tag us on Instagram to get featured.</p>
//       </section>

//       <section className="discount-popup">
//         <strong>Discount Popup:</strong> Use code <code>NAIL10</code> for 10%
//         off first order.
//       </section>
//     </div>
//   );
// };

// export default Home;