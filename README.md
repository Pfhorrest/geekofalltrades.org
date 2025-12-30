# Geek Of All Trades

A modern take on web fundamentals, blending the best practices of the old web with contemporary technologies and standards.

## Philosophy

This website represents decades of evolution while maintaining core web principles. It strives to uphold the good aspects of the old web while embracing modern improvements:

### Structure
- Hand-written semantic polyglot (X)HTML5
- PrevHP system: Lightweight PHP framework inspired by NextJS concepts, adaptable to ancient xAMP-stack sites
- Fully searchable and accessible without additional effort
- Works perfectly fine with CSS or JS disabled

### Styles
- Fusion of modern flat design (default) and playful skeuomorphic design (on interaction)
- Mobile-first, responsive up to UHD displays
- Pure SCSS with progressive enhancement (compiled to CSS)
- Complete separation of presentation from structure
- No JavaScript required for styling (but progressive enhancements with it)

### Scripts
- Works completely without JavaScript (ensures searchability and accessibility)
- Progressive enhancement for enabled JavaScript users
- Vanilla TypeScript (compiled to ES6) - no heavy frameworks
- Snappy performance on client and server

## Features

- **Modular Gallery System**: PHP gallery module that generates HTML image galleries from arrays
- **Lightbox Component**: Interactive image viewing with keyboard navigation
- **Collapsible Sections**: JavaScript-enhanced expandable/collapsible content sections
- **Color Scheme Switcher**: User-selectable color themes with localStorage persistence
- **Motion Preferences**: Respects and allows toggling of reduced motion preferences
- **Lazy Loading**: Performance-optimized image loading
- **Scroll Animations**: Smooth reveal animations as content enters viewport
- **Breadcrumb Navigation**: Dynamic breadcrumb generation based on URL structure
- **Dropdown Menus**: Accessible navigation with keyboard support

## Tech Stack

- **Frontend**: HTML5, SCSS (compiled to CSS), TypeScript (compiled to ES6 JavaScript)
- **Backend**: PHP with custom routing (replicates `.htaccess` behavior locally)
- **Build Tools**: 
  - Sass compiler
  - TypeScript compiler (`tsc`)
  - fswatch (for live reload)
  - Concurrently (for running multiple watch processes)
- **Deployment**: SSH, Git, rsync
- **Hosting**: Dreamhost

## Prerequisites

- Node.js and npm
- PHP (with CLI for local development)
- SSH access to deployment servers (for deployment scripts)
- Git

## Project Structure

```
geekofalltrades.org/
├── ___structure/          # PHP structural components (PrevHP)
│   ├── html.php           # PrevHP core: cascading layout system
│   ├── http.php           # Dev router (replicates .htaccess)
│   ├── config.php         # Site-wide configuration variables
│   └── modules/           # Reusable PHP modules
├── __scripts/             # TypeScript/JavaScript files
│   ├── modules/           # Script modules
│   └── scripts.js         # Main script (compiled)
├── __styles/              # SCSS/CSS files
│   ├── modules/           # Style modules
│   └── styles.css         # Main stylesheet (compiled)
├── _media/                # Media assets
│   └── images/            # Image files
├── photos/                # Photo galleries (not in git, deployed via rsync)
├── [content-dirs]/        # Content directories (e.g., /stories, /essays, etc.)
│   ├── __head.php         # Page metadata (title, description)
│   ├── __header.php       # Header content (optional)
│   ├── __nav.php          # Navigation (optional)
│   ├── __main.php         # Main page content
│   ├── __footer.php       # Footer content (optional)
│   ├── __styles/          # Page-specific styles (optional)
│   └── __scripts/         # Page-specific scripts (optional)
├── __head.php             # Root metadata (title, description)
├── __header.php           # Root header content
├── __nav.php              # Root navigation
├── __main.php             # Root page content
├── __footer.php           # Root footer content
├── .htaccess              # Apache configuration for routing
├── package.json           # npm configuration and scripts
└── tsconfig.json          # TypeScript configuration
```

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pfhorrest/geekofalltrades.org.git
   cd geekofalltrades.org
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   This command concurrently runs four processes with color-coded output:
   - **SASS** (magenta): `sass --watch` - Compiles SCSS to CSS on change
   - **TS** (yellow): `tsc --watch` - Compiles TypeScript to JavaScript on change
   - **PHP** (blue): PHP built-in server on `geekofalltrades.local:8000`
   - **LOAD** (green): Opens browser and watches for file changes to reload

