export interface GoogleObj {
    q: string[];
    target: string;
    source: string;
}
export interface TranslationResponse{
    data: {
        translations: Array<{
            translatedText: string;
        }>;
    }
}