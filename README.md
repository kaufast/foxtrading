# FoxTrading - Architecture & Construction Website

A modern, responsive website template for architecture and construction businesses, featuring clean design and smooth animations.

## Overview

FoxTrading (originally Terravia template) is a professional website template designed for architecture, construction, and design firms. It showcases a minimalist aesthetic with a focus on sustainability and eco-friendly construction practices.

## Features

- **Responsive Design**: Fully responsive layout that works seamlessly across all devices
- **Modern UI/UX**: Clean, minimalist design with smooth animations using GSAP and ScrollTrigger
- **Interactive Elements**: 
  - Image sliders for hero section and project showcases
  - Tabbed content for services
  - Accordion-style FAQ section
  - Modal popup for contact forms
- **Navigation**: Smooth scroll navigation with sticky header
- **Performance Optimized**: Lazy loading images and optimized assets

## Technologies Used

- HTML5
- CSS3 (Webflow styles)
- JavaScript/jQuery
- GSAP (GreenSock Animation Platform)
- ScrollTrigger for scroll-based animations

## Structure

```
foxtrading/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   ├── google-fonts.css       # Google Fonts stylesheet
│   │   └── terravia.webflow.css   # Main styles
│   └── js/
│       ├── jquery-3.5.1.min.js    # jQuery library
│       ├── gsap.min.js            # GSAP animation library
│       ├── ScrollTrigger.min.js   # GSAP ScrollTrigger plugin
│       └── webflow[1-3].js        # Webflow interaction scripts
└── README.md
```

## Sections

1. **Hero Section**: Eye-catching slider with call-to-action
2. **Brand Partners**: Showcasing tools and render software
3. **About Us**: Company introduction with statistics
4. **Services**: Tabbed interface highlighting eco-friendly solutions
5. **Projects**: Portfolio showcase with detailed project cards
6. **Testimonials**: Client feedback carousel
7. **Team**: Core team member profiles
8. **FAQ**: Frequently asked questions with accordion functionality

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/kaufast/foxtrading.git
   ```

2. Open `index.html` in your browser or serve it using a local web server

## Customization

- **Content**: Edit the HTML content in `index.html` to match your business information
- **Styles**: Modify the CSS files in `assets/css/` for custom styling
- **Images**: Replace image URLs with your own assets
- **Animations**: Adjust GSAP animations in the JavaScript files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is based on a Webflow template. Please ensure you have the appropriate license for commercial use.

## Contact

For questions or support, please open an issue on GitHub.