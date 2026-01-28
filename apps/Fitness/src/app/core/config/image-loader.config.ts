import {ImageLoaderConfig} from "@angular/common";

export function customImageLoader(config: ImageLoaderConfig): string {
    return config.width ? `${config.src}?w=${config.width}` : config.src;
}
