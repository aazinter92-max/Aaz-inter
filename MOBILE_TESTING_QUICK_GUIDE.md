# Mobile Testing Quick Reference Guide

## 🧪 Quick Test Checklist

### Homepage (/)

- [ ] Hero section height appropriate on phone (not too tall)
- [ ] Logo size correct: 36px mobile, 48px desktop
- [ ] Search bar full-width on mobile
- [ ] Buttons stack vertically and are full-width on mobile
- [ ] All buttons minimum 44px height
- [ ] Featured boxes display 1 per row on mobile
- [ ] Product cards show 1 per row on mobile
- [ ] No horizontal scrolling at any viewport width

### Header/Navigation

- [ ] Hamburger menu appears on mobile (<768px)
- [ ] Hamburger menu slides in from right smoothly
- [ ] Cart icon stays visible on mobile
- [ ] User/Login button visible on mobile
- [ ] All touch targets minimum 44px
- [ ] Header is sticky on scroll
- [ ] Dropdown menus work on desktop
- [ ] Mobile menu closes when clicking outside

### Products Page (/products)

- [ ] Filter sidebar becomes drawer on mobile
- [ ] Filter button full-width on mobile
- [ ] Products display 1 per column on mobile
- [ ] Product cards have uniform heights
- [ ] Images don't overflow cards
- [ ] Buttons full-width within cards on mobile
- [ ] Sort dropdown works on mobile

### Product Detail (/products/:id)

- [ ] Image appears on top on mobile (max 350px)
- [ ] Product name readable (not too small)
- [ ] Price prominent and clear
- [ ] Add to Cart button full-width on mobile (44px)
- [ ] Specs display vertically on mobile (not squished)
- [ ] Tabs scroll horizontally if needed on mobile
- [ ] Quantity controls full-width on mobile
- [ ] No text overflow or cutting

### Cart (/cart)

- [ ] Summary appears at top on mobile
- [ ] Cart items stack vertically
- [ ] Product images appropriate size (100px mobile)
- [ ] Quantity controls centered and usable
- [ ] Remove button clearly visible
- [ ] Checkout button full-width and prominent
- [ ] Prices displayed clearly
- [ ] Total price stands out

### Footer

- [ ] Sections stack vertically on mobile
- [ ] All links have adequate tap targets
- [ ] WhatsApp button full-width on mobile (44px)
- [ ] Text readable (not too small)
- [ ] Copyright centered on mobile
- [ ] No overlapping elements

## 📱 Device-Specific Tests

### iPhone SE (375px width) - Smallest Common Phone

```
Test URL: Use Chrome DevTools Device Mode
- Set to iPhone SE
- Test all pages listed above
- Check that nothing breaks
- Ensure all buttons reachable with thumb
```

### iPhone 12/13/14 (390px width) - Most Common

```
Test URL: Use Chrome DevTools Device Mode
- Set to iPhone 12 Pro
- Test all interactions
- Verify spacing looks good
- Check button sizes feel natural
```

### iPad (768px width) - Tablet Breakpoint

```
Test URL: Use Chrome DevTools Device Mode
- Set to iPad
- Verify 2-column layouts work
- Check navigation (should show desktop nav)
- Ensure spacing appropriate for tablet
```

### Desktop (1440px width) - Standard Desktop

```
Test URL: Use normal browser window
- Maximize window
- Check multi-column grids (4 products per row)
- Verify desktop navigation works
- Ensure optimal use of space
```

## 🎯 Critical Interactions to Test

### 1. Navigation Flow

```
Home → Products → Product Detail → Cart → Checkout
- Click through this flow on mobile
- Ensure smooth transitions
- Check that back button works
- Verify no layout breaks
```

### 2. Add to Cart Flow

```
1. Browse products
2. Click on a product
3. Add to cart
4. View cart
5. Proceed to checkout
- Test on mobile AND desktop
- Ensure buttons always accessible
- Check quantity controls work
```

### 3. Menu Interactions

```
1. Open hamburger menu
2. Navigate to different pages
3. Check dropdowns work
4. Close menu
5. Repeat on different pages
```

### 4. Filter/Search

```
1. Go to Products page
2. Open filter sidebar (mobile drawer)
3. Select category
4. Apply filters
5. Check results update
```

## 🔍 Visual Checks

### Typography