4. **Access the site**
   
   The dev script automatically opens `http://geekofalltrades.local:8000` in your browser.

## The PrevHP System

PrevHP is a component-based PHP system inspired by NextJS, but designed to work on traditional xAMP stacks without any build process. The name is a playful reversal of "Next" - going back to basics while borrowing modern concepts.

### How It Works

The core of PrevHP is `___structure/html.php`, which:

1. **Parses the URL** into segments (e.g., `/graphics/logo/` → `["graphics", "logos"]`)
2. **Builds breadcrumbs** for each level (e.g., `["/", "/graphics/", "/graphics/logos/"]`)
3. **Cascades through directories** from root to the requested page, loading at each level:
   - `__styles/styles.css` - Page-specific styles
   - `__scripts/scripts.js` - Page-specific scripts
   - `__head.php` - Metadata (title, description)
   - `__header.php` - Header content
   - `__nav.php` - Navigation menus
   - `__footer.php` - Footer content
4. **Renders the page structure**:
   - All `__header.php` files from deep to shallow
   - All `__nav.php` files cascaded into the navigation (hierarchical menus)
   - The `__main.php` from the requested directory (the actual page content)
   - All `__footer.php` files from shallow to deep
5. **Handles special cases**:
   - Lightbox display via `?display=image.jpg` parameter
   - Directory listings
   - Error pages (403, 404, 500)

### Navigation System

The navigation is automatically built from cascading `__nav.php` files:

**Structure:**
- Root `__nav.php` provides the main site navigation
- Each section can have its own `__nav.php` for subsection menus
- Menus are combined in the root header's `<nav>` element

**Behavior:**
- **Mobile (< 640px)**: Menu collapses; only current section's menu visible
- **Desktop (≥ 640px)**: 
  - Breadcrumbs show navigation path with fading opacity
  - Hovering a breadcrumb reveals its associated menu after delay
  - Menus slide smoothly with configurable transitions
  - Returns to deepest menu when not hovering any breadcrumb

### Example: Loading `/graphics/logos/`

```
Root (/)
├── __styles/styles.css            ← Loaded
├── __scripts/scripts.js           ← Loaded
├── __head.php                     ← Loaded (sets base title/description)
├── __header.php                   ← Loaded (site header)
├── __nav.php                      ← Loaded into site header (site navigation)
├── graphics/__nav.php             ← Loaded into site header (graphics section navigation)
├── graphics/logos/__nav.php       ← Loaded into site header (logos section navigation)
│
├── graphics/
│   ├── __styles/styles.css        ← Loaded (graphics section styles)
│   ├── __scripts/scripts.js       ← Loaded (graphics section scripts)
│   ├── __head.php                 ← Loaded (updates title/description)
│   ├── __header.php               ← Loaded (graphics section header)
│   │
│   ├── logos/
│   │   ├── __styles/styles.css   ← Loaded (logos section styles)
│   │   ├── __scripts/scripts.js  ← Loaded (logos section scripts)
│   │   ├── __head.php            ← Loaded (final title/description)
│   │   ├── __main.php            ← Rendered as main content
│   │   └── __footer.php          ← Loaded (logos section footer)
│   │
│   └── __footer.php              ← Loaded (graphics section header)
│
└── __footer.php                  ← Loaded (site footer)
```

### Routing

#### Production (Apache with .htaccess)
```apache
# Forward all non-file, non-__ requests to html.php
RewriteCond %{REQUEST_URI} !/__
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule .* ___structure/html.php [L]

# Allow importing .js files without extension in __scripts
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^(__scripts/.+)$ $1.js [L]
```

#### Development (http.php router for PHP built-in server)
The `http.php` router replicates `.htaccess` behavior:
- Serves static files directly
- Adds trailing slashes to directories
- Routes `__scripts` imports to `.js` files
- Routes everything else through `html.php`

This ensures identical behavior between development and production.

### Key Conventions

- **`_` prefix**: Media and asset directories
- **`__` prefix**: Special files/directories used by the system
- **`___` prefix**: Internal system directories (the PrevHP core)
- **Each route has its own `__main.php`**: PrevHP expects content at `[url-path]/__main.php`

## Deployment

The project includes npm scripts for deploying to both staging and production environments on Dreamhost.

### Deploy to Staging

```bash
npm run stage
```

