import View from './View.js';

/**
 * Class representing a view for adding a new recipe.
 * @extends View
 */
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded.';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  /**
   * Create a new AddRecipeView.
   * Add event handlers for showing and hiding the add recipe window.
   */
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  /**
   * Add an event handler for showing the add recipe window.
   */
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.showWindow.bind(this));
  }

  /**
   * Add an event handler for hiding the add recipe window.
   */
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.hideWindow.bind(this));
    this._overlay.addEventListener('click', this.hideWindow.bind(this));
  }

  /**
   * Add an event handler for uploading a new recipe.
   * @param {Function} handler - The event handler function.
   */
  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  /**
   * Show the add recipe window.
   */
  showWindow() {
    this._overlay.classList.remove('hidden');
    this._window.classList.remove('hidden');
  }

  /**
   * Hide the add recipe window.
   */
  hideWindow() {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  }

  /**
   * Generate the markup for the view.
   * This method is not implemented in this class and should be implemented in
   * subclasses.
   */
  _generateMarkup() {}
}

// Export an instance of AddRecipeView
export default new AddRecipeView();
