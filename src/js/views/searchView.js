/**
 * Class representing a view for handling search operations.
 */
class SearchView {
  // The parent element for the search view
  _parentEl = document.querySelector('.search');

  /**
   * Get the search query from the input field.
   * @returns {string} - The search query.
   */
  getQuery() {
    return this._parentEl.querySelector('.search__field').value;
  }

  /**
   * Clear the input field.
   */
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  /**
   * Add an event handler for the search operation.
   * @param {Function} handler - The event handler function.
   */
  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