This runs two sub-commands:
- `stage-code`: SSH to `dev.geekofalltrades.org` and `git pull`
- `stage-photos`: rsync photos directory (photos are not in git due to size)

### Deploy to Production

```bash
npm run deploy
```

This runs rsync over ssh to update `geekofalltrades.org` from `dev.geekofalltrades.org`

## Photo Processing System

The `/photos/` directory includes an automated photo gallery generation system (`/photos/process_photos/`) that creates galleries from folder hierarchies using EXIF data, geolocation APIs, and image recognition.

### Features

**Automated Gallery Generation:**
- Recursively processes photo directories (deepest first)
- Generates appropriately-sized thumbnails (`-thumb` suffix)
- Creates `__head.php` and `__main.php` files for date-based folders
- Supports hierarchical date structure: `YYYY/`, `YYYY/MM/`, `YYYY/MM/DD/`

**Smart Image Handling:**
- Extracts EXIF metadata (timestamp, location, camera info)
- Uses HuggingFace image recognition models for auto-descriptions
- Queries OpenStreetMap API for location names
- Sorts images reverse-chronologically by EXIF timestamp

**Gallery Organization:**
- Date-based galleries automatically titled (e.g., "15th of March 2024 Photography")
- Parent folders aggregate child galleries
- "More from [date]" links for galleries exceeding threshold
- Orphan thumbnail cleanup and validation

**Usage:**
```bash
cd photos/process_photos
python -m process_photos
```

The script:
1. Creates thumbnails for all images (configurable size)
2. Extracts EXIF data and generates descriptions
3. Creates or updates `__main.php` with image arrays
4. Organizes galleries hierarchically with "more" links
5. Resorts existing galleries by timestamp

**Configuration** (`config.py`):
- `THUMB_SIZE`: Thumbnail dimensions
- `subimage_threshold`: Minimum images before creating "more" links
- Image extensions and processing options

## Key Modules

### Gallery Module (`___structure/modules/gallery.php`)

A powerful image gallery generator with automatic discovery and nested gallery support.

**Usage:**
```php
<?php
// Option 1: Explicit array of images
echo render_gallery($images = [
    [
        'filename' => 'image.jpg',
        'title' => 'Image Title',
        'description' => 'Image description',
        'altlink' => 'external-url.com',   // Optional external link
        'morelink' => 'subfolder',         // Optional subgallery link
        'moretext' => 'Series Name',       // Optional link text
        'morecount' => 5,                  // Optional manual count
    ],
    // ... more images
]);

// Option 2: Automatic discovery (scans current directory)
echo render_gallery();
?>
```

**Key Features:**

1. **Automatic Image Discovery**: When called without arguments, scans the calling file's directory for images, automatically building the gallery array

2. **Nested Gallery Support**: Can create hierarchical galleries up to 3 levels deep
   - Finds images in subdirectories
   - Generates "X more from [folder]" links
   - Recursively counts images in nested galleries

3. **Smart Thumbnail Handling**: 
   - Automatically looks for `-thumb` versions of images
   - Falls back to full image if thumbnail doesn't exist
   - Searches both local directory and `_media/images/`

4. **Flexible File Paths**: 
   - First tries root of calling file's directory
   - Falls back to `_media/images/` if not in root

5. **Lightbox Integration**: 
   - Generates `?display=filename&title=...` URLs for lightbox viewing
   - Supports external links via `altlink` parameter

6. **Progressive Enhancement**:
   - Works as standard image grid without JavaScript
   - Enhanced with lightbox when JavaScript enabled

**Auto-Discovery Behavior:**
- Ignores files starting with `.` (hidden files)
- Ignores files starting with `_` (special directories)
- Skips `-thumb` files (to avoid duplicates)
- Processes images in reverse chronological order
- For directories, uses first found image as thumbnail
- Automatically counts nested images for "more" links

### Lightbox (`___structure/modules/views/partials/lightbox.php`)
Progressive enhancement: works as regular links without JavaScript, enhanced with overlay and keyboard navigation when JavaScript is enabled. Activated via `?display=filename.jpg` URL parameter.

### Color Scheme System

A sophisticated theming system based on HSL color manipulation with configurable themes.

**Configuration** (`__styles/modules/root/colors/colors-config.scss`):
```scss
// Primary color variables
--hm: 120;    // Main hue (0-360)
--hs: 60;     // Hue separation for complementary colors
--sm: 50%;    // Main saturation
--lmo: 75%;   // Main lightness offset (contrast from background)
```

