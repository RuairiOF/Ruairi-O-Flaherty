import React from 'react';
import './StarBorder.css';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
};

const StarBorder = <T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  size = 'lg',
  variant = 'primary',
  children,
  ...rest
}: StarBorderProps<T>) => {
  const Component = as || 'button';

  return (
    <Component
      className={`star-border-container ${className}`}
      {...(rest as any)}
      style={{
        padding: `${thickness}px 0`,
        ...(rest as any).style
      }}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div
        className="border-gradient-top"
        style={{
          background: `radial-gradient(circle, ${color}, transparent 20%)`,
          animationDuration: speed
        }}
      ></div>
      <div className={`inner-content btn btn-${variant} btn-${size} !rounded-full`}>{children}</div>
    </Component>
  );
};

export default StarBorder;
