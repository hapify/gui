import { TestBed, inject } from '@angular/core/testing';

import { StringService } from './string.service';
import {SentenceFormat} from '../interfaces/sentence-format.enum';

describe('StringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StringService]
    });
  });

  it('should be created', inject([StringService], (service: StringService) => {
    expect(service).toBeTruthy();
  }));

  it('tests removeDiacritics', inject([StringService], (service: StringService) => {
    expect(service.removeDiacritics('J\'ai éternué à l\'Étagères; Ça $$.')).toBe('J\'ai eternue a l\'Etageres; Ca $$.');
  }));

  it('tests replaceNonAlphaNumericChars', inject([StringService], (service: StringService) => {
    expect(service.replaceNonAlphaNumericChars('J\'ai éternué à l\'Étagères; Ça $$.')).toBe('J ai ternu l tag res a ');
    expect(service.replaceNonAlphaNumericChars('J\'ai éternué à l\'Étagères; Ça $$.', '_')).toBe('J_ai_ternu_l_tag_res_a_');
  }));

  it('tests removeMultipleSpaces', inject([StringService], (service: StringService) => {
    expect(service.removeMultipleSpaces('J\'ai   éternué à  l\'Étagères; Ça  $$.   ')).toBe('J\'ai éternué à l\'Étagères; Ça $$. ');
  }));

  it('tests removeSpaces', inject([StringService], (service: StringService) => {
    expect(service.removeSpaces('J\'ai   éternué à  l\'Étagères; Ça  $$.   ')).toBe('J\'aiéternuéàl\'Étagères;Ça$$.');
  }));

  it('tests lowerCaseFirstLetter', inject([StringService], (service: StringService) => {
    expect(service.lowerCaseFirstLetter('J\'ai éternué à l\'Étagères; Ça $$.')).toBe('j\'ai éternué à l\'Étagères; Ça $$.');
    expect(service.lowerCaseFirstLetter('testDeux')).toBe('testDeux');
    expect(service.lowerCaseFirstLetter(' TestTrois')).toBe(' TestTrois');
    expect(service.lowerCaseFirstLetter('TestTrois')).toBe('testTrois');
  }));

  it('tests upperCaseFirstLetter', inject([StringService], (service: StringService) => {
    expect(service.upperCaseFirstLetter('TestDeux')).toBe('TestDeux');
    expect(service.upperCaseFirstLetter(' testTrois')).toBe(' testTrois');
  }));

  it('tests splitCamelCase', inject([StringService], (service: StringService) => {
    expect(service.splitCamelCase('UpperCamelCase')).toBe('Upper Camel Case');
    expect(service.splitCamelCase(' UpperCamelCase')).toBe('Upper Camel Case');
    expect(service.splitCamelCase('lowerCamelCase')).toBe('lower Camel Case');
    expect(service.splitCamelCase(' lowerCamelCase')).toBe('lower Camel Case');
  }));

  it('tests upperCaseWords', inject([StringService], (service: StringService) => {
    expect(service.upperCaseWords('une phrase comme ça')).toBe('Une Phrase Comme Ça');
    expect(service.upperCaseWords('une phrase comme  ça')).toBe('Une Phrase Comme  Ça');
  }));

  it('tests format Original', inject([StringService], (service: StringService) => {
    expect(service.format('Une Phrase Comme Ça', SentenceFormat.Original)).toBe('Une Phrase Comme Ça');
    expect(service.format('une phrase Comme ça ', SentenceFormat.Original)).toBe('une phrase Comme ça');
  }));

  it('tests format SlugHyphen', inject([StringService], (service: StringService) => {
    expect(service.format('$Une Phrase Comme Ça ?', SentenceFormat.SlugHyphen)).toBe('une-phrase-comme-ca');
    expect(service.format('UnePhraseComme$Ca', SentenceFormat.SlugHyphen)).toBe('une-phrase-comme-ca');
    expect(service.format('UnePhrase_CommeCa ', SentenceFormat.SlugHyphen)).toBe('une-phrase-comme-ca');
    expect(service.format('Une phrase-commeCa ', SentenceFormat.SlugHyphen)).toBe('une-phrase-comme-ca');
  }));

  it('tests format SlugUnderscore', inject([StringService], (service: StringService) => {
    expect(service.format('$Une Phrase Comme Ça ?', SentenceFormat.SlugUnderscore)).toBe('une_phrase_comme_ca');
    expect(service.format('UnePhraseComme$Ca', SentenceFormat.SlugUnderscore)).toBe('une_phrase_comme_ca');
    expect(service.format('UnePhrase_CommeCa ', SentenceFormat.SlugUnderscore)).toBe('une_phrase_comme_ca');
    expect(service.format('Une phrase-commeCa ', SentenceFormat.SlugUnderscore)).toBe('une_phrase_comme_ca');
  }));

  it('tests format SlugOneWord', inject([StringService], (service: StringService) => {
    expect(service.format('$Une Phrase Comme Ça ?', SentenceFormat.SlugOneWord)).toBe('unephrasecommeca');
    expect(service.format('UnePhraseComme$Ca', SentenceFormat.SlugOneWord)).toBe('unephrasecommeca');
    expect(service.format('UnePhrase_CommeCa ', SentenceFormat.SlugOneWord)).toBe('unephrasecommeca');
    expect(service.format('Une phrase-commeCa ', SentenceFormat.SlugOneWord)).toBe('unephrasecommeca');
  }));

  it('tests format LowerCamelCase', inject([StringService], (service: StringService) => {
    expect(service.format('$Une Phrase Comme Ça ?', SentenceFormat.LowerCamelCase)).toBe('unePhraseCommeCa');
    expect(service.format('UnePhraseComme$Ca', SentenceFormat.LowerCamelCase)).toBe('unePhraseCommeCa');
    expect(service.format('UnePhrase_CommeCa ', SentenceFormat.LowerCamelCase)).toBe('unePhraseCommeCa');
    expect(service.format('Une phrase-commeCa ', SentenceFormat.LowerCamelCase)).toBe('unePhraseCommeCa');
  }));

  it('tests format UpperCamelCase', inject([StringService], (service: StringService) => {
    expect(service.format('$Une Phrase Comme Ça ?', SentenceFormat.UpperCamelCase)).toBe('UnePhraseCommeCa');
    expect(service.format('UnePhraseComme$Ca', SentenceFormat.UpperCamelCase)).toBe('UnePhraseCommeCa');
    expect(service.format('UnePhrase_CommeCa ', SentenceFormat.UpperCamelCase)).toBe('UnePhraseCommeCa');
    expect(service.format('Une phrase-commeCa ', SentenceFormat.UpperCamelCase)).toBe('UnePhraseCommeCa');
  }));

  it('tests format WordsLowerCase', inject([StringService], (service: StringService) => {
    expect(service.format('$Une Phrase Comme Ça ?', SentenceFormat.WordsLowerCase)).toBe('une phrase comme ca');
    expect(service.format('UnePhraseComme$Ca', SentenceFormat.WordsLowerCase)).toBe('une phrase comme ca');
    expect(service.format('UnePhrase_CommeCa ', SentenceFormat.WordsLowerCase)).toBe('une phrase comme ca');
    expect(service.format('Une phrase-commeCa ', SentenceFormat.WordsLowerCase)).toBe('une phrase comme ca');
  }));

  it('tests format WordsUpperCase', inject([StringService], (service: StringService) => {
    expect(service.format('$Une Phrase Comme Ça ?', SentenceFormat.WordsUpperCase)).toBe('Une Phrase Comme Ca');
    expect(service.format('UnePhraseComme$Ca', SentenceFormat.WordsUpperCase)).toBe('Une Phrase Comme Ca');
    expect(service.format('UnePhrase_CommeCa ', SentenceFormat.WordsUpperCase)).toBe('Une Phrase Comme Ca');
    expect(service.format('Une phrase-commeCa ', SentenceFormat.WordsUpperCase)).toBe('Une Phrase Comme Ca');
  }));

});
