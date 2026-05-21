# Implementation Plan - Website Optimization and Features Expansion (Updated)

This implementation plan details our proposed changes to the Wanomichi Takemusu Aikido Hochburg-Ach website to optimize the mobile experience, add auto-translations for Japanese and French using the DeepL API, redesign the Photo Gallery page with modern aesthetics, and improve the calendar and event components.

---

## Proposed Technical Changes

### 1. Configurable Active Languages List
*   **Problem**: Adding new languages should be easy and controlled by a single field so both the frontend selectors and build-time translation scripts align automatically.
*   **Solution**: In `src/data/site.ts`, define and export a configurable `activeLanguages` list:
    ```typescript
    export const activeLanguages = ['de', 'en', 'fr', 'ja'];
    ```
*   **Dynamic rendering (`src/components/Navigation.astro`)**:
    ```html
    <div class="lang-toggle">
      {activeLanguages.map((lang) => (
        <button class="lang-option" type="button" data-lang={lang}>
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
    ```
*   **Build script (`scripts/translate-i18n.mjs`)**: Import `activeLanguages` dynamically and translate only for active non-German target languages.

### 2. Typographical Enhancements & Readable Font Stack
*   **Serif Initialization (`src/layouts/BaseLayout.astro`)**: Initialize all three fonts simultaneously in a single stylesheet query so the browser loads them and handles failover naturally:
    ```html
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,500..700,50&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Manrope:wght@400;500;600;700;800&family=Noto+Serif+JP:wght@500;600;700&display=swap" rel="stylesheet" />
    ```
*   **CSS Variable Font Chaining (`public/styles/colors.css`)**:
    ```css
    --font-serif: 'Fraunces', 'Cormorant Garamond', 'Libre Baskerville', serif;
    ```
*   **Enlarged Font Sizes (`public/styles/base.css`)**: Boost font sizes slightly to maximize readability across devices:
    *   Change `.content p` base size from `1.06rem` to `1.15rem` with a line-height of `1.82`.
    *   Scale headers and buttons proportionally.

### 3. Mobile View Stability (No Wiggle/Overflow)
*   **Solution**: Control mobile horizontal wiggles on body and main content wrapper (`public/styles/base.css`):
    ```css
    html, body {
      max-width: 100vw;
      width: 100%;
      overflow-x: hidden;
      position: relative;
    }
    .site-wrapper {
      max-width: 100vw;
      width: 100%;
      overflow-x: hidden;
      position: relative;
    }
    ```

### 4. Correcting German Umlauts & Text Cleanups
*   **Review and Correction**: Convert German texts inside Astro components and translation stores (`public/locales/de.json`) from transliterated form (`ae`, `oe`, `ue`, `ss`) to proper German spelling:
    *   *Lehrgaenge* ➔ **Lehrgänge**
    *   *regelmaessigem* ➔ **regelmäßigem**
    *   *Rueckblicke* ➔ **Rückblicke**
    *   *Ausschreibungen fuer* ➔ **Ausschreibungen für**
    *   *oeffnet sich* ➔ **öffnet sich**
    *   *Aeltere Beitraege* ➔ **Ältere Beiträge**
    *   *Ettikette* ➔ **Etikette**
    *   *Duttendorf mit regelmaessigem Training* ➔ **Duttendorf mit regelmäßigem Training**

### 5. Social Icons & Footer (WhatsApp Fixes)
*   **SocialIcon (`src/components/SocialIcon.astro`)**: Replace the generic message bubble inside `lucide:message-circle` with the dual-path WhatsApp vector logo.
*   **Footer (`src/components/Footer.astro`)**: Add a contact list link directly pointing to Christian Dostal's WhatsApp phone number:
    ```html
    <li>
      <a href={contactData.whatsapp.href} target="_blank" rel="noopener noreferrer">
        WhatsApp: {contactData.whatsapp.phoneLabel}
      </a>
    </li>
    ```

### 6. Termine Page Swap & Event Dots (`src/pages/termine.astro`)
*   **Panel Restructuring**: Swapping HTML layout elements so calendar sits left/top and detail panel sits right/bottom.
*   **Dots Render Verification**: Under the day number in `renderCalendar()`, verify placement of `event-dots` with `.event-dot.tone-[color]`.

### 7. News Page Chronicle Limit & Cleanups (`src/pages/news.astro`)
*   **Limited Display**: Limit past events in Chronicle to exactly 7 events using `.slice(0, 7)`.
*   **Warning Fix**: Remove unused `featuredEvents` to clean compilation diagnostics.

### 8. Foto-Galerie Flat List, 3D Shadow Card, and Fallback Logo
*   **3D Overlap Layout**: Implement elevated left image `.gallery-cover` projecting a strong rightward box-shadow onto the adjacent text container.
*   **Logo Fallback**: If an entry does not have a `coverImage`, fall back automatically to the brand logo (`logo_light.png` or similar) so every row maintains the cards structure:
    ```typescript
    const coverImage = entry.coverImage 
      ? withOptionalBasePath(baseUrl, entry.coverImage) 
      : withBasePath(baseUrl, 'images/logo/logo_light.png');
    ```

### 9. Dynamic Navigation Summary Translating & Japanese Metadata
*   **Navigation (`src/components/Navigation.astro`)**: Use custom `data-i18n-summary` attribute.
*   **Script (`public/scripts/i18n.js`)**:
    *   Register `ja: { code: 'JA', htmlLang: 'ja', dateLocale: 'ja-JP' }`.
    *   Parse, split, translate parts, and join back summaries dynamically.

### 10. DeepL Translation & File Cleanups
*   Update `scripts/translate-i18n.mjs` to fetch target languages dynamically from `site.ts`.
*   Delete duplicate Macke-files: `scripts/translate-i18n-Inspiron-Macke.mjs` and `scripts/dev-Inspiron-Macke.mjs`.

---

## Verification Plan

### Automated Checks
*   Run `npm run check` to verify types, imports, and compilation correctness.
*   Run `npm run build` to confirm output compilation success.

### Manual Verification
*   Test screen widths (320px to 1440px) to verify zero wiggling and a perfectly fixed layout.
*   Toggle active languages config to check frontend and compiler adjustments.
