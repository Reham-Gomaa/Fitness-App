import {TranslateLoader} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {TranslationManagerService} from "./translation-manager.service";
import {inject} from "@angular/core";

export class CustomTranslateLoader implements TranslateLoader {
    private readonly translationManager = inject(TranslationManagerService);

    getTranslation(lang: string): Observable<any> {
        return this.translationManager.loadCoreTranslations(lang);
    }
}

export function createCustomTranslateLoader(): CustomTranslateLoader {
    return new CustomTranslateLoader();
}
