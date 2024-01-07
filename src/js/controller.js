/**
 * Import necessary modules and views
 */
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import renderFormView from './views/renderFormView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime.js';

/**
 * Asynchronous function to control the recipe view
 */
async function controlRecipe() {
  try {
    // Get the id from the URL
    const id = window.location.hash.slice(1);

    // If there is no id, return
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // Load the recipe
    await model.loadRecipe(id);

    // Render the recipe
    recipeView.render(model.state.recipe);
  } catch (error) {
    // If there is an error, render the error
    recipeView.renderError();
  }
}

/**
 * Asynchronous function to control the search results
 */
async function controlSearchResults() {
  try {
    resultsView.renderSpinner();

    // Get the search query
    const query = searchView.getQuery();
    if (!query) return;
    searchView._clearInput();

    // Load the search results
    await model.loadSearchResults(query);

    // Render the results
    resultsView.render(model.getSearchResultsPage());

    // Render the initial pagination results
    paginationView.render(model.state.search);
  } catch (err) {
    // If there is an error, render the error
    recipeView.renderError();
  }
}

/**
 * Function to control the pagination
 * @param {number} goToPage - The page to go to
 */
function controlPagination(goToPage) {
  // Render the results for the page
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render the pagination
  paginationView.render(model.state.search);
}

/**
 * Function to control the servings
 * @param {number} newServings - The new number of servings
 */
function controlServings(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
}

/**
 * Function to control the bookmarks
 */
function controlBookmarks() {
  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
}

/**
 * Function to control the addition of a bookmark
 */
function controlAddBookmark() {
  // Add or remove the bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update the recipe view
  recipeView.update(model.state.recipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
}

/**
 * Asynchronous function to control the addition of a recipe
 * @param {Object} newRecipe - The new recipe to add
 */
async function controlAddRecipe(newRecipe) {
  try {
    // Show the loading spinner
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // Render the recipe
    recipeView.render(model.state.recipe);

    // Show a success message
    addRecipeView.renderMessage();

    // Render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change the ID in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close the form after a delay
    setTimeout(() => {
      addRecipeView.hideWindow();
      renderFormView.renderForm();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    // If there is an error, render the error
    addRecipeView.renderError(err.message);
  }
}

/**
 * Function to initialize the application
 */
function init() {
  // Add event handlers
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}

// Initialize the application
init();
