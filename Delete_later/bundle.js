/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/frontend.js":
/*!****************************!*\
  !*** ./src/js/frontend.js ***!
  \****************************/
/***/ (() => {

eval("/* This file has some interactive frontend components */\n\n// Hamburger menu\nvar menuBtn = document.querySelector(\".menu-btn\");\nvar menu = document.querySelector(\".menu\");\nvar menuNav = document.querySelector(\".menu-nav\");\nvar navItems = document.querySelectorAll(\".nav-item\");\n\n// Set initial state of menu\nvar showMenu = false;\n\n// Change menu state when I click menu button\nmenuBtn.addEventListener(\"click\", toggleMenu);\nfunction toggleMenu() {\n  if (!showMenu) {\n    menuBtn.classList.add(\"close\");\n    menu.classList.add(\"show\");\n    menuNav.classList.add(\"show\");\n    navItems.forEach(function (item) {\n      return item.classList.add(\"show\");\n    });\n\n    // Set menu state\n    showMenu = true;\n  } else {\n    menuBtn.classList.remove(\"close\");\n    menu.classList.remove(\"show\");\n    menuNav.classList.remove(\"show\");\n    navItems.forEach(function (item) {\n      return item.classList.remove(\"show\");\n    });\n\n    // Set menu state\n    showMenu = false;\n  }\n}\n\n//# sourceURL=webpack://finalproject/./src/js/frontend.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/frontend.js"]();
/******/ 	
/******/ })()
;