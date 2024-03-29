import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './View.js';

/**
 * Class representing a view for rendering a recipe.
 * @extends View
 */
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one';
  _message = '';

  /**
   * Add event handlers for rendering the recipe view.
   * @param {Function} handler - The event handler function.
   */
  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handler),
    );
  }

  /**
   * Add event handlers for updating the servings of the recipe.
   * @param {Function} handler - The event handler function.
   */
  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      const newServings = Number(btn.dataset.newServings);
      if (newServings > 0) handler(newServings);
    });
  }

  /**
   * Add event handlers for bookmarking the recipe.
   * @param {Function} handler - The event handler function.
   */
  addHandlerBookmark(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }

  /**
   * Generate the markup for the recipe view.
   * @returns {string} - The generated markup.
   */
  _generateMarkup() {
    return `
    <figure class="recipe__fig">
        <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
        <h1 class="recipe__title">
          <span>${this._data.title}</span>
        </h1>
      </figure>

      <div class="recipe__details">
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-clock"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--minutes">${
            this._data.cookingTime
          }</span>
          <span class="recipe__info-text">minutes</span>
        </div>
        <div class="recipe__info">
          <svg class="recipe__info-icon">
            <use href="${icons}#icon-users"></use>
          </svg>
          <span class="recipe__info-data recipe__info-data--people">${
            this._data.servings
          }</span>
          <span class="recipe__info-text">servings</span>

          <div class="recipe__info-buttons">
            <button data-new-servings="${
              this._data.servings - 1
            }" class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-minus-circle"></use>
              </svg>
            </button>
            <button data-new-servings="${
              this._data.servings + 1
            }" class="btn--tiny btn--increase-servings">
              <svg>
                <use href="${icons}#icon-plus-circle"></use>
              </svg>
            </button>
          </div>
        </div>

        <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
          <svg>
            <use href="${icons}#icon-user"></use>
          </svg>
        </div>
        <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
              this._data.bookmarked ? '-fill' : ''
            }"></use>
          </svg>
        </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
        ${this._data.ingredients
          .map(ingredient => this.renderMarkupIngredient(ingredient))
          .join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  /**
   * Generate the markup for a single ingredient.
   * @param {Object} ingredient - The ingredient to generate markup for.
   * @returns {string} - The generated markup.
   */
  renderMarkupIngredient(ingredient) {
    return `
        <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}_icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
            ingredient.quantity}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.description}
          </div>
        </li>
        `;
  }
}

export default new RecipeView();
