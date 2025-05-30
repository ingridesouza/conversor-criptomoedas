export default function Button({ as: Component = 'button', children, className = '', ...props }) {
  const classes = `px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 ${className}`;
  if (Component === 'button') {
    return (
      <button className={classes} {...props}>
        {children}
      </button>
    );
  }
  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
}