**Built-in Themes:**
- `natural` (default): Green-based (hue 120°) with 60° separation
- `warmer`: Yellow-orange-based (hue 45°) with 15° separation
- `cooler`: Blue-azure-based (hue 195°) with 15° separation
- `alien`: Magenta-based (hue 300°) with negative separation
- `grays`: Desaturated version (saturation 0%)

**How it works:**
- Base colors defined in HSL with CSS custom properties
- Secondary colors automatically calculated from primary hues (`colors-calc.scss`)
- JavaScript hydration enables theme switcher in footer
- Respects `prefers-color-scheme` media query
- Persists user preference in localStorage
- All themes derive from the same mathematical relationships

## Design System

The site uses a configurable design system based on CSS custom properties and SCSS mixins.

### Spacing System (`__styles/modules/root/layout/spacing.scss`)

Responsive spacing that scales with viewport and font size:

```scss
--spacingFactor: 1;        // Multiplier for spacing
--spacingRel: clamp(       // Relative to local font size
  0.5rem, 
  calc(100vw / 60),
  calc(var(--spacingFactor) * 1em)
);
--spacingAbs: clamp(       // Relative to root font size
  0.5rem,
  calc(100vw / 60),
  calc(var(--spacingFactor) * 1rem)
);
```

### Rounding System (`__styles/modules/root/layout/rounding.scss`)

Border radius that coordinates with spacing:

```scss
--roundingFactor: 1;       // Multiplier for rounding
--rounding: calc(var(--spacing) * var(--roundingFactor));
```

### Breakpoints (`__styles/modules/root/layout/breakpoints.scss`)

Mobile-first breakpoint system:

```scss
$bp1: 20rem;   // 320px  - Small phones
$bp2: 40rem;   // 640px  - Large phones / small tablets
$bp3: 60rem;   // 960px  - Tablets / small laptops
$bp4: 80rem;   // 1280px - Desktops / large screens
```

Available as both SCSS variables and CSS custom properties for use in media queries and JavaScript.
- Respects `prefers-reduced-motion` media query
- Allows manual toggle via footer control
- Affects slide, fade, and scroll animations

## Development Principles

- **Progressive Enhancement**: Core functionality works without JavaScript or CSS
- **Semantic HTML**: Meaningful markup that works universally
- **Separation of Concerns**: Structure (HTML/PHP), presentation (CSS/SCSS), and behavior (JavaScript/TypeScript) remain independent
- **Performance First**: Vanilla technologies for lightweight, fast experiences
- **Accessibility**: Built-in support for screen readers and assistive technologies
- **No Framework Dependence**: Easy to understand and modify with just vanilla web tech knowledge
- **Cascading Architecture**: Each level of the URL hierarchy can add styles, scripts, and content

## Browser Support

- **Basic functionality**: All browsers (even with CSS/JS disabled)
- **Enhanced features**: Modern browsers with CSS3 and ES6 support
- **Optimal experience**: Latest browsers with full progressive enhancement features

## TypeScript & SCSS

The project uses TypeScript and SCSS for better development experience:

- **TypeScript**: Provides type safety and better IDE support, compiles to clean ES6 JavaScript modules
- **SCSS**: Enables variables, nesting, and mixins for maintainable styles, compiles to standard CSS

Both compiled outputs (`.js` and `.css` files) are committed to the repository for direct browser use and easier deployment.

## Documentation

All code is self-documenting using standard documentation formats:

- **PHP**: PHPDoc format with `@var`, `@param`, `@return`, `@uses`, etc.
- **SCSS**: SassDoc format with `@group`, `@type`, `@see`, `@require`, etc.
- **TypeScript**: TSDoc/JSDoc format with type annotations and descriptions

This ensures IDE autocomplete, hover documentation, and the ability to generate comprehensive API documentation.

### Generating Documentation

To generate HTML documentation from the inline comments:

**For PHP (using phpDocumentor):**
```bash
# Install phpDocumentor globally
composer global require phpdocumentor/phpdocumentor

# Generate docs
npm run document:php
```

**For SCSS (using SassDoc):**
```bash
# Install SassDoc
npm install --save-dev sassdoc

# Generate docs
npm run document:sass
```

**For TypeScript (using TypeDoc):**
```bash
# Install TypeDoc
npm install --save-dev typedoc

# Generate docs
npm run document:ts
```

**For all at once:**
```bash
# After installing all as above

# Generate all docs
npm run document
```

