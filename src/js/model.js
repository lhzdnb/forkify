import { AJAX } from './helper.js';
import { API_URL, KEY, RES_PER_PAGE } from './config.js';

/**
 * The state object stores the current state of the application.
 * It includes the current recipe, search results, current page of search
 * results, and bookmarks.
 */
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Initialize the application by loading bookmarks from local storage.
 */
function init() {
  state.bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
}

/**
 * Create a recipe object from the data returned by the API.
 * @param {Object} data - The data returned by the API.
 * @returns {Object} - The created recipe object.
 */
function createRecipeObject(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
}

/**
 * Load a recipe from the API.
 * @param {string} id - The ID of the recipe to load.
 */
export async function loadRecipe(id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(
      bookmark => bookmark.id === id,
    );
  } catch (error) {
    // Temp error handling
    console.error(error);
    throw error;
  }
}

/**
 * Load search results from the API.
 * @param {string} query - The search query.
 */
export async function loadSearchResults(query) {
  try {
    state.search.query = query;
    const { data } = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Get a page of search results.
 * @param {number} [page=state.search.page] - The page of results to return.
 * @returns {Array} - A page of search results.
 */
export function getSearchResultsPage(page = state.search.page) {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
}

/**
 * Update the number of servings for the current recipe.
 * @param {number} newServings - The new number of servings.
 */
export function updateServings(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
}

/**
 * Persist the current state of bookmarks to local storage.
 */
function persistBookmark() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

/**
 * Add a recipe to bookmarks.
 * @param {Object} recipe - The recipe to add to bookmarks.
 */
export function addBookmark(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  // mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmark();
}

/**
 * Delete a bookmark.
 * @param {string} id - The ID of the bookmark to delete.
 */
export function deleteBookmark(id) {
  // delete bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as not bookmark
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmark();
}

// Initialize the application
init();

/**
 * Clear all bookmarks from local storage.
 */
function clearBookmarks() {
  localStorage.removeItem('bookmarks');
}

/**
 * Upload a new recipe to the API.
 * @param {Object} newRecipe - The new recipe to upload.
 */
export async function uploadRecipe(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format.',
          );
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? Number(quantity) : null,
          unit,
          description,
        };
      });
    const recipe = {
      title: newRecipe.title,
      publisher: newRecipe.publisher,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      servings: Number(newRecipe.servings),
      cooking_time: Number(newRecipe.cookingTime),
      ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}
