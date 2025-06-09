import { OnModuleInit } from "@nestjs/common";
export declare class AutocompleteAiService implements OnModuleInit {
    private encoder;
    private products;
    private vectors;
    onModuleInit(): Promise<void>;
    private cosineSimilarity;
    suggest(query: string): Promise<{
        title: string;
        score: number;
    }[]>;
}
