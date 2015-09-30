/**
 * Print a context array to a readable string
 *
 * (root)<div>[0]<span>
 */
export function ctx (context) {
  return '(root)' + context.map(item => {
    return typeof item === 'string'
      ? '<' + item + '>'
      : '[' + item + ']'
  }).join('')
}
