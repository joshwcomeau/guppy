// @flow
import { Terminal, ILinkMatcherOptions } from 'xterm';

// Regex & consts from https://github.com/microsoft/vscode/blob/master/src/vs/workbench/parts/terminal/electron-browser/terminalLinkHandler.ts

// Todo: Add Col/line handling.

const pathPrefix = '(\\.\\.?|\\~)';
const pathSeparatorClause = '\\/';
// '":; are allowed in paths but they are often separators so ignore them
// Also disallow \\ to prevent a catastropic backtracking case #24798
const excludedPathCharactersClause = '[^\\0\\s!$`&*()\\[\\]+\'":;\\\\]';
/** A regex that matches paths in the form /foo, ~/foo, ./foo, ../foo, foo/bar */
const unixLocalLinkClause =
  '((' +
  pathPrefix +
  '|(' +
  excludedPathCharactersClause +
  ')+)?(' +
  pathSeparatorClause +
  '(' +
  excludedPathCharactersClause +
  ')+)+)';

const winDrivePrefix = '[a-zA-Z]:';
const winPathPrefix = '(' + winDrivePrefix + '|\\.\\.?|\\~)';
const winPathSeparatorClause = '(\\\\|\\/)';
const winExcludedPathCharactersClause =
  '[^\\0<>\\?\\|\\/\\s!$`&*()\\[\\]+\'":;]';
/** A regex that matches paths in the form c:\foo, ~\foo, .\foo, ..\foo, foo\bar */
const winLocalLinkClause =
  '((' +
  winPathPrefix +
  '|(' +
  winExcludedPathCharactersClause +
  ')+)?(' +
  winPathSeparatorClause +
  '(' +
  winExcludedPathCharactersClause +
  ')+)+)';

/** As xterm reads from DOM, space in that case is nonbreaking char ASCII code - 160,
 replacing space with nonBreakningSpace or space ASCII code - 32. */
const lineAndColumnClause = [
  '((\\S*)", line ((\\d+)( column (\\d+))?))', // "(file path)", line 45 [see #40468]
  '((\\S*) on line ((\\d+)(, column (\\d+))?))', // (file path) on line 8, column 13
  '((\\S*):line ((\\d+)(, column (\\d+))?))', // (file path):line 8, column 13
  '(([^\\s\\(\\)]*)(\\s?[\\(\\[](\\d+)(,\\s?(\\d+))?)[\\)\\]])', // (file path)(45), (file path) (45), (file path)(45,18), (file path) (45,18), (file path)(45, 18), (file path) (45, 18), also with []
  '(([^:\\s\\(\\)<>\'"\\[\\]]*)(:(\\d+))?(:(\\d+))?)', // (file path):336, (file path):336:9
]
  .join('|')
  .replace(/ /g, `[${'\u00A0'} ]`);

// Changing any regex may effect this value, hence changes this as well if required.
const winLineAndColumnMatchIndex = 12;
const unixLineAndColumnMatchIndex = 11;

// Each line and column clause have 6 groups (ie no. of expressions in round brackets)
const lineAndColumnClauseGroupCount = 6;

/** Higher than local link, lower than hypertext */
// const CUSTOM_LINK_PRIORITY = -1;
/** Lowest */
// const LOCAL_LINK_PRIORITY = -2;

export type LineColumnInfo = {
  lineNumber: number,
  columnNumber: number,
};

function handleLink(event: MouseEvent, uri: string): void {
  window.open(uri, '_blank');
}

/**
 * Returns line and column number of URl if that is present.
 *
 * @param link Url link which may contain line and column number.
 */
// todo: localLinkRegex & platform not available in function - not sure how to add.
export function extractLineColumnInfo(
  link: string,
  localLinkRegex: any,
  platform: string
): LineColumnInfo {
  const matches: string[] | null = localLinkRegex.exec(link);
  const lineColumnInfo: LineColumnInfo = {
    lineNumber: 1,
    columnNumber: 1,
  };

  if (!matches) {
    return lineColumnInfo;
  }

  const lineAndColumnMatchIndex =
    platform === 'win32'
      ? winLineAndColumnMatchIndex
      : unixLineAndColumnMatchIndex;
  for (let i = 0; i < lineAndColumnClause.length; i++) {
    const lineMatchIndex =
      lineAndColumnMatchIndex + lineAndColumnClauseGroupCount * i;
    const rowNumber = matches[lineMatchIndex];
    if (rowNumber) {
      lineColumnInfo['lineNumber'] = parseInt(rowNumber, 10);
      // Check if column number exists
      const columnNumber = matches[lineMatchIndex + 2];
      if (columnNumber) {
        lineColumnInfo['columnNumber'] = parseInt(columnNumber, 10);
      }
      break;
    }
  }

  return lineColumnInfo;
}
/**
 * Initialize the relative links addon, registering the link matcher.
 * @param term The terminal to use relative links within.
 * @param handler A custom handler to use.
 * @param options Custom options to use, matchIndex will always be ignored.
 */
export function localLinksInit(
  term: Terminal,
  handler: (event: MouseEvent, uri: string) => void = handleLink,
  options: ILinkMatcherOptions = {}
): void {
  options.matchIndex = 1; // LOCAL_LINK_PRIORITY;

  // todo: Is platform allowed as option in xterm? If not how to handle it correctly?
  const baseLocalLinkClause =
    options.platform === 'win32' ? winLocalLinkClause : unixLocalLinkClause;

  // Append line and column number regex
  const localLinkPattern = new RegExp(
    `${baseLocalLinkClause}(${lineAndColumnClause})`
  );

  term.registerLinkMatcher(localLinkPattern, handler, options);
}

export function apply(terminalConstructor: typeof Terminal): void {
  terminalConstructor.prototype.localLinksInit = function(
    handler?: (event: MouseEvent, uri: string) => void,
    options?: ILinkMatcherOptions
  ): void {
    localLinksInit(this, handler, options);
  };
}
