---
title: Figma Kit
---

## Overview

The laioutr Figma UI Kit is a comprehensive, professional-grade design system fully integrated with the laioutr frontend. It is designed to empower teams to build extensive, high-performance online shops and content-rich websites with unprecedented speed.

Everything you find in these libraries—from basic atoms to complex e-commerce sections—is mirrored 1:1 in laioutr Studio, ensuring a seamless handoff between design and production.

## Getting Started

To ensure a smooth setup and keep your workspace organized, we recommend the following workflow for importing the libraries:

1. **Create a New Project:** In your Figma team, create a new, empty project (e.g., named "Laioutr Design System"). This keeps all four library files in one central location.
2. **Import the .fig Files:** Drag and drop the four provided .fig files into this new project.
3. **Publish the Core Kit First:** Open the Laioutr UI Kit file and click the "Publish" button. This file contains the global variables (tokens) that the other libraries rely on
4. **Publish Specialized Libraries:** Open the SHOP, CMS, and Inpage Navigation files one by one and publish them.

::tip
#default
**Note on Library Connections:** If the specialized libraries do not automatically recognize your newly published Core Kit (e.g., variables appear missing or unlinked), you can manually re-establish the connection using Figma's Swap library function:

- Open the Assets tab (Alt + 2) within the specialized file (e.g., SHOP Components).
- Click the Library icon (the book symbol) and locate the original library reference that needs to be replaced.
- Select "Swap library", choose your newly published Laioutr UI Kit from the dropdown, and click Swap library.
- Figma will automatically reconnect all components and variables based on name matches.
::

5. **Enable for Your Design File:** In your actual design project, open the "Assets" panel, click the library icon, and enable all four laioutr libraries.
6. **Apply Your Theme:** Select a Frame or Page and use the Variable icon in the right sidebar (under "Layer" or "Selection colors") to toggle between the 4 Theme Modes or switch between Mobile/Desktop views.

## Library Structure

To ensure optimal performance and scalability, the UI Kit is divided into four specialized Figma libraries. This modular approach prevents Figma runtime memory errors and allows us to continuously expand the component library without compromising file stability.

## Library Content & Purpose

### Laioutr UI Kit

The core library containing all Design Tokens (Variables) and foundational elements like buttons, checkboxes, inputs, and modals.

### SHOP Components

Everything specifically related to product presentation and online shopping, such as product cards, grids, and filters.

### CMS Components

Content-driven elements such as banners, text-image sections, hero modules, and editorial blocks.Inpage NavigationA dedicated collection of navigation components for linking categories and content with various visual styles.

## Total Control with Figma Variables

The Laioutr UI Kit serves as the "brain" of the system. All design tokens are centralized here as Figma Variables—even those used by the SHOP and CMS libraries. This centralization ensures that a single change to a variable propagates through your entire project.

### What's included in the variables?

Our variable architecture covers every detail of the design system:

- **Typography**: Font families, sizes, and line heights.
- **Layout**: Comprehensive spacing and sizing systems.
- **Styling**: Colors, border radii, and effects (shadows, background blurs).
- **Adaptivity**: Built-in modes for Light & Dark themes, as well as Mobile & Desktop scaling.

### Four Pre-designed Theme Modes

Why settle for one look? We provide four distinct Theme Modes as presets. This allows you to switch between themes with just one click and start with the one that suits your project perfectly.

## Advanced Component Features

### Mobile-First & Responsive by Default

"Mobile First" is our credo. Every component is meticulously designed to function perfectly on small screens first and then scale elegantly across all breakpoints.

Each component is built using the latest Figma features:

- **Properties & States:** Easily toggle between different states (Hover, Focus, Disabled) via the properties panel.
- **Instance Swapping**: Quickly swap icons or nested elements without breaking the layout.
- **Auto Layout**: All components use advanced Auto Layout to ensure they respond naturally to content changes.

## Best Practices & Naming Conventions

To maintain the integrity of the design-to-code pipeline, please keep the following in mind:

- **Important** - Preservation of Naming - The names of existing variables and components in the Figma Kit are directly linked to CSS custom properties and the frontend architecture in laioutr Studio. **Do not rename existing variables or components.** Renaming them will break the automated link between design and code, complicating the developer handoff.
- **Freedom to Expand** - While you should not rename existing elements, you are encouraged to extend the system! You can add as many new variables and custom components as you like to tailor the kit to your specific project needs.
