import View from './View.js';
import previewView from './previewView.js';

/**
 * Class representing a view for rendering bookmarks.
 * @extends View
 */
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it.';
  _message = '';

  /**
   * Add an event handler for rendering the bookmarks view.
   * @param {Function} handler - The event handler function.
   */
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  /**
   * Generate the markup for the bookmarks view.
   * @returns {string} - The generated markup.
   */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

// Export an instance of BookmarksView
export default new BookmarksView();
