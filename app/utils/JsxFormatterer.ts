import prettier from 'prettier';
import * as babelParser from 'prettier/parser-babel';

interface PrettierConfig {
    parser: string;
    plugins: any[];
    printWidth?: number;
    tabWidth: number;
    useTabs: boolean;
    semi: boolean;
    singleQuote: boolean;
    jsxSingleQuote: boolean;
    bracketSpacing: boolean;
    jsxBracketSameLine: boolean;
    endOfLine: 'lf' | 'crlf' | 'cr' | 'auto';
}

class FormattingError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'FormattingError';
        Object.setPrototypeOf(this, FormattingError.prototype);
    }
}

class JsxFormatter {
    private readonly config: PrettierConfig;

    constructor(customConfig?: Partial<PrettierConfig>) {
        this.config = {
            parser: 'babel',
            plugins: [babelParser],
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: true,
            jsxSingleQuote: false,
            bracketSpacing: true,
            jsxBracketSameLine: false,
            endOfLine: 'lf',
            ...customConfig
        };
    }

    public async format(jsxContent: string): Promise<string> {
        try {
            const formattedJsx = await prettier.format(jsxContent, { ...this.config });
            return formattedJsx;
        } catch (error) {
            this.handleFormattingError(error as Error);
            throw error; // TypeScript knows this line is unreachable but it's good practice
        }
    }

    private handleFormattingError(error: Error): never {
        if (error.message.includes('Cannot read properties')) {
            throw new FormattingError(
                'Prettier plugin or parser not properly initialized. Please ensure prettier/parser-babel is installed and imported correctly.'
            );
        }

        if (error.message.includes('No parser could be inferred')) {
            throw new FormattingError(
                'Babel parser not found. Please check if prettier/parser-babel is installed.'
            );
        }

        throw new FormattingError(`Error formatting JSX: ${error.message}`);
    }
}

const jsxFormatter = async (jsx: string): Promise<string> => {
    try {
        const formatter = new JsxFormatter();
        const formattedJsx = await formatter.format(jsx);
        return formattedJsx;
    } catch (error) {
        if (error instanceof FormattingError) {
            throw new Error(error.message);
        } else {
            throw new Error(String(error));
        }
    }
};

export default jsxFormatter;
