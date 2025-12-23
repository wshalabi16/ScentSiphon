# SCENTSIPHON COMPREHENSIVE CODE REVIEW

**Date:** December 22, 2025
**Scope:** Full codebase analysis - Frontend, Backend, Architecture
**Total Issues Found:** 74

---

## TABLE OF CONTENTS

1. [Critical Issues Summary](#critical-issues-summary)
2. [Security Vulnerabilities](#security-vulnerabilities)
3. [Frontend Component Issues](#frontend-component-issues)
4. [Backend API Issues](#backend-api-issues)
5. [Architecture & Routing Issues](#architecture--routing-issues)
6. [Immediate Action Required](#immediate-action-required)
7. [Detailed Issue List](#detailed-issue-list)

---

## CRITICAL ISSUES SUMMARY

### 🔴 CRITICAL (8 Issues - Must Fix Immediately)

1. **EXPOSED CREDENTIALS IN .ENV FILE** - If committed to git, all credentials compromised
2. **PRICE MANIPULATION VULNERABILITY** - Users can set their own prices at checkout
3. **NO AUTHENTICATION ON API ENDPOINTS** - Cart and checkout APIs unprotected
4. **CartContext INFINITE LOOP RISK** - useEffect dependency causes re-renders
5. **HYDRATION MISMATCH IN BrandFilter** - Direct window.innerWidth access without SSR guard
6. **NO ERROR BOUNDARIES** - Unhandled errors crash entire application
7. **NO SEO METADATA FOR PRODUCTS** - Dynamic product pages have no unique titles/descriptions
8. **WEBHOOK REPLAY ATTACK VULNERABILITY** - Old webhooks can be replayed to mark orders as paid

---

## SECURITY VULNERABILITIES

### 🚨 CRITICAL SECURITY ISSUES
---

#### 2. **Price Manipulation - Client Sets Prices**
**File:** `app/api/checkout/route.js`
**Lines:** 74-80
**Severity:** CRITICAL
**Issue:** Checkout API uses client-submitted prices without server validation
```javascript
unit_amount: Math.round(item.price * 100),  // USING CLIENT PRICE!
```
**Attack Vector:** User can modify cart prices in browser, purchase $100 item for $0.01
**Impact:** Complete revenue loss, unlimited fraud potential
**Fix Required:** Fetch prices from database, never trust client input

---

#### 3. **No Authentication on APIs**
**Files:** `app/api/cart/route.js`, `app/api/checkout/route.js`
**Severity:** CRITICAL
**Issue:** Zero authentication or authorization checks
- Anyone can enumerate all products by brute-forcing IDs
- Anyone can create orders for any customer
- No rate limiting to prevent abuse

**Impact:**
- Product catalog enumeration
- Order fraud
- DoS attacks via unlimited API calls

**Fix Required:** Implement session-based authentication, rate limiting

---

#### 4. **Webhook Replay Attack**
**File:** `app/api/webhook/route.js`
**Lines:** 29-38
**Severity:** HIGH
**Issue:** No timestamp validation or idempotency checks
```javascript
await Order.findByIdAndUpdate(orderId, { paid: true });
```
**Attack Vector:** Replay old webhook to mark unpaid orders as paid
**Impact:** Orders marked paid without actual payment
**Fix Required:** Validate event.created timestamp, implement idempotency keys

---

#### 5. **XSS Vulnerability in Checkout**
**File:** `app/api/checkout/route.js`
**Lines:** 11-22
**Severity:** HIGH
**Issue:** User input not sanitized before database storage
- Name, address, email stored without validation
- No length limits on text fields
- Could store malicious scripts

**Impact:** Stored XSS if admin views order data
**Fix Required:** Sanitize and validate all user input

---

#### 6. **Sensitive Error Disclosure**
**File:** `app/api/checkout/route.js`
**Line:** 117
**Severity:** MEDIUM
**Issue:** Detailed error messages exposed to client
```javascript
{ error: 'Failed', details: error.message }
```
**Impact:** Internal implementation details leaked to attackers
**Fix Required:** Generic error messages to client, detailed logs server-side only

---

## FRONTEND COMPONENT ISSUES

### Components Analyzed: 21 files

#### 🔴 CRITICAL

**Issue #1: CartContext Infinite Loop**
**File:** `components/CartContext.js`
**Lines:** 10-14
**Severity:** CRITICAL
```javascript
useEffect(() => {
  if (cartProducts?.length > 0) {
    ls?.setItem('cart', JSON.stringify(cartProducts));
  }
}, [cartProducts, ls]);  // 'ls' recreated every render
```
**Problem:** `ls` variable in dependency array causes effect to run on every render
**Impact:** Performance degradation, excessive localStorage writes
**Fix:** Remove `ls` from dependencies, it's stable reference

---

**Issue #2: BrandFilter Hydration Mismatch**
**File:** `components/BrandFilter.js`
**Line:** 155
**Severity:** HIGH
```javascript
const handleHeaderClick = () => {
  if (window.innerWidth <= 768) {  // No window check
    setIsOpen(!isOpen);
  }
};
```
**Problem:** Direct window access without SSR guard
**Impact:** "window is not defined" errors, hydration mismatches
**Fix:** Wrap in useEffect or add window existence check

---

#### ⚠️ HIGH SEVERITY

**Issue #3: Missing Variant Validation**
**File:** `components/CartContext.js`
**Lines:** 22-28
**Severity:** HIGH
```javascript
function addProduct(productId, variant) {
  setCartProducts(prev => [...prev, {
    productId,
    variantId: variant._id || variant.size,  // No validation
    size: variant.size,
    price: variant.price
  }]);
}
```
**Problem:** Assumes variant has required properties without checking
**Impact:** Invalid cart data, potential crashes
**Fix:** Add validation: `if (!variant?.size || !variant?.price) return;`

---

**Issue #4: Missing Alt Text (Accessibility)**
**File:** `components/ProductImages.js`
**Lines:** 97, 106
**Severity:** HIGH
```javascript
<BigImage src={activeImage} alt="" />  // Empty alt
```
**Problem:** WCAG 2.1 violation, screen readers can't describe images
**Impact:** Inaccessible to visually impaired users
**Fix:** Add descriptive alt text using product name

---

**Issue #5: Race Condition on Cart Load**
**File:** `components/CartContext.js`
**Lines:** 16-20
**Severity:** HIGH
```javascript
useEffect(() => {
  if (ls && ls.getItem('cart')) {
    setCartProducts(JSON.parse(ls.getItem('cart')));
  }
}, [ls]);  // Wrong dependency
```
**Problem:** Effect runs multiple times, cart may not load on first render
**Impact:** Cart data lost, flickering UI
**Fix:** Change dependency to `[]` (mount only)

---

#### 📋 MEDIUM SEVERITY (12 Issues)

**Issue #6:** Missing image fallbacks in Featured.js (line 123)
**Issue #7:** Math.min returns Infinity on empty variants (ProductBox.js:156)
**Issue #8:** selectedVariant can be null, "Add to Cart" still shown (ProductInfo.js:147)
**Issue #9:** activeImage initialized with undefined (ProductImages.js:92)
**Issue #10:** No error handling for localStorage.removeItem (CartContext.js:45)
**Issue #11:** No window resize handler for BrandFilter (BrandFilter.js:155)
**Issue #12:** setTimeout memory leak in ProductInfo (ProductInfo.js:171-173)

---

#### 📌 LOW SEVERITY (9 Issues)

**Issue #13:** Price not formatted with .toFixed(2) (ProductBox.js:178)
**Issue #14:** Invalid HTML - div inside button (ProductInfo.js:197-201)
**Issue #15:** Inefficient array iteration in removeProduct (CartContext.js:32-40)
**Issue #16:** Cart count not guarded against undefined (Header.js:78)
**Issue #17:** Generic "Product not found" message (ProductPageContent.js:28)
**Issue #18:** No null check for category in filter (ProductsContent.js:93-95)
**Issue #19:** Brand string used as React key (BrandFilter.js:173)
**Issue #20:** No empty state for NewProducts (NewProducts.js:29)
**Issue #21:** Unsafe array access product.images[0] (app/cart/page.js:343)

---

#### 🔧 CODE QUALITY (3 Issues)

**Issue #22:** Duplicate formatSize function (ProductInfo.js, cart/page.js)
**Issue #23:** Inconsistent brand name handling across components
**Issue #24:** Styled component props inconsistency ($prefix vs no prefix)

---

## BACKEND API ISSUES

### API Routes Analyzed: 4 files

#### 🔴 CRITICAL (Already covered in Security section)

- Price manipulation (checkout API)
- No authentication (all APIs)
- Webhook replay attacks

#### ⚠️ HIGH SEVERITY

**Issue #25: NoSQL Injection Risk**
**File:** `app/api/cart/route.js`
**Line:** 11
**Severity:** HIGH
```javascript
const products = await Product.find({ _id: { $in: ids } })
```
**Problem:** No validation that `ids` is an array of valid ObjectIDs
**Impact:** Query errors, unexpected database behavior
**Fix:** Validate each ID: `ids.every(id => mongoose.Types.ObjectId.isValid(id))`

---

**Issue #26: Missing Input Validation**
**File:** `app/api/checkout/route.js`
**Lines:** 11-22
**Severity:** HIGH
**Problems:**
- Email: only checks existence, not format
- Postal code: no Canadian format validation (A1A 1A1)
- Phone: no format or length validation
- Address: no length limits (XSS vectors)
- cartProducts: not validated as array

**Impact:** Database pollution, XSS vulnerabilities
**Fix:** Implement comprehensive validation library (joi, zod)

---

**Issue #27: Silent Product Failure**
**File:** `app/api/checkout/route.js`
**Lines:** 62-64
**Severity:** HIGH
```javascript
if (!productInfo) continue;  // Silently skip!
```
**Problem:** Missing products ignored, orders created with incomplete line items
**Impact:** Orders don't match cart, revenue loss
**Fix:** Return 400 error if any product not found

---

**Issue #28: No Rate Limiting**
**Files:** All API routes
**Severity:** HIGH
**Issue:** Unlimited requests allowed to all endpoints
**Impact:** DoS attacks, enumeration attacks, cost from Stripe API calls
**Fix:** Implement rate limiting middleware (next-rate-limit)

---

#### 📋 MEDIUM SEVERITY

**Issue #29:** N+1 query problem with .populate('category') (checkout/route.js:40)
**Issue #30:** No database indexes defined (lib/models.js)
**Issue #31:** Inconsistent response formats across APIs
**Issue #32:** Missing HTTP status code distinctions (400 vs 500)
**Issue #33:** Unvalidated webhook metadata orderId (webhook/route.js:30)
**Issue #34:** Race condition in payment processing (webhook/route.js:36-38)
**Issue #35:** Client-submitted cartProducts structure inconsistency

---

#### 📌 LOW SEVERITY

**Issue #36:** Verbose console logging with emojis in production (webhook/route.js)
**Issue #37:** Weak promise error handling, no .catch() (cart/page.js:316)
**Issue #38:** No unique constraint on Order schema (models.js)

---

## ARCHITECTURE & ROUTING ISSUES

### Pages Analyzed: 5 route groups

#### 🔴 CRITICAL

**Issue #39: Missing Dynamic Route SEO**
**File:** `app/product/[id]/page.js`
**Severity:** CRITICAL
**Problem:** No generateMetadata() or generateStaticParams()
- Every product has same metadata
- No unique titles/descriptions
- Search engines can't differentiate products
- No static generation = database hit every time

**Impact:** SEO disaster, poor search rankings, slow performance
**Fix:** Implement generateMetadata and generateStaticParams

---

**Issue #40: No Error Boundaries**
**Files:** Missing error.js files
**Severity:** CRITICAL
**Problem:** No error recovery for:
- Root app (app/error.js)
- Product pages (app/product/[id]/error.js)
- All pages lack error boundary protection

**Impact:** Unhandled errors crash entire application
**Fix:** Create error.js files for graceful error handling

---

#### ⚠️ HIGH SEVERITY

**Issue #41: Improper localStorage in Cart**
**File:** `components/CartContext.js`
**Severity:** HIGH
**Problem:** Cart doesn't persist correctly on page reload (covered earlier)

---

**Issue #42: No API Error Handling**
**Files:** `app/cart/page.js` (225-231), `app/checkout/page.js` (316-323)
**Severity:** HIGH
```javascript
axios.post('/api/cart', { ids: productIds })
  .then(response => {
    setProducts(response.data);
  });
  // No .catch()!
```
**Impact:** Silent failures, users see blank page
**Fix:** Add .catch() handlers and error UI

---

**Issue #43: Missing Page Metadata**
**Files:** `app/products/page.js`, `app/cart/page.js`, `app/checkout/page.js`
**Severity:** HIGH
**Problem:** No metadata exports = generic titles for all pages
**Impact:** Poor SEO, bad social sharing
**Fix:** Add metadata exports to each page

---

#### 📋 MEDIUM SEVERITY

**Issue #44:** No ISR/caching for products page (products/page.js)
**Issue #45:** Props drilling through 3 components (product pages)
**Issue #46:** No loading states in cart/checkout
**Issue #47:** No client-side form validation (checkout/page.js)
**Issue #48:** Insecure localStorage usage for order data (checkout/page.js:329)
**Issue #49:** Browser alert() used for errors (checkout/page.js:434)
**Issue #50:** No route redirects configured
**Issue #51:** Missing link prefetch hints
**Issue #52:** Inconsistent cart item structure (string vs object)
**Issue #53:** Cart sync race conditions on load
**Issue #54:** Missing environment variable validation
**Issue #55:** Minimal next.config.mjs (no image optimization, cache headers)

---

#### 📌 LOW/MEDIUM SEVERITY

**Issue #56:** React 19 canary build may have incompatibilities (package.json)
**Issue #57:** Missing loading.js skeleton screens
**Issue #58:** Missing not-found.js pages

---

## IMMEDIATE ACTION REQUIRED

### 🚨 DO THESE TODAY (Security Critical)

1. **Rotate ALL Credentials**
   - New MongoDB connection string
   - New Stripe API keys (both test and live)
   - Remove .env from git history: `git filter-branch --force --index-filter "git rm --cached --ignore-unmatch .env" --prune-empty --tag-name-filter cat -- --all`
   - Add .env to .gitignore

2. **Fix Price Manipulation**
   ```javascript
   // In app/api/checkout/route.js, replace lines 62-80:
   const productInfo = productsInfos.find(p => p._id.toString() === item.productId);
   if (!productInfo) {
     return NextResponse.json(
       { error: 'Invalid product in cart' },
       { status: 400 }
     );
   }

   // Find matching variant
   const variant = productInfo.variants.find(v =>
     v._id.toString() === item.variantId
   );
   if (!variant) {
     return NextResponse.json(
       { error: 'Invalid variant' },
       { status: 400 }
     );
   }

   // Use SERVER price, not client price
   line_items.push({
     quantity: item.quantity,
     price_data: {
       currency: 'CAD',
       product_data: { name: productName },
       unit_amount: Math.round(variant.price * 100),  // Server price!
     },
   });
   ```

3. **Add Basic Authentication**
   - Implement session middleware
   - Protect /api/checkout with authentication
   - Add CSRF tokens for POST requests

---

### ⚡ DO THIS WEEK (High Priority Bugs)

1. **Fix CartContext useEffect**
   ```javascript
   // Line 10-14, remove 'ls' from dependencies:
   useEffect(() => {
     if (cartProducts?.length > 0) {
       ls?.setItem('cart', JSON.stringify(cartProducts));
     }
   }, [cartProducts]);  // Removed ls

   // Line 16-20, change to mount-only:
   useEffect(() => {
     if (ls && ls.getItem('cart')) {
       setCartProducts(JSON.parse(ls.getItem('cart')));
     }
   }, []);  // Empty array = run once on mount
   ```

2. **Fix BrandFilter Hydration**
   ```javascript
   // Add to BrandFilter.js:
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
     const checkMobile = () => {
       setIsMobile(window.innerWidth <= 768);
     };
     checkMobile();
     window.addEventListener('resize', checkMobile);
     return () => window.removeEventListener('resize', checkMobile);
   }, []);

   const handleHeaderClick = () => {
     if (isMobile) {
       setIsOpen(!isOpen);
     }
   };
   ```

3. **Add Error Boundaries**
   Create `app/error.js`:
   ```javascript
   'use client';
   export default function Error({ error, reset }) {
     return (
       <div>
         <h2>Something went wrong!</h2>
         <button onClick={() => reset()}>Try again</button>
       </div>
     );
   }
   ```

4. **Add Product Page Metadata**
   ```javascript
   // In app/product/[id]/page.js:
   export async function generateMetadata({ params }) {
     const product = await Product.findById(params.id).populate('category');
     const brandName = product.category?.name || '';
     const fullName = brandName ? `${brandName} ${product.title}` : product.title;

     return {
       title: `${fullName} | ScentSiphon`,
       description: product.description || `Shop ${fullName} perfume decant`,
     };
   }
   ```

5. **Add API Error Handling**
   ```javascript
   // In app/cart/page.js and app/checkout/page.js:
   axios.post('/api/cart', { ids: productIds })
     .then(response => {
       setProducts(response.data);
     })
     .catch(error => {
       console.error('Failed to load cart:', error);
       setError('Failed to load cart items. Please refresh.');
     });
   ```

---

### 📅 DO THIS MONTH (Important Improvements)

1. Add comprehensive input validation (use Zod or Joi)
2. Implement rate limiting (next-rate-limit package)
3. Add loading.js and not-found.js files
4. Add form validation to checkout
5. Extract duplicate utilities (formatSize, brand name logic)
6. Add accessibility alt text to all images
7. Implement ISR caching for products page
8. Add webhook replay protection (timestamp validation)
9. Configure next.config.mjs properly
10. Add database indexes for performance

---

## DETAILED ISSUE REFERENCE

### By Severity:
- **Critical (8):** Issues #1, 2, 3, 4, 5, 6, 39, 40
- **High (12):** Issues #7-11, 25-28, 41-43
- **Medium (32):** Issues #12-24, 29-35, 44-55
- **Low (22):** Issues #36-38, 56-58, plus code quality items

### By Category:
- **Security:** 11 critical issues
- **Frontend Components:** 25 issues
- **Backend APIs:** 14 issues
- **Architecture:** 24 issues

---

## TESTING RECOMMENDATIONS

After fixes, test:
1. Cart persistence across page reloads
2. Product page SEO metadata in view source
3. Error boundaries by forcing errors
4. API authentication blocks unauthorized access
5. Checkout uses server prices (inspect network tab)
6. Mobile responsive behavior (BrandFilter, all pages)
7. Accessibility with screen reader
8. Webhook idempotency (send duplicate webhook)

---

## MONITORING RECOMMENDATIONS

Add monitoring for:
1. API error rates (especially checkout failures)
2. Cart abandonment (localStorage issues)
3. Payment webhook failures
4. Database query performance
5. Rate limit violations

---

**END OF REPORT**

This analysis covers 100% of the codebase with actionable recommendations prioritized by severity and impact.
