import prettier from 'prettier';
import * as cssParser from 'prettier/parser-postcss';

interface PrettierConfig {
  parser: string;
  plugins: any[];
  printWidth?: number;
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  bracketSpacing: boolean;
  endOfLine: 'lf' | 'crlf' | 'cr' | 'auto';
}

class FormattingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormattingError';
    Object.setPrototypeOf(this, FormattingError.prototype);
  }
}

class CssFormatter {
  private readonly config: PrettierConfig;

  constructor(customConfig?: Partial<PrettierConfig>) {
    this.config = {
      parser: 'css',
      plugins: [cssParser],
      tabWidth: 2,
      useTabs: false,
      printWidth: 100,
      semi: true,
      singleQuote: false,
      bracketSpacing: true,
      endOfLine: 'lf',
      ...customConfig,
    };
  }

  public async format(cssContent: string): Promise<string> {
    try {
      const formattedCss = await prettier.format(cssContent, { ...this.config });
      return formattedCss;
    } catch (error) {
      this.handleFormattingError(error as Error);
      throw error;
    }
  }

  private handleFormattingError(error: Error): never {
    if (error.message.includes('Cannot read properties')) {
      throw new FormattingError(
        'Prettier plugin or parser not properly initialized. Please ensure prettier/parser-postcss is installed and imported correctly.'
      );
    }

    if (error.message.includes('No parser could be inferred')) {
      throw new FormattingError(
        'CSS parser not found. Please check if prettier/parser-postcss is installed.'
      );
    }

    throw new FormattingError(`Error formatting CSS: ${error.message}`);
  }
}

const cssFormatter = async (css: string): Promise<string> => {
  try {
    const formatter = new CssFormatter();
    const formattedCss = await formatter.format(css);
    return formattedCss;
  } catch (error) {
    if (error instanceof FormattingError) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
};

export default cssFormatter;
