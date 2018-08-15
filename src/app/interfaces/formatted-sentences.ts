export interface IFormattedSentences {

  /**
   * The sentence as Original
   *
   * @type {string}
   */
  raw: string;
  /**
   * The sentence as SlugHyphen
   *
   * @type {string}
   */
  hyphen: string;
  /**
   * The sentence as SlugHyphenUpperCase
   *
   * @type {string}
   */
  hyphenUpper: string;
  /**
   * The sentence as SlugUnderscore
   *
   * @type {string}
   */
  underscore: string;
  /**
   * The sentence as SlugUnderscoreUpperCase
   *
   * @type {string}
   */
  underscoreUpper: string;
  /**
   * The sentence as SlugOneWord
   *
   * @type {string}
   */
  oneWord: string;
  /**
   * The sentence as WordsUpperCase
   *
   * @type {string}
   */
  wordsUpper: string;
  /**
   * The sentence as WordsLowerCase
   *
   * @type {string}
   */
  wordsLower: string;
  /**
   * The sentence as UpperCamelCase
   *
   * @type {string}
   */
  upperCamel: string;
  /**
   * The sentence as LowerCamelCase
   *
   * @type {string}
   */
  lowerCamel: string;

}
