import View from './View.js';
import icons from 'url:../../img/icons.svg';

/**
 * Class representing a view for rendering pagination.
 * @extends View
 */
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**
   * Add an event handler for clicking on the pagination buttons.
   * @param {Function} handler - The event handler function.
   */
  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      handler(Number(btn.dataset.goto));
    });
  }

  /**
   * Generate the markup for the pagination view.
   * @returns {string} - The generated markup.
   */
  _generateMarkup() {
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );
    // Page 1, and there are other pages
    if (this._data.page === 1 && numPages > 1) return this._nextButton();
    // Last Page
    else if (this._data.page === numPages && numPages > 1)
      return this._preButton();
    // Other Page
    else if (this._data.page > 1 && this._data.page < numPages)
      return this._preButton() + this._nextButton();
    // Page 1, and there is no other page
    else return '';
  }

  /**
   * Generate the markup for the previous page button.
   * @returns {string} - The generated markup.
   */
  _preButton() {
    return `
    <button data-goto="${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${this._data.page - 1}</span>
    </button>
    `;
  }

  /**
   * Generate the markup for the next page button.
   * @returns {string} - The generated markup.
   */
  _nextButton() {
    return `
    <button data-goto="${
      this._data.page + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${this._data.page + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
  }
}

// Export an instance of PaginationView
export default new PaginationView();