The generated documentation will be created in the `_docs/` directory and can be viewed by opening the `index.html` file in each subdirectory.

## Testing Setup

This project includes testing setups for **PHP**, **JavaScript**, and **Python**.

### PHP

- **Test runner:** `phpunit`
- **Test location:** `___structure/tests/`
- **Dummy test:** `DummyTest.php`

```php
<?php
use PHPUnit\Framework\TestCase;

class DummyTest extends TestCase
{
    public function testAlwaysPasses(): void
    {
        $this->assertTrue(true);
    }
}
```

Run PHP tests:

```bash
phpunit --configuration phpunit.xml
```

This vacuous test ensures PHPUnit runs and exits cleanly.

### JavaScript / TypeScript

- **Test runner:** `Vitest`
- **Test location:** `__scripts/`
- **Dummy test:** `dummy.test.ts`

```typescript
import { describe, it, expect } from 'vitest'

describe('dummy test suite', () => {
  it('always passes', () => {
    expect(true).toBe(true)
  })
})
```

Run JS/TS tests:

```bash
npm run test:js
```

Ensure the `package.json` script uses non-watch mode:

```json
"scripts": {
  "test:js": "vitest --run"
}
```

This ensures Vitest runs once and exits immediately, even with no real tests.

### Python

- **Test runner:** `pytest`  
- **Test location:** `process_photos/tests/`  
- **Dummy test:** `test_dummy.py`

```python
import process_photos

def test_dummy():
    """Vacuous test to ensure pytest runs and exits cleanly."""
    assert True
```

Run Python tests:

```bash
source .venv/bin/activate
pytest process_photos/tests
```

This ensures the test runner exits immediately, even without real tests.

### How to Add New Tests

#### PHP

Add new classes extending `PHPUnit\Framework\TestCase` in `__structure/tests/`. Each test method should start with `test`. Example:

```php
class MyFeatureTest extends TestCase
{
    public function testSomething(): void
    {
        $this->assertEquals(42, my_function());
    }
}
```

#### JavaScript/TypeScript

Add new `.test.ts` or `.test.js` files in `__scripts/`. Use `describe` and `it` blocks:

```typescript
import { describe, it, expect } from 'vitest'

describe('my feature', () => {
  it('should do something', () => {
    expect(myFunction()).toBe(42)
  })
})
```

#### Python

Add new `.py` files in `process_photos/tests/`. Each file should contain functions starting with `test_`. Example:

```python
def test_my_function():
    result = my_function()
    assert result == expected_value
```


## npm Scripts Reference

```bash
npm run dev:sass-watch        # Watch and compile SCSS only
npm run dev:ts-watch          # Watch and compile TypeScript only
npm run dev:php-server        # Start PHP development server only
npm run dev:dev               # Start all development watchers and open browser
npm run test:php              # Run PHP tests with PHPUnit
npm run test:js               # Run TypeScript tests with vitest
npm run test:py               # Run Python tests with pytest
npm run test                  # Run all tests
npm run document:php          # Generate PHP documentation
npm run document:sass         # Gemerate SASS documentation
npm run document:ts           # Generate TypeScript documentation
npm run document              # Generate all documentation
npm run deploy:stage:code     # Deploy code to staging server via git
npm run deploy:stage:photos   # Deploy photos to staging server via rsync
npm run deploy:stage          # Deploy all to staging server via prior scripts
npm run deploy:prod:health    # Check health of production deployment via curl and grep
npm run deploy:prod:snapshot  # Create snapshot of production deployment vis ssh rsync
npm run deploy:prod:rollback  # Restore production deployment to latest snapshot via ssh rsync 
npm run deploy:prod:clean     # Overwrite production deployment with staging via ssh rsync
npm run deploy:prod:update    # Update production deployment from staging via ssh rsync
npm run deploy:prod:legacy    # Safely repopulate production deployment from legacy archive via ssh rsync
npm run deploy:prod           # Run snapshot, update, and legacy between health checks, rollback if fail
```

## Contact

- **Email**: [forrest@geekofalltrades.org](mailto:forrest@geekofalltrades.org)
- **Website**: [geekofalltrades.org](https://geekofalltrades.org)
- **GitHub**: [github.com/Pfhorrest/geekofalltrades.org](https://github.com/Pfhorrest/geekofalltrades.org)

---

*A testament to the principle that modern web development doesn't require abandoning the fundamentals that made the web accessible and universal in the first place.*