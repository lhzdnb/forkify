import View from './View.js';
import previewView from './previewView.js';

/**
 * Class representing a view for rendering search results.
 * @extends View
 */
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again!';
  _message = '';

  /**
   * Generate the markup for the search results view.
   * @returns {string} - The generated markup.
   */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

// Export an instance of ResultsView
export default new ResultsView();
