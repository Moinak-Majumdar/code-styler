import prettier from 'prettier';
import * as htmlParser from 'prettier/parser-html';

interface PrettierConfig {
  parser: string;
  plugins: any[];
  printWidth?: number;
  tabWidth: number;
  useTabs: boolean;
  semi: boolean;
  singleQuote: boolean;
  bracketSpacing: boolean;
  htmlWhitespaceSensitivity: 'css' | 'strict' | 'ignore';
  endOfLine: 'lf' | 'crlf' | 'cr' | 'auto';
}

class FormattingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FormattingError';
    Object.setPrototypeOf(this, FormattingError.prototype);
  }
}

class HtmlFormatter {
  private readonly config: PrettierConfig;

  constructor(customConfig?: Partial<PrettierConfig>) {
    this.config = {
      parser: 'html',
      plugins: [htmlParser],
      tabWidth: 2,
      useTabs: false,
      printWidth: 200,
      semi: true,
      singleQuote: false,
      bracketSpacing: true,
      htmlWhitespaceSensitivity: 'css',
      endOfLine: 'lf',
      ...customConfig
    };
  }

  public async format(htmlContent: string): Promise<string> {
    try {
      const formattedHtml = await prettier.format(htmlContent, { ...this.config });
      return formattedHtml;
    } catch (error) {
      this.handleFormattingError(error as Error);
      throw error; // TypeScript knows this line is unreachable but it's good practice
    }
  }

  private handleFormattingError(error: Error): never {
    if (error.message.includes('Cannot read properties')) {
      throw new FormattingError(
        'Prettier plugin or parser not properly initialized. Please ensure prettier/parser-html is installed and imported correctly.'
      );
    }

    if (error.message.includes('No parser could be inferred')) {
      throw new FormattingError(
        'HTML parser not found. Please check if prettier/parser-html is installed.'
      );
    }

    throw new FormattingError(`Error formatting HTML: ${error.message}`);
  }
}

const htmlFormatter = async (html: string): Promise<string> => {
  try {
    const formatter = new HtmlFormatter();
    const formattedHtml = await formatter.format(html);
    return formattedHtml
  } catch (error) {
    if (error instanceof FormattingError) {
      throw new Error(error.message);
    } else {
      throw new Error(String(error));
    }
  }
}


export default htmlFormatter;