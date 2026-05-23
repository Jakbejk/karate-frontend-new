import {TranslateModule, TranslateLoader, TranslationObject} from '@ngx-translate/core';

import cs from '../../public/locales/cs/global.json';
import en from '../../public/locales/en/global.json';
import {Observable, of} from 'rxjs';

const translations: Record<string, object> = {cs, en};

class StaticTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    return of(translations[lang] ?? translations['cs']) as Observable<TranslationObject>;
  }
}

export const langs = TranslateModule.forRoot({
  defaultLanguage: 'cs',
  loader: {
    provide: TranslateLoader,
    useClass: StaticTranslateLoader,
  },
})
