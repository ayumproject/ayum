# Modern Website Template

A modern website template built with Next.js and Tailwind CSS.

## Technology Stack

- **Frontend Framework**: Next.js
- **Style Scheme**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Type System**: TypeScript
- **Code Standards**: ESLint + Prettier

## Features

- 📱 Responsive design, perfectly adapted to various devices
- 🎨 Modern UI design, based on the shadcn/ui component library
- ✨ Dynamic components (Client Components) and static rendering (Server Components) via Next.js App Router
- 🔍 SEO friendly (using Next.js metadata API)
- 💻 TypeScript support, providing complete type definitions

## Page List

- 🏠 Homepage (`/`)
- 📄 About Us (`/about`)
- 💼 Projects (`/projects`)
- 🤝 Partners (`/partners`)
- 📞 Contact Us (`/contact`)

## Quick Start

1.  **Clone the project**

    ```bash
    git clone YOUR_PROJECT_ADDRESS_HERE
    cd YOUR_PROJECT_DIRECTORY
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start the development server**

    ```bash
    npm run dev
    ```

4.  **Build the production version**

    ```bash
    npm run build
    ```

## Project Structure

```
├── app/             ## App Router pages and layouts
│   ├── api/         ## API routes
│   ├── [pages]/     ## Individual pages (e.g., about, projects)
│   └── layout.tsx   ## Root layout
├── components/      ## Reusable components
│   ├── layout/      ## Layout specific components (Header, Footer)
│   ├── projects/    ## Project related components (ProjectCard)
│   ├── ui/          ## shadcn/ui components
│   ├── scroll-button.tsx ## Scroll button component
│   └── testimonial-slider.tsx ## Testimonial slider component
├── lib/             ## Utility functions and data
│   ├── data.ts      ## Data definitions (projects, partners, testimonials etc.)
│   └── utils.ts     ## Utility functions (cn helper)
├── public/          ## Static assets
├── .eslintrc.js    ## ESLint configuration
├── .prettierrc     ## Prettier configuration
├── next.config.js  ## Next.js configuration
├── package.json     ## Project dependencies and scripts
├── tailwind.config.js ## Tailwind configuration
└── tsconfig.json    ## TypeScript configuration
```

## Configuration File Explanation

Key data and configurations are managed in:

-   `lib/data.ts`: Contains data for projects, partners, and testimonials.
-   `tailwind.config.js`: Customizes Tailwind CSS settings.
-   `next.config.js`: Next.js specific configurations.

## Development Guidelines

### Component Development Standards

1.  Develop components using TypeScript.
2.  Use PascalCase for component naming.
3.  Define and use appropriate Props types.
4.  Follow the project's established style guidelines, prioritizing Tailwind CSS.
5.  Clearly indicate Client Components with `"use client"`.

### Style Development Standards

1.  Primarily use Tailwind CSS utility classes.
2.  Ensure responsiveness using Tailwind's breakpoints.
3.  Maintain consistency in colors, spacing, and typography based on `tailwind.config.js`.

### Page Development Standards

1.  Utilize the root `app/layout.tsx` for consistent page structure.
2.  Implement necessary SEO metadata using Next.js Metadata API.
3.  Ensure responsive design and performance for all pages.

## Deployment Instructions

This project uses Next.js App Router, supporting various rendering strategies. For static export:

1.  Update `next.config.js` to enable static output if not already configured.
2.  Build the project:
    ```bash
    npm run build
    ```
3.  Export the static site:
    ```bash
    npm run export # If export is configured in package.json scripts
    ```
    (Alternatively, the `build` command might directly output static files depending on next.config.js)
4.  The generated static files are typically located in the `out` directory (or `.next/` depending on configuration).
5.  Deploy the output directory to your static hosting service.

## Contribution Guidelines

1.  Fork the project.
2.  Create a feature branch (`git checkout -b feature/your-feature-name`).
3.  Commit your changes (`git commit -m 'feat: Add your feature'`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Create a Pull Request.

## License

[MIT License](https://github.com/github/choosealicense.com/blob/gh-pages/_licenses/mit.txt)

## Deploy
[![Deploy with EdgeOne Pages](https://cdnstatic.tencentcs.com/edgeone/pages/deploy.svg)](https://edgeone.ai/pages/new?template=modern-website-template)
