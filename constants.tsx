
import React from 'react';
import { StyleType, Quality } from './types';

export const CINEMATIC_ANGLES = [
  "Medium shot, subject centered, face clearly visible, professional framing",
  "Close-up portrait, focusing on facial expressions and high-detail skin texture",
  "Three-quarter view, subjects face fully within frame, artistic lighting",
  "Eye-level shot, symmetrical composition, balanced framing",
  "Cinematic portrait, subject centered, no head cropping, full view of upper body",
  "Low angle heroic shot, subject fully visible against the environment",
  "Side profile but with face turned slightly towards camera to maintain identity visibility"
];

export const STYLE_PROMPTS = {
  [StyleType.TET_MAI]: `Ultra-realistic portrait, luxury Vietnamese Tet atmosphere, Southern Vietnam apricot blossom garden (vườn mai vàng), elegant traditional Ao Dai, cinematic lighting, soft golden ambient light, high-detail skin texture, photorealistic, face identity preserved, same facial structure, same skin tone, hyperrealistic, professional photography`,
  
  [StyleType.TET_DAO]: `Ultra-realistic portrait, luxury Vietnamese Tet atmosphere, Northern Vietnam peach blossom garden (vườn đào), elegant traditional Ao Dai, cinematic lighting, soft spring mist, premium fashion photography, high-detail skin texture, photorealistic, face identity preserved, same facial structure, same skin tone`,
  
  [StyleType.TET_LONG_DEN]: `Ultra-realistic portrait, luxury Vietnamese Tet atmosphere, traditional lantern street, vibrant red lanterns background, modern Ao Dai, glowing ambient light, cinematic festival mood, hyperrealistic skin detail, photorealistic, face identity preserved`,
  
  [StyleType.TET_NGUYEN_HUE]: `Ultra-realistic portrait, luxury Vietnamese Tet atmosphere, Saigon Nguyen Hue walking street, celebratory crowds and grand flower displays, spring fashion, professional commercial photography, high clarity, face identity preserved`,

  [StyleType.PROFILE_VEST]: `Ultra-realistic professional profile portrait, luxury dark blue and charcoal grey gradient background, premium tailored vest and suit, sophisticated executive look, studio rim lighting, sharp focus, cinematic masterwork, photorealistic, face identity preserved, same facial structure, same skin tone`,

  [StyleType.BUSINESS]: `Ultra-realistic corporate portrait, professional business style, luxury office background, executive look, suit, blazer, corporate lighting, studio lighting, sharp focus, clean background, professional headshot, business magazine style, photorealistic, face identity preserved`,
  
  [StyleType.FASHION]: `Ultra-realistic fashion portrait, modern creative style, stylish outfit, high-end fashion editorial look, studio lighting, artistic lighting, Vogue magazine style, dramatic shadows, premium photography, hyperrealistic skin detail, photorealistic, face identity preserved`,

  [StyleType.GALA]: `Ultra-realistic luxury gala portrait. Wearing a high-end evening gown made of premium silk and sequins, red carpet event atmosphere, sophisticated lighting, glamorous and elegant. Subject centered, face clearly visible, professional ballroom framing, high-detail fabric and skin texture, photorealistic.`,

  [StyleType.CLASSIC_LOTUS]: `8K hyper-realistic fine art portrait of an East Asian woman around 35 years old, classical Vietnamese aesthetic. Wearing a modern-traditional "ao yem" made of thin light blue silk with silver sheen, exquisite white lotus embroidery. Bare shoulders, flowing silk sleeves, feminine and pure. She is sitting slightly tilted to the left, left hand touching an ancient ceramic vase, right hand holding a white lotus flower, head slightly tilted, loose hair with strands flying. Gentle, shy expression, downcast eyes, soft smile - radiating peace and grace. Background: dark brown-black, large ceramic vase with white lotuses and large leaves for depth. Studio lighting: backlight/rim light creating a halo on hair and shoulders, highlighting clear skin, dreamlike atmosphere. Framing: 3/4 view, eye-level, harmonious triangle composition between vase, face, and lotus. Full framing, no cropping of head or main features.`
};

export const QUALITY_MAPPING = {
  [Quality.FOUR_K]: `ultra detailed, 4k resolution, sharp focus, high clarity, clean texture, professional commercial photography`,
  [Quality.EIGHT_K]: `ultimate quality, 8k resolution, hyper sharp, extreme realism, cinematic quality, ultra high definition, professional commercial photography quality`,
  [Quality.SIXTEEN_K]: `extreme 16k resolution masterwork, infinite detail, hyper-realistic textures, microscopic clarity, legendary photography quality, flawless cinematic masterpiece`
};

export const Icons = {
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  Refresh: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  Eye: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Trash: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Key: () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
};