- [ ] All text readable at mobile sizes
- [ ] No text cut off or ellipsed unexpectedly
- [ ] Heading hierarchy clear
- [ ] Line heights appropriate

### Spacing

- [ ] Consistent padding throughout
- [ ] No cramped sections
- [ ] Adequate white space
- [ ] Elements don't touch edges

### Buttons

- [ ] All same height within context
- [ ] Clear visual hierarchy (primary vs secondary)
- [ ] Hover states work on desktop
- [ ] Active states clear on mobile
- [ ] Loading states visible if applicable

### Images

- [ ] Load properly
- [ ] Correct aspect ratios
- [ ] Don't overflow containers
- [ ] Lazy loading works
- [ ] Fallbacks show if image fails

### Colors

- [ ] Medical blue/teal theme consistent
- [ ] Status colors clear (success/error/warning)
- [ ] Sufficient contrast for readability
- [ ] Links clearly identifiable

## 🐛 Common Issues to Watch For

### Mobile Issues

- ❌ Horizontal scrolling (NEVER acceptable)
- ❌ Tiny buttons (<44px)
- ❌ Overlapping text
- ❌ Images overflowing cards
- ❌ Font too small to read
- ❌ Hit targets too close together
- ❌ Modals/dropdowns off-screen

### Desktop Issues

- ❌ Too much white space
- ❌ Single column when multi-column expected
- ❌ Buttons too wide
- ❌ Navigation doesn't show properly
- ❌ Hero section too short

### Cross-Device Issues

- ❌ Inconsistent spacing scales
- ❌ Different button styles
- ❌ Typography jumps between breakpoints
- ❌ Color inconsistencies

## ✅ Quick Pass/Fail Criteria

### PASS if:

- ✅ No horizontal scroll on any device
- ✅ All buttons ≥44px height on mobile
- ✅ All text readable without zooming
- ✅ Navigation works on all devices
- ✅ Images load and scale properly
- ✅ Checkout flow completes smoothly
- ✅ Looks professional and trustworthy

### FAIL if:

- ❌ Any horizontal scrolling
- ❌ Buttons too small to tap
- ❌ Text unreadable
- ❌ Broken layouts
- ❌ Images overflowing or broken
- ❌ Cannot complete purchase
- ❌ Looks unprofessional

## 🚀 Browser Testing Matrix

| Browser | Mobile      | Tablet      | Desktop |
| ------- | ----------- | ----------- | ------- |
| Chrome  | ✅ Test     | ✅ Test     | ✅ Test |
| Safari  | ✅ Test     | ✅ Test     | ✅ Test |
| Firefox | ⚠️ Optional | ⚠️ Optional | ✅ Test |
| Edge    | ⚠️ Optional | ⚠️ Optional | ✅ Test |

## 📝 How to Test

### Using Chrome DevTools:

1. Press `F12` to open DevTools
2. Click device toolbar icon (or `Ctrl+Shift+M`)
3. Select device from dropdown
4. Refresh page to test
5. Rotate device to test landscape

### Using Real Devices:

1. Get local IP: `ipconfig` (look for IPv4)
2. Start dev server: `npm run dev`
3. On phone, browse to: `http://YOUR_IP:5173`
4. Test all interactions

### Using Browser Resize:

1. Open website in browser
2. Slowly resize window from wide to narrow
3. Watch for layout breaks
4. Note any sudden jumps or shifts

## 📊 Testing Priority

### Priority 1 (Must Test):

1. Homepage mobile layout
2. Product listing mobile
3. Product detail mobile
4. Cart mobile layout
5. Navigation mobile menu

### Priority 2 (Should Test):

1. Footer mobile
2. Checkout mobile
3. User dashboard mobile
4. Tablet layouts (768px)
5. Desktop layouts

### Priority 3 (Nice to Test):

1. Edge cases (very wide screens)
2. Landscape mobile
3. Different browsers
4. Slow network simulation
5. Touch gestures

## 🎉 Success Indicators

After testing, the website should feel:

- ✅ **Trustworthy** - Professional medical aesthetic
- ✅ **Accessible** - Easy to use on phone
- ✅ **Efficient** - Quick to browse and buy
- ✅ **Polished** - Attention to detail
- ✅ **Consistent** - Same experience across devices
- ✅ **Responsive** - Adapts smoothly to any screen

---

**Quick Start:** Test Homepage → Products → Product Detail → Cart on mobile (375px) first!
