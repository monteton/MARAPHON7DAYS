
# Blueprint: "7 Days to Summer" Marathon App

## Overview

This document outlines the development of a web application for a 7-day health and nutrition marathon. The application is designed with a modern, mobile-first, multi-page flow, guiding the user from a dedicated landing page to a central menu and then into distinct, modal-based content pages for each day.

## Project Outline & Features

### Core Structure
*   **Framework**: Framework-less modern web project (HTML, CSS, JavaScript).
*   **Entry Point**: `index.html`
*   **Styling**: `style.css`
*   **Logic**: `main.js`

### Application Flow & Architecture

The application is structured as a single-page application that simulates a multi-page experience using JavaScript to show and hide different full-screen sections.

1.  **Landing Page (`#landing-page`)**:
    *   **Purpose**: The initial entry point for the user.
    *   **Design**: A full-screen view (100vh) featuring a single, vertically oriented (9:16) background image, the marathon title, and a prominent "Start" button.
    *   **Functionality**: Clicking "Start" transitions the user to the Main Menu.

2.  **Main Menu (`#main-page`)**:
    *   **Purpose**: The central navigation hub of the application.
    *   **Design**: Contains the primary header, the day-by-day marathon navigation, the supplementary materials section, and a fixed bottom navigation bar.
    *   **Functionality**: Buttons in this section do not show content in-place but trigger the Content Modal.

3.  **Content Modal (`#content-modal`)**:
    *   **Purpose**: A full-screen overlay to display the content for any selected day or supplementary item.
    *   **Design**: A modal window that covers the Main Menu. It has its own internal scrolling and a distinct, always-visible "Close" button.
    *   **Functionality**: The content (text, videos, PDF links) is dynamically loaded into this modal. The close button hides the modal and returns the user to the Main Menu.

### Implemented Design & Style
*   **Color Palette ("Grape" Theme)**: The design uses a calming, grape-inspired palette for backgrounds, text, and accents.
*   **Layout**: A responsive, mobile-first design that provides a native-app-like experience.
*   **Bottom Navigation**: A fixed bar at the bottom of the screen provides persistent navigation with "Home" and "Chat" icons.

### Implemented Features
*   **Three-Part App Structure**: Clear and distinct Landing, Main Menu, and Content Modal views.
*   **Modal-Based Content**: All daily and supplementary content is displayed in a full-screen, closable modal window.
*   **Optimized for Vertical Video**: The video player is styled for a 9:16 aspect ratio.
*   **Local PDF Integration**: All PDF links point to local files in the project's root directory.

## Current Plan

**Objective**: Rearchitect the entire application to a new, three-part structure with a landing page, a main menu, and modal-based content windows. Add a fixed bottom navigation bar.

**Steps**:

1.  **Update `blueprint.md`**: Create a new blueprint reflecting the new application architecture.
2.  **Restructure `index.html`**:
    *   Create three main containers: `<div id="landing-page">`, `<main id="main-page" class="hidden">`, and `<div id="content-modal" class="hidden">`.
    *   Add a `<nav id="bottom-nav">` with "Home" and "Chat" buttons inside the main page.
3.  **Overhaul `style.css`**:
    *   Add styles for the full-screen landing page, the main page layout, the fixed bottom navigation, and the full-screen content modal with its close button.
4.  **Refactor `main.js`**:
    *   Remove the old Web Component classes (`MarathonDay`, `SupplementaryMaterial`).
    *   Create a "Start" button event listener to hide the landing page and show the main page.
    *   Modify the day and supplementary button listeners to dynamically build HTML content and inject it into the content modal before showing it.
    *   Add a listener for the modal's "Close" button to hide the modal.
    *   Add a listener for the "Home" button in the bottom navigation to also close the modal.
